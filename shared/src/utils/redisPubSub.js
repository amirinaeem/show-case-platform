// shared/src/utils/redisPubSub.js
import { createClient } from 'redis';

const publisher = createClient();
const subscriber = createClient();

await publisher.connect();
await subscriber.connect();

export { publisher, subscriber };
