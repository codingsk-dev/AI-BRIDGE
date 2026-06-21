# AIBridge Integration

End-to-end stack: **ai-service** (FastAPI on `:8000`) → **fixed-backend** gateway (Express on `:3000`, Postgres + Redis) → **teammate-frontend** (Next.js 16 on `:3001`).

All three services run on your laptop and talk to **fully-managed cloud services** (no Docker, no local Qdrant, no local Postgres, no local Redis). Local dev and production run the same code path with different env files.

## Free-tier cloud services (zero rupees)

| Concern | Service | Region | Used for |
|---|---|---|---|
| Frontend hosting | Vercel | n/a | teammate-frontend |
| Backend hosting | Render | (free tier) | fixed-backend + ai-service |
| Postgres | Neon | Singapore (`ap-southeast-1`) | Users, businesses, audits, chat history |
| Redis | Upstash | Singapore (`ap-southeast-1`) | Refresh tokens, sessions, rate limit, cache |
| Vector DB | Qdrant Cloud | Sydney (`australia-southeast1`) | Embeddings for chat + RAG |
| LLM | Groq | n/a | llama-3.3-70b for chat answers + report gen |
| Uptime pinger | UptimeRobot | n/a | Keep Render free tier from sleeping |

## What was done

### Repo-level
- All Docker files removed: `docker-compose.yml`, `Dockerfile`, `install.sh`, `install.bat`, `start.sh`, `start.bat`.
- `.gitignore` now blocks `info.txt`, every `.env*`, secrets, `node_modules`, `.next`, `.tsbuildinfo`, etc.

### ai-service (`ai-service/`)
- `app/core/config.py` — replaced `qdrant_host` / `qdrant_port` / `qdrant_grpc_port` with `qdrant_url` + `qdrant_api_key`. Hard-fails at startup if the URL is missing/placeholder.
- `app/core/qdrant.py` + `scripts/init_qdrant.py` — switched to `QdrantClient(url=..., api_key=...)`. The Qdrant-binary subprocess path is gone.
- `.env.example` / `.env` — only the cloud-Qdrant + Groq fields remain.

### fixed-backend (`fixed-backend/`)
- `src/config/index.ts` — added `redisUrl` (preferred over host/port/password). CORS now reads `CORS_ORIGIN` (comma-separated) or `FRONTEND_ORIGIN`.
- `src/lib/redis.ts` — when `REDIS_URL` is set, pass it as the first positional arg to ioredis (spreading it as `{ url }` silently fails with ECONNREFUSED). When unset, fall back to host+port+password.
- `src/chat/controllers/chat.controller.ts` — auto-creates a `Visitor` row before opening a `ChatSession` (was crashing on FK violation).
- `src/documents/routes/document.routes.ts` — multer now runs inside the controller (was registered twice in the router, double-parsing the multipart body).
- `.env.example` + `.env.development` — Neon + Upstash placeholders + the real cloud values for local dev.
- Prisma schema applied to Neon via `npx prisma migrate dev --name init`.

### teammate-frontend (`teammate-frontend/`)
- No code changes needed; `next.config.mjs` rewrites already point at `BACKEND_URL` and we're using the same value.
- `.env.development` keeps `BACKEND_URL=http://localhost:3000` and `NEXT_PUBLIC_BACKEND_URL=http://localhost:3000`.

## How to run locally (no Docker, no Qdrant binary)

Prereqs: Node 18+, Python 3.11+, pnpm. Neon / Upstash / Qdrant Cloud / Groq accounts.

```bash
# 1) ai-service (FastAPI on :8000)
cd ai-service
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# .env already has your QDRANT_URL, QDRANT_API_KEY, GROQ_API_KEYS — edit if you rotate them
python scripts/init_qdrant.py                       # one-time, creates 6 collections
uvicorn app.main:app --host 127.0.0.1 --port 8000

# 2) fixed-backend gateway (Express on :3000, talking to Neon + Upstash)
cd ../fixed-backend
npm install
cp .env.development .env                             # .env.development already has cloud URLs
npx prisma migrate deploy                            # one-time
npm run dev

# 3) teammate-frontend (Next.js on :3001)
cd ../teammate-frontend
pnpm install
cp .env.development .env                             # BACKEND_URL=http://localhost:3000
pnpm dev
```

Open `http://localhost:3001`, sign up, create a business, upload a PDF / DOCX / TXT, optionally set a website URL + click **Crawl**, then **Generate report** to invoke the ai-service.

## End-to-end smoke test (every feature)

```bash
# 1) health (gateway + ai-service)
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:8000/v1/health

# 2) signup → login → /me
curl -c /tmp/c.txt -X POST http://127.0.0.1:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@test.local","password":"Passw0rd!","firstName":"Smoke","lastName":"Test"}'
curl -c /tmp/c.txt -X POST http://127.0.0.1:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"smoke@test.local","password":"Passw0rd!"}'
curl -b /tmp/c.txt http://127.0.0.1:3000/api/auth/me

# 3) create business + set website + crawl + index
BIZ=$(curl -b /tmp/c.txt -X POST http://127.0.0.1:3000/api/business \
  -H "Content-Type: application/json" \
  -d '{"name":"Bookzstore","industry":"ECOMMERCE","websiteUrl":"https://bookzstore.in/"}' \
  | node -e "let s='';process.stdin.on('data',c=>s+=c);process.stdin.on('end',()=>{process.stdout.write(JSON.parse(s).business.id);});")

# Re-crawl + analyse the website (fills Qdrant kb_master + website_pages)
curl -X POST http://127.0.0.1:8000/v1/analyze-website \
  -H "Content-Type: application/json" \
  -d "{\"business_id\":\"$BIZ\",\"url\":\"https://bookzstore.in/\",\"max_pages\":2,\"force_recrawl\":true}"

# 4) upload a document
echo "Hello. We ship within India only." > /tmp/sample.txt
curl -b /tmp/c.txt -X POST http://127.0.0.1:3000/api/documents/upload \
  -F "file=@/tmp/sample.txt"

# 5) open a chat session + send a question (proxy → ai-service → Groq)
CSID=$(curl -b /tmp/c.txt -X POST http://127.0.0.1:3000/api/chat/session \
  -H "Content-Type: application/json" \
  -d "{\"businessId\":\"$BIZ\"}" \
  | node -e "let s='';process.stdin.on('data',c=>s+=c);process.stdin.on('end',()=>{process.stdout.write(JSON.parse(s).chatSession.id);});")

curl -b /tmp/c.txt -X POST "http://127.0.0.1:3000/api/chat/$CSID/message" \
  -H "Content-Type: application/json" \
  -d '{"content":"What does this bookstore sell?","isFromUser":true}'
sleep 4
curl -b /tmp/c.txt "http://127.0.0.1:3000/api/chat/$CSID/messages"

# 6) generate AI readiness report
curl -b /tmp/c.txt -X POST "http://127.0.0.1:3000/api/audit/generate/$BIZ" \
  -H "Content-Type: application/json" \
  -d '{"include_documents":false,"focus_areas":[],"language":"en"}'
curl -b /tmp/c.txt "http://127.0.0.1:3000/api/audit/business/$BIZ/latest"

# 7) widgets + analytics + business settings
curl -b /tmp/c.txt "http://127.0.0.1:3000/api/widget?businessId=$BIZ"
curl -b /tmp/c.txt "http://127.0.0.1:3000/api/analytics/$BIZ"
curl -b /tmp/c.txt "http://127.0.0.1:3000/api/business-settings/me"
```

Every command above was run successfully on 2026-06-21 against the live cloud stack (Neon + Upstash + Qdrant Cloud Sydney + Groq).

## What the frontend should be able to do (Phase 2, after you sign off)

Open `http://localhost:3001` in your browser and verify every flow works:

| Page | Verifies |
|---|---|
| `/` (landing) | Frontend dev server + UI |
| `/signup` then `/signin` | Auth round-trip → cookies set → /api/auth/me returns user |
| `/dashboard` | /api/business/mine + /api/audit/business/:id/latest |
| `/dashboard/businesses` | list + create + detail (documents + chatbot) |
| `/dashboard/businesses/:id` | document upload (multipart) + audit history |
| `/dashboard/chatbots` | widgets CRUD + chat session + message stream |
| `/dashboard/reports/new` | audit generation form |
| `/dashboard/reports/:id` | rendered audit (score, subscores, strengths, …) |
| `/dashboard/analytics` | charts (KPIs + bar/pie) from /api/analytics |
| `/dashboard/settings` | /api/business-settings/me GET + PUT |

If any page shows a server error or stuck spinner, copy the URL + the network-tab response here.

## What's NOT done yet (deferred)

- **File-storage migration to Cloudflare R2** — uploads still land in `ai-service/data/uploads/` and `fixed-backend/uploads/`. These are wiped on every container restart. For a demo this is fine; for production we'll add R2.
- **Production deployment** (`render.yaml` for both backend services + Vercel config for the frontend + UptimeRobot monitors). I'll do this once you confirm local dev works end-to-end.
