import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/mdb.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import socketAuthMiddleware from './middleware/socketAuthMiddleware.js';
import { setupSocketHandlers } from './sockets/socketHandlers.js';

// Route imports
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoute.js';
import messageRoutes from './routes/messageRoutes.js';
import messagingUploadRoutes from './routes/messagingUploadRoute.js';

// Initialize paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve();
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

// Express app setup
const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/messagingUploads', express.static(path.join(rootDir, 'messagingUploads')));
app.use(express.static(path.join(rootDir, 'shared')));

// API routes
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/messaging-upload', messagingUploadRoutes);

// PayPal config endpoint
app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// In server.js, before errorMiddleware
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend is running', 
    apiDocs: '/api-docs', 
    websocket: 'ws://localhost:5000' 
  });
});

// Socket.IO configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: false,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling']
});

// Socket.IO authentication middleware
io.use(socketAuthMiddleware);

// Initialize socket event handlers
setupSocketHandlers(io);

// Start the server
httpServer.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📁 Static files served from: ${rootDir}`);
  console.log(`🌐 WebSocket server running at ws://localhost:${port}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});