# Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{BUSINESS : owns
    USER ||--o{REFRESHTOKEN : has
    BUSINESS ||--o{WEBSITE : has
    BUSINESS ||--o{DOCUMENT : owns
    BUSINESS ||--o{KNOWLEDGEBASE : has
    BUSINESS ||--o{AUDIT : has
    BUSINESS ||--o{WIDGET : owns
    BUSINESS ||--o{ANALYTIC : has
    BUSINESS ||--o{NOTIFICATION : sends
    BUSINESS ||--o{SYNCJOB : has
    BUSINESS ||--o{JOB : has
    BUSINESS ||--o{USERSettings : has
    WEBSITE ||--o{WEBSITEPAGE : contains
    KNOWLEDGEBASE ||--o{DOCUMENT : indexes
    KNOWLEDGEBASE ||--o{WEBSITEPAGE : indexes
    CHATSESSION }|..|{VISITOR : belongs to
    CHATSESSION ||--o{MESSAGE : contains
    MESSAGE }|..|{CHATSESSION : part of
```

## Table Descriptions

### Users
- **id**: UUID (Primary Key)
- **email**: String (Unique)
- **passwordHash**: String
- **firstName**: String
- **lastName**: String
- **role**: Enum (ADMIN, BUSINESS_OWNER, EMPLOYEE)
- **isVerified**: Boolean
- **verificationToken**: String (Nullable, Unique)
- **verificationTokenExpiry**: DateTime (Nullable)
- **resetToken**: String (Nullable, Unique)
- **resetTokenExpiry**: DateTime (Nullable)
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deletedAt**: DateTime (Nullable, for soft delete)

### Businesses
- **id**: UUID (Primary Key)
- **name**: String
- **description**: String (Nullable)
- **websiteUrl**: String (Nullable)
- **industry**: Enum
- **contactEmail**: String (Nullable)
- **contactPhone**: String (Nullable)
- **address**: String (Nullable)
- **isActive**: Boolean
- **userId**: UUID (Foreign Key to Users)
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deletedAt**: DateTime (Nullable, for soft delete)

### BusinessSettings
- **id**: UUID (Primary Key)
- **businessId**: UUID (Foreign Key to Businesses, Unique)
- **timezone**: String
- **language**: String
- **emailNotifications**: Boolean
- **analyticsSharing**: Boolean
- **dataRetentionDays**: Integer
- **createdAt**: DateTime
- **updatedAt**: DateTime

### Documents
- **id**: UUID (Primary Key)
- **filename**: String
- **originalName**: String
- **mimeType**: String
- **size**: Integer (bytes)
- **type**: Enum (PDF, DOCX, TXT)
- **url**: String (storage URL)
- **extractedText**: String (Nullable)
- **chunkCount**: Integer
- **isProcessed**: Boolean
- **businessId**: UUID (Foreign Key to Businesses)
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deletedAt**: DateTime (Nullable, for soft delete)

### Websites
- **id**: UUID (Primary Key)
- **url**: String (Unique)
- **title**: String (Nullable)
- **description**: String (Nullable)
- **faviconUrl**: String (Nullable)
- **lastCrawled**: DateTime (Nullable)
- **crawlStatus**: String (pending, in_progress, completed, failed)
- **pageCount**: Integer
- **businessId**: UUID (Foreign Key to Businesses)
- **createdAt**: DateTime
- **updatedAt**: DateTime

### WebsitePages
- **id**: UUID (Primary Key)
- **url**: String
- **title**: String (Nullable)
- **content**: String (Nullable)
- **summary**: String (Nullable)
- **websiteId**: UUID (Foreign Key to Websites)
- **createdAt**: DateTime

### KnowledgeBases
- **id**: UUID (Primary Key)
- **name**: String
- **description**: String (Nullable)
- **documentCount**: Integer
- **pageCount**: Integer
- **chunkCount**: Integer
- **isReady**: Boolean
- **businessId**: UUID (Foreign Key to Businesses, Unique)
- **createdAt**: DateTime
- **updatedAt**: DateTime

### Audits
- **id**: UUID (Primary Key)
- **readinessScore**: Integer (0-100)
- **businessSummary**: String (Nullable)
- **aiOpportunities**: String (Nullable, JSON)
- **automationSuggestions**: String (Nullable, JSON)
- **estimatedBenefits**: String (Nullable, JSON)
- **strengths**: String (Nullable, JSON)
- **weaknesses**: String (Nullable, JSON)
- **suggestedSolutions**: String (Nullable, JSON)
- **expectedRoi**: String (Nullable, JSON)
- **businessId**: UUID (Foreign Key to Businesses)
- **createdAt**: DateTime

### Visitors
- **id**: UUID (Primary Key)
- **sessionId**: String (Unique)
- **ipAddress**: String (Nullable)
- **userAgent**: String (Nullable)
- **country**: String (Nullable)
- **city**: String (Nullable)
- **firstVisit**: DateTime
- **lastVisit**: DateTime
- **visitCount**: Integer
- **isUnique**: Boolean

### ChatSessions
- **id**: UUID (Primary Key)
- **sessionToken**: String (Unique)
- **startedAt": DateTime
- **endedAt": DateTime (Nullable)
- **messageCount": Integer
- **satisfactionScore": Integer (Nullable, 1-5)
- **feedback": String (Nullable)
- **visitorId": UUID (Foreign Key to Visitors)
- **businessId": UUID (Foreign Key to Businesses)
- **createdAt": DateTime
- **updatedAt": DateTime

### Messages
- **id**: UUID (Primary Key)
- **content": String
- **isFromUser": Boolean
- **chatSessionId": UUID (Foreign Key to ChatSessions)
- **createdAt": DateTime

### Widgets
- **id**: UUID (Primary Key)
- **title": String
- **theme": Enum (LIGHT, DARK, AUTO)
- **position": Enum (BOTTOM_RIGHT, BOTTOM_LEFT, TOP_RIGHT, TOP_LEFT)
- **isEnabled": Boolean
- **customCss": String (Nullable)
- **businessId": UUID (Foreign Key to Businesses)
- **createdAt": DateTime
- **updatedAt": DateTime

### Analytics
- **id": UUID (Primary Key)
- **metricType": Enum (TOTAL_CHATS, POPULAR_TOPICS, FAILED_RESPONSES, RESOLUTION_RATE, AVERAGE_SESSION_DURATION)
- **metricValue": Float
- **date": DateTime
- **labels": String (Nullable, JSON)
- **businessId": UUID (Foreign Key to Businesses)
- **createdAt": DateTime

### Notifications
- **id": UUID (Primary Key)
- **title": String
- **message": String
- **type": Enum (SYSTEM, BUSINESS_UPDATE, AI_READINESS_REPORT, CHAT_RATING_REQUEST, SUBSCRIPTION_EXPIRING)
- **isRead": Boolean
- **readAt": DateTime (Nullable)
- **businessId": UUID (Foreign Key to Businesses)
- **createdAt": DateTime

### SyncJobs
- **id": UUID (Primary Key)
- **status": String (pending, in_progress, completed, failed)
- **type": String (website, document, knowledge_base)
- **startedAt": DateTime (Nullable)
- **completedAt": DateTime (Nullable)
- **errorMessage": String (Nullable)
- **pagesProcessed": Integer
- **documentsProcessed": Integer
- **businessId": UUID (Foreign Key to Businesses)
- **createdAt": DateTime
- **updatedAt": DateTime

### Jobs
- **id": UUID (Primary Key)
- **name": String
- **type": String
- **payload": JSON
- **status": String (pending, processing, completed, failed)
- **attempts": Integer
- **maxAttempts": Integer
- **lastError": String (Nullable)
- **scheduledAt": DateTime (Nullable)
- **startedAt": DateTime (Nullable)
- **completedAt": DateTime (Nullable)
- **businessId": UUID (Foreign Key to Businesses, Nullable)
- **createdAt": DateTime
- **updatedAt": DateTime

### RefreshTokens
- **id": UUID (Primary Key)
- **token": String (Unique)
- **expiresAt": DateTime
- **createdAt": DateTime
- **revoked": Boolean
- **userId": UUID (Foreign Key to Users)

## Indexes

All tables have indexes on foreign key columns for efficient joins.
Additional indexes are created on frequently queried columns such as:
- email (Users)
- userId (Businesses)
- businessId (Documents, Websites, KnowledgeBases, Audits, Widgets, Analytics, Notifications, SyncJobs, Jobs)
- status (SyncJobs, Jobs)
- type (SyncJobs, Jobs)
- createdAt (most tables)