import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

// Redis client instance
export const redis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
  db: 0, // Default DB
  keyPrefix: 'aibridge:', // Prefix for all keys
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  }
});

// Connection events
redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('ready', () => {
  logger.info('Redis ready');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Reconnecting to Redis...');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Closing Redis connection...');
  await redis.quit();
  process.exit(0);
});

export default redis;