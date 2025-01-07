import { Redis } from 'ioredis';
import 'server-only';

// Initialize Redis using credentials from environment variables
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});
export default redis;