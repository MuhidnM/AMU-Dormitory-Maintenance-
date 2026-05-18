import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Don't crash the app if Redis is down
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 5000);
    return delay;
  },
  enableOfflineQueue: true,
});


redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (err) => {
  logger.error('Redis Error: ' + err.message);
});

export default redis;
