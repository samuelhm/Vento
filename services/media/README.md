# 📸 Media Service

Microservicio de gestión de imágenes para el marketplace C2C. Maneja upload, validación, conversión a WebP y almacenamiento persistente.

---

## 🚀 API Endpoints

### `POST /upload`
Sube imágenes y las convierte a WebP.

**Request:**
```bash
curl -X POST https://localhost/api/media/upload \
  -F "files=@imagen1.jpg" \
  -F "files=@imagen2.png" \
  -F "names=img_uuid-1.webp" \
  -F "names=img_uuid-2.webp"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "files": [
      "img_550e8400-e29b-41d4-a716-446655440000.webp",
      "img_6ba7b810-9dad-11d1-80b4-00c04fd430c8.webp"
    ]
  }
}
```

**Parámetros:**
- `files` (required): Archivos de imagen (JPG, PNG, WebP)
- `names` (optional): Nombres personalizados para las imágenes

**Validaciones:**
- ✅ Formatos: `.jpg`, `.png`, `.webp` únicamente
- ✅ Tamaño: Max 5MB por imagen
- ✅ Cantidad: Max 8 imágenes por request
- ✅ Al menos 1 imagen requerida

---

### `GET /:filename`
Obtiene una imagen almacenada.

**Request:**
```bash
curl https://localhost/api/media/img_550e8400-e29b-41d4-a716-446655440000.webp
```

**Response:**
- Imagen WebP directamente (Content-Type: `image/webp`)
- 404 si la imagen no existe

**Uso en HTML:**
```html
<img src="https://localhost/api/media/img_550e8400.webp" alt="Product">
```

---

### `DELETE /:filename`
Elimina una imagen. **Solo para comunicación interna entre microservicios.**

**Request (desde Catalog):**
```javascript
await fetch(`http://media:3003/${filename}`, {
  method: 'DELETE',
  headers: { 'X-Service-Secret': process.env.SERVICE_SECRET }
});
```

**Response:**
```json
{
  "status": "success",
  "data": { "deleted": "img_550e8400.webp" }
}
```

**Errores:**
- 403 si falta o es inválido `X-Service-Secret`
- 404 si la imagen no existe

**Nota:** Este endpoint NO está expuesto al frontend. Solo Catalog puede llamarlo después de verificar que el usuario es dueño del producto.

---

## 🔐 Seguridad

### 1. Validación Estricta de Formatos
```javascript
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
```
- Valida MIME type real (no extensión)
- Previene ejecución de scripts maliciosos
- Rechaza archivos no-imagen

### 2. Límites de Tamaño
```javascript
limits: {
  fileSize: 5 * 1024 * 1024,  // 5MB por archivo
  files: 8                     // Máximo 8 archivos
}
```
- Protección contra DoS por archivos grandes
- Previene saturación de disco
- Error 413 automático si excede límite

### 3. Nombres UUID Únicos
```javascript
crypto.randomUUID() → img_550e8400-e29b-41d4-a716-446655440000.webp
```
- Evita colisiones de nombres
- Previene Directory Traversal (`../../etc/passwd`)
- Ignora nombre original del usuario

### 4. Conversión con Sharp
```javascript
await sharp(buffer).webp({ quality: 80 }).toFile(filepath);
```
- Detecta y rechaza imágenes corruptas
- Re-procesa la imagen (elimina metadatos maliciosos)
- Garantiza formato WebP válido

---

## 🎯 Arquitectura

### Por Qué WebP
| Aspecto | JPG/PNG | WebP (80%) | Beneficio |
|---------|---------|------------|-----------|
| Tamaño | 100% | ~35% | Menor uso de disco y ancho de banda |
| Calidad | Original | Excelente | Imperceptible a simple vista |
| Carga | Lenta | Rápida | Mejor UX, menor tiempo de carga |

### Almacenamiento Persistente
```yaml
volumes:
  - vento-media-uploads:/uploads
```
- Volumen Docker persistente
- Sobrevive a reinicios del contenedor
- Backup independiente del código

### Integración con Catalog
```javascript
// 1. Frontend genera nombres únicos para cada imagen
const imageNames = files.map(() => `img_${crypto.randomUUID()}.webp`);

// 2. Preparar FormData para Media (imágenes + nombres)
const formData = new FormData();
files.forEach((file, i) => formData.append('files', file));
formData.append('filenames', JSON.stringify(imageNames));

// 3. Datos del producto para Catalog
const productData = {
  title: 'iPhone 13 Pro',
  description: 'Excelente estado, incluye caja original',
  price: 599.99,
  latitude: 40.4168,
  longitude: -3.7038,
  idCategory: 1,
  images: imageNames  // Array de nombres que Media guardará
};

// 4. Llamadas paralelas (ambas usan los mismos nombres)
await Promise.all([
  fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  }),
  fetch('/api/catalog/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  })
]);
```
## 💻 Desarrollo

### Tecnologías
- **Fastify**: Framework web de alto rendimiento
- **Sharp**: Procesamiento de imágenes (4x más rápido que ImageMagick)
- **@fastify/multipart**: Manejo de uploads
- **@fastify/static**: Servir imágenes estáticas

### Variables de Entorno
```bash
SERVICE_NAME=Media Service
PORT=3003
HOST=0.0.0.0
UPLOAD_DIR=/uploads
```

### Testing Local
```bash
# Subir imagen
curl -F "files=@test.jpg" https://localhost/api/media/upload

# Ver imagen
open https://localhost/api/media/img_xxxxx.webp

# Verificar en volumen
docker exec tr_media ls -lh /uploads/
```

## 📊 Manejo de Errores

| Código | Error | Causa |
|--------|-------|-------|
| 400 | No files uploaded | Request sin archivos |
| 400 | Invalid file format | Formato no permitido |
| 413 | File too large | Archivo > 5MB |
| 404 | Image not found | Imagen no existe en GET |
| 500 | Internal server error | Error de procesamiento |

**Formato de Respuesta:**
```json
{
  "status": "error",
  "message": "Descripción del error",
  "code": 400
}
```

---

## 🔄 Mejoras Futuras

- [x] Endpoint `DELETE /:filename` para borrar imágenes
- [x] Job de limpieza de imágenes huérfanas (cron diario)
- [ ] Generación de thumbnails automática (100x100px)
- [ ] Múltiples tamaños (small, medium, large)
- [ ] CDN integration para mejor performance
- [ ] Compresión adaptativa según tipo de imagen

---

## 🧹 Limpieza de Imágenes Huérfanas

El servicio incluye un **job cron automático** que detecta y elimina imágenes que ya no están en uso.

### ¿Cómo funciona?

**Frecuencia:** Todos los días a las **3:00 AM (hora española)**
- Usa la zona horaria `Europe/Madrid` (automáticamente ajusta CET/CEST)

**Proceso:**
1. Obtiene todas las imágenes del directorio `/uploads`
2. Consulta al servicio **auth**: lista de avatares en uso
3. Consulta al servicio **catalog**: lista de fotos de productos en uso
4. Calcula la diferencia (imágenes huérfanas)
5. Elimina automáticamente las imágenes no referenciadas

### Seguridad

- **Fail-safe:** Si falla alguna consulta a auth/catalog, no se elimina ninguna imagen
- **Logging completo:** Se registra cada operación (archivos encontrados, eliminados, errores)
- **Autenticación:** Las consultas internas usan `X-Service-Secret` para validación

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `AUTH_URL` | URL interna del servicio auth | `http://auth:3001` |
| `CATALOG_URL` | URL interna del servicio catalog | `http://catalog:3002` |
| `SERVICE_SECRET` | Secret compartido entre servicios | - |

### Logs Esperados

```
[OrphanCleanup] Scheduled job: daily at 3:00 AM (Europe/Madrid)
[OrphanCleanup] Starting daily cleanup job at 2024-01-15T03:00:00+01:00
[OrphanCleanup] Files on disk: 152
[OrphanCleanup] Avatars in use: 45
[OrphanCleanup] Photos in use: 98
[OrphanCleanup] Orphan files found: 9
[OrphanCleanup] Deleted: old-file-1.webp
[OrphanCleanup] Deleted: old-file-2.webp
...
[OrphanCleanup] Job completed: 9 orphans removed, 0 errors
```

### Requisitos de Implementación en Otros Servicios

- **Auth:** Debe exponer `GET /internal/avatars` (ver implementación en `services/auth/src/routes/auth-routes.js`)
- **Catalog:** Debe exponer `GET /internal/photos` (ver documentación en `services/catalog/CATALOG_ENDPOINT_REQUIREMENTS.md`)

---

## 📚 Referencias

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Performance](https://developers.google.com/speed/webp)
- [Fastify Best Practices](https://fastify.dev/docs/latest/Guides/Getting-Started/)
