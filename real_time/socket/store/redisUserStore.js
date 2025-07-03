import { createClient } from 'redis';
import { env } from '../../../shared/src/config/env.js';

const redis = createClient({ url: env.REDIS_URL });
await redis.connect();

const ONLINE_USERS_KEY = 'onlineUsers';

export const addOnlineUser = async (user) => {
  await redis.hSet(ONLINE_USERS_KEY, user.id, JSON.stringify(user));
};

export const removeOnlineUser = async (userId) => {
  await redis.hDel(ONLINE_USERS_KEY, userId);
};

export const getAllOnlineUsers = async () => {
  const users = await redis.hGetAll(ONLINE_USERS_KEY);
  return Object.values(users).map(u => JSON.parse(u));
};
