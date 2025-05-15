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

// Route imports
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoute.js';
import messageRoutes from './routes/messageRoutes.js';
import messagingUploadRoutes from './routes/messagingUploadRoute.js';

// Auth middleware for Socket
import socketAuthMiddleware from './middleware/socketAuthMiddleware.js';

// Setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve();
const port = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Express app setup
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  contentSecurityPolicy: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/messagingUploads', express.static(path.join(rootDir, 'messagingUploads')));
app.use(express.static(path.join(rootDir, 'shared')));

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/messaging-upload', messagingUploadRoutes);

app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket auth + connection handler
io.use(socketAuthMiddleware);
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user?.id}`);
  // ... Your socket event handlers here ...
});

// Start server
httpServer.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📁 Static files served from: ${rootDir}`);
});
