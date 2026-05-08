# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app

ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_API_URL=/api
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_API_URL=$VITE_API_URL

COPY services/frontend/package*.json ./
RUN npm ci

COPY services/frontend/ .

RUN npm run build

# Stage 2: Nginx + frontend static files
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=frontend-build /app/dist /usr/share/nginx/html

COPY infra/nginx/conf.d.prod/*.conf /etc/nginx/conf.d/

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
