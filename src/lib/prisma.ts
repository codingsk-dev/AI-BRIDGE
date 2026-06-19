import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { PrismaClient } from '@prisma/client';

// Prisma client instance
export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'stdout',
      level: 'error'
    },
    {
      emit: 'stdout',
      level: 'warn'
    }
  ]
});

// Optional: Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    // Prisma QueryEvent
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../utils/logger').default;
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Params: ${e.params}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

// Connect handler
prisma.$connect()
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../utils/logger').default;
    logger.info('Connected to database');
  })
  .catch((e) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../utils/logger').default;
    logger.error('Database connection error:', e);
    process.exit(1);
  });

// Disconnect on process exit
process.on('SIGINT', async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const logger = require('../utils/logger').default;
  logger.info('Disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;