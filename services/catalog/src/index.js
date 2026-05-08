import Fastify from 'fastify';
import categoryRoutes from './routes/category-routes.js';
import listingRoutes from './routes/listing-routes.js';
import transactionRoutes from './routes/transaction-route.js';
import wishlistRoutes from './routes/wishlist-routes.js';
import reviewsRoutes from './routes/reviews-routes.js';
import {categoryNodeSchema} from './schemas/category-schema.js';
import { dbmigrations } from './db-migrations.js';
import {fastifyPostgres} from '@fastify/postgres';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import healthRoutes from './routes/health.js';
import {errorHandler} from './utils/error-handler.js';


const fastify = Fastify({logger:true, trustProxy: true});
const SERVICE_NAME = process.env.SERVICE_NAME;
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const JWT_SECRET = process.env.JWT_SECRET;

await fastify.setErrorHandler(errorHandler);
await fastify.addSchema(categoryNodeSchema);
await fastify.register(listingRoutes);
await fastify.register(categoryRoutes);
await fastify.register(transactionRoutes);
await fastify.register(wishlistRoutes);
await fastify.register(reviewsRoutes);
await fastify.register(fastifyPostgres, {connectionString: DATABASE_URL});
await fastify.register(fastifyCookie);
await fastify.register(fastifyJwt , {
  secret: JWT_SECRET,
  cookie :{
    cookieName: 'token',
    httpOnly: true,
    secure: true,
    signed: false,
    sameSite: 'lax'
  }
});

const start = async () => {
  try {
    await fastify.register(healthRoutes);
    await dbmigrations(fastify);
    await fastify.listen({ port: parseInt(PORT), host: HOST });
    console.log(`Servidor ${SERVICE_NAME} corriendo en http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();