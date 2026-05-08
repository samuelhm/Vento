import Fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { mkdir } from 'fs/promises';

import mediaRoutes from './routes/media-routes.js';
import healthRoutes from './routes/health.js';
import { initOrphanCleanupJob } from './jobs/orphan-cleanup-job.js';

const SERVICE_NAME = process.env.SERVICE_NAME || 'Media Service';
const PORT = parseInt(process.env.PORT) || 3003;
const HOST = process.env.HOST || '0.0.0.0';
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fastify = Fastify({ logger: true, trustProxy: true });

fastify.register(fastifyMultipart, {
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 8
  }
});

fastify.register(fastifyStatic, {
  root: UPLOAD_DIR,
  prefix: '/',
  serve: false // Manual serving via sendFile
});
fastify.register(healthRoutes);
fastify.register(mediaRoutes);

fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  
  reply.code(error.statusCode || 500).send({
    status: 'error',
    message: error.message || 'Internal server error',
    code: error.statusCode || 500
  });
});

const start = async () => {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 ${SERVICE_NAME} running on http://${HOST}:${PORT}`);
    console.log(`📁 Upload directory: ${UPLOAD_DIR}`);

    // Initialize the orphan cleanup cron job
    initOrphanCleanupJob();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
