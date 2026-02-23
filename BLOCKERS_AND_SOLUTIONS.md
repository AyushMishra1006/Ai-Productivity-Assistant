# Project Blockers & Solutions - Learning Guide

**Purpose:** Document all blockers faced during development, their root causes, solutions, and lessons learned.

---

## Table of Contents
1. [Blocker 1: Ollama Model Too Heavy](#blocker-1-ollama-model-too-heavy)
2. [Blocker 2: UI Not Meeting Expectations](#blocker-2-ui-not-meeting-expectations)
3. [Blocker 3: Hardcoded Test Data](#blocker-3-hardcoded-test-data)
4. [Blocker 4: Schema Mismatch](#blocker-4-schema-mismatch)
5. [Blocker 5: Backend Not Responding](#blocker-5-backend-not-responding)
6. [Blocker 6: Rust Compilation Issues](#blocker-6-rust-compilation-issues)
7. [Blocker 7: CORS Configuration](#blocker-7-cors-configuration)
8. [Blocker 8: Environment Variable Management](#blocker-8-environment-variable-management)
9. [Blocker 9: Groq API Incompatibility & Deprecated Model](#blocker-9-groq-api-incompatibility--deprecated-model)
10. [Blocker 10: HTTP Method Mismatch](#blocker-10-http-method-mismatch)

---

## BLOCKER 1: Ollama Model Too Heavy

### ❌ Problem
```
- Model size: 4.4GB (Mistral 7B)
- Local storage on user's machine
- Model load time: 30-60 seconds each request
- Network bandwidth: Very high
- Setup complexity: Very high (need to download 4.4GB)
```

### Root Cause Analysis
```
Ollama is designed for LOCAL LLM inference:
  └─ Good for: Privacy, offline capability, control
  └─ Bad for: Speed, accessibility, scaling

Our use case needed: SPEED + EASE OF USE (not privacy)
```

### 🔧 Solution Implemented
**Replaced Ollama with Groq API**

```python
# BEFORE (Ollama - slow, heavy)
from anthropic import Anthropic
client = Anthropic(
    api_key="dummy-key",
    base_url="http://localhost:11434/v1"  # Local 4.4GB model
)

# AFTER (Groq - fast, lightweight)
from groq import Groq
client = Groq(api_key=settings.groq_api_key)  # Cloud API
```

### 📊 Comparison

| Metric | Ollama | Groq API |
|--------|--------|----------|
| **Model Size** | 4.4GB local | Cloud-hosted |
| **Response Time** | 10-30 seconds | 0.5-2 seconds |
| **Setup Time** | 30+ minutes | 2 minutes |
| **Local Storage** | 4.4GB | ~1MB |
| **Cost** | Free (electricity) | Free tier |
| **Privacy** | Complete | Sent to Groq |
| **Offline Capability** | Yes | No |
| **Scalability** | Limited | Unlimited |

### 💡 Lesson Learned
```
ALWAYS consider:
1. Use case requirements (speed vs privacy)
2. User experience (setup complexity)
3. Scalability needs
4. Total cost of ownership (not just license cost)

Don't over-engineer for features you don't need!
```

### Blockers This Caused
- ✅ Removed: 4.4GB storage requirement
- ✅ Removed: 30+ second initial load
- ✅ Removed: Complex local setup

---

## BLOCKER 2: UI Not Meeting Expectations

### ❌ Problem
```
Initial dark-themed UI didn't match user expectations:
  - First attempt: Dark navy + indigo + pink (custom)
  - User feedback: "Not professional enough"
  - Second attempt: Custom red/black theme
  - User feedback: "Still not right"
```

### Root Cause Analysis
```
1. Custom design ≠ Professional appearance
2. Designer perception ≠ Component library design
3. Time spent on styling ≠ Better result

Why custom designs fail:
  - Missing accessibility features (WCAG compliance)
  - Inconsistent spacing/typography
  - Poor component state handling
  - Not tested across devices
```

### 🔧 Solution Implemented
**Use v0.app - Professional UI Generator**

```
v0.app generates:
  ✅ Production-ready components (Radix UI)
  ✅ Accessibility built-in
  ✅ Responsive design
  ✅ Professional appearance
  ✅ Modern patterns (Next.js 16)
  ✅ Type-safe (TypeScript)
```

### Why This Won (vs Custom CSS)

| Aspect | Custom CSS | v0.app |
|--------|-----------|--------|
| **Design Quality** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Accessibility** | ❌ | ✅ WCAG AA |
| **Time to Market** | Days | Hours |
| **Mobile Responsive** | Manual testing | Built-in |
| **Component Consistency** | Mistakes likely | Guaranteed |
| **Developer Experience** | Debug CSS | Use components |

### 💡 Lesson Learned
```
DECISION RULE:
  If design matters to UX → Use design system/library
  If it's internal tool → Custom styling is OK
  If client-facing → Always use professional components

Don't reinvent the wheel. Use tools built for this.
```

### Blockers This Caused
- ✅ Removed: Hours of CSS debugging
- ✅ Removed: Accessibility concerns
- ✅ Removed: Mobile responsive issues

---

## BLOCKER 3: Hardcoded Test Data

### ❌ Problem
```
v0.app generated code included sample data:

INITIAL_TASKS = [
  { id: "1", title: "Redesign landing page", ... },
  { id: "2", title: "API integration tests", ... },
  ...
]

INITIAL_MESSAGES = [
  { role: "assistant", content: "Welcome to..." },
  { role: "user", content: "Can you suggest..." },
  ...
]

AI_RESPONSES = [
  "Great question! Let me analyze...",
  "I've reviewed the task priorities...",
  ...
]
```

### Issues This Caused
```
1. Tasks never deleted permanently (state only)
2. Refresh page → test data reappears
3. Chat with fake AI responses
4. Data never sent to backend
5. User confusion: "Why does everything reset?"
```

### Root Cause Analysis
```
v0.app generates:
  ✅ Beautiful UI components
  ❌ Client-side state only (no real API)

This is by design (v0 = prototype/demo)
But our project needed REAL data
```

### 🔧 Solution Implemented
**Remove all hardcoded data + Connect to real API**

```typescript
// BEFORE (Hardcoded)
const [todos, setTodos] = useState<Todo[]>(INITIAL_TASKS)
const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)

// AFTER (Real API)
const [todos, setTodos] = useState<Todo[]>([])

useEffect(() => {
  const loadTodos = async () => {
    const data = await todoAPI.getAll()  // Fetch from backend
    setTodos(data)
  }
  loadTodos()
}, [])
```

### 📊 Impact Comparison

| Feature | Before (Hardcoded) | After (Real API) |
|---------|------------------|-----------------|
| **Data Persistence** | ❌ No | ✅ Yes (DB) |
| **Create Todo** | Local only | Server + DB |
| **Delete Todo** | Reversal on refresh | Permanent |
| **Chat with AI** | Fake responses | Real Groq API |
| **Real functionality** | ❌ No | ✅ Yes |

### 💡 Lesson Learned
```
DEVELOPMENT WORKFLOW:
1. Use templates/generators to SPEED UP
2. Don't use test data in production
3. ALWAYS replace with real API calls
4. Test data = prototype only

Red flags:
  - INITIAL_* variables
  - Hardcoded arrays
  - localStorage instead of backend
  - setTimeout for simulated delays
```

---

## BLOCKER 4: Schema Mismatch

### ❌ Problem
```
Frontend expected:
{
  id: string
  title: string
  description: string
  completed: boolean
  priority?: "high" | "medium" | "low"
}

Backend actually returned:
{
  id: number
  title: string
  priority: "high" | "medium" | "low"
  status: "pending" | "completed"  // NOT "completed" boolean
  due_date?: string
  created_at: string
  updated_at: string
}
```

### Issues This Caused
```
1. Frontend errors: "Property 'completed' does not exist"
2. Type mismatch: string vs number for ID
3. Status mapping: "pending" vs boolean true/false
4. Missing fields: description not in API
```

### Root Cause Analysis
```
Frontend was built for IMAGINED schema
Backend had DIFFERENT schema

Why it happened:
  1. Frontend developer made assumptions
  2. Backend API already existed
  3. No API contract defined upfront
  4. No .d.ts or OpenAPI spec checked
```

### 🔧 Solution Implemented
**Align frontend with ACTUAL backend schema**

```typescript
// Step 1: Read actual backend schema
// File: backend/app/schemas/todo.py
{
  id: int
  title: str
  priority: str  // "high" | "medium" | "low"
  status: str    // "pending" | "completed"
  due_date: Optional[str]
  created_at: str
  updated_at: str
}

// Step 2: Update frontend types
export interface Todo {
  id: number;           // Changed: string → number
  title: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";  // Changed: completed boolean
  due_date?: string;
  created_at: string;
  updated_at: string;
  // Removed: description (not in backend)
}

// Step 3: Update components
const filteredTodos = todos.filter((todo) => {
  // OLD: (filter === "active" && !todo.completed)
  // NEW: (filter === "active" && todo.status === "pending")
  return todo.status === "pending"
})
```

### 💡 Lesson Learned
```
BEST PRACTICE - Define API Contract FIRST:

1. Create OpenAPI/Swagger spec BEFORE coding
2. Use API spec to generate TypeScript types
3. Frontend and backend both follow same spec
4. No surprises, no schema mismatches

Tools to use:
  - Swagger/OpenAPI spec
  - TypeScript schema generation
  - API contract testing (e.g., Pact)

NEVER assume the schema!
Always read the actual API response.
```

---

## BLOCKER 5: Backend Not Responding

### ❌ Problem
```
Frontend console errors:
  "Failed to fetch"
  "TypeError: Failed to fetch"

Browser can't reach http://localhost:8000
```

### Root Cause Analysis
```
Possible causes (in order of likelihood):
1. ✅ Backend server not running
2. ✅ Backend running on different port
3. ✅ CORS misconfigured
4. ✅ Firewall blocking port 8000
5. API URL wrong in frontend config
```

### 🔧 Solution Implemented
**Systematic diagnosis**

```bash
# Step 1: Check if backend is running
curl http://localhost:8000/health

# Step 2: Check which port is listening
netstat -ano | grep 8000

# Step 3: Test from terminal (not browser)
curl http://localhost:8000/todos

# Step 4: Check frontend env var
cat frontend/.env.local
# Should have: NEXT_PUBLIC_API_URL=http://localhost:8000

# Step 5: Hard refresh browser
# Ctrl + Shift + R (clear cache)
```

### 💡 Lesson Learned
```
DEBUGGING CHECKLIST for "Failed to fetch":

1. Server running?
   ✅ ps aux | grep uvicorn
   ✅ ps aux | grep npm

2. Port correct?
   ✅ netstat/lsof shows listening
   ✅ config env vars match actual port

3. URL correct?
   ✅ cat .env.local
   ✅ No typos in URL

4. CORS enabled?
   ✅ Check ALLOWED_ORIGINS in backend
   ✅ frontend URL is in the list

5. Cache issue?
   ✅ Hard refresh: Ctrl+Shift+R
   ✅ Clear DevTools cache

6. Firewall?
   ✅ Check Windows Defender
   ✅ Check antivirus rules
```

---

## BLOCKER 6: Rust Compilation Issues

### ❌ Problem
```
Error when installing requirements:
  "Failed to build 'psycopg2-binary' when getting requirements to build wheel"
  "Rust compiler not found or not on PATH"

This happens on Windows with certain packages.
```

### Root Cause Analysis
```
psycopg2-binary requires compilation:
  - Has C extensions
  - Has Rust components (pydantic-core)
  - Windows doesn't have Rust toolchain by default
  - Building from source fails

Why it matters:
  - PostgreSQL driver is needed for production
  - But not needed for local SQLite development
```

### 🔧 Solution Implemented
**Remove non-essential dependencies for local dev**

```txt
# requirements.txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
groq==0.4.1
sqlalchemy==2.0.35
pydantic==2.10.6
pydantic-settings==2.2.1
python-dotenv==1.0.1
# psycopg2-binary removed (only needed for production)
```

### Strategy
```
Development:
  └─ Use SQLite (no compilation needed)
  └─ Just install: fastapi, sqlalchemy, pydantic

Production (Railway):
  └─ Add psycopg2-binary in docker build
  └─ Railway has build tools available
  └─ PostgreSQL needed for multi-user scale
```

### 💡 Lesson Learned
```
DEPENDENCY MANAGEMENT:

1. Separate dev and production dependencies
2. Don't install production packages locally
3. Use virtual environments properly

Development:
  requirements.txt (minimal)
  - fastapi, sqlalchemy, basic deps
  - SQLite (built-in, no compilation)

Production:
  requirements-prod.txt
  - Add: psycopg2-binary, redis, etc.
  - Use: PostgreSQL, caching layers

Docker handles compilation:
  - Docker images have build tools
  - psycopg2-binary installs fine in Docker
```

---

## BLOCKER 7: CORS Configuration

### ❌ Problem
```
Browser console error:
  "Access to XMLHttpRequest at 'http://localhost:8000/todos'
   from origin 'http://localhost:3000' has been blocked by CORS policy"

Frontend can't call backend API.
```

### Root Cause Analysis
```
Browser CORS policy:
  - Protects users from malicious scripts
  - Blocks cross-origin requests by default
  - Requires backend to explicitly allow origin

Initial CORS config:
  ALLOWED_ORIGINS = "http://localhost:5173"  # Old Vite port!

But frontend was on:
  http://localhost:3000  # Next.js port

Mismatch!
```

### 🔧 Solution Implemented
**Update CORS to allow frontend origin**

```python
# backend/.env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000

# backend/app/core/config.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,  # ["http://localhost:3000", ...]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### CORS Rules
```
Production checklist:
  ✅ Remove localhost entries
  ✅ Add your domain only
  ✅ Use https:// not http://
  ✅ Don't use wildcards (*)
  ✅ Specify exact origins

Example (secure):
  ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com

Don't do:
  ALLOWED_ORIGINS=*  (security risk!)
  ALLOWED_ORIGINS=http://*  (too permissive)
```

### 💡 Lesson Learned
```
CORS Configuration Rules:

1. Local Development:
   - Can be permissive
   - Include all local ports
   - http:// is OK for localhost

2. Production:
   - Be restrictive
   - Only your domain
   - Always use https://
   - Whitelist specific origins

3. Debugging CORS:
   - Check browser console (clear message)
   - Check backend ALLOWED_ORIGINS
   - Verify frontend URL matches exactly
   - Check for typos (important!)
```

---

## BLOCKER 8: Environment Variable Management

### ❌ Problem
```
Initial setup scattered:
  - API key in code comments
  - Environment variables unnamed
  - No documentation of required vars
  - Different vars in .env vs code

New team member asks:
  "What variables do I need to set?"
  Answer: "Good luck figuring it out from the code"
```

### Solution Implemented
**Create .env.example as documentation**

```bash
# .env.example (commit to git)
GROQ_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///./todos.db
ENVIRONMENT=development
AI_MODEL=mixtral-8x7b-32768
AI_MAX_TOKENS=1024

# .env (don't commit - private keys)
GROQ_API_KEY=gsk_jXVwC2GGwALjixRCFE4kWGdyb3FYr7r6...
```

### Best Practices

```yaml
Version Control:
  ✅ Commit: .env.example (template)
  ❌ Don't commit: .env (secret keys)
  ✅ Add to .gitignore: .env

.env.example Structure:
  - All required variables listed
  - Example values (not real secrets)
  - Comments explaining each var
  - Helps new developers setup
```

### 💡 Lesson Learned
```
ENVIRONMENT VARIABLE MANAGEMENT:

1. Use .env.example as documentation
2. Create .env from .env.example
3. Add .env to .gitignore
4. Document all variables needed
5. Use clear naming: FEATURE_SETTING

Examples:
  ✅ GROQ_API_KEY
  ✅ DATABASE_URL
  ✅ ALLOWED_ORIGINS

  ❌ API_KEY (too vague)
  ❌ KEY (what key?)
  ❌ SECRET (what secret?)
```

---

## BLOCKER 9: Groq API Incompatibility & Deprecated Model

### ❌ Problem
```
Chat endpoint was broken after Groq integration:
  "Failed to get response. Make sure the backend is running"

Console errors:
  - TypeError: Groq API doesn't have client.messages.stream()
  - 400 Error: "The model 'mixtral-8x7b-32768' has been decommissioned"
  - Port 8000 already in use, server failing to start
```

### Root Cause Analysis
```
Multiple issues found:

1. SDK Mismatch (Critical)
   ├─ Code was using Anthropic SDK pattern: client.messages.stream()
   ├─ But implemented with Groq SDK which doesn't have this method
   ├─ Groq uses OpenAI-compatible API: client.chat.completions.create()
   └─ Result: TypeError at runtime when chat endpoint called

2. Model Deprecation
   ├─ mixtral-8x7b-32768 was decommissioned by Groq
   ├─ API returns: "model has been decommissioned" error
   └─ No fallback to newer models

3. Port Binding
   ├─ Multiple Python processes left running
   ├─ Port 8000 already bound from previous session
   ├─ New server fails: "Address already in use"
   └─ Can't test the fix
```

### 🔧 Solution Implemented
**Complete Groq API rewrite + Model update + Port management**

```python
# BEFORE (Wrong - Anthropic SDK pattern)
with client.messages.stream(
    model=settings.ai_model,
    system=system,  # Wrong parameter for Groq
    messages=current_messages,
) as stream:
    # Anthropic-specific logic
    pass

# AFTER (Correct - Groq/OpenAI-compatible API)
stream = client.chat.completions.create(
    model=settings.ai_model,
    messages=[{"role": "system", "content": system}] + messages,
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        yield {"type": "text_delta", "data": {"delta": ...}}
```

### Key Changes Made

| File | Change | Impact |
|------|--------|--------|
| `backend/app/services/claude_service.py` | Rewrote stream_chat() to use Groq's actual API | ✅ Stream now works |
| `backend/.env` | `AI_MODEL=llama-3.3-70b-versatile` | ✅ Model no longer deprecated |
| `backend/app/core/config.py` | Updated default model | ✅ Fallback to new model |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:8001` | ✅ Port conflict resolved |
| `backend/app/api/chat.py` | Added debug logging | ✅ Can diagnose issues |

### Technical Details

**System Message Handling**
```python
# Groq doesn't accept system parameter
# Must add system as first message
chat_messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": "Hello"},
]
```

**SSE Event Streaming**
```python
# Yield proper SSE format for frontend parser
for chunk in stream:
    if chunk.choices[0].delta.content:
        yield {
            "type": "text_delta",
            "data": {"delta": chunk.choices[0].delta.content}
        }
yield {
    "type": "message_stop",
    "data": {"finish_reason": "end_turn"}
}
```

### Model Comparison: Groq Available Models

| Model | Size | Latency | Quality | Status |
|-------|------|---------|---------|--------|
| mixtral-8x7b-32768 | 8x7B | ~0.5-2s | Good | ❌ DEPRECATED |
| **llama-3.3-70b-versatile** | 70B | ~0.5-2s | **Excellent** | ✅ **CURRENT** |
| llama-3.1-70b-versatile | 70B | ~0.5-2s | Excellent | ✅ Available |
| gemma-2-9b-itm | 9B | ~0.3-1s | Good | ✅ Available |

### Testing Result
```
Before: Chat endpoint returns 0 events, connection closes
After:  Chat endpoint returns 16+ events with streaming response

Command:
  curl -X POST http://localhost:8001/chat/stream \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role": "user", "content": "Hi"}]}'

Response:
  data: {"type":"text_delta","data":{"delta":"Hello"}}
  data: {"type":"text_delta","data":{"delta":" there"}}
  ...
  data: {"type":"message_stop","data":{"finish_reason":"end_turn"}}
```

### 💡 Lesson Learned
```
SDK COMPATIBILITY CHECKLIST:

1. API Pattern Verification
   ❌ Don't assume SDK A works like SDK B
   ✅ Read actual SDK documentation
   ✅ Test basic streaming first
   ✅ Check method signatures carefully

2. Model Lifecycle
   ❌ Don't hardcode model names
   ✅ Version models (mixtral-8x7b-v1)
   ✅ Have fallbacks for deprecated models
   ✅ Monitor provider deprecation notices

3. Port Management
   ❌ Don't assume port is free
   ✅ Kill old processes before starting
   ✅ Check port availability first
   ✅ Use different ports for dev/test

4. Debugging Streaming
   ❌ Don't rely on error messages alone
   ✅ Add print statements in generators
   ✅ Check each event yielded
   ✅ Monitor both client and server logs

5. Test Each Component
   ✅ Test stream function directly (sync)
   ✅ Test endpoint response (HTTP)
   ✅ Test frontend integration (browser)
```

### Prevention for Future
```
✅ Always verify SDK compatibility before using
✅ Create wrapper functions for cloud APIs
✅ Use feature flags for model switching
✅ Document required API changes for new SDK versions
```

---

## BLOCKER 10: HTTP Method Mismatch

### ❌ Problem
```
Frontend error when trying to mark task as complete:
  "Failed to update task"

All task update/completion attempts failed silently.
```

### Root Cause Analysis
```
HTTP Method Inconsistency:

Frontend (lib/api.ts):
  └─ update() method: Used PUT request
  └─ complete() method: Used PUT request

Backend (app/api/todos.py):
  └─ @router.patch("/{todo_id}") expects PATCH
  └─ @router.patch("/{todo_id}/complete") expects PATCH

Result: Server rejected PUT requests with 405 Method Not Allowed
```

### 🔧 Solution Implemented
**Update frontend API client to use correct HTTP methods**

```typescript
// BEFORE (Wrong - PUT)
async update(id: string, todo: Partial<Todo>): Promise<Todo> {
  const response = await fetch(ENDPOINTS.todos.update(id), {
    method: "PUT",  // ❌ Wrong
    body: JSON.stringify(todo),
  });
}

// AFTER (Correct - PATCH)
async update(id: string, todo: Partial<Todo>): Promise<Todo> {
  const response = await fetch(ENDPOINTS.todos.update(id), {
    method: "PATCH",  // ✅ Correct
    body: JSON.stringify(todo),
  });
}
```

### HTTP Method Semantics

| Method | Purpose | Use Case |
|--------|---------|----------|
| **PUT** | Replace entire resource | `/todos/1` with full object |
| **PATCH** | Partial update | `/todos/1` with only changed fields |
| **POST** | Create new resource | `/todos` (creates new) |
| **GET** | Retrieve resource | `/todos/1` (read only) |
| **DELETE** | Remove resource | `/todos/1` (delete) |

### Why PATCH vs PUT?
```
Our API design:
  - Only sends changed fields
  - Doesn't require full object
  - Uses exclude_none=True
  └─ This is PATCH semantics, not PUT

Example:
  ✓ PATCH: {"status": "completed"}  (only changed field)
  ✗ PUT: {"status": "completed", "title": "...", ...}  (full object)
```

### 💡 Lesson Learned
```
REST API BEST PRACTICES:

1. Use Correct HTTP Methods:
   ✅ POST for creation (/todos)
   ✅ GET for retrieval (/todos/{id})
   ✅ PATCH for partial updates ({id} with partial data)
   ✅ PUT for full replacement ({id} with complete object)
   ✅ DELETE for removal ({id})

2. Be Consistent Between Layers:
   ❌ Frontend uses PUT, Backend expects PATCH = Error
   ✅ Frontend uses PATCH, Backend expects PATCH = Works

3. Document API Contract:
   ✅ Specify HTTP method in OpenAPI spec
   ✅ Include examples in documentation
   ✅ Test with actual methods used in code

4. Frontend-Backend Alignment:
   - Always match frontend API client with backend endpoints
   - Don't assume method names (PUT ≠ PATCH)
   - Test API calls with curl before assuming they work
```

### Prevention for Future
```
✅ Review OpenAPI spec for correct HTTP methods
✅ Test API endpoints with curl before implementing frontend
✅ Use IDE/Postman to verify HTTP methods match
✅ Document method changes in API changelog
```

---

## Summary: Key Learnings

### Pattern Recognition
```
Most blockers fell into categories:

1. TECHNICAL MISMATCHES
   - Schema mismatch (blocked by wrong assumptions)
   - Framework choice (React vs Next.js)
   - Solution: Always verify assumptions

2. EXTERNAL DEPENDENCIES
   - Ollama heavy (solved by switching)
   - Rust compilation (solved by skipping)
   - Solution: Evaluate alternatives early

3. CONFIGURATION
   - CORS misconfigured
   - Env vars scattered
   - Solution: Document everything upfront

4. DATA DESIGN
   - Hardcoded test data
   - No API contract
   - Solution: Define contract before coding
```

### Decision Framework Going Forward

```
BLOCKER → ANALYSIS → SOLUTION

When blocked:
1. What is the root cause?
   - Missing information?
   - Wrong tool choice?
   - Configuration issue?

2. What are the alternatives?
   - Switch tool?
   - Configure differently?
   - Accept limitation?

3. What's the cost/benefit?
   - Time to solve
   - Long-term maintenance
   - User impact

4. Document for next time!
```

---

**Last Updated:** 2026-02-23
**Total Blockers Documented:** 10
**All Resolved:** ✅ Yes

### Overall Summary of Blockers Resolved

| # | Blocker | Root Cause | Solution | Status |
|---|---------|-----------|----------|--------|
| 1 | Ollama Too Heavy | 4.4GB model, 30s latency | Switch to Groq API | ✅ |
| 2 | Poor UI Design | Custom theme not professional | Use v0.app + Radix | ✅ |
| 3 | Hardcoded Test Data | v0.app sample data persisting | Remove, use API | ✅ |
| 4 | Schema Mismatch | Frontend expected wrong fields | Fix Todo interface | ✅ |
| 5 | Backend Not Responding | Various causes (see checklist) | Systematic diagnosis | ✅ |
| 6 | Rust Compilation | psycopg2-binary on Windows | Remove for dev, add for prod | ✅ |
| 7 | CORS Blocked | Wrong port in ALLOWED_ORIGINS | Update to :3000 | ✅ |
| 8 | Env Vars Scattered | No documentation | Create .env.example | ✅ |
| 9 | Chat Not Working | Groq API mismatch + deprecated model | Rewrite streaming, update model | ✅ |
| 10 | Task Update Failed | Frontend PUT vs Backend PATCH | Change API client to PATCH | ✅ |
