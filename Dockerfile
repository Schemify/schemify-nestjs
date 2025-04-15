# 🛠️ Build Stage (Construcción de la aplicación)
FROM node:23-alpine AS builder

# Configuración del entorno
ENV NODE_ENV build

# Crear directorio de trabajo y usar usuario sin privilegios
WORKDIR /home/node/app
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

USER node

# Copiar package.json y package-lock.json antes para aprovechar la cache de Docker
COPY --chown=node:node package*.json ./

# Instalar solo dependencias necesarias para la construcción
RUN npm ci

# Copiar el código fuente de la aplicación
COPY --chown=node:node . .

# Compilar la aplicación
RUN npm run build \
    && npm prune --omit=dev  # Elimina dependencias de desarrollo para reducir tamaño

# ------------------------------------------

# 🏗️ Production Stage (Imagen optimizada para ejecución)
FROM node:23-alpine

# Configuración del entorno
ENV NODE_ENV production

# Crear directorio de trabajo
WORKDIR /home/node/app

# Copiar solo los archivos necesarios desde la imagen builder
COPY --from=builder --chown=node:node /home/node/app/package*.json ./
COPY --from=builder --chown=node:node /home/node/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/app/dist/ ./dist/

# Usar usuario no root para mayor seguridad
USER node

# Puerto de la aplicación (esto es solo informativo)
EXPOSE 3010

# Agregar healthcheck para que Docker monitoree el contenedor
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s \
    CMD node -e "process.exit(require('http').request({method:'HEAD',host:'localhost',port:3010}, r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1)))"

# Ejecutar la aplicación
CMD ["npm", "start:all"]
