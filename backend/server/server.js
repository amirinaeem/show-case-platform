import { env } from '../../env.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';

import { attachSocketServer } from '../../real_time/socket/socketServer.js';
import connectDB from '../config/mdb.js';
import { notFound, errorHandler } from '../middleware/errorMiddleware.js';

import apiRoutes from '../routes/routeSetup.js';
import messengerRoutes from '../routes/messengerRoutes.js';

// =====================================================
// Constants
// =====================================================
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve();
const PORT = env.PORT || 5000;
const FRONTEND_URL = env.FRONTEND_URL || 'http://localhost:3000';

// Define upload directories
const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp_uploads');
const activeUploads = new Set();

// Create directories if they don't exist
[uploadsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// =====================================================
// Initialize Express + HTTP Server
// =====================================================
const app = express();
const httpServer = createServer(app);

// Attach Socket.IO
attachSocketServer(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`
  =============================================
  🚀 Server running on http://localhost:${PORT}
  📁 Root directory: ${rootDir}
  🌍 API: http://localhost:${PORT}/api
  📂 Uploads served from: /uploads
  =============================================
  `);
});

// =====================================================
// Database
// =====================================================
connectDB()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// =====================================================
// Middleware
// =====================================================

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

app.use((req, res, next) => {
  req.app.locals.activeUploads = activeUploads;
  next();
});

// =====================================================
// Routes
// =====================================================

app.use('/api', apiRoutes);
app.use('/api/messenger', messengerRoutes);

app.get('/health', (_, res) => res.status(200).json({ status: 'healthy' }));

// ✅ PayPal client ID endpoint
app.get('/api/config/paypal', (req, res) => {
  const clientId = env.PAYPAL_CLIENT_ID;
  res.json({ clientId });
});

// =====================================================
// Static Files
// =====================================================
if (process.env.NODE_ENV === 'production') {
  const feBuild = path.join(__dirname, '../../frontend/build');
  app.use(express.static(feBuild));
  app.get('*', (req, res) => res.sendFile(path.join(feBuild, 'index.html')));
} else {
  app.get('/', (_, res) => res.send('Welcome to the API (Development Mode)'));
}

// =====================================================
// Error Handling
// =====================================================
app.use(notFound);
app.use(errorHandler);

// =====================================================
// Temp File Cleanup
// =====================================================
const cleanTempFolder = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    return;
  }

  console.log('Starting temp folder cleanup...');
  const files = fs.readdirSync(tempDir);
  let deletedCount = 0;

  files.forEach((file) => {
    const filePath = path.join(tempDir, file);
    if (activeUploads.has(filePath)) return;
    try {
      fs.unlinkSync(filePath);
      deletedCount++;
    } catch (err) {
      console.error(`Error deleting ${filePath}:`, err.message);
    }
  });

  console.log(`Cleanup complete. Deleted ${deletedCount} files.`);
};

cleanTempFolder();
const cleanupInterval = setInterval(cleanTempFolder, 60 * 60 * 1000);

// =====================================================
// Graceful Shutdown
// =====================================================
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down...`);
  clearInterval(cleanupInterval);
  cleanTempFolder();

  const timeout = setTimeout(() => {
    console.warn('⚠️ Force exiting after timeout.');
    process.exit(1);
  }, 10000);

  httpServer.close(() => {
    console.log('✅ HTTP server closed.');
    clearTimeout(timeout);
    process.exit(0);
  });
};

if (!globalThis.shutdownHandlersAttached) {
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  globalThis.shutdownHandlersAttached = true;
}

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  shutdown('unhandledRejection');
});