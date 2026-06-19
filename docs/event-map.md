# Event Map

## Overview
This document describes the domain events used in the AIBridge platform for loose coupling between modules and services.

## Event Naming Convention
Events follow the pattern: `[Subject][Action]Event`
- Subject: The entity or concept the event relates to (e.g., User, Business, Job)
- Action: What happened to the subject (e.g., Created, Updated, Deleted, Started, Completed)

## User Events

### UserCreatedEvent
- **Triggered when**: A new user registers
- **Fields**: userId, email, timestamp
- **Listeners**: 
  - Send welcome email
  - Create default business profile (optional)
  - Add to analytics
  - Send welcome notification

### UserUpdatedEvent
- **Triggered when**: User profile information is updated
- **Fields**: userId, updates (firstName, lastName, email, role), timestamp
- **Listeners**:
  - Clear relevant caches
  - Update search indexes
  - Notify collaborators
  - Update analytics

### UserDeletedEvent
- **Triggered when**: User account is deleted (soft delete)
- **Fields**: userId, timestamp
- **Listeners**:
  - Archive or delete related data
  - Cancel active sessions
  - Notify stakeholders
  - Clean up business profile if exists
  - Revoke API keys

### UserVerifiedEvent
- **Triggered when**: User verifies their email address
- **Fields**: userId, email, timestamp
- **Listeners**:
  - Send welcome email
  - Create default business profile
  - Update analytics

### PasswordUpdatedEvent
- **Triggered when**: User changes their password
- **Fields**: userId, timestamp
- **Listeners**:
  - Send password change confirmation email
  - Notify security team if suspicious

## Business Events

### BusinessCreatedEvent
- **Triggered when**: A new business profile is created
- **Fields**: businessId, userId, name, industry, timestamp
- **Listeners**:
  - Create default website entry
  - Create default knowledge base
  - Send welcome email to business owner
  - Initialize analytics for business
  - Create default widget configuration

### BusinessUpdatedEvent
- **Triggered when**: Business information is updated
- **Fields**: businessId, updates (name, description, websiteUrl, industry, contactEmail, contactPhone, address), timestamp
- **Listeners**:
  - Clear relevant caches
  - Trigger knowledge base update if needed
  - Notify user
  - Update analytics

### BusinessDeletedEvent
- **Triggered when**: Business is deleted (soft delete)
- **Fields**: businessId, timestamp
- **Listeners**:
  - Archive or delete related data (websites, documents, etc.)
  - Cancel active sync jobs
  - Notify stakeholders
  - Clean up storage files
  - Revoke API keys

## Document Events

### DocumentUploadedEvent
- **Triggered when**: A new document is uploaded
- **Fields**: documentId, businessId, filename, size, type, timestamp
- **Listeners**:
  - Trigger document processing pipeline
  - Send notification to user
  - Update analytics
  - Extract text and generate chunks (via external AI service)
  - Update knowledge base

### DocumentProcessedEvent
- **Triggered when**: Document processing is completed
- **Fields**: documentId, businessId, extractedTextLength, chunkCount, timestamp
- **Listeners**:
  - Update knowledge base with new embeddings
  - Notify user that document is ready
  - Update analytics

### DocumentDeletedEvent
- **Triggered when**: Document is deleted
- **Fields**: documentId, businessId, timestamp
- **Listeners**:
  - Remove from knowledge base
  - Delete file from storage
  - Notify user
  - Update analytics

## Website Events

### WebsiteUpdatedEvent
- **Triggered when**: Website information is updated
- **Fields**: websiteId, businessId, updates (url, title, description, faviconUrl), timestamp
- **Listeners**:
  - Clear relevant caches
  - Trigger knowledge base update if needed
  - Notify user
  - Update analytics

### WebsiteDeletedEvent
- **Triggered when**: Website is deleted
- **Fields**: websiteId, businessId, timestamp
- **Listeners**:
  - Delete associated pages
  - Clear knowledge base
  - Notify user
  - Update analytics

### WebsiteCrawlStartedEvent
- **Triggered when**: Website crawling begins
- **Fields**: websiteId, businessId, timestamp
- **Listeners**:
  - Notify user that crawl has started
  - Update analytics

### WebsiteCrawlCompletedEvent
- **Triggered when**: Website crawling completes successfully
- **Fields**: websiteId, businessId, pagesCrawled, timestamp
- **Listeners**:
  - Trigger knowledge base update
  - Notify user that crawl is complete
  - Update analytics

### WebsiteCrawlFailedEvent
- **Triggered when**: Website crawling fails
- **Fields**: websiteId, businessId, error, timestamp
- **Listeners**:
  - Notify user that crawl failed
  - Update analytics
  - Retry mechanism if applicable

## Knowledge Base Events

### KnowledgeBaseCreatedEvent
- **Triggered when**: A knowledge base is created for a business
- **Fields**: knowledgeBaseId, businessId, timestamp
- **Listeners**:
  - Initialize knowledge base with default settings
  - Notify user
  - Update analytics

### KnowledgeBaseUpdatedEvent
- **Triggered when**: Knowledge base information is updated
- **Fields**: knowledgeBaseId, updates (name, description, documentCount, pageCount, chunkCount, isReady), timestamp
- **Listeners**:
  - Clear relevant caches
  - Trigger re-indexing if needed
  - Notify user
  - Update analytics

### KnowledgeBaseDeletedEvent
- **Triggered when**: Knowledge base is deleted
- **Fields**: knowledgeBaseId, timestamp
- **Listeners**:
  - Clean up associated data
  - Notify user
  - Update analytics

## Audit Events

### AuditCreatedEvent
- **Triggered when**: An AI readiness audit is completed
- **Fields**: auditId, businessId, readinessScore, timestamp
- **Listeners**:
  - Notify user that audit is complete
  - Update analytics
  - Trigger any follow-up actions based on score

### AuditUpdatedEvent
- **Triggered when**: Audit information is updated
- **Fields**: auditId, updates (readinessScore, businessSummary, aiOpportunities, automationSuggestions, estimatedBenefits, strengths, weaknesses, suggestedSolutions, expectedRoi), timestamp
- **Listeners**:
  - Clear relevant caches
  - Notify user if needed
  - Update analytics

### AuditDeletedEvent
- **Triggered when**: Audit is deleted
- **Fields**: auditId, timestamp
- **Listeners**:
  - Clean up associated data
  - Notify user if needed
  - Update analytics

## Chat Events

### ChatSessionCreatedEvent
- **Triggered when**: A new chat session is started
- **Fields**: chatSessionId, visitorId, businessId, sessionToken, timestamp
- **Listeners**:
  - Notify business owner of new chat request (if applicable)
  - Update analytics
  - Initialize chatbot context for this session

### ChatSessionEndedEvent
- **Triggered when**: A chat session ends
- **Fields**: chatSessionId, satisfactionScore, feedback, timestamp
- **Listeners**:
  - Update analytics
  - Trigger follow-up actions if satisfaction low
  - Notify business owner if needed

### MessageCreatedEvent
- **Triggered when**: A new message is sent in a chat session
- **Fields**: messageId, chatSessionId, content, isFromUser, timestamp
- **Listeners**:
  - If message is from user, trigger chatbot response generation
  - Update analytics
  - Check for trigger words or phrases

### VisitorCreatedEvent
- **Triggered when**: A new visitor visits the website
- **Fields**: visitorId, sessionId, timestamp
- **Listeners**:
  - Update analytics
  - Track new vs returning visitors

## Widget Events

### WidgetCreatedEvent
- **Triggered when**: A widget is created for a business
- **Fields**: widgetId, businessId, timestamp
- **Listeners**:
  - Notify user
  - Update analytics

### WidgetUpdatedEvent
- **Triggered when**: Widget information is updated
- **Fields**: widgetId, updates (title, theme, position, isEnabled, customCss), timestamp
- **Listeners**:
  - Clear relevant caches
  - Notify user if needed
  - Update analytics

### WidgetDeletedEvent
- **Triggered when**: Widget is deleted
- **Fields**: widgetId, timestamp
- **Listeners**:
  - Clean up associated data
  - Notify user if needed
  - Update analytics

## Notification Events

### NotificationCreatedEvent
- **Triggered when**: A new notification is created
- **Fields**: notificationId, businessId, type, timestamp
- **Listeners**:
  - Send real-time notification via WebSocket if connected
  - Send email notification if configured
  - Update analytics

### NotificationUpdatedEvent
- **Triggered when**: Notification information is updated
- **Fields**: notificationId, updates (title, message, type, isRead), timestamp
- **Listeners**:
  - Send real-time notification via WebSocket if connected
  - Update analytics

### NotificationDeletedEvent
- **Triggered when**: Notification is deleted
- **Fields**: notificationId, timestamp
- **Listeners**:
  - Clean up associated data
  - Update analytics

### NotificationMarkedAsReadEvent
- **Triggered when**: Notification is marked as read
- **Fields**: notificationId, timestamp
- **Listeners**:
  - Send real-time notification via WebSocket if connected
  - Update analytics

### NotificationMarkedAsUnreadEvent
- **Triggered when**: Notification is marked as unread
- **Fields**: notificationId, timestamp
- **Listeners**:
  - Send real-time notification via WebSocket if connected
  - Update analytics

### NotificationAllMarkedAsReadEvent
- **Triggered when**: All notifications for a business are marked as read
- **Fields**: businessId, count, timestamp
- **Listeners**:
  - Send real-time notification via WebSocket if connected
  - Update analytics

## Sync Events

### SyncJobCreatedEvent
- **Triggered when**: A new sync job is created
- **Fields**: syncJobId, businessId, type, timestamp
- **Listeners**:
  - Send notification to user
  - Update analytics

### SyncJobUpdatedEvent
- **Triggered when**: Sync job information is updated
- **Fields**: syncJobId, updates (type, status, startedAt, completedAt, errorMessage, pagesProcessed, documentsProcessed), timestamp
- **Listeners**:
  - Send notification to user if status changed
  - Update analytics

### SyncJobDeletedEvent
- **Triggered when**: Sync job is deleted
- **Fields**: syncJobId, timestamp
- **Listeners**:
  - Clean up associated data
  - Update analytics

### SyncJobStartedEvent
- **Triggered when**: Sync job begins processing
- **Fields**: syncJobId, businessId, timestamp
- **Listeners**:
  - Send notification to user
  - Update analytics

### SyncJobCompletedEvent
- **Triggered when**: Sync job completes successfully
- **Fields**: syncJobId, businessId, pagesProcessed, documentsProcessed, timestamp
- **Listeners**:
  - Send notification to user
  - Update analytics
  - Trigger knowledge base update if website sync
  - Trigger chatbot context update if needed

### SyncJobFailedEvent
- **Triggered when**: Sync job fails
- **Fields**: syncJobId, businessId, error, timestamp
- **Listeners**:
  - Send notification to user
  - Update analytics
  - Retry mechanism if applicable

## Job Events

### JobCreatedEvent
- **Triggered when**: A new background job is created
- **Fields**: jobId, name, type, businessId, timestamp
- **Listeners**:
  - Send notification to user if job is for their business
  - Update analytics
  - If job is scheduled for immediate processing, trigger processor

### JobUpdatedEvent
- **Triggered when**: Job information is updated
- **Fields**: jobId, updates (name, type, payload, scheduledAt, status), timestamp
- **Listeners**:
  - Send notification to user if significant changes
  - Update analytics

### JobDeletedEvent
- **Triggered when**: Job is deleted
- **Fields**: jobId, timestamp
- **Listeners**:
  - Clean up associated data
  - Update analytics

### JobStartedEvent
- **Triggered when**: Job begins processing
- **Fields**: jobId, timestamp
- **Listeners**:
  - Send notification to user
  - Update analytics
  - Log start time for performance tracking

### JobCompletedEvent
- **Triggered when**: Job completes successfully
- **Fields**: jobId, timestamp
- **Listeners**:
  - Send notification to user
  - Update analytics
  - Log completion time for performance tracking
  - Trigger any dependent jobs

### JobFailedEvent
- **Triggered when**: Job fails
- **Fields**: jobId, error, timestamp
- **Listeners**:
  - Send notification to user
  - Update analytics
  - Implement retry logic if applicable
  - Alert administrators for repeated failures