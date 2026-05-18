import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { createAdapter } from '@socket.io/redis-adapter';
import app from './app.js';
import redis from './config/redis.js';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Redis Adapter for Clustering Support
const pubClient = redis;
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

// Socket.IO Logic
io.on('connection', (socket) => {
  logger.info('A user connected: ' + socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    logger.info(`User ${userId} joined their notification room`);
  });

  socket.on('disconnect', () => {
    logger.info('User disconnected');
  });
});

// Export io for use in controllers
export { io };

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

