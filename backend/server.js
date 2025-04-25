import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/mdb.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoute.js';

const port = process.env.PORT || 5000;

// Connect to database
connectDB();


if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing! Check your .env file.');
  }
  
// Initialize Express app
const app = express();

// Get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(express.static(path.join(rootDir, 'shared'))); // Serve from root/shared

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

// PayPal config endpoint
app.get('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Proxy middleware
app.use(
    '/api',
    createProxyMiddleware({
        target: `http://localhost:${port}`,
        changeOrigin: true,
        proxyTimeout: 60000
    })
);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Serving static files from: ${path.join(rootDir, 'shared')}`);
});