# Frontend Integration Guide

## Overview
This guide explains how to integrate a frontend application with the AIBridge backend API.

## Authentication

### Login Flow
1. User submits login credentials to `/api/auth/login`
2. Backend verifies credentials and sets HTTP-only cookie with refresh token
3. For subsequent requests, the browser automatically sends the cookie
4. Backend validates the refresh token and issues access token for API access

### Access Token Usage
The backend uses a cookie-based authentication flow where:
- Refresh token is stored in HTTP-only cookie (secure, not accessible to JavaScript)
- Access token is generated server-side and used for internal validation
- Frontend doesn't need to handle tokens directly for most API calls

### Making Authenticated Requests
```javascript
// Using fetch API
fetch('/api/business/me', {
  method: 'GET',
  credentials: 'include' // Important: sends cookies with request
})
.then(response => response.json())
.then(data => console.log(data));

// Using Axios (with credentials included by default)
axios.get('/api/business/me')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## API Endpoints Reference
See [API Reference](api-reference.md) for detailed endpoint information.

## WebSocket Integration (Optional)
For real-time notifications, the backend supports WebSocket connections.

### Connection
```javascript
const socket = new WebSocket('ws://localhost:3000');

// Or for secure connections
// const socket = new WebSocket('wss://yourdomain.com');

socket.onopen = function(event) {
  console.log('WebSocket connected');
  // Optionally send authentication token
  // socket.send(JSON.stringify({ type: 'auth', token: 'your-jwt-token' }));
};

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
  // Handle incoming notifications
};

socket.onclose = function(event) {
  console.log('WebSocket disconnected');
};

socket.onerror = function(error) {
  console.error('WebSocket error:', error);
};
```

### Message Types
The backend may send various message types:
- `notification`: New notification for user
- `chat_update`: Updates to chat sessions
- `sync_progress`: Updates on ongoing sync operations
- `job_status`: Updates on background jobs

## Error Handling
Handle common HTTP status codes:
- 400: Bad Request - Check request format and validation
- 401: Unauthorized - Redirect to login page
- 403: Forbidden - Show access denied message
- 404: Not Found - Show not found page
- 429: Too Many Requests - Implement retry with backoff
- 500: Internal Server Error - Show generic error message
- 503: Service Unavailable - Show service unavailable message

## Data Formats
### Date Times
All date/time values are returned in ISO 8601 format:
```
2023-06-15T14:30:00.000Z
```

### Pagination
Responses with paginated data include:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### File Uploads
Use multipart/form-data for file uploads:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'Optional description');

fetch('/api/documents/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});
```

## Environment Configuration
Frontend should be configured with the backend URL:
```javascript
// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Usage
fetch(`${API_BASE_URL}/business/me`, {
  credentials: 'include'
});
```

## Security Considerations
1. Always use HTTPS in production
2. Set appropriate CORS headers on backend
3. Sanitize all user input to prevent XSS
4. Implement CSRF protection if using cookie-based authentication
5. Use Content Security Policy (CSP) headers
6. Implement proper error handling to avoid leaking stack traces

## Example: Creating a Business
```javascript
async function createBusiness(businessData) {
  try {
    const response = await fetch('/api/business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(businessData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to create business:', error);
    throw error;
  }
}
```

## Example: Uploading a Document
```javascript
async function uploadDocument(file, description = '') {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);

    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to upload document:', error);
    throw error;
  }
}
```

## Example: Getting Chat Sessions
```javascript
async function getChatSessions() {
  try {
    const response = await fetch('/api/chat/business', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to get chat sessions:', error);
    throw error;
  }
}
```

## Testing Integration
1. Verify authentication flow works correctly
2. Test all CRUD operations for key entities
3. Verify error handling and edge cases
4. Test file uploads and downloads
5. Verify pagination works correctly
6. Test WebSocket connection if implemented
7. Check performance with large data sets
8. Verify security headers are present