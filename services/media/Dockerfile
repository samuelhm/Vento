FROM node:20-alpine

WORKDIR /app

# Crear carpeta de uploads y asignar permisos al usuario 'node' (seguridad)
RUN mkdir -p /uploads && chown -R node:node /uploads

# Copiar assets al contenedor
COPY --chown=node:node assets/ ./assets/

# Copiar script de entrada
COPY --chown=node:node docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Puerto interno de Media
EXPOSE 3003

ENTRYPOINT ["docker-entrypoint.sh"]