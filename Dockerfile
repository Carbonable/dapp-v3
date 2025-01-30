# base node image
FROM node:21 as base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /app
WORKDIR /app

ADD package.json package-lock.json ./
RUN npm install --production=false --force

# Setup production node_modules
FROM base as production-deps

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production --force

# Build the app
FROM base as build

WORKDIR /app

# Copy all files needed for build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

# Set build-time variables
ARG NEXT_PUBLIC_NETHERMINED_API_KEY
ARG NEXT_PUBLIC_DEFAULT_CHAIN

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production

# Pass build arguments to environment for build time
ENV NEXT_PUBLIC_NETHERMINED_API_KEY=${NEXT_PUBLIC_NETHERMINED_API_KEY}
ENV NEXT_PUBLIC_DEFAULT_CHAIN=${NEXT_PUBLIC_DEFAULT_CHAIN}

RUN npm run build

# Production image
FROM base

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Runtime public variables
ENV NEXT_PUBLIC_NETHERMINED_API_KEY=${NEXT_PUBLIC_NETHERMINED_API_KEY}
ENV NEXT_PUBLIC_DEFAULT_CHAIN=${NEXT_PUBLIC_DEFAULT_CHAIN}

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/next.config.* ./
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/tsconfig.json ./tsconfig.json

CMD ["npm", "run", "start"]