
import { Server } from 'socket.io';
import { registerUserHandlers } from './socketControllers/userRegisterHandlers.js';
import { socketLogger } from './socketUtils/logger.js';
import { env } from '../../shared/src/config/env.js';


// ===================================================================
// SECTION 1: SERVER CONFIGURATION
// ===================================================================

const PORT = env.SOCKET_PORT || 8000;
const CORS_CONFIG = {
  origin: env.FRONTEND_URL || '*',
  methods: ['GET', 'POST']
};

// ===================================================================
// SECTION 2: SERVER INITIALIZATION
// ===================================================================


const io = new Server(PORT, { 
  cors: CORS_CONFIG,
  connectionStateRecovery: {
    maxDisconnectionDuration: 30000 // 30 seconds to reconnect
  }
});

// ===================================================================
// SECTION 3: SERVER STARTUP
// ===================================================================

socketLogger.serverStart(PORT, CORS_CONFIG);

// ===================================================================
// SECTION 4: CONNECTION MANAGEMENT
// ===================================================================

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

  // =================================================================
  // SUBSECTION 4.1: NETWORK MONITORING
  // =================================================================

  socket.on('ping', () => socketLogger.networkEvent('Ping', socket.id));
  socket.on('pong', (latency) => socketLogger.networkEvent('Pong', socket.id, `(${latency}ms)`));


  socket.on('disconnect', (reason) => socketLogger.disconnect(socket.id, reason));
});

// ===================================================================
// SECTION 5: ERROR HANDLING
// ===================================================================


io.engine.on('connection_error', (err) => {
  socketLogger.connectionError(err);
});

// ===================================================================
// SECTION 6: PROCESS MANAGEMENT
// ===================================================================


process.on('SIGTERM', () => {
  socketLogger.shutdown();
  io.close(() => process.exit(0)); 
});


export { io as socketServer };