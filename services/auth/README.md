# 🔐 Auth Service

Microservicio de autenticación y gestión de usuarios. Maneja registro, login, logout, perfiles y eliminación de cuentas con JWT en cookies HttpOnly.

---

## 🚀 API Endpoints

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/signup` | POST | Registrar nuevo usuario | ❌ |
| `/signin` | POST | Iniciar sesión | ❌ |
| `/logout` | POST | Cerrar sesión |  ✅ JWT |
| `/forgot-password` | POST | Solicitar recuperación de contraseña | ❌ |
| `/reset-password` | POST | Restablecer contraseña con token | ❌ |
| `/user/:id` | GET | Obtener perfil público | ✅ JWT en Datos sensibles |
| `/user/:id` | PUT | Actualizar perfil | ✅ JWT |
| `/user/:id` | DELETE | Eliminar cuenta | ✅ JWT |

### Ejemplos de Uso

**Registro:**
```bash
curl -X POST https://localhost/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePass123", "name": "Juan", "lastNames": "Pérez", "lat": 40.4168, "lng": -3.7038}'
```

**Login:**
```bash
curl -X POST https://localhost/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePass123"}'
```

**Recuperación de contraseña - Paso 1 (solicitar):**
```bash
curl -X POST https://localhost/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Recuperación de contraseña - Paso 2 (restablecer):**
```bash
curl -X POST https://localhost/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJhbGciOiJIUzI1NiIs...", "newPassword": "nuevaContraseña123"}'
```

**Response:** Cookie JWT + datos del usuario
```json
{
  "message": "Login exitoso",
  "user": { "id": "uuid", "email": "user@example.com", "name": "Juan" }
}
```

---

## 🔒 Seguridad Implementada

### 1. Hash de Contraseñas (bcrypt)
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
const match = await bcrypt.compare(password, user.password);
```
- 10 rondas de salt (~1s por hash)
- Imposible recuperar contraseña original
- Protección contra ataques de diccionario

### 2. JWT en Cookies HttpOnly
```javascript
reply.setCookie('token', token, {
  httpOnly: true,   // No accesible desde JavaScript (XSS)
  secure: true,     // Solo HTTPS
  sameSite: 'lax'   // Protección CSRF
});
```

### 3. Prepared Statements
```javascript
// ✅ Seguro - placeholders
await pg.query('SELECT * FROM users WHERE email = $1', [email]);
// ❌ Vulnerable - interpolación directa (NUNCA hacer esto)
```

### 4. Validación de Esquemas (JSON Schema)
- Valida tipos de datos (string, number)
- Valida formato (email válido)
- Valida rangos (lat/lng válidos)

### 5. Autorización por Ownership
```javascript
await request.jwtVerify();
if (request.user.id !== id) {
  return reply.code(403).send({ message: 'No tienes permiso' });
}
```

---

## 🎯 Integración con Otros Servicios

### Para Catalog/Chat: Verificar JWT
```javascript
// Compartir configuración JWT idéntica
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: { cookieName: 'token', signed: false }
});

// Verificar en rutas protegidas
await request.jwtVerify();
const { id, email } = request.user;
```

### Datos del Usuario en JWT
```javascript
{ id: "uuid", email: "user@example.com" }
```

---

## 📊 Base de Datos

### Tabla users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    last_names VARCHAR(355) NOT NULL,
    email VARCHAR(355) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    location GEOMETRY(POINT) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    avatar_url VARCHAR(355),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**PostGIS:** Coordenadas en formato (longitude, latitude)

---

## 💻 Desarrollo

### Tecnologías
- **Fastify**: Framework web de alto rendimiento
- **bcrypt**: Hash de contraseñas
- **@fastify/jwt**: Tokens JWT
- **@fastify/cookie**: Cookies seguras
- **pg**: PostgreSQL con PostGIS

### Variables de Entorno
```bash
SERVICE_NAME=Auth Service
PORT=3001
DATABASE_URL=postgres://user:pass@postgres:5432/auth_db
JWT_SECRET=your-secret-key

# SMTP Configuration (para recuperación de contraseña)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=admin@ventomarket.store
SMTP_FROM=admin@ventomarket.store
FRONTEND_URL=https://ventomarket.store
```

### Secrets (archivos sensibles)
El password SMTP se carga desde el archivo de secrets:
- **Archivo:** `secrets/smtp_password.txt`
- **Montaje:** `/run/secrets/smtp_password.txt` en el contenedor

**Nota:** No incluir `SMTP_PASS` en el archivo `.env`. El servicio primero busca la variable de entorno, y si no existe, lee el archivo de secrets.

---

## 📊 Manejo de Errores

| Código | Error | Causa |
|--------|-------|-------|
| 400 | Validation error | Datos inválidos en request |
| 400 | Invalid token | Token de recuperación inválido o expirado |
| 401 | Unauthorized | JWT inválido o expirado |
| 403 | Forbidden | Usuario no es dueño del recurso |
| 404 | User not found | Usuario no existe |
| 409 | Email already exists | Email duplicado |
| 500 | Internal server error | Error de BD o servidor |
| 500 | Email error | Error al enviar email de recuperación |
