import http from 'http';
import { Server } from 'socket.io'; // Optional for real-time features
import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

const server = http.createServer(app);

// Optional: Socket.IO setup for real-time updates
// const io = new Server(server, {
//   cors: {
//     origin: config.corsOrigin,
//     methods: ['GET', 'POST']
//   }
// });

const PORT = config.port || 3000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// Optional Socket.IO connection handling
// io.on('connection', (socket) => {
//   logger.info(`User connected: ${socket.id}`);

//   socket.on('disconnect', () => {
//     logger.info(`User disconnected: ${socket.id}`);
//   });
// });

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default server;