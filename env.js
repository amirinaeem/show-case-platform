// shared/config/env.js

import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'url';

// Load .env from monorepo root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });


// =============================
// Schema-based ENV validation
// =============================
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  PAYPAL_API_URL: z.string().url(),
  PAYPAL_CLIENT_ID: z.string().min(1, 'PAYPAL_CLIENT_ID is required'),

  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  REACT_APP_API_URL: z.string().url(),
  MESSAGING_UPLOADS_DIR: z.string().default('messagingUploads'),
  MAX_FILE_UPLOAD_SIZE: z.coerce.number().default(52428800), // 50MB

  REACT_APP_PEER_HOST: z.string().default('0.peerjs.com'),
  REACT_APP_PEER_PORT: z.coerce.number().default(443),

  FRONTEND_URL: z.string().url(),
  SOCKET_PORT: z.coerce.number().default(5001),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

// =============================
// Validation
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
