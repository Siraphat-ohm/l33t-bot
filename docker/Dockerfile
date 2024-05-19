FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else echo "No yarn.lock file found" && exit 1; fi

FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM base AS runner

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

CMD node bot.js
