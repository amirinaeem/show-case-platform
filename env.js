// shared/env.js (at root)

// Core imports
import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'url';

// =============================
// Load .env from root
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// =============================
// Backend-only ENV schema
// =============================
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  // Database & Auth
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  // Payments
  PAYPAL_API_URL: z.string().url(),
  PAYPAL_CLIENT_ID: z.string().min(1, 'PAYPAL_CLIENT_ID is required'),

  // Redis
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  // Messaging
  MESSAGING_UPLOADS_DIR: z.string().default('messagingUploads'),
  MAX_FILE_UPLOAD_SIZE: z.coerce.number().default(52428800), // 50MB

  // Socket
  SOCKET_PORT: z.coerce.number().default(5000),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // Frontend URL (for CORS)
  FRONTEND_URL: z.string().url(),
});

// =============================
// Validate backend env
// =============================
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:\n', parsed.error.format());
  throw new Error('❌ Environment validation failed. Check your .env file.');
}

// =============================
// Export typed and parsed env
// =============================
export const env = parsed.data;
