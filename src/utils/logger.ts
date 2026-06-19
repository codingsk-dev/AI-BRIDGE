import pino from 'pino';
import { config } from '../config';

// Configure pino logger
export const logger = pino({
  level: config.logLevel || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
          }
        }
      : undefined,
  base: {
    pid: process.pid
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

export default logger;