# AIBridge Backend

AIBridge is an AI Adoption Platform that helps small and medium businesses evaluate their AI readiness, identify automation opportunities, create AI-powered support assistants, and continuously improve their AI implementation.

This repository contains the backend implementation of the AIBridge platform.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Scalability](#scalability)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Event-Driven Architecture](#event-driven-architecture)
- [AI Service Integration](#ai-service-integration)
- [Frontend Integration](#frontend-integration)
- [Deployment](#deployment)
- [Testing](#testing)
- [License](#license)

## Overview

The AIBridge backend is a Node.js/Express application that provides:
- User management and authentication
- Business profile management
- Document processing and storage
- Website crawling and analysis
- Knowledge base management
- AI readiness assessment workflows
- Chatbot session management
- Analytics and reporting
- Notification system
- Background job processing
- Sync job management
- Caching layer
- Health monitoring

## Features

### Authentication
- User registration with email verification
- JWT-based authentication with refresh tokens
- Password reset functionality
- Role-based access control (ADMIN, BUSINESS_OWNER, EMPLOYEE)

### Business Management
- Create and manage business profiles
- Track business information (name, industry, website, contact info)
- Business-specific settings (timezone, language, notifications)

### Document Management
- Upload PDF, DOCX, and TXT files
- Extract text and generate embeddings (via external AI services)
- Track processing status
- Associate documents with businesses

### Website Analysis
- Crawl business websites
- Extract content, metadata, and structure
- Track crawling status and history
- Extract pages, FAQs, services, products, and contact information

### Knowledge Base
- Unified repository for website and document content
- Vector embeddings for semantic search (via external AI services)
- Track readiness status
- Associate with businesses

### AI Readiness Assessment
- Generate comprehensive readiness reports
- Evaluate businesses across multiple dimensions
- Provide actionable recommendations and ROI estimates
- Store assessment results for tracking progress

### Chatbot Functionality
- Manage chat sessions and messages
- Track visitor information
- Store conversation history
- Satisfaction scoring and feedback

### Analytics
- Track key metrics (total chats, popular topics, etc.)
- Calculate averages and trends
- Data retention policies
- Metric-specific calculations

### Notifications
- Create, read, update, and delete notifications
- Mark notifications as read/unread
- Broadcast notifications to all users
- Different notification types (system updates, audit completion, etc.)

### Background Jobs
- Create, manage, and monitor background jobs
- Various job types (sync jobs, maintenance tasks, etc.)
- Job scheduling and retry mechanisms
- Progress tracking and failure handling

### Sync Jobs
- Website synchronization (crawl for changes)
- Document synchronization (process new documents)
- Knowledge base synchronization (update embeddings)
- Sync history and status tracking

### Caching
- Redis-based caching layer
- Cache-aside pattern for frequently accessed data
- Configurable TTL (time-to-live)
- Cache invalidation strategies

### Health Monitoring
- Comprehensive health check endpoints
- Database and Redis connectivity checks
- Service availability monitoring
- Performance metrics

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Typed JavaScript superset
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **Redis** - In-memory data structure store (caching, sessions)
- **Zod** - Schema validation
- **JSON Web Tokens** - Authentication
- **Bcrypt.js** - Password hashing
- **Pino** - High-performance logger
- **Axios** - HTTP client
- **Cheerio** - HTML parsing (for website crawling)
- **Multer** - File upload handling
- **Jest** - Testing framework
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **ts-node-dev** - Development server with auto-reload
- **tsc** - TypeScript compiler

## Architecture

The backend follows a modular, event-driven architecture designed for scalability:

### Layers
1. **Transport Layer** - Controllers, routes, middleware
2. **Application Layer** - Services, business logic
3. **Domain Layer** - Entities, value objects, events
4. **Infrastructure Layer** - Repositories, external services, messaging

### Modules
Each feature is implemented as an independent module with:
- Controllers (HTTP request handlers)
- Services (business logic orchestration)
- Repositories (data access)
- Validators (input validation)
- Events (domain event definitions)
- Listeners (side effect handlers)
- Routes (route definitions)

### Communication
- **Synchronous**: HTTP requests for immediate responses
- **Asynchronous**: Domain events for loose coupling
- **Future**: Designed for migration to message queues (BullMQ, Kafka)

## Scalability

The AIBridge backend is designed with scalability in mind:

### Horizontal Scaling
- Stateless services that can be run behind a load balancer
- Externalized session storage (Redis)
- Shared nothing architecture (except for shared database and cache)
- Ready for container orchestration (Kubernetes, Docker Swarm)

### Database Optimization
- Proper indexing on frequently queried columns
- Connection pooling (implicit in Prisma)
- Read replica support (can be configured in DATABASE_URL)
- Partitioning strategies for large tables (if needed)

### Caching Strategy
- Multi-level caching (application-level + Redis)
- Configurable TTL for different data types
- Cache warming and invalidation strategies
- Redis clustering support for production

### Asynchronous Processing
- Job queue system for background tasks
- Retry mechanisms with exponential backoff
- Dead letter queues for failed jobs
- Priority-based job processing

### Performance Optimization
- Pagination for large datasets
- Efficient database queries with proper indexing
- Payload size limits for API requests
- Compression for HTTP responses
- ETag and caching headers for static assets

### Microservice Readiness
- Loose coupling through event-driven architecture
- Clear service boundaries
- Independent deployability of modules
- API versioning strategy

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Redis
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/aibridge-backend.git
cd aibridge-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.development
# Edit .env.development with your configuration
```

4. Initialize the database
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

The API will be available at http://localhost:3000/api

## Environment Variables

See [.env.example](.env.example) for a complete list of configuration options.

Key variables:
- `NODE_ENV`: Environment (development, production, test)
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `JWT_ACCESS_SECRET`: Secret for signing access tokens
- `JWT_REFRESH_SECRET`: Secret for signing refresh tokens
- `UPLOAD_DIR`: Directory for file uploads
- Various external AI service URLs and keys
- Monitoring and feature flags

## API Documentation

See [API Reference](docs/api-reference.md) for complete endpoint documentation.

## Database Schema

See [Database Schema](docs/database-schema.md) for detailed entity relationships and table definitions.

## Event-Driven Architecture

See [Event Map](docs/event-map.md) for a comprehensive list of domain events and their listeners.

## AI Service Integration

See [AI Service Integration](docs/ai-service-integration.md) for details on how the backend integrates with external AI services for LLMs, embeddings, vector storage, and AI readiness assessment.

## Frontend Integration

See [Frontend Integration](docs/frontend-integration.md) for guidance on connecting frontend applications to the backend.

## Deployment

### Docker
```bash
# Build the image
docker build -t aibridge-backend .

# Run the container
docker run -p 3000:3000 --env-file .env.development aibridge-backend
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

### Production Considerations
1. Use a reverse proxy (NGINX, Traefik) for SSL termination and load balancing
2. Implement proper logging and monitoring (ELK stack, Prometheus/Grafana)
3. Set up automated backups for PostgreSQL
4. Configure Redis persistence for production
5. Use environment-specific configuration files
6. Implement health checks for load balancers
7. Consider using a CDN for static assets
8. Implement proper error tracking (Sentry, etc.)
9. For high availability, run multiple instances behind a load balancer
10. Use managed services for database and Redis (AWS RDS, ElastiCache, etc.)
11. Implement blue/green or canary deployment strategies
12. Set up rate limiting and DDoS protection at the network level

### Kubernetes Deployment
For Kubernetes deployment, you would typically:
1. Create Deployments for the app, database, and Redis
2. Use Services for internal communication
3. Use Ingress for external access with TLS termination
4. Implement Horizontal Pod Autoscaler based on CPU/memory usage
5. Use PersistentVolumes for data storage
6. Implement liveness and readiness probes
7. Use ConfigMaps and Secrets for configuration management

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

### Test Types
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test module interactions
- **API Tests**: Test endpoint functionality
- **End-to-End Tests**: Test complete user flows

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on the GitHub repository.

---
Built with ❤️ by the AIBridge Team