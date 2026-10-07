# --- Base ---
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- Dependencies ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_MAINNET_RPC_URL
ARG NEXT_PUBLIC_SEPOLIA_RPC_URL
ARG NEXT_PUBLIC_DEFAULT_CHAIN
ENV NEXT_PUBLIC_MAINNET_RPC_URL=${NEXT_PUBLIC_MAINNET_RPC_URL}
ENV NEXT_PUBLIC_SEPOLIA_RPC_URL=${NEXT_PUBLIC_SEPOLIA_RPC_URL}
ENV NEXT_PUBLIC_DEFAULT_CHAIN=${NEXT_PUBLIC_DEFAULT_CHAIN}
ENV NODE_ENV=production

RUN npm run build

# --- Production ---
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
