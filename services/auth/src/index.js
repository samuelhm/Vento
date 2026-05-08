import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyPostgres from '@fastify/postgres';
import fastifyCookie from '@fastify/cookie';

import routes from './routes/auth-routes.js';
import healthRoutes from './routes/health.js';
import dbmigrations  from './db-migrations.js';

const fastify = Fastify({ logger: true, trustProxy: true });
// Variables de entorno
const SERVICE_NAME = process.env.SERVICE_NAME;
const PORT = parseInt(process.env.PORT);
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;


fastify.register(fastifyCookie);
fastify.register(fastifyJwt, {
  secret: JWT_SECRET,
  cookie: {
    cookieName: 'token',
    httpOnly: true,
    secure: true,
    signed: false,
    sameSite: 'lax'
  }
});
await fastify.register(fastifyPostgres, {
  connectionString: DATABASE_URL
});
fastify.register(routes);
await dbmigrations(fastify);

fastify.get('/', async () => {
  return { 
    service: SERVICE_NAME, 
    status: 'OK', 
    timestamp: new Date() 
  };
});

const start = async () => {
  try {
    await fastify.register(healthRoutes);
    await fastify.listen({ port: parseInt(PORT), host: HOST });
    console.log(`Servidor ${SERVICE_NAME} corriendo en http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();