FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

RUN pnpm install --frozen-lockfile && \
	npx prisma generate

COPY src ./src

RUN pnpm run build

FROM node:24-alpine AS production-deps

WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --prod --frozen-lockfile && \
	npx prisma generate && \
	pnpm cache clean

FROM node:24-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
	adduser -S nestjs -u 1001

RUN corepack enable pnpm

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=production-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package.json /app/pnpm-lock.yaml ./

USER nestjs

EXPOSE 3001

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
	CMD node -e "const p = process.env.PORT || 3001; require('http').get('http://localhost:' + p + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
