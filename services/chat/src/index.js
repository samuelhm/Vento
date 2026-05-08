import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';   // New database
import dotenv from 'dotenv';
import chatRoutes from './routes/chat-routes.js';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import cookie from 'cookie';
import { z } from 'zod';
import healthRoutes from './routes/health.js';


dotenv.config();

const fastify = Fastify({ logger: true, trustProxy: true });
const prisma = new PrismaClient(); //declarate prisma

// Validating (Valking)
const MessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1, "Message cannot be empty").max(1000),
  type: z.enum(["TEXT", "IMAGE", "OFFER", "SYSTEM"]).default("TEXT"),
  offerAmount: z.number().positive().nullable().optional()
});

await fastify.register(fastifyCookie);

//Register cors to frontend
await fastify.register(cors, {
  origin: true, //we can change to url
  credentials: true, //get cookies
  methods: ["GET", "POST"]
});

//Configurating JWT
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'super_secret_potatos_321',
  cookie: {
    cookieName: 'token',
    signed: false,
  }
});

// Configurate Socket.io
await fastify.register(fastifySocketIO, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

//register routes HTTP (REST)
fastify.register(chatRoutes);

const start = async () => {
  try {
    await fastify.register(healthRoutes);

    const PORT = process.env.PORT || 3004;
    const HOST = '0.0.0.0';

    await fastify.ready();

    //Security process - check user- Middleware
    fastify.io.use((socket, next) => {
      try {
        const cookieHeader = socket.handshake.headers.cookie;
        let token = null;

        if (cookieHeader){
          const cookies = cookie.parse(cookieHeader);
          token = cookies.token;
        }

        if (!token){
          token = socket.handshake.auth?.token;
        }

        if (!token) {
          fastify.log.error("Access denied: Cookie 'token' not found");
          return next(new Error("Access denied: Token not found"));
        }

        //Verify token
        const decoded = fastify.jwt.verify(token);
        socket.userId = decoded.id;
        fastify.log.info(`Verified user: ${socket.userId}`);
        next();
      }
      catch (e) {
        fastify.log.error(`Invalid Token: ${e.message}`);
        return next(new Error("Access denied: Invalid session"));
        }
    });


    // 3. Logic socket
    fastify.io.on('connection', (socket) => {
      fastify.log.info(`Socket connected: ${socket.id} (User: ${socket.userId})`);

      //Join chat & History
      socket.on('join_conversation', async ({ conversationId }) => {
        try {
          const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId}
          });
          if (!conversation) {
            return socket.emit('error_message', { message: "Conversation not found"});
          }
          //Validating users
          if (conversation.buyerId !== socket.userId && conversation.productOwner !== socket.userId) {
            fastify.log.warn(`Unauthorized access attempt by ${socket.userId} to ${conversationId}`);
            return socket.emit('error_message', { message: "You do not have permission to view this chat"});
          }

          socket.join(conversationId);
          socket.activeRoom = conversationId;
          socket.to(conversationId).emit('user_status', { userId: socket.userId, status: 'online'});

          //Checking in real-time status connnected-disconected
          const roomSize = fastify.io.sockets.adapter.rooms.get(conversationId)?.size || 0;
          if (roomSize > 1){
            const otherUserId = (socket.userId === conversation.buyerId)
            ? conversation.productOwner : conversation.buyerId;

            socket.emit('user_status', {userId: otherUserId, status: 'online'});
          }

          const history = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc'},
            take: 50
          });

          socket.emit('chat_history', history);
          fastify.log.info(`User ${socket.userId} loaded the chat: ${conversationId}`);
        }
        catch (e) {
          fastify.log.error(e);
        }
      });

      socket.on('send_message', async (data) => {
        try {
          const validatedData = MessageSchema.parse(data);
          const newMessage = await prisma.message.create({
            data: {
              conversationId: validatedData.conversationId,
              senderId: socket.userId,
              content: validatedData.content,
              type: validatedData.type,
              offerAmount: validatedData.offerAmount
            }
          });

          //Update date
          await prisma.conversation.update({
            where: { id: validatedData.conversationId },
            data: { updatedAt: new Date() }
          });
          //send to room
          fastify.io.to(validatedData.conversationId).emit('new_message', newMessage);
        }
        catch (error) {
        if (error instanceof z.ZodError) {
         return socket.emit('error_message', {
          message: "Invalid data",
          errors: error.errors
         });
        }
        fastify.log.error("Error saving messages", error);
        }
      });

      socket.on('mark_as_read', async ({ conversationId }) => {
        try {
          await prisma.message.updateMany({
            where: {
              conversationId,
              senderId: { not: socket.userId }, //mark whom read, that != my_user
              read: false
            },
            data: { read: true }
          });
          fastify.io.to(conversationId).emit('message_read', { by: socket.userId });
        } catch (e) {
          fastify.log.error('Error marking as read: ', e);
        }
      });

      socket.on('disconnect', () => {
        fastify.log.info(`Socket disconnected: ${socket.id}`);
        if (socket.activeRoom) {
          socket.to(socket.activeRoom).emit('user_status', { userId: socket.userId, status: 'offline'});
        }
      });
    });

    // Run server
    await fastify.listen({ port: parseInt(PORT), host: HOST });
    console.log(`🚀 Chat Service running on http://${HOST}:${PORT}`);

  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();