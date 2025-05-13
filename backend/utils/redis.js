import { createClient } from 'redis';

let redisClient;
let isConnected = false;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.log('Too many retries on Redis. Connection terminated');
            return new Error('Too many retries');
          }
          return Math.min(retries * 100, 5000);
        }
      }
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => console.log('Redis connecting...'));
    redisClient.on('ready', () => {
      isConnected = true;
      console.log('Redis connected');
    });
    redisClient.on('end', () => {
      isConnected = false;
      console.log('Redis disconnected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    throw error;
  }
};

export { redisClient, isConnected };