import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { env } from '../../../shared/src/config/env.js';


const pubClient = createClient({ url: env.REDIS_URL });
const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));
