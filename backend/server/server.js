// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core Modules
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PeerServer } from 'peer';
import fs from 'fs';

// Config and Middleware
import connectDB from '../config/mdb.js';
import { notFound, errorHandler } from '../middleware/errorMiddleware.js';
import { socketAuth } from '../middleware/authMiddleware.js';

// Routes and Sockets
import apiRoutes from '../routes/routeSetup.js';
import { setupSocketHandlers } from '../sockets/socketHandlers.js';
import messengerRoutes from '../routes/messengerRoutes.js';

// Constants
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const tempDir = path.join(__dirname, 'temp_uploads');
const activeUploads = new Set();

// ======================
// Initialize Servers
// ======================
const app = express();
const httpServer = createServer(app);

// PeerJS Signaling Server
const peerServer = PeerServer({
  port: 9001,
  path: '/peerjs',
  proxied: true,
});

// ======================
// Connect to Database
// ======================
connectDB()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// ======================
// Global Middleware
// ======================
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Make activeUploads available to all routes
app.use((req, res, next) => {
  req.app.locals.activeUploads = activeUploads;
  next();
});

// ======================
// Static Files
// ======================
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(express.static(path.join(rootDir, 'shared')));

// ======================
// Routes
// ======================
app.get('/', (req, res) => res.send('Welcome to the API!'));
app.use('/api', apiRoutes);
app.use('/api/messenger', messengerRoutes);
app.get('/health', (_, res) => res.status(200).json({ status: 'healthy' }));
app.get('/api/config/paypal', (_, res) => res.json({ clientId: process.env.PAYPAL_CLIENT_ID }));

// ======================
// Error Handling
// ======================
app.use(notFound);
app.use(errorHandler);

// ======================
// Socket.IO Setup
// ======================
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: false,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling'],
});

io.use(socketAuth);
setupSocketHandlers(io);

// ======================
// TEMPORARY FILE CLEANUP
// ======================
const cleanTempFolder = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    return;
  }

  console.log('Starting temp folder cleanup...');
  const files = fs.readdirSync(tempDir);
  let deletedCount = 0;

  files.forEach(file => {
    const filePath = path.join(tempDir, file);
    
    // Skip if file is being actively uploaded
    if (activeUploads.has(filePath)) return;

    try {
      fs.unlinkSync(filePath);
      deletedCount++;
      console.log(`Deleted temp file: ${filePath}`);
    } catch (err) {
      console.error(`Error deleting ${filePath}:`, err.message);
    }
  });

  console.log(`Cleanup complete. Deleted ${deletedCount} files.`);
};

// Initial cleanup when server starts
cleanTempFolder();

// Schedule periodic cleanup (every hour)
const cleanupInterval = setInterval(cleanTempFolder, 60 * 60 * 1000);

// ======================
// Start Server 
// ======================
httpServer.listen(PORT, () => {
  console.log(`
  =============================================
  🚀 Server running on port ${PORT}
  📁 Root directory: ${rootDir}
  🌐 WebSocket: ws://localhost:${PORT}
  🌍 API: http://localhost:${PORT}/api
  =============================================
  `);
});

// ======================
// Graceful Shutdown
// ======================
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  // Clear intervals
  clearInterval(cleanupInterval);
  
  // Perform final cleanup
  cleanTempFolder();

  const shutdownTimeout = setTimeout(() => {
    console.warn('⚠️ Force exiting after timeout.');
    process.exit(1);
  }, 10000);

  httpServer.close(() => {
    console.log('✅ HTTP server closed.');

    if (peerServer && peerServer._wss) {
      peerServer._wss.close(() => {
        console.log('✅ PeerJS server closed.');
        clearTimeout(shutdownTimeout);
        process.exit(0);
      });
    } else {
      clearTimeout(shutdownTimeout);
      process.exit(0);
    }
  });
};

// Avoid duplicate listeners
if (!globalThis.shutdownHandlersAttached) {
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  globalThis.shutdownHandlersAttached = true;
}

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  shutdown('unhandledRejection');
});