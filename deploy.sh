#!/bin/bash

# Function to print debug information
debug_info() {
    echo "Debug Info:"
    echo "CONFIG_FILE: $CONFIG_FILE"
    echo "BUILD_ARGS: $BUILD_ARGS"
    echo "NEXT_PUBLIC variables:"
    env | grep NEXT_PUBLIC_
}

# Initialize variables
CONFIG_FILE=""

# Check if the script is being sourced
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    echo "Script is being sourced. Please run it as a separate command."
    return 1
fi

# Parse command line arguments
while getopts ":c:" opt; do
  case $opt in
    c)
      CONFIG_FILE="-c $OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Check for required files
if [[ ! -f .env ]]; then
    echo ".env file not found!"
    exit 1
fi

# Read .env file
set -a
source .env
set +a

# Check for required environment variables
required_vars=("NEXT_PUBLIC_NETHERMINED_API_KEY" "NEXT_PUBLIC_DEFAULT_CHAIN")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "Error: Required environment variable $var is not set!"
        exit 1
    fi
done

# Construct build args string
BUILD_ARGS=""
for var in "${!NEXT_PUBLIC_@}"; do
    BUILD_ARGS="$BUILD_ARGS --build-arg $var=${!var}"
done

# Print debug information
debug_info

# Deploy with build args and optional config file
echo "Deploying with command: fly deploy $CONFIG_FILE $BUILD_ARGS"

# Confirm before deploying
read -p "Do you want to proceed with deployment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    fly deploy $CONFIG_FILE $BUILD_ARGS
else
    echo "Deployment cancelled"
    exit 1
fi