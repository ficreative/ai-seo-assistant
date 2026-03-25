# ---------- Builder ----------
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Prisma schema + generate
COPY prisma ./prisma
RUN npx prisma generate

# App source + build
COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Prisma generated client (KRİTİK)
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

# Build output + runtime files
COPY --from=builder /app/build ./build
COPY --from=builder /app/app ./app
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/shopify.app.toml ./shopify.app.toml

CMD ["npm","run","start:cloudrun"]