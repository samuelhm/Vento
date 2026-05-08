import { getUserConversation, createConversation, getChatHistory, sendMessage } from "../chat-controller.js";

async function chatRoutes(fastify, options) {
	//Get API/chats, my chats
	fastify.get('/chats', getUserConversation);
	//Get API/chats history
	fastify.get('/chats/:conversationId/messages', getChatHistory);
	//Post API/chats, create chat
	fastify.post('/chats', createConversation);
	//Post API/chats/messages, send message
	fastify.post('/chats/:conversationId/messages', sendMessage);
}

export default chatRoutes;
