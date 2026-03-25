# ---------- Build stage (devDependencies dahil) ----------
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- Runtime stage (sadece prod deps) ----------
FROM node:22-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Build çıktıları + runtime için gereken klasörler
COPY --from=builder /app/build ./build
COPY --from=builder /app/app ./app
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/shopify.app.toml ./shopify.app.toml

EXPOSE 8080
CMD ["npm","run","start:cloudrun"]