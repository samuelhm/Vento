async function mediaRoutes(fastify) {
  fastify.register(import('@fastify/http-proxy'), {
    upstream: process.env.MEDIA_URL,
    prefix: '/',
    rewritePrefix: '', 
    http2: false
  });
}

export default mediaRoutes;