// backend/config/redis.js
import { createClient } from 'redis';
import logger from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.initialize();
  }

  async initialize() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 5) {
              logger.warn('Too many Redis reconnection attempts');
              return false;
            }
            return Math.min(retries * 100, 5000);
          }
        }
      });

      this.setupEventListeners();
      await this.client.connect();
    } catch (error) {
      logger.error('Redis initialization failed:', error);
      throw error;
    }
  }

  setupEventListeners() {
    this.client.on('error', (err) => {
      this.isConnected = false;
      logger.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis connecting...');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      logger.info('Redis connected and ready');
    });

    this.client.on('end', () => {
      this.isConnected = false;
      logger.info('Redis disconnected');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis get failed for key ${key}:`, error);
      throw error;
    }
  }

  async set(key, value, options = {}) {
    try {
      return await this.client.set(key, value, options);
    } catch (error) {
      logger.error(`Redis set failed for key ${key}:`, error);
      throw error;
    }
  }

  async quit() {
    try {
      await this.client.quit();
      this.isConnected = false;
    } catch (error) {
      logger.error('Redis disconnection failed:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const redis = new RedisClient();

export default redis;