import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//check last conversation
export const getUserConversation = async (req, reply) => {
	try {
		await req.jwtVerify();
		const userId = req.user.id;

		const chats = await prisma.conversation.findMany({
			where: {
				OR: [
					{ buyerId: userId },
					{ productOwner: userId }
				]
			},
			include: {
				messages: {
					take: 1,
					orderBy: { createdAt : 'desc' }
				}
			},
			orderBy: { updatedAt : 'desc' }
		});
		return chats;
	}
	catch (error) {
		req.log.error(error);
		if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE' || error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
			return reply.code(401).send({ error: 'No autorizado' });
		}

		return reply.code(500).send({ error: 'Error: Not found chats' });
	}
};

export const getChatHistory = async (req, reply) => {
	const { conversationId } = req.params;

	try {
		const messages = await prisma.message.findMany({
			where: { conversationId },
			orderBy: { createdAt: 'asc' }
		});
		return messages;
	}
	catch (error) {
		req.log.error(error);
		return reply.code(500).send({ error: 'Error reading history'});
	}
};

//Get history from chats-db
export const createConversation = async (req, reply) => {
	const {productId, productOwner } = req.body;

	if (!productId || !productOwner )
		return reply.code(400).send( {error: 'Error: Not enough data'} );

	try{
		await req.jwtVerify();
		const buyerId = req.user.id;

		let conversation = await prisma.conversation.findFirst({
			where: {
				productId,
				productOwner,
				buyerId
			}
		});

		if (!conversation) {
			conversation =  await prisma.conversation.create({
				data: {
					productId,
					productOwner,
					buyerId
				}
			});
		}
		return conversation;
	}
	catch (error) {
		req.log.error(error);
		reply.code(500).send({ error: 'Cant find chat'});
	}
};

export const sendMessage = async (req, reply) => {
	const { conversationId } = req.params;
	const { content } = req.body;

	if (!content) {
		return reply.code(400).send({ error: 'Message content is required' });
	}

	try {
		await req.jwtVerify();
		const userId = req.user.id;

		const newMessage = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				content
			}
		});
		return reply.code(201).send(newMessage);
	} catch (error) {
		req.log.error(error);
		return reply.code(500).send({ error: 'Error sending message' });
	}
};