# API Reference

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token stored in an HTTP-only cookie named `refreshToken`.

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "error": string | null
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "message": string,
  "error": string
}
```

## Pagination

Endpoints that return lists use query parameters for pagination:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)

Response includes pagination metadata:

```json
{
  "success": true,
  "data": [...],
  "message": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

## Modules

### Authentication (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /forgot-password` - Initiate password reset
- `POST /reset-password/:token` - Complete password reset
- `GET /verify-email/:token` - Verify email address
- `POST /logout` - Logout user
- `POST /refresh-token` - Refresh access token

### Users (`/api/users`)

- `GET /:id` - Get user by ID
- `GET /` - Get all users (admin only)
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (admin only)
- `PATCH /:id/verify` - Verify user (admin only)
- `PATCH /:id/password` - Update user password
- `GET /count` - Get user count (admin only)

### Business (`/api/business`)

- `POST /` - Create business
- `GET /:id` - Get business by ID
- `GET /me` - Get business for authenticated user
- `PUT /:id` - Update business
- `DELETE /:id` - Delete business
- `GET /` - Get businesses (with filtering)

### Business Settings (`/api/business-settings`)

- `GET /` - Get business settings
- `PUT /` - Update business settings

### Documents (`/api/documents`)

- `POST /upload` - Upload document
- `GET /:id` - Get document by ID
- `GET /` - Get documents for user's business
- `PUT /:id` - Update document
- `DELETE /:id` - Delete document
- `POST /:id/process` - Mark document as processed
- `GET /count` - Get document count for user's business

### Website (`/api/website`)

- `POST /url` - Set website URL
- `GET /` - Get website for user's business
- `PUT /` - Update website information
- `DELETE /` - Delete website
- `POST /crawl` - Crawl website
- `POST /recrawl` - Recrawl website
- `GET /pages` - Get website pages

### Knowledge Base (`/api/knowledge-base`)

- `GET /` - Get knowledge base for user's business
- `POST /` - Create knowledge base
- `PUT /` - Update knowledge base
- `DELETE /` - Delete knowledge base
- `POST /document` - Add document to knowledge base
- `DELETE /document` - Remove document from knowledge base
- `POST /page` - Add page to knowledge base
- `DELETE /page` - Remove page from knowledge base
- `POST /ready` - Set knowledge base as ready/not ready
- `GET /stats` - Get knowledge base statistics

### Audit (`/api/audit`)

- `POST /` - Create audit
- `GET /:id` - Get audit by ID
- `GET /business` - Get audits for business
- `GET /business/latest` - Get latest audit for business
- `PUT /:id` - Update audit
- `DELETE /:id` - Delete audit
- `GET /business/count` - Get audit count for business

### Chat (`/api/chat`)

- `POST /session` - Create chat session
- `GET /session/:sessionToken` - Get chat session by token
- `POST /:chatSessionId/message` - Send message
- `GET /:chatSessionId/messages` - Get messages for session
- `POST /:chatSessionId/end` - End chat session
- `GET /business` - Get chat sessions for business
- `GET /visitor/:visitorId` - Get chat sessions for visitor
- `GET /active-sessions` - Get active chat sessions for business

### Widget (`/api/widget`)

- `GET /` - Get widget for business
- `POST /` - Create widget
- `PUT /` - Update widget
- `DELETE /` - Delete widget

### Analytics (`/api/analytics`)

- `POST /` - Create analytics record
- `GET /:id` - Get analytics by ID
- `GET /business` - Get analytics for business
- `GET /business/:metricType` - Get analytics for business and metric type
- `GET /business/:metricType/latest` - Get latest analytics for business and metric type
- `PUT /:id` - Update analytics
- `DELETE /:id` - Delete analytics
- `GET /business/count` - Get analytics count for business
- `DELETE /business/old/:days` - Delete old analytics (data retention)
- `POST /business/calculate/total-chats` - Calculate total chats for business
- `POST /business/calculate/average-session-duration` - Calculate average session duration

### Notifications (`/api/notifications`)

- `POST /` - Create notification
- `GET /:id` - Get notification by ID
- `GET /` - Get notifications for business
- `GET /unread` - Get unread notifications for business
- `PUT /:id` - Update notification
- `DELETE /:id` - Delete notification
- `POST /:id/read` - Mark notification as read
- `POST /:id/unread` - Mark notification as unread
- `POST /read-all` - Mark all notifications as read
- `GET /count` - Get notification count for business
- `GET /unread/count` - Get unread notification count for business

### Sync (`/api/sync`)

- `POST /` - Create sync job
- `GET /:id` - Get sync job by ID
- `GET /` - Get sync jobs for business
- `GET /status/:status` - Get sync jobs by status
- `GET /latest/:type` - Get latest sync job by type
- `PUT /:id` - Update sync job
- `DELETE /:id` - Delete sync job
- `POST /website/start` - Start website sync
- `POST /document/start` - Start document sync
- `POST /knowledge-base/start` - Start knowledge base sync
- `GET /count` - Get sync job count for business

### Jobs (`/api/jobs`)

- `POST /` - Create job
- `GET /:id` - Get job by ID
- `GET /business` - Get jobs for business
- `GET /type/:type` - Get jobs by type
- `GET /status/:status` - Get jobs by status
- `GET /pending` - Get pending jobs
- `PUT /:id` - Update job
- `DELETE /:id` - Delete job
- `POST /:id/start` - Start job
- `POST /:id/complete` - Complete job
- `POST /:id/fail` - Fail job
- `GET /count` - Get job count (admin only)
- `GET /business/count` - Get job count for business
- `GET /type/:type/count` - Get job count by type
- `GET /status/:status/count` - Get job count by status

### Health (`/api/health`)

- `GET /` - Health check endpoint (public)
- `GET /history` - Get health check history (authenticated)
- `GET /latest` - Get latest health check (authenticated)

### Cache (`/api/cache`)

- `POST /set` - Set value in cache (admin only)
- `GET /get/:key` - Get value from cache
- `DELETE /del/:key` - Delete value from cache (admin only)
- `GET /exists/:key` - Check if key exists in cache
- `GET /info` - Get cache info (admin only)
- `POST /flushall` - Flush all cache (admin only)
- `GET /ttl/:key` - Get TTL for key

## Error Codes

- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## Versioning

This documentation refers to API version 1.0.0.
