async function authRoutes(fastify) {
  fastify.register(import('@fastify/http-proxy'), {
    upstream: process.env.AUTH_URL,
    prefix: '/',
    rewritePrefix: '',
    http2: false
  });
}

export default authRoutes;