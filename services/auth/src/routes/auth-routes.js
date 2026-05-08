import { authController } from '../controllers/auth-controller.js';
import { signupSchema, signinSchema, userResponseSchema, updateUserSchema, deleteUserSchema, meResponseSchema, forgotPasswordSchema, forgotPasswordResponseSchema, resetPasswordSchema, resetPasswordResponseSchema } from '../schemas/auth-schemas.js';

const SERVICE_SECRET = process.env.SERVICE_SECRET;

/**
 * Middleware to validate internal service authentication
 */
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

async function authRoutes(fastify) {

  // Internal endpoint: Get all avatar URLs (for media service orphan cleanup)
  fastify.get('/internal/avatars', {
    preHandler: validateServiceSecret,
    handler: async (request, reply) => {
      try {
        const { rows } = await fastify.pg.query(
          'SELECT DISTINCT avatar_url FROM users WHERE avatar_url IS NOT NULL'
        );

        const avatars = rows.map(row => row.avatar_url);

        return {
          status: 'success',
          data: {
            avatars,
            count: avatars.length
          }
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          status: 'error',
          message: 'Failed to fetch avatars',
          code: 500
        });
      }
    }
  });

  // Registro
fastify.post('/signup', { 
    schema: { 
      ...signupSchema, 
      response: { 201: userResponseSchema } 
    },
    handler: authController.signup 
  });

  // Login
  fastify.post('/signin', { 
    schema: signinSchema,
    handler: authController.signin
  });

  // Logout
  fastify.post('/logout', {
    handler: authController.logout
  });

  // Forgot Password
  fastify.post('/forgot-password', {
    schema: {
      body: forgotPasswordSchema.body,
      response: {
        200: forgotPasswordResponseSchema
      }
    },
    handler: authController.requestPasswordReset
  });

  // Reset Password
  fastify.post('/reset-password', {
    schema: {
      body: resetPasswordSchema.body,
      response: {
        200: resetPasswordResponseSchema
      }
    },
    handler: authController.resetPassword
  });

  // Current session
  fastify.get('/me', {
    schema: {
      response: { 200: meResponseSchema }
    },
    handler: authController.getMe
  });

  // Perfil (Protegido)
  fastify.get('/user/:id', {
    schema: {
        params: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' } // Validamos que el ID de la URL sea un UUID
            }
        }
    },
    handler: authController.getUserProfile
  });
  // Actualizar usuario
  fastify.put('/user/:id', {
    schema: updateUserSchema,
    handler: authController.updateUser
  });

  // Eliminar usuario
  fastify.delete('/user/:id', {
    schema: deleteUserSchema,
    handler: authController.deleteUser
  });
}

export default authRoutes;