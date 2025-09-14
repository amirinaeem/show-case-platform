/**
 * Socket.IO integration with Express httpServer
 *
 * This attaches Socket.IO to the same server instance used by Express,
 * so you only need to deploy one service/process.
 */

import { Server as IOServer } from 'socket.io';
import { registerUserHandlers } from './socketControllers/userRegisterHandlers.js';
import { socketLogger } from './socketUtils/logger.js';

// Allowed origins (configure properly in production)
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:3000'
];

export function attachSocketServer(httpServer) {
  const io = new IOServer(httpServer, {
    cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'] },
    connectionStateRecovery: {
      maxDisconnectionDuration: 30_000 // 30 seconds to reconnect
    }
  });

  // Startup log
  socketLogger.serverStart('attached to Express httpServer', { ALLOWED_ORIGINS });

  // Connection management
  io.on('connection', (socket) => {
    socketLogger.connection(socket.id);

    try {
      registerUserHandlers(io, socket);
      socketLogger.handlerSuccess(socket.id);
    } catch (err) {
      socketLogger.handlerError(socket.id, err);
      socket.disconnect(true);
      return;
    }

    socket.on('ping', () => socketLogger.networkEvent('Ping', socket.id));
    socket.on('pong', (latency) =>
      socketLogger.networkEvent('Pong', socket.id, `(${latency}ms)`)
    );
    socket.on('disconnect', (reason) =>
      socketLogger.disconnect(socket.id, reason)
    );
  });

  // Error handling
  io.engine.on('connection_error', (err) => {
    socketLogger.connectionError(err);
  });

  return io;
}
