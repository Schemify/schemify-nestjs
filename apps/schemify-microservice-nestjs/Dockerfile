FROM node:23-alpine AS builder

ENV HUSKY=0

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

# RUN mkdir -p dist/apps/${APP_NAME}/proto && \
#     cp -r libs/proto/src/services/ dist/apps/${APP_NAME}/proto/

# ------------------------
# 🚀 Stage 2: Runtime
# ------------------------
FROM node:23-alpine AS runtime

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

EXPOSE 50051

CMD [ "sh", "-c", "node dist/apps/schemify-microservice-nestjs/src/main"]