import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';

//rutas (proxies)
import authRoutes from './routes/auth-routes.js';
import catalogRoutes from './routes/catalog-routes.js';
import mediaRoutes from './routes/media-routes.js';
import healthRoutes from './routes/health.js';

const fastify = Fastify({ 
  logger: true,
  trustProxy: true,
  bodyLimit: 1048576 * 10 // 10MB
});


const PORT = parseInt(process.env.PORT);
const HOST = process.env.HOST || '0.0.0.0';
fastify.register(fastifyCookie);
fastify.register(fastifyHelmet, {
  contentSecurityPolicy: false, // nginx lo maneja
  hsts: false // nginx lo maneja
});
fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  
  reply.code(error.statusCode || 500).send({
    error: error.name || 'Internal Server Error',
    message: error.message || 'Algo salió mal'
  });
});
fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(catalogRoutes, { prefix: '/catalog' });
fastify.register(mediaRoutes, { prefix: '/media' });

fastify.get('/', async () => {
  return { 
    service: process.env.SERVICE_NAME, 
    status: 'OK', 
    timestamp: new Date() 
  };
});

const start = async () => {
  try {
    await fastify.register(healthRoutes);
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 BFF Service corriendo en http://${HOST}:${PORT}`);
    console.log(`🔗 Conectado a Auth: ${process.env.AUTH_URL}`);
    console.log(`🔗 Conectado a Catalog: ${process.env.CATALOG_URL}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();