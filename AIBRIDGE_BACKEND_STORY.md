# AI-Bridge Backend: A Storytelling Walkthrough

Hello! I'm excited to walk you through the backend architecture of the **AI-Bridge** project. Imagine we're taking a tour of a well-organized factory, where raw data comes in, gets processed, secured, and turned into actionable AI intelligence for businesses. Let me take you through how we’ve structured this system, module by module, and how data flows through it.

---

## 1. The Big Picture: Our Tech Stack & Philosophy
Before we dive into the code, let me set the stage. The AI-Bridge backend is built to be a robust, scalable **Node.js** application. 
- We use **TypeScript** throughout for strong typing and developer confidence.
- **Express.js** acts as our web framework handling the HTTP layer.
- For data persistence, we use **PostgreSQL** alongside **Prisma ORM**, which gives us excellent type safety from the database all the way to the API.
- We utilize **Redis** for caching and session management.
- The system is completely modular and follows an **Event-Driven Architecture**, keeping our components decoupled and ready for horizontal scaling.

---

## 2. The Factory Entrance: `app.ts` & `server.ts`
Every request starts its journey at `server.ts`, which bootstraps our application, connects to Prisma and Redis, and starts the HTTP server. 

But the real traffic control happens in `app.ts`. Here, we set up our foundational security and middleware:
- **Security:** We use `helmet` for HTTP headers, `cors` for cross-origin requests, and `express-rate-limit` to prevent abuse.
- **Payload Parsing:** We parse JSON and URL-encoded bodies (up to 10MB to support document uploads).
- **Routing:** Finally, `app.ts` delegates requests to their respective modules under the `/api/*` prefix.

---

## 3. The Layered Architecture (How a Module Works)
To keep things clean, we strictly enforce a 4-layer architecture across all our modules. Let's look at how a typical module is structured:

1. **Transport Layer (`routes`, `controllers`, `middleware`):** The bouncer and the receptionist. Routes define the endpoints, middleware authenticates and validates the request (using **Zod** for schema validation), and the controller parses the HTTP request before handing it off.
2. **Application Layer (`services`, `validators`):** The brains of the operation. Services contain pure business logic. They don't know about HTTP or Express.
3. **Infrastructure Layer (`repositories`):** The filing clerks. Repositories handle all direct interactions with Prisma/PostgreSQL. If we ever swap our database, the service layer won't even notice.
4. **Domain Layer (`events`, `listeners`):** The intercom system. When a significant action happens (like a user registering), the service emits a Domain Event. Listeners pick this up to handle side effects (like sending a welcome email) without slowing down the main request.

---

## 4. The Modules: A Tour of the Departments

Let’s walk through the key modules and their endpoints.

### 🔐 Authentication & Users (`/api/auth`, `/api/users`)
- **Purpose:** Secures the platform using JWT (JSON Web Tokens). It features Role-Based Access Control (Admin, Business Owner, Employee).
- **Workflow:** When a user hits `POST /api/auth/login`, the controller passes credentials to the `AuthService`. We verify the password hash using **bcrypt**. Upon success, we generate an Access Token (kept in memory) and a Refresh Token (stored in an HTTP-only cookie and the database).
- **Events:** Emits `UserLoggedInEvent` or `UserRegisteredEvent`, which triggers listeners to log the login time or send a verification email.

### 🏢 Business Management (`/api/business`, `/api/business-settings`)
- **Purpose:** Manages the tenant (the business using our AI services). Every user belongs to a business.
- **Key Routes:** CRUD operations for business profiles and configuration of their specific AI settings.

### 📄 Document Processing (`/api/documents`)
- **Purpose:** Where businesses upload their data (PDFs, TXT, DOCX) to train their AI.
- **Workflow:** 
  1. A file is uploaded via `POST /api/documents/upload`.
  2. **Multer** middleware captures the file.
  3. The `DocumentService` validates business ownership and saves a record via the `DocumentRepository`.
  4. Here is the magic: We emit a `DocumentUploadedEvent`. A listener picks this up and forwards the document to an external Python/FastAPI service. The external service chunks the text, creates embeddings, and returns them to us.
  5. The document is marked as `processed`.

### 🌐 Website Crawler (`/api/website`)
- **Purpose:** Allows businesses to simply provide a URL, and our backend will crawl it using **Cheerio** to extract knowledge base content automatically.

### 🧠 Knowledge Base (`/api/knowledge-base`)
- **Purpose:** The centralized brain for a specific business. It aggregates data from the Document and Website modules, storing the processed embeddings that power the AI.

### 💬 Chat & Widget (`/api/chat`, `/api/widget`)
- **Purpose:** The consumer-facing side. The widget is embedded on the business's actual website. 
- **Workflow:** Visitors interact with the widget. The backend receives `POST /api/chat/message`, retrieves the relevant Knowledge Base context using the embeddings, and interfaces with the LLM to generate a response, maintaining session history via Redis.

### 📊 Analytics & Audit (`/api/analytics`, `/api/audit`)
- **Purpose:** Tracks usage, AI effectiveness, and logs sensitive actions. 
- **Workflow:** Asynchronous listeners from other modules (like a completed chat session) drop data into these repositories for reporting.

### 🔔 Notifications, Sync & Jobs (`/api/notifications`, `/api/sync`, `/api/jobs`)
- **Purpose:** Handles system alerts, background data synchronization (like updating embeddings if a website changes), and managing background tasks.

---

## 5. Security & Scalability: Ready for Production

If you asked me, "Is this ready for prime time?", here is my answer:

**Security:**
- We validate *every* incoming payload using strict **Zod** schemas. No malformed data enters the application layer.
- Passwords are never stored in plain text (bcrypt).
- Refresh tokens are rotated and stored securely.
- We utilize Helmet for CSP headers and Express Rate Limit to prevent brute-force attacks.

**Scalability:**
- **Statelessness:** The Node app itself is completely stateless. Session state lives in Redis, and persistent state in PostgreSQL. We can spin up 10 instances of this backend behind a load balancer instantly.
- **Event-Driven:** By decoupling side-effects (like sending emails or triggering external AI processing) into events and listeners, our API response times remain lightning-fast. In the future, these synchronous listeners can easily be swapped out for a message queue like BullMQ or Kafka for true distributed processing.

## Conclusion

In summary, the AI-Bridge backend is built not just to work, but to grow. By enforcing strict boundaries between the Transport, Application, and Infrastructure layers, and leveraging TypeScript alongside Prisma, we've created a system that is highly testable, secure by default, and ready to scale alongside our businesses' AI needs.
