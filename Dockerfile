# 🛠️ Build Stage
FROM node:23-alpine AS builder

# Configuración del entorno
ENV NODE_ENV build

# Crear estructura de directorios
WORKDIR /home/node/app
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

USER node

# Copiar TODOS los archivos necesarios
COPY --chown=node:node . .

# Instalar dependencias y construir
RUN npm ci && npm run build

# Crear directorio proto en dist y copiar archivos
RUN mkdir -p dist/apps/schemify-nestjs/proto && \
    cp proto/*.proto dist/apps/schemify-nestjs/proto/

# ------------------------------------------

# 🏗️ Production Stage
FROM node:23-alpine

# Configuración del entorno
ENV NODE_ENV production

# Crear estructura de directorios
WORKDIR /home/node/app

# Copiar solo lo necesario desde el builder
COPY --from=builder --chown=node:node /home/node/app/package*.json ./
COPY --from=builder --chown=node:node /home/node/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/app/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/app/proto/ ./proto/

# Usar usuario no root
USER node

# Puerto de la aplicación
EXPOSE 3010

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s \
    CMD node -e "process.exit(require('http').request({method:'HEAD',host:'localhost',port:3010}, r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1)))"

# Ejecutar la aplicación
CMD ["npm", "start:all"]
