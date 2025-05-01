# -----------------------------
# 🏗 Stage 1: Builder
# -----------------------------
FROM node:23-slim AS builder

ENV HUSKY=0
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build 

# -----------------------------
# 🚀 Stage 2: Runtime
# -----------------------------
FROM node:23-slim AS runtime

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production \
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist/apps/schemify-microservice-nestjs/src ./dist/apps/schemify-microservice-nestjs/src
COPY --from=builder /app/apps/schemify-microservice-nestjs/prisma ./prisma
COPY --from=builder /app/libs/proto ./dist/apps/schemify-microservice-nestjs/proto

# Exponer el puerto gRPC
EXPOSE 50051

CMD ["sh", "-c", "npx prisma generate --schema=prisma/schema.prisma && npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/apps/schemify-microservice-nestjs/src/main"]