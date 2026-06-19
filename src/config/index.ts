import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = join(process.cwd(), `.env.${nodeEnv}`);

// Load .env file, then .env.local, then .env
dotenvConfig({ path: envFile });
dotenvConfig({ path: join(process.cwd(), '.env.local') });
dotenvConfig({ path: join(process.cwd(), '.env') });

interface Config {
  nodeEnv: string;
  port: number | string;
  trustProxy: boolean;
  corsOrigin: string;
  logLevel: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  // Database
  databaseUrl: string;
  // Redis
  redisHost: string;
  redisPort: number;
  redisPassword: string | undefined;
  // JWT
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
  // Cookie
  cookieSecret: string;
  cookieSecure: boolean;
  // Upload
  uploadMaxSize: string;
  uploadDir: string;
  // Email (for future)
  emailService: string;
  emailUser: string;
  emailPass: string;
  // Frontend
  frontendUrl: string;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  trustProxy: process.env.TRUST_PROXY === 'true',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD || undefined,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'your-cookie-secret',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  uploadMaxSize: process.env.UPLOAD_MAX_SIZE || '10mb',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  emailService: process.env.EMAIL_SERVICE || '',
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};

export { config };