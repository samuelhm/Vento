# TODO — Production Readiness for ventomarket.store

## 1. Docker Compose de Producción (`docker-compose.prod.yml`)

- [x] Crear `docker-compose.prod.yml` separado del de desarrollo.
  - Sin puertos expuestos al host (NPM en red `red_proxy` accede por nombre de contenedor).
  - Sin puertos expuestos para `auth`, `chat`, ni `postgres`.
  - Volúmenes de código fuente eliminados (no hot-reload).
  - Red interna `trans_net` + red externa `red_proxy` para NPM.
  - `restart: unless-stopped` en todos los servicios.
  - Sin montaje de certificados (SSL lo maneja NPM).

## 2. Frontend — Build de Producción

- [x] Multi-stage build en `infra/nginx/Dockerfile`:
  - Stage 1 (build): `npm ci && npm run build` → genera `dist/`.
  - Stage 2 (serve): nginx:alpine con `dist/` copiado a `/usr/share/nginx/html`.
- [ ] Verificar que `vite build` funcione correctamente (Tailwind v4 + React Compiler).
- [x] El proxy `/api` de Vite solo funciona en desarrollo. `httpClient.ts` usa `VITE_API_URL ?? "/api"` (en prod es `/api`), y nginx proxy a BFF. Correcto.
- [x] `VITE_GOOGLE_MAPS_API_KEY` como argumento de build (`--build-arg`) en lugar de runtime.

## 3. Nginx — Configuración de Producción

- [x] `server_name` a `ventomarket.store www.ventomarket.store`.
- [x] Simplificado a solo HTTP (puerto 80) — NPM maneja SSL/HTTPS.
- [x] Sin redirección HTTP→HTTPS (NPM lo hace).
- [x] Archivos estáticos del frontend servidos con `try_files` (SPA fallback).
- [x] Location blocks de `/api/`, `/api/chats` y `/socket.io/` mantenidas.
- [x] Headers de seguridad (X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- [x] Gzip compression.
- [x] Proxy headers (X-Real-IP, X-Forwarded-For, X-Forwarded-Proto).
- [ ] Configurar HSTS en NPM (no en el nginx interno, ya que solo sirve HTTP).

## 4. Backend — Modo Producción

- [x] `Dockerfile.prod` creados para cada servicio (auth, bff, catalog, media, chat).
  - `npm ci --production` en build time (excepto chat que necesita prisma CLI).
  - `CMD ["node", "index.js"]` (sin `--watch`, sin `npm install` en runtime).
  - `wget` instalado para healthchecks.
- [ ] El script `"start": "node index.js"` ya existe en todos los package.json de backend.
- [x] Volúmenes de código fuente eliminados en producción.
- [x] Puertos `3001`, `3004`, `5432` NO expuestos al host en producción.

## 5. Base de Datos

- [x] Puerto PostgreSQL NO expuesto al exterior. Solo accesible dentro de `trans_net`.
- [ ] Implementar estrategia de backups automáticos (pg_dump + cron en el VPS).
- [x] `init_dbs.sh` se ejecuta solo en primer inicio (mecanismo `docker-entrypoint-initdb.d` de postgres).
- [ ] Las credenciales de BD están en `.env` — pasar a Docker secrets en producción (o al menos asegurar que `.env` no se commitee).

## 6. Seguridad

- [ ] **CRÍTICO**: `.env` contiene secretos reales (JWT_SECRET, SERVICE_SECRET, contraseñas de BD, SMTP_USER). `.env` **NO está en `.gitignore`** (solo está `.envip` que parece un typo). Agregar `.env` a `.gitignore` inmediatamente. Si ya fue commiteado, rotar todos los secretos.
- [ ] Pasar secretos sensibles a Docker secrets en lugar de variables de entorno:
  - `JWT_SECRET` → `/run/secrets/jwt_secret.txt`
  - `SERVICE_SECRET` → `/run/secrets/service_secret.txt`
  - `DB_PASS`, contraseñas de BD → `/run/secrets/db_passwords/`
  - `SMTP_PASSWORD` → ya está hecho (`secrets/smtp_password.txt`)
- [ ] Cookie JWT: ya tiene `httpOnly: true`, `secure: true`, `sameSite: 'lax'`. Correcto para producción con HTTPS real.
- [ ] Verificar `@fastify/helmet` en BFF — la configuración actual deshabilita CSP y HSTS (nginx los maneja). Revisar si Helmet debe habilitarse como defensa en profundidad.
- [x] `trustProxy: true` agregado en todas las instancias de Fastify (auth, bff, catalog, media, chat) para respetar `X-Forwarded-*` del proxy.
- [ ] Los endpoints internos (`/internal/*`) usan `X-Service-Secret`. Verificar que este header no sea spoffeable desde fuera (nginx podría bloquear requests con este header desde el exterior).
- [ ] Configurar firewall (ufw/iptables) en el VPS para solo permitir puertos 80 y 443 (y SSH).

## 7. Certificados SSL (Let's Encrypt)

- [ ] Obtener certificados SSL desde la web UI de NPM (puerto 81 → SSL Certificates → Add Let's Encrypt).
- [ ] NPM maneja la renovación automática — no se necesita certbot en el VPS ni en el proyecto.

## 8. Variables de Entorno y Build Args

- [ ] `FRONTEND_URL` ya está configurado como `https://ventomarket.store`. Correcto.
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_FROM` configurados para Hostinger. Verificar conectividad desde el VPS.
- [ ] `GOOGLE_MAPS_API_KEY`: actualmente se lee en runtime en el Dockerfile del frontend. En producción debe ser un build arg (`--build-arg VITE_GOOGLE_MAPS_API_KEY=...`) o inyectarse en el HTML.

## 9. Monitoreo y Logging

- [ ] Configurar `json` o `pretty` logging en producción (Fastify lo soporta nativamente). Recomendado: structured JSON logs.
- [ ] Evaluar agregar `docker logging driver` (e.g., `json-file` con rotación, o `loki`/`promtail`).
- [ ] Configurar health check endpoints en cada servicio (ya existen: `/health` en auth, catalog, media, chat).
- [ ] Agregar un health check endpoint en BFF.

## 10. CI/CD y Deploy

- [x] Makefile actualizado con:
  - `make prod` — build + start producción
  - `make prod-build` — build de imágenes prod
  - `make prod-up` — iniciar servicios prod
  - `make prod-down` — detener servicios prod
  - `make build-frontend` — build de Vite local para testing
- [ ] Evaluar si se necesita un registry de imágenes (Docker Hub, GHCR) o si se hace build directamente en el VPS.

## 11. Extras / Mejoras Sugeridas

- [ ] Agregar `docker-compose.override.yml` para desarrollo local (para no tocar el compose principal).
- [x] ~~`infra/nginx/Dockerfile` vacío~~ → reemplazado por multi-stage build (frontend + nginx).
- [ ] Los mensajes de chat tienen tipo `IMAGE` — verificar que las imágenes referenciadas se sirvan correctamente en producción.
- [ ] El endpoint `GET /internal/photos` en catalog (documentado pero posiblemente no implementado) es necesario para el orphan cleanup de media. Verificar estado.
- [ ] Agregar `user: node` en los Dockerfiles para no correr como root.
- [x] `HEALTHCHECK` en el Dockerfile de cada servicio (complementario al `healthcheck` del compose).
- [ ] Valkey (Redis) no tiene persistencia configurada (no volumes). Agregar volumen o `appendonly` si se necesita persistencia de sesiones WebSocket.
