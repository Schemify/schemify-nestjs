# 🛠️ Build Stage
FROM node:23-alpine AS builder

ENV NODE_ENV build

WORKDIR /home/node/app
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

USER node

# Copiar el código fuente
COPY --chown=node:node . .
# TODO: seleccionar el micrservicio especifico

# Instalar dependencias y construir
RUN npm ci && npm run build

RUN cp proto/*.proto /home/node/app/dist/apps/schemify-nestjs/ 

# 🏗️ Production Stage
FROM node:23-alpine

ENV NODE_ENV production

WORKDIR /home/node/app

# Copiar lo necesario desde el builder
COPY --from=builder --chown=node:node /home/node/app/package*.json ./
COPY --from=builder --chown=node:node /home/node/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/app/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/app/proto/*.proto ./dist/schemify-nestjs-consumer/

USER node

EXPOSE 3020

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s \
    CMD node -e "process.exit(require('http').request({method:'HEAD',host:'localhost',port:3010}, r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1)))"

CMD ["node", "dist/apps/schemify-nestjs/src/main.js"]
