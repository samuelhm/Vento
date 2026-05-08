# 🌐 BFF (Backend For Frontend)

Punto de entrada único para todas las peticiones del frontend. Actúa como proxy reverso a los microservicios internos aplicando medidas de seguridad adicionales.

---

## 🚀 Rutas Proxy

| Ruta Frontend | Destino | Puerto Interno |
|---------------|---------|----------------|
| `/api/auth/*` | Auth Service | 3001 |
| `/api/catalog/*` | Catalog Service | 3002 |
| `/api/media/*` | Media Service | 3003 |

**Ejemplo de flujo:**
```
Frontend → https://localhost/api/auth/signin
         → Nginx :443 (SSL + headers)
         → BFF :3000 (Helmet + proxy)
         → Auth :3001 (lógica)
```

---

## 🔒 Seguridad Implementada

### 1. Rate Limiting (Nginx)
```nginx
# 10000 peticiones/minuto por IP + 4000 burst
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10000r/m;
limit_req zone=api_limit burst=4000 nodelay;
```

| Escenario | Resultado |
|-----------|-----------|
| Navegación normal (~20 req/min) | ✅ Permitido |
| App real-time (~300 req/min) | ✅ Permitido |
| Petición #14001+ | ❌ HTTP 503 |

### 2. Headers de Seguridad (Nginx)
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

| Header | Protege Contra |
|--------|---------------|
| HSTS | Downgrade a HTTP |
| X-Frame-Options | Clickjacking |
| X-Content-Type-Options | MIME sniffing |
| Referrer-Policy | URL leakage |

### 3. Helmet (Defense in Depth)
```javascript
fastify.register(fastifyHelmet, {
  contentSecurityPolicy: false,  // Nginx lo maneja
  hsts: false                    // Nginx lo maneja
});
```
Segunda capa de seguridad si Nginx falla.

### 4. Error Handler Seguro
```javascript
// ❌ Sin handler - expone información sensible
{ "message": "Database postgres://user:pass@host failed" }

// ✅ Con handler - mensaje genérico
{ "error": "Internal Server Error", "message": "Algo salió mal" }
```

---

## 🎯 Arquitectura

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ HTTPS
       ▼
┌──────────────────────────────────┐
│  Nginx :443                      │
│  • SSL/TLS termination           │
│  • Rate limiting                 │
│  • Security headers              │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  BFF :3000                       │
│  • Helmet                        │
│  • Error handling                │
│  • Proxy routing                 │
└──────┬───────┬───────┬───────────┘
       │       │       │
       ▼       ▼       ▼
    Auth    Catalog  Media
    :3001   :3002    :3003
```

**Importante:** Los microservicios NO están expuestos externamente. Todo el tráfico pasa por Nginx → BFF.

---

## 💻 Desarrollo

### Tecnologías
- **Fastify**: Framework web de alto rendimiento
- **@fastify/http-proxy**: Proxy reverso a microservicios
- **@fastify/helmet**: Headers de seguridad adicionales
- **@fastify/cookie**: Forwarding de cookies JWT

### Configuración del Proxy
```javascript
fastify.register(import('@fastify/http-proxy'), {
  upstream: process.env.AUTH_URL,  // http://auth:3001
  prefix: '/auth',
  rewritePrefix: ''
});
```

### Variables de Entorno
```bash
SERVICE_NAME=BFF Service
PORT=3000
AUTH_URL=http://auth:3001
CATALOG_URL=http://catalog:3002
MEDIA_URL=http://media:3003
```

---

## 📊 Manejo de Errores

| Código | Origen | Causa |
|--------|--------|-------|
| 503 | Nginx | Rate limit excedido |
| 502 | BFF | Microservicio no disponible |
| 4xx/5xx | Microservicio | Error de lógica de negocio |

Los errores de microservicios se propagan transparentemente al frontend.
