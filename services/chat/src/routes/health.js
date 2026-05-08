export default async function healthRoutes(fastify, options) {
	fastify.get('/health', async (req, reply) => {
		try {
			if (fastify.prisma) {
				await fastify.prisma.$queryRaw`SELECT 1`;
			}

			if (fastify.valkey) {
				await fastify.valkey.ping();
			}
			return reply.code(200).send({
				status: 'UP',
				service: 'Vento Microservice: Chat',
				timestamp: new Date().toISOString(),
				uptime: process.uptime()
			});
		} catch (errn) {
			fastify.log.error({err: errn}, 'Healthcheck failed');
			return reply.code(503).send({
				status: 'DOWN',
				service: 'Vento Microservice: Chat',
				error: errn.message
			});
		}
	});
}