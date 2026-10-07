This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Installation

First, run the development server:

```bash
npm install
npm run dev
```

## Environment Variables

All three are read at build time (`next build` inlines them) and the build fails if one is missing or malformed.

```bash
# Starknet JSON-RPC URL used for mainnet (RPC spec 0.10, must send CORS headers: the browser calls it directly).
# Production uses the Carbonable RPC gateway, which only answers requests coming from https://app.carbonable.io,
# so local development needs a public RPC instead, for example https://starknet-rpc.publicnode.com
NEXT_PUBLIC_MAINNET_RPC_URL=https://starknet-rpc.publicnode.com
# Starknet JSON-RPC URL used for Sepolia (same requirements)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://starknet-sepolia-rpc.publicnode.com
# Network selected when no wallet is connected
NEXT_PUBLIC_DEFAULT_CHAIN=mainnet|sepolia
```

## Configuration
Edit the file config/projects.ts

## Start the server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy

Production is built by Dokploy from the `Dockerfile`, which takes the three variables above as build args
(`NEXT_PUBLIC_MAINNET_RPC_URL`, `NEXT_PUBLIC_SEPOLIA_RPC_URL`, `NEXT_PUBLIC_DEFAULT_CHAIN`).
The mainnet URL carries the RPC gateway key: never print it in a build log or a shell history.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!