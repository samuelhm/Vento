import bcrypt from 'bcrypt';
import { sendPasswordResetEmail } from '../utils/email-service.js';

const SERVICE_SECRET = process.env.SERVICE_SECRET;
const MEDIA_URL = process.env.MEDIA_URL || 'http://media:3003';

// Helper to delete avatar from Media service
async function deleteAvatarFromMedia(avatarUrl) {
  if (!avatarUrl) return;

  try {
    const response = await fetch(`${MEDIA_URL}/${avatarUrl}`, {
      method: 'DELETE',
      headers: { 'X-Service-Secret': SERVICE_SECRET }
    });

    if (!response.ok && response.status !== 404) {
      console.error(`Failed to delete avatar: ${avatarUrl}`);
    }
  } catch (error) {
    console.error(`Error deleting avatar from media: ${error.message}`);
  }
}

export const authController = {

  // --- REGISTRO ---
  signup: async (request, reply) => {
    const {
      email,
      password,
      name,
      lastNames,
      avatarUrl,
      lat, 
      lng 
    } = request.body;

    const { pg, jwt } = request.server;

    // Validar que lat/lng estén presentes (geolocalización obligatoria)
    if (lat === undefined || lat === null || lng === undefined || lng === null) {
      return reply.code(400).send({ message: 'La geolocalización es obligatoria para registrarse' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const { rows } = await pg.query(
        `INSERT INTO users (name, last_names, email, password, avatar_url, location)
         VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_Point($6, $7), 4326))
         RETURNING id, email, name, last_names, avatar_url`,
        [name, lastNames, email, hashedPassword, avatarUrl ?? null, lng, lat]
      );
      const newUser = rows[0];
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        lastNames: newUser.last_names,
        avatarUrl: newUser.avatar_url
      };

      const token = jwt.sign({ id: userResponse.id, email: userResponse.email });

      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      });

      reply.code(201).send({
        message: 'Bienvenido',
        user: userResponse
      });

    } catch (err) {
      if (err.code === '23505') {
        return reply.code(409).send({ message: 'El email ya está registrado' });
      }
      request.log.error(err);
      return reply.code(500).send({ message: 'Error interno del servidor' });
    }
  },
  // --- INICIO DE SESIÓN ---
  signin: async (request, reply) => {
    const { email, password } = request.body;
    const { pg, jwt } = request.server;

    const { rows } = await pg.query('SELECT * FROM users WHERE email = $1', [email]);

    if (rows.length === 0) {
      return reply.code(401).send({ message: 'Credenciales inválidas' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return reply.code(401).send({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email });

    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });
    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastNames: user.last_names
      }
    };
  },
  // --- CERRAR SESIÓN ---
  logout: async (_request, reply) => {
    reply.clearCookie('token', { path: '/' });
    return { message: 'Sesión cerrada' };
  },
  // --- ACTUALIZAR PERFIL ---
  updateUser: async (request, reply) => {
    const { id } = request.params;
    const { name, lastNames, lat, lng, avatarUrl } = request.body;
    const { pg } = request.server;

    if (lat === undefined || lat === null || lng === undefined || lng === null) {
      return reply.code(400).send({ message: 'La geolocalización es obligatoria para actualizar el perfil' });
    }

    // 1. Verificar que el usuario autenticado sea el dueño del perfil
    await request.jwtVerify();
    if (request.user.id !== id) {
      return reply.code(403).send({ message: 'No tienes permiso para actualizar este perfil' });
    }

    try {
      // 2. If changing avatar, get old one to delete it
      let oldAvatarUrl = null;
      if (avatarUrl !== undefined) {
        const { rows: currentUser } = await pg.query(
          'SELECT avatar_url FROM users WHERE id = $1',
          [id]
        );
        if (currentUser.length > 0) {
          oldAvatarUrl = currentUser[0].avatar_url;
        }
      }

      // 3. Update user profile
      const { rows } = await pg.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             last_names = COALESCE($2, last_names),
             location = COALESCE(ST_SetSRID(ST_Point($3, $4), 4326), location),
             avatar_url = COALESCE($5, avatar_url)
         WHERE id = $6
         RETURNING id, name, last_names, email, avatar_url`,
        [name, lastNames, lng, lat, avatarUrl, id]
      );

      if (rows.length === 0) {
        return reply.code(404).send({ message: 'Usuario no encontrado' });
      }

      // 4. Delete old avatar from Media if it changed
      if (oldAvatarUrl && oldAvatarUrl !== avatarUrl) {
        await deleteAvatarFromMedia(oldAvatarUrl);
      }

      return {
        message: 'Perfil actualizado',
        user: {
          id: rows[0].id,
          name: rows[0].name,
          lastNames: rows[0].last_names,
          email: rows[0].email,
          avatarUrl: rows[0].avatar_url
        }
      };
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ message: 'Error al actualizar el usuario' });
    }
  },

  // --- ELIMINAR CUENTA ---
  deleteUser: async (request, reply) => {
    const { id } = request.params;
    const { pg } = request.server;

    await request.jwtVerify();
    if (request.user.id !== id) {
      return reply.code(403).send({ message: 'No tienes permiso para eliminar esta cuenta' });
    }

    // 1. Get user's avatar before deleting
    const { rows } = await pg.query(
      'SELECT avatar_url FROM users WHERE id = $1',
      [id]
    );
    const avatarUrl = rows.length > 0 ? rows[0].avatar_url : null;

    // 2. Delete user from database
    const { rowCount } = await pg.query('DELETE FROM users WHERE id = $1', [id]);

    if (rowCount === 0) {
      return reply.code(404).send({ message: 'Usuario no encontrado' });
    }

    // 3. Delete avatar from Media service
    if (avatarUrl) {
      await deleteAvatarFromMedia(avatarUrl);
    }

    // Al eliminar la cuenta, limpiamos la cookie de sesión
    reply.clearCookie('token', { path: '/' });
    return { message: 'Cuenta eliminada exitosamente' };
  },
  // --- PERFIL DE USUARIO ---
  getUserProfile: async (request, reply) => {
    const { id } = request.params;
    const { pg } = request.server;
    let viewerId = null;

    try {
      await request.jwtVerify();
      viewerId = request.user.id;
    } catch (err) {
      viewerId = null;
    }

    const { rows } = await pg.query(
      `SELECT
        id, email, name, last_names, avatar_url, terms_accepted_at,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
       FROM users WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return reply.code(404).send({ message: 'Usuario no encontrado' });
    }

    const userTarget = rows[0];
    const isOwner = viewerId === userTarget.id;
    if (!isOwner) {
        return {
            id: userTarget.id,
            name: userTarget.name,
            lastNames: userTarget.last_names,
            avatarUrl: userTarget.avatar_url,
            createdAt: userTarget.terms_accepted_at,
            isPublicView: true
        };
    }

    return {
        id: userTarget.id,
        name: userTarget.name,
        lastNames: userTarget.last_names,
        email: userTarget.email,
        avatarUrl: userTarget.avatar_url,
        createdAt: userTarget.terms_accepted_at,
        coordinates: {
            lat: userTarget.lat,
            lng: userTarget.lng
        },
        isOwnerView: true
    };
  },
  // --- CURRENT SESSION ---
  getMe: async (request, reply) => {
    const { pg } = request.server;

    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({
        status: 'error',
        message: 'Unauthorized',
        code: 401
      });
    }

    const { rows } = await pg.query(
      `SELECT
        id, email, name, last_names, avatar_url, terms_accepted_at,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
       FROM users WHERE id = $1`,
      [request.user.id]
    );

    if (rows.length === 0) {
      return reply.code(404).send({
        status: 'error',
        message: 'User not found',
        code: 404
      });
    }

    const userTarget = rows[0];
    return {
      status: 'success',
      data: {
        id: userTarget.id,
        name: userTarget.name,
        lastNames: userTarget.last_names,
        email: userTarget.email,
        avatarUrl: userTarget.avatar_url,
        createdAt: userTarget.terms_accepted_at,
        coordinates: {
          lat: userTarget.lat,
          lng: userTarget.lng
        }
      }
    };
  },

  // --- SOLICITUD DE RECUPERACIÓN DE CONTRASEÑA ---
  requestPasswordReset: async (request, reply) => {
    const { email } = request.body;
    const { pg, jwt } = request.server;

    try {
      const { rows } = await pg.query('SELECT id, email FROM users WHERE email = $1', [email]);

      if (rows.length === 0) {
        return reply.code(200).send({
          message: 'Si el email está registrado, recibirás un enlace de recuperación'
        });
      }

      const user = rows[0];

      const resetToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          type: 'password_reset'
        },
        { expiresIn: '30m' }
      );

      await sendPasswordResetEmail(user.email, resetToken);

      return reply.code(200).send({
        message: 'Si el email está registrado, recibirás un enlace de recuperación'
      });

    } catch (err) {
      request.log.error(err);

      if (err.message.includes('SMTP')) {
        return reply.code(500).send({
          message: 'Error al enviar el email. Inténtalo más tarde.'
        });
      }

      return reply.code(500).send({
        message: 'Error interno del servidor'
      });
    }
  },

  // --- RESTABLECER CONTRASEÑA ---
  resetPassword: async (request, reply) => {
    const { token, newPassword } = request.body;
    const { pg, jwt } = request.server;

    try {
      let decoded;
      try {
        decoded = jwt.verify(token);
      } catch (err) {
        return reply.code(400).send({
          message: 'Token inválido o expirado'
        });
      }

      if (decoded.type !== 'password_reset') {
        return reply.code(400).send({
          message: 'Token inválido para recuperación de contraseña'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const { rows } = await pg.query(
        'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
        [hashedPassword, decoded.id]
      );

      if (rows.length === 0) {
        return reply.code(404).send({
          message: 'Usuario no encontrado'
        });
      }

      return reply.code(200).send({
        message: 'Contraseña actualizada exitosamente'
      });

    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({
        message: 'Error interno del servidor'
      });
    }
  }
};
