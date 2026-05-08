# Documentación para el Equipo de Catalog

## Endpoint Requerido: `GET /internal/photos`

Este endpoint es necesario para que el servicio **media** pueda ejecutar su tarea de limpieza de imágenes huérfanas.

---

## Propósito

El servicio media ejecuta un job cron diario a las 3:00 AM (hora española) que:
1. Obtiene todas las imágenes del directorio de uploads
2. Consulta qué imágenes están en uso por los usuarios (avatars) y productos (photos)
3. Elimina las imágenes que no están referenciadas en ningún lado

Para el paso 2, necesita consultar a auth (avatars) y a catalog (photos).

---

## Especificaciones del Endpoint

### URL
```
GET /internal/photos
```

### Headers Requeridos
| Header | Valor |
|--------|-------|
| `X-Service-Secret` | El valor de la variable de entorno `SERVICE_SECRET` |

### Seguridad
- **NO expongas este endpoint al frontend/nginx**
- Solo debe ser accesible internamente entre microservicios
- Validar el header `X-Service-Secret` contra `process.env.SERVICE_SECRET`
- Retornar 403 si el secret es inválido o falta

### Query SQL
```sql
SELECT DISTINCT path FROM photos
```

### Respuesta Exitosa (200 OK)
```json
{
  "status": "success",
  "data": {
    "photos": [
      "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6.webp",
      "2d3e4f5a-6b7c-48d9-ae0f-1a2b3c4d5e6f.webp",
      ...
    ],
    "count": 150
  }
}
```

### Respuestas de Error

**403 Forbidden - Secret inválido**
```json
{
  "status": "error",
  "message": "Forbidden: Invalid service credentials",
  "code": 403
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Failed to fetch photos",
  "code": 500
}
```

---

## Ejemplo de Implementación

### Opción 1: Añadir a `routes/listing-routes.js`

```javascript
const SERVICE_SECRET = process.env.SERVICE_SECRET;

// Middleware para validar el secret de servicio
async function validateServiceSecret(request, reply) {
  const serviceSecret = request.headers['x-service-secret'];

  if (!serviceSecret || serviceSecret !== SERVICE_SECRET) {
    return reply.code(403).send({
      status: 'error',
      message: 'Forbidden: Invalid service credentials',
      code: 403
    });
  }
}

// Dentro de la función listingRoutes(fastify), añadir:
fastify.get('/internal/photos', {
  preHandler: validateServiceSecret,
  handler: async (request, reply) => {
    try {
      const { rows } = await fastify.pg.query(
        'SELECT DISTINCT path FROM photos'
      );

      const photos = rows.map(row => row.path);

      return {
        status: 'success',
        data: {
          photos,
          count: photos.length
        }
      };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        status: 'error',
        message: 'Failed to fetch photos',
        code: 500
      });
    }
  }
});
```

### Opción 2: Crear un archivo separado `routes/internal-routes.js`

```javascript
const SERVICE_SECRET = process.env.SERVICE_SECRET;

async function validateServiceSecret(request, reply) {
  const serviceSecret = request.headers['x-service-secret'];

  if (!serviceSecret || serviceSecret !== SERVICE_SECRET) {
    return reply.code(403).send({
      status: 'error',
      message: 'Forbidden: Invalid service credentials',
      code: 403
    });
  }
}

async function internalRoutes(fastify) {
  fastify.get('/internal/photos', {
    preHandler: validateServiceSecret,
    handler: async (request, reply) => {
      try {
        const { rows } = await fastify.pg.query(
          'SELECT DISTINCT path FROM photos'
        );

        const photos = rows.map(row => row.path);

        return {
          status: 'success',
          data: {
            photos,
            count: photos.length
          }
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          status: 'error',
          message: 'Failed to fetch photos',
          code: 500
        });
      }
    }
  });
}

export default internalRoutes;
```

Luego registrar en `index.js`:
```javascript
import internalRoutes from './routes/internal-routes.js';

await fastify.register(internalRoutes);
```

---

## Testing

Una vez implementado, puedes probar el endpoint con curl:

```bash
# Desde dentro del contenedor de catalog
curl -H "X-Service-Secret: tu-service-secret" \
  http://localhost:3002/internal/photos
```

O desde otro contenedor:

```bash
# Desde el contenedor de media
curl -H "X-Service-Secret: ${SERVICE_SECRET}" \
  http://catalog:3002/internal/photos
```

---

## Importante

- El servicio media **ya está programado** para llamar a este endpoint
- Cuando implementes el endpoint, el job de limpieza empezará a funcionar automáticamente
- El job se ejecuta **todos los días a las 3:00 AM hora española** (CET/CEST)
- Si el endpoint falla, el job no eliminará ninguna imagen (fail-safe)

---

## Referencia de Implementación

Puedes ver la implementación equivalente en el servicio **auth**:
- Archivo: `services/auth/src/routes/auth-routes.js`
- Endpoint: `GET /internal/avatars`
- La lógica es idéntica, solo cambia la tabla consultada (`users.avatar_url` vs `photos.path`)
