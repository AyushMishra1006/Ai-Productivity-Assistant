# Architecture & Tech Stack - Complete Guide

**Purpose:** Understand the complete system design, technology choices, data flow, and alternatives.

---

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Tech Stack Breakdown](#tech-stack-breakdown)
3. [Technology Choices & Alternatives](#technology-choices--alternatives)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Database Schema](#database-schema)
6. [API Contract](#api-contract)
7. [Deployment Architecture](#deployment-architecture)
8. [Scalability & Future Growth](#scalability--future-growth)

---

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       USER BROWSER                          │
│              (http://localhost:3000)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP REST API + SSE
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
┌───────▼──────────────────┐        ┌────────────▼─────────┐
│   FRONTEND LAYER         │        │  BACKEND LAYER       │
│   (Next.js 16.1.6)       │        │  (FastAPI)           │
│                          │        │                      │
│ ┌──────────────────────┐ │        │ ┌──────────────────┐ │
│ │ React Components     │ │        │ │ API Routes       │ │
│ │ ├─ TaskPanel         │ │        │ ├─ /todos         │ │
│ │ ├─ ChatPanel         │ │        │ ├─ /chat/stream   │ │
│ │ └─ Other components  │ │        │ └─ /health       │ │
│ └──────────────────────┘ │        │ └──────────────────┘ │
│ ┌──────────────────────┐ │        │ ┌──────────────────┐ │
│ │ State Management     │ │        │ │ Business Logic   │ │
│ │ (React Hooks)        │ │        │ ├─ TodoService    │ │
│ └──────────────────────┘ │        │ ├─ ChatService    │ │
│ ┌──────────────────────┐ │        │ └─ AIService      │ │
│ │ API Client           │ │        │ └──────────────────┘ │
│ │ (lib/api.ts)         │ │        │ ┌──────────────────┐ │
│ └──────────────────────┘ │        │ │ Database Access  │ │
└────────────┬─────────────┘        │ │ (SQLAlchemy)     │ │
             │                       │ └──────────────────┘ │
             │                       └────────────┬─────────┘
             │                                    │
        (REST API calls)              (SQL queries)
             │                                    │
             │    ┌───────────────────────────────┘
             │    │
             │    ├─────────┐
             │    │         │
             ▼    ▼         ▼
        ┌─────────────────────────────┐
        │   DATA PERSISTENCE LAYER    │
        ├─────────────────────────────┤
        │ ┌───────────────────────┐   │
        │ │  SQLite (Local Dev)   │   │
        │ │  todos.db             │   │
        │ └───────────────────────┘   │
        │ ┌───────────────────────┐   │
        │ │  PostgreSQL (Prod)    │   │
        │ │  Railway Database     │   │
        │ └───────────────────────┘   │
        └─────────────────────────────┘

        ┌─────────────────────────────┐
        │    AI SERVICE (Groq API)    │
        │  Cloud-based LLM Provider   │
        └─────────────────────────────┘
```

### Component Responsibilities

```
FRONTEND (Next.js)
├─ Rendering UI (React components)
├─ User interactions
├─ State management (form data, loading states)
├─ API calls to backend
└─ Real-time updates (SSE for chat)

BACKEND (FastAPI)
├─ HTTP API (REST endpoints)
├─ Business logic (create/update/delete todos)
├─ Authentication/Authorization (future)
├─ Database queries (SQLAlchemy ORM)
├─ AI integration (Groq API calls)
├─ Validation (Pydantic schemas)
└─ Error handling

DATABASE (SQLite/PostgreSQL)
├─ Persistent storage
├─ ACID compliance
├─ Query optimization
└─ Backup & recovery

AI SERVICE (Groq)
├─ Chat inference
├─ Tool execution
└─ Streaming responses
```

---

## Tech Stack Breakdown

### Frontend Stack

```
Next.js 16.1.6
│
├─ React 19.2.4
│  └─ Component framework
│     └─ Hooks for state management
│        └─ useEffect, useState, useCallback
│
├─ TypeScript 5.7.3
│  └─ Type safety at compile time
│     └─ Prevents: undefined properties, type mismatches
│        └─ Better DX: autocomplete, refactoring
│
├─ Tailwind CSS 4.2.0
│  └─ Utility-first CSS framework
│     └─ Pre-built classes (flex, p-4, text-red-600)
│        └─ No CSS file maintenance
│
├─ Radix UI
│  └─ Headless component library
│     └─ Accessible primitives (Dialog, Popover, etc.)
│        └─ Unstyled (style with Tailwind)
│
├─ Lucide React
│  └─ Icon library
│     └─ SVG icons as React components
│
├─ lib/api.ts
│  └─ Custom API client
│     └─ Type-safe fetch wrapper
│        └─ Handles: authentication, errors, streaming
│
└─ .env.local
   └─ Environment variables (NEXT_PUBLIC_API_URL)
```

### Backend Stack

```
FastAPI 0.115.0
│
├─ Python 3.9+
│  └─ Programming language
│
├─ Uvicorn 0.30.6
│  └─ ASGI server (async HTTP server)
│     └─ Handles: concurrent requests, WebSocket
│
├─ SQLAlchemy 2.0.35
│  └─ ORM (Object-Relational Mapping)
│     └─ Python objects ↔ Database tables
│        └─ Benefits: type safety, migration, relationships
│
├─ Pydantic 2.10.6
│  └─ Data validation library
│     └─ Validates request/response data
│        └─ Auto-generates OpenAPI docs
│
├─ Groq Python SDK
│  └─ Client library for Groq API
│     └─ Makes: /chat/completions API calls
│        └─ Handles: streaming, errors
│
├─ python-dotenv 1.0.1
│  └─ Loads .env variables into Python
│     └─ Keeps secrets out of code
│
└─ app/ directory
   ├─ api/ - Route handlers
   ├─ models/ - SQLAlchemy ORM models
   ├─ schemas/ - Pydantic validation schemas
   ├─ services/ - Business logic
   ├─ core/ - Config, database, etc.
   └─ tools/ - Tool definitions for AI
```

### Database Stack

```
SQLite 3 (Development)
│
├─ File-based database
├─ No server needed
├─ Perfect for local development
├─ Limitations:
│  ├─ Single writer
│  ├─ No concurrent updates
│  └─ Limited to single machine
│
└─ Usage:
   ├─ Local testing
   ├─ Schema development
   └─ Feature implementation

PostgreSQL 13+ (Production)
│
├─ Full-featured relational database
├─ Concurrent multi-user support
├─ ACID transactions
├─ Advanced features (JSON, arrays, etc.)
├─ Excellent performance at scale
│
└─ Usage:
   ├─ Production data
   ├─ Multiple users
   └─ Backup/recovery
```

### AI/LLM Stack

```
Groq API
│
├─ Cloud-based LLM provider
├─ Models available:
│  ├─ llama-3.3-70b-versatile (current, recommended)
│  ├─ llama-3.1-70b-versatile (alternative)
│  ├─ gemma-2-9b-it (lightweight option)
│  └─ Note: mixtral-8x7b-32768 is deprecated
│
├─ Features:
│  ├─ Fast inference (0.5-2 seconds)
│  ├─ Streaming support (OpenAI-compatible API)
│  ├─ OpenAI SDK compatibility
│  └─ Free tier available
│
├─ API Pattern:
│  ├─ Uses OpenAI-compatible API (NOT Anthropic)
│  ├─ Method: client.chat.completions.create(stream=True)
│  ├─ System message: First message in list (role="system")
│  └─ SSE streaming: Yields chunked responses
│
└─ Integration:
   ├─ Python SDK (groq 0.4.1)
   ├─ API Key: GROQ_API_KEY
   ├─ Endpoint: https://api.groq.com/openai/v1/chat/completions
   └─ Streaming: Uses standard Server-Sent Events (SSE)
```

---

## Technology Choices & Alternatives

### Frontend Framework: Next.js vs Alternatives

#### ✅ Next.js 16.1.6 (CHOSEN)

```
Pros:
  ✅ Server-side rendering (SSR) ready
  ✅ File-based routing (simple)
  ✅ Built-in optimization
  ✅ Vercel deployment (free)
  ✅ TypeScript first-class support
  ✅ API routes built-in
  ✅ Image optimization
  ✅ CSS module support

Cons:
  ❌ Larger bundle size than pure React
  ❌ Learning curve for SSR concepts
  ❌ More setup than Vite
  ❌ Opinionated structure

Use when:
  ✅ Building full-stack apps
  ✅ Need SEO (Server-Side Rendering)
  ✅ Want rapid development
  ✅ Deploying to Vercel
```

#### ❌ React + Vite (REJECTED)

```
Pros:
  ✅ Lightweight
  ✅ Super fast dev server
  ✅ Smaller bundle
  ✅ Simple setup

Cons:
  ❌ No built-in backend
  ❌ No SSR out of box
  ❌ CSR only (client-side rendering)
  ❌ Manual optimization needed
  ❌ Deployment more complex
  ❌ v0.app generates Next.js, not Vite

Why rejected:
  - Project needed quick deployment
  - v0.app outputs Next.js
  - SSR benefits worth it
```

#### ❌ Vue 3 / Nuxt (NOT CONSIDERED)

```
Pros:
  ✅ Similar to Next.js
  ✅ Great DX

Cons:
  ❌ Smaller ecosystem
  ❌ Fewer integrations
  ❌ Less community support
  ❌ v0.app doesn't generate Vue
```

### Backend Framework: FastAPI vs Alternatives

#### ✅ FastAPI (CHOSEN)

```
Pros:
  ✅ Async support (handles concurrent requests)
  ✅ Automatic API documentation (Swagger)
  ✅ Built-in validation (Pydantic)
  ✅ Type hints for everything
  ✅ Modern Python (async/await)
  ✅ Very fast (near-C speed with uvicorn)
  ✅ Easy WebSocket support
  ✅ Streaming responses (SSE)
  ✅ Minimal boilerplate

Cons:
  ❌ Newer framework (might have edge cases)
  ❌ Smaller ecosystem than Django
  ❌ Less frameworks around it

Use when:
  ✅ Building APIs (not web apps)
  ✅ Need async/high concurrency
  ✅ Want rapid API development
  ✅ Need type safety
```

#### ❌ Django (REJECTED)

```
Pros:
  ✅ Batteries included
  ✅ Huge ecosystem
  ✅ Battle-tested
  ✅ Great ORM (Django ORM)

Cons:
  ❌ Synchronous by default
  ❌ Slower than FastAPI
  ❌ Heavier (all batteries included)
  ❌ More boilerplate
  ❌ Overkill for API-only

Why rejected:
  - We need async (not Django's strong suit)
  - We need speed
  - Django bloat unnecessary
```

#### ❌ Flask (NOT CHOSEN)

```
Pros:
  ✅ Lightweight
  ✅ Flexible

Cons:
  ❌ Manual setup (no batteries)
  ❌ Less validation
  ❌ More boilerplate
  ❌ Slower development

Why rejected:
  - FastAPI better for same use case
  - FastAPI has built-in validation
  - FastAPI faster to develop
```

### AI Provider: Groq vs Alternatives

#### ✅ Groq API (CHOSEN)

```
Pros:
  ✅ Extremely fast (0.5-2 seconds)
  ✅ Free tier available
  ✅ Good quality models
  ✅ Simple API
  ✅ Streaming support
  ✅ Tool/function calling
  ✅ No infrastructure needed

Cons:
  ❌ Data sent to cloud (no privacy)
  ❌ Depends on Groq availability
  ❌ Rate limited on free tier

Use when:
  ✅ Speed is priority
  ✅ Privacy not critical
  ✅ Want easy deployment
  ✅ Need free tier
```

#### ❌ Ollama (REJECTED)

```
Pros:
  ✅ Complete privacy (local)
  ✅ No API calls
  ✅ Offline capable
  ✅ No costs

Cons:
  ❌ 4.4GB model download
  ❌ 10-30 second response time
  ❌ User setup complexity
  ❌ Slow inference
  ❌ Resource intensive

Why rejected:
  - Speed critical for user experience
  - Setup too complex
  - Model too heavy
```

#### ❌ OpenAI API (ALTERNATIVE)

```
Pros:
  ✅ Best quality models (GPT-4)
  ✅ Most capable

Cons:
  ❌ Expensive ($0.03-0.06 per 1K tokens)
  ❌ No free tier
  ❌ Needs paid account
  ❌ Rate limits

Why rejected:
  - Cost prohibitive
  - Groq is good enough
  - Free tier available
```

#### ❌ Claude API (ALTERNATIVE)

```
Pros:
  ✅ Great quality
  ✅ Powerful models

Cons:
  ❌ Expensive
  ❌ No free tier
  ❌ User has no API key

Why rejected:
  - Same cost issues as OpenAI
```

### Database: SQLite vs PostgreSQL

#### ✅ SQLite (LOCAL DEVELOPMENT)

```
Pros:
  ✅ Zero setup
  ✅ File-based (todos.db)
  ✅ No server needed
  ✅ Fast for single user
  ✅ Built into Python
  ✅ Perfect for testing

Cons:
  ❌ Single writer only
  ❌ Poor concurrency
  ❌ No multi-server support
  ❌ Not suitable for production

Use when:
  ✅ Local development
  ✅ Testing
  ✅ Single user
  ✅ Simple prototypes
```

#### ✅ PostgreSQL (PRODUCTION)

```
Pros:
  ✅ Multi-user concurrency
  ✅ ACID transactions
  ✅ Advanced features
  ✅ Scalable
  ✅ Excellent performance
  ✅ Great tools

Cons:
  ❌ Requires server setup
  ❌ More complex
  ❌ More expensive (hosting)

Use when:
  ✅ Production app
  ✅ Multiple users
  ✅ Data integrity critical
  ✅ Scale needed

Migration Path:
  Development: SQLite
  ↓
  Testing: PostgreSQL locally
  ↓
  Production: PostgreSQL (Railway)
```

#### ❌ MongoDB (REJECTED)

```
Pros:
  ✅ Flexible schema

Cons:
  ❌ No transactions
  ❌ Eventual consistency
  ❌ Not suitable for structured data

Why rejected:
  - Our data is structured (todos)
  - Don't need schema flexibility
  - SQL databases better fit
```

---

## Data Flow Architecture

### User Creates a Todo - Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                               │
│    User clicks "Add Task" button, fills form, hits "Create"  │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 2. FRONTEND VALIDATION                                       │
│    React component validates input                           │
│    └─ Title required?                                        │
│    └─ Priority valid?                                        │
│    └─ Sets isSubmitting = true                               │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 3. API CALL                                                  │
│    lib/api.ts → todoAPI.create()                            │
│    ┌──────────────────────────────────────────┐             │
│    │ POST /todos                              │             │
│    │ Content-Type: application/json           │             │
│    │ Body: {                                  │             │
│    │   "title": "Learn TypeScript",           │             │
│    │   "priority": "high"                     │             │
│    │ }                                        │             │
│    └──────────────────────────────────────────┘             │
└──────────────┬───────────────────────────────────────────────┘
               │ HTTP Request (JSON)
               │ http://localhost:8000
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 4. BACKEND RECEIVES REQUEST                                  │
│    FastAPI app receives POST /todos                          │
│    Pydantic validates request body                           │
│    └─ Converts JSON → TodoCreate schema                      │
│    └─ Type checks all fields                                 │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 5. BUSINESS LOGIC                                            │
│    TodoService.create_todo()                                 │
│    ├─ Create Todo ORM object                                 │
│    ├─ Set fields:                                            │
│    │  ├─ title: "Learn TypeScript"                           │
│    │  ├─ priority: "high"                                    │
│    │  ├─ status: "pending"                                   │
│    │  ├─ created_at: now()                                   │
│    │  └─ updated_at: now()                                   │
│    └─ Log operation                                          │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 6. DATABASE INTERACTION                                      │
│    SQLAlchemy ORM                                            │
│    ┌──────────────────────────────────────────┐             │
│    │ INSERT INTO todos                        │             │
│    │ (title, priority, status, created_at)   │             │
│    │ VALUES                                   │             │
│    │ ('Learn TypeScript', 'high', 'pending',  │             │
│    │  '2026-02-23 12:00:00')                  │             │
│    └──────────────────────────────────────────┘             │
│    Database returns: id = 42                                 │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 7. RESPONSE PREPARATION                                      │
│    Create response object:                                   │
│    {                                                         │
│      "id": 42,                                               │
│      "title": "Learn TypeScript",                            │
│      "priority": "high",                                     │
│      "status": "pending",                                    │
│      "created_at": "2026-02-23T12:00:00",                   │
│      "updated_at": "2026-02-23T12:00:00"                    │
│    }                                                         │
│    Return HTTP 201 (Created)                                 │
└──────────────┬───────────────────────────────────────────────┘
               │ HTTP Response (JSON)
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 8. FRONTEND RECEIVES RESPONSE                                │
│    lib/api.ts parses response                                │
│    Sets isSubmitting = false                                 │
│    Clears form fields                                        │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 9. UI UPDATE                                                 │
│    Calls loadTodos() to refresh list                         │
│    ├─ GET /todos (fetch all)                                │
│    └─ Updates React state                                    │
│    Component re-renders                                      │
│    New task appears in list                                  │
└──────────────────────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 10. USER SEES RESULT                                         │
│     New todo "Learn TypeScript" appears in task list         │
│     ✅ Operation complete                                    │
└──────────────────────────────────────────────────────────────┘
```

### User Chats with AI - Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER SENDS MESSAGE                                        │
│    User types "Create a task to read docs"                   │
│    Clicks send button                                        │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 2. FRONTEND PREPARATION                                      │
│    ChatPanel component:                                      │
│    ├─ Add message to local state                             │
│    ├─ Fetch current todos (context)                          │
│    ├─ Set isLoading = true                                   │
│    └─ Prepare conversation history                           │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 3. API CALL - STREAMING                                      │
│    POST /chat/stream                                         │
│    Content-Type: application/json                            │
│    Body: {                                                   │
│      "messages": [                                           │
│        {                                                     │
│          "role": "user",                                     │
│          "content": "Create a task to read docs"             │
│        }                                                     │
│      ],                                                      │
│      "context": {                                            │
│        "todos": [                                            │
│          { id: 1, title: "...", ... },                       │
│          { id: 2, title: "...", ... }                        │
│        ]                                                     │
│      }                                                       │
│    }                                                         │
│    Response type: Server-Sent Events (SSE)                   │
└──────────────┬───────────────────────────────────────────────┘
               │ HTTP POST with SSE streaming
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 4. BACKEND RECEIVES REQUEST                                  │
│    FastAPI /chat/stream endpoint                             │
│    Validates request with Pydantic                           │
│    Extracts: messages, context (todos)                       │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 5. AI SERVICE CALL                                           │
│    ChatService.stream_chat()                                 │
│    Calls Groq API:                                           │
│    ├─ Model: mixtral-8x7b-32768                             │
│    ├─ System prompt: (instructions for AI)                   │
│    ├─ Messages: (user + history)                             │
│    ├─ Tools: (can create/delete todos)                       │
│    └─ max_tokens: 1024                                       │
│                                                              │
│    Groq processes and STREAMS response:                      │
│    Event 1: "text_delta" {"delta": "Sure,"}                 │
│    Event 2: "text_delta" {"delta": " I'll"}                 │
│    Event 3: "text_delta" {"delta": " create"}               │
│    ...                                                       │
│    Event N: "text_delta" {"delta": "task."}                 │
│    Final: "tool_call" {tool: "add_todo", input: {...}}      │
└──────────────┬───────────────────────────────────────────────┘
               │ SSE Stream (chunked events)
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 6. FRONTEND RECEIVES STREAM                                  │
│    SSE reader in ChatPanel:                                  │
│    for await (event of chatAPI.stream(...))                  │
│    ├─ Receive text_delta                                     │
│    ├─ Append to message content                              │
│    ├─ Re-render (show partial response)                      │
│    └─ Scroll to bottom                                       │
│                                                              │
│    Example on screen:                                        │
│    "I'll create that task for you..."                        │
│    "I'll create that task for you. Let..."                   │
│    "I'll create that task for you. Let me..."                │
│    (Updates in real-time as events arrive)                   │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 7. AI EXECUTES TOOL                                          │
│    If AI wants to create todo:                               │
│    Event: "tool_call"                                        │
│    {                                                         │
│      "tool_name": "add_todo",                                │
│      "input": {                                              │
│        "title": "Read documentation",                        │
│        "priority": "medium"                                  │
│      }                                                       │
│    }                                                         │
│                                                              │
│    Backend executes: TodoService.create_todo(...)            │
│    Database updated → new todo created                       │
│                                                              │
│    Event: "tool_result"                                      │
│    {                                                         │
│      "tool_name": "add_todo",                                │
│      "result": {"id": 43, "title": "...", ...},              │
│      "refresh_todos": true                                   │
│    }                                                         │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 8. FRONTEND UPDATES                                          │
│    Receives tool_result event                                │
│    If refresh_todos = true:                                  │
│    ├─ Call loadTodos() (reload task list)                    │
│    ├─ Update UI                                              │
│    └─ Show "Task created!" confirmation                      │
│                                                              │
│    Stream completes:                                         │
│    isLoading = false                                         │
│    Chat shows full AI response + created task                │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│ 9. USER SEES RESULT                                          │
│    Chat panel:                                               │
│    "I'll create that task for you. Let me add it..."         │
│                                                              │
│    Task panel:                                               │
│    New todo "Read documentation" appears in list!            │
│    ✅ AI successfully created a real task                    │
└──────────────────────────────────────────────────────────────┘
```

### Data Model Relationships

```
┌─────────────────────────────────────────┐
│           TODOS TABLE                   │
├─────────────────────────────────────────┤
│ id          (Primary Key, auto-inc)     │
│ title       (String, required)          │
│ priority    (String: high/med/low)      │
│ status      (String: pending/completed) │
│ due_date    (String, optional)          │
│ created_at  (DateTime, auto)            │
│ updated_at  (DateTime, auto)            │
└─────────────────────────────────────────┘

No foreign keys currently (single-tenant)
Future: Add user_id for multi-tenant
├─ user_id (FK to USERS table)
└─ Created_by_user_id (FK to USERS table)
```

---

## Database Schema

### SQLite Schema (Development)

```sql
-- Created automatically by SQLAlchemy
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR NOT NULL,
    priority VARCHAR NOT NULL DEFAULT 'medium',
    status VARCHAR NOT NULL DEFAULT 'pending',
    due_date VARCHAR,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CHECK (priority IN ('high', 'medium', 'low')),
    CHECK (status IN ('pending', 'completed'))
);

-- Indexes for performance
CREATE INDEX idx_status ON todos(status);
CREATE INDEX idx_created_at ON todos(created_at);
```

### PostgreSQL Schema (Production)

```sql
-- Same as SQLite but with PostgreSQL features
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_priority CHECK (priority IN ('high', 'medium', 'low')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed'))
);

-- Indexes
CREATE INDEX idx_status ON todos(status);
CREATE INDEX idx_created_at ON todos(created_at DESC);
```

### Future: Multi-Tenant Schema

```sql
-- When we add user authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_priority CHECK (priority IN ('high', 'medium', 'low')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed')),
    CONSTRAINT valid_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_user_id ON todos(user_id);
CREATE INDEX idx_user_status ON todos(user_id, status);
```

---

## API Contract

### OpenAPI Specification (Swagger)

```yaml
openapi: 3.0.0
info:
  title: AI Productivity Assistant API
  version: 1.0.0

servers:
  - url: http://localhost:8001
    description: Development (Backend runs on port 8001)
  - url: https://api.your-app.railway.app
    description: Production

paths:
  /health:
    get:
      summary: Health check
      responses:
        200:
          description: API is running
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: "ok"

  /todos:
    get:
      summary: List all todos
      responses:
        200:
          description: List of todos
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Todo'

    post:
      summary: Create a new todo
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TodoCreate'
      responses:
        201:
          description: Todo created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Todo'
        422:
          description: Validation error

  /todos/{id}:
    patch:
      summary: Partially update a todo (status, priority, due_date)
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TodoUpdate'
            examples:
              update_status:
                value: {"status": "completed"}
              update_priority:
                value: {"priority": "high"}
      responses:
        200:
          description: Todo updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Todo'

    delete:
      summary: Delete a todo
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        204:
          description: Todo deleted

  /chat/stream:
    post:
      summary: Stream chat response with AI (Server-Sent Events)
      description: |
        Streams chat completion from Groq LLM using Server-Sent Events (SSE).
        Client receives text tokens as they're generated in real-time.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                messages:
                  type: array
                  description: Conversation history including user's latest message
                  items:
                    type: object
                    properties:
                      role:
                        type: string
                        enum: [user, assistant]
                      content:
                        type: string
                context:
                  type: object
                  description: Additional context (todos, timestamps, etc)
                  properties:
                    todos:
                      type: array
                      items:
                        $ref: '#/components/schemas/Todo'
                    timestamp:
                      type: string
                      format: date-time
      responses:
        200:
          description: Streaming response via Server-Sent Events
          content:
            text/event-stream:
              schema:
                type: string
              examples:
                text_delta: |
                  data: {"type":"text_delta","data":{"delta":"Hello"}}
                  data: {"type":"text_delta","data":{"delta":" there"}}
                message_stop: |
                  data: {"type":"message_stop","data":{"finish_reason":"end_turn"}}
                error: |
                  data: {"type":"error","data":{"error":"API error message"}}

components:
  schemas:
    Todo:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        priority:
          type: string
          enum: [high, medium, low]
        status:
          type: string
          enum: [pending, completed]
        due_date:
          type: string
          format: date
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required:
        - id
        - title
        - priority
        - status
        - created_at
        - updated_at

    TodoCreate:
      type: object
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 255
        priority:
          type: string
          enum: [high, medium, low]
          default: medium
        due_date:
          type: string
          format: date
          nullable: true
      required:
        - title

    TodoUpdate:
      type: object
      properties:
        title:
          type: string
        priority:
          type: string
          enum: [high, medium, low]
        status:
          type: string
          enum: [pending, completed]
        due_date:
          type: string
          format: date
          nullable: true
```

### Request/Response Examples

```javascript
// CREATE TODO
POST /todos
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "priority": "high",
  "due_date": "2026-03-01"
}

Response: 201 Created
{
  "id": 42,
  "title": "Learn TypeScript",
  "priority": "high",
  "status": "pending",
  "due_date": "2026-03-01",
  "created_at": "2026-02-23T12:00:00",
  "updated_at": "2026-02-23T12:00:00"
}

// UPDATE TODO STATUS
PATCH /todos/42
Content-Type: application/json

{
  "status": "completed"
}

Response: 200 OK
{
  "id": 42,
  "title": "Learn TypeScript",
  "priority": "high",
  "status": "completed",  // Changed!
  "due_date": "2026-03-01",
  "created_at": "2026-02-23T12:00:00",
  "updated_at": "2026-02-23T12:10:00"  // Updated!
}

// DELETE TODO
DELETE /todos/42

Response: 204 No Content
(no body)
```

### HTTP Methods Reference

| Method | Purpose | Endpoint | Use Case |
|--------|---------|----------|----------|
| **GET** | Retrieve resource | `/todos` or `/todos/{id}` | Get todos list or single todo |
| **POST** | Create new resource | `/todos` | Create a new todo |
| **PATCH** | Partial update | `/todos/{id}` | Update status/priority/due_date |
| **DELETE** | Remove resource | `/todos/{id}` | Delete a todo |

### Key Points
```
✅ Use PATCH for partial updates (only send changed fields)
✅ Use POST only for creation
✅ Use DELETE for removal
❌ Don't use PUT unless replacing entire resource
```

---

## Deployment Architecture

### Local Development

```
Developer Machine
├─ Frontend: npm run dev (port 3000)
├─ Backend: python -m uvicorn app.main:app (port 8001)
└─ Database: SQLite (todos.db)

Execution:
  Browser (localhost:3000)
    ↓ REST API calls
  Backend (localhost:8001)
    ↓ SQL queries
  SQLite (todos.db)
```

### Production Deployment

```
User's Browser
  ↓ HTTPS

Vercel CDN
├─ Deploys: Frontend (Next.js)
├─ Auto SSL
├─ Global CDN
└─ Automatic scaling
  ↓ HTTPS API calls

Railway
├─ Deploys: Backend (FastAPI)
├─ PostgreSQL database
├─ Auto scaling
├─ Monitoring
└─ Backups
  ↓ API calls

Groq API (Cloud)
└─ AI inference
```

### Environment Variables

**Production:**
```env
# Vercel (Frontend)
NEXT_PUBLIC_API_URL=https://api.your-app.railway.app

# Railway (Backend)
DATABASE_URL=postgresql://user:pass@host:5432/db
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=https://your-app.vercel.app
ENVIRONMENT=production
```

---

## Scalability & Future Growth

### Current Bottlenecks

```
Bottleneck 1: Database
  Current: SQLite (single writer)
  Limit: ~100 concurrent users
  Solution: PostgreSQL (already planned)

Bottleneck 2: Backend instances
  Current: Single Uvicorn process
  Limit: ~500 concurrent requests
  Solution: Multiple instances + load balancer

Bottleneck 3: AI inference
  Current: Groq API (shared)
  Limit: Free tier ~30 req/min
  Solution: Paid Groq tier or queue requests

Bottleneck 4: Frontend build
  Current: Next.js default
  Limit: Not a bottleneck (CDN serves)
  Solution: ISR (Incremental Static Regeneration)
```

### Scaling Strategy

```
Phase 1 (Current - 1K users):
  ✅ One backend instance
  ✅ SQLite → PostgreSQL
  ✅ Groq free tier

Phase 2 (10K users):
  ├─ Multiple backend instances
  ├─ Load balancer (Nginx)
  ├─ PostgreSQL read replicas
  └─ Groq paid tier

Phase 3 (100K users):
  ├─ Kubernetes orchestration
  ├─ Redis caching layer
  ├─ Separate search service
  └─ Multi-region deployment

Phase 4 (1M+ users):
  ├─ Microservices architecture
  ├─ Event streaming (Kafka)
  ├─ Dedicated LLM inference
  └─ Global CDN + edge computing
```

### Future Features (Architecture Ready)

```
1. User Authentication
   └─ Add users table
   └─ JWT tokens
   └─ Multi-tenant data isolation

2. Collaboration
   └─ Shared tasks
   └─ Comments/reactions
   └─ Real-time sync (WebSocket)

3. Analytics
   └─ Completion rates
   └─ Productivity metrics
   └─ Charts/dashboards

4. Mobile App
   └─ React Native
   └─ Same API endpoints
   └─ Offline-first sync

5. Integrations
   └─ GitHub issues
   └─ Slack notifications
   └─ Google Calendar
```

---

**Last Updated:** 2026-02-23
**Version:** 1.0
**Status:** Complete and tested ✅
