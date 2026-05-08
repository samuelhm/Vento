async function catalogRoutes(fastify) {
  fastify.register(import('@fastify/http-proxy'), {
    upstream: process.env.CATALOG_URL,
    prefix: '/',
    rewritePrefix: '',
    http2: false
  });
}

export default catalogRoutes;