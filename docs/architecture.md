# AIBridge Backend Architecture

## Overview
AIBridge is a backend platform designed to support AI adoption for small and medium businesses. The backend focuses on infrastructure concerns like user management, data handling, event processing, and integration with external AI services, while delegating core AI capabilities (LLMs, embeddings, vector search) to specialized external services.

## Architectural Goals
- **Scalability**: Handle growing number of businesses and conversations
- **Maintainability**: Clear separation of concerns, modular design
- **Security**: Protect user data and business information
- **Observability**: Comprehensive logging, monitoring, and health checks
- **Extensibility**: Easy to add new features and integrations
- **Resilience**: Graceful degradation and fault tolerance

## Core Principles
1. **Separation of Concerns**: Distinct layers for transport, business logic, data access, and side effects
2. **Event-Driven**: Loose coupling between components via domain events
3. **Modularity**: Independent modules that can be deployed separately
4. **SOLID Principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion
5. **Infrastructure as Code**: Consistent, reproducible deployments

## Layered Architecture
```
┌─────────────────────────────────────┐
│        Transport Layer              │
│  (Controllers, Routes, Middleware)  │
└─────────────────────────────────────┘
          │       ▲
          ▼       │
┌─────────────────────────────────────┐
│      Application Layer              │
│      (Services, Domain Logic)       │
└─────────────────────────────────────┘
          │       ▲
          ▼       │
┌─────────────────────────────────────┐
│      Domain Layer                   │
│  (Entities, Value Objects, Events)  │
└─────────────────────────────────────┘
          │       ▲
          ▼       │
┌─────────────────────────────────────┐
│   Infrastructure Layer              │
│ (Repositories, External Services,   │
│  Messaging, Caching, Persistence)   │
└─────────────────────────────────────┘
```

## Module Structure
Each domain module follows a consistent structure:
```
module/
├── controllers/     # HTTP request handlers (thin layer)
├── services/        # Business logic orchestration
├── repositories/    # Data access abstraction
├── validators/      # Input validation schemas
├── events/          # Domain event definitions
├── listeners/       # Side effect handlers
└── routes/          # Route definitions
```

## Key Architectural Decisions

### 1. Event-Driven Core
- Domain events trigger side effects (notifications, sync jobs, analytics updates)
- Enables loose coupling and easier extension
- Future migration to message queues (BullMQ, Kafka) facilitated

### 2. CQRS-Like Separation
- Read operations (queries) and write operations (commands) separated implicitly
- Controllers handle transport, services handle commands, repositories handle persistence
- Read-heavy operations can leverage caching independently

### 3. External Service Integration
- AI services (LLM, embeddings) accessed via well-defined service interfaces
- External calls abstracted behind adapters for easy mocking and replacement
- Retry policies, circuit breakers, and timeout configurations centralized

### 4. Data Management
- Primary data store: PostgreSQL via Prisma ORM
- Caching layer: Redis for sessions, OTPs, rate limiting, and frequent queries
- File storage: Cloud storage abstraction (AWS S3 compatible) for uploads
- Vector data: Handled by external vector database service (not implemented here)

### 5. Security Approach
- Defense in depth: Helmet, CORS, rate limiting, input validation
- Authentication: JWT access tokens + refresh tokens in HTTP-only cookies
- Authorization: Role-based checks in services
- Data protection: Encryption at rest for sensitive fields, PII handling

### 6. Observability
- Structured logging with Pino (request tracing, error tracking)
- Health check endpoints for all dependencies
- Metrics collection (Prometheus-compatible)
- Distributed tracing readiness (OpenTelemetry hooks)

### 7. Deployment Considerations
- Containerized with Docker
- Environment-specific configuration
- Zero-downtime deployment ready
- Database migrations via Prisma Migrate
- Blue-green deployment pattern supported

## Scalability Patterns
- **Horizontal Scaling**: Stateless services, shared nothing architecture
- **Database Scaling**: Read replicas for analytics, connection pooling
- **Caching**: Multi-level caching (local, Redis, CDN for widgets)
- **Async Processing**: Offload heavy jobs to workers (sync, analytics, notifications)
- **Load Shedding**: Rate limiting and circuit breakers protect downstream services
- **Sharding Readiness**: Designed for future tenant-based sharding

## Technology Choices Rationale
- **Node.js/Express**: Mature ecosystem, excellent for I/O-heavy SaaS applications
- **Prisma ORM**: Type-safe database access, good developer experience, migration support
- **Redis**: Versatile for caching, sessions, pub/sub, rate limiting
- **Zod**: Runtime validation with TypeScript integration, excellent DX
- **JWT**: Stateless authentication suitable for microservices
- **Pino**: High-performance structured logging
- **Docker**: Consistent environments, orchestration ready
- **Jest**: Popular testing framework with good coverage tools

## Future Evolution Path
1. **Monolith to Microservices**: Modules can be extracted as services communicate via events
2. **Event Streaming**: Replace direct event handling with Apache Kafka/Pulsar
3. **GraphQL Layer**: Add GraphQL gateway for flexible frontend data fetching
4. **Service Mesh**: Istio/Linkerd for advanced traffic management
5. **Serverless Functions**: Specific jobs (sync, analytics) migrated to AWS Lambda/Azure Functions

## Diagram References
See `docs/database-schema.md` for entity relationships.
See `docs/event-map.md` for event flow documentation.