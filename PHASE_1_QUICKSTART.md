# PHASE 1: Local Testing & Integration Guide

## ✅ What's Been Completed

### Backend Updates
- ✅ Replaced Ollama with Groq API (cloud-based, much faster)
- ✅ Added environment configuration management
- ✅ Updated database config for both SQLite (local) and PostgreSQL (production)
- ✅ Updated requirements.txt with Groq and PostgreSQL packages
- ✅ Created .env configuration files

### Frontend Updates
- ✅ Copied v0.app Next.js frontend (modern, professional UI)
- ✅ Created API client (lib/api.ts) for backend communication
- ✅ Set up environment configuration
- ✅ Installed all dependencies

---

## 🚀 How to Run Locally

### Step 1: Get a Free Groq API Key (2 minutes)

1. Go to https://console.groq.com/
2. Sign up (free account)
3. Click "API Keys" → Create new key
4. Copy the API key

### Step 2: Configure Backend

```bash
cd backend

# Update .env file with your Groq API key
# Open backend/.env and replace the GROQ_API_KEY value
# GROQ_API_KEY=paste_your_key_here
```

### Step 3: Start Backend

```bash
cd backend

# Activate virtual environment (if not already active)
# On Windows:
venv\Scripts\activate

# Start the server
python -m uvicorn app.main:app --reload

# You should see:
# INFO:     Application startup complete
# Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Start Frontend (in a new terminal)

```bash
cd frontend

# Start development server
npm run dev

# You should see:
# ▲ Next.js 16.1.6
# ✓ Ready in 2.5s
# ➜ Local: http://localhost:3000
```

### Step 5: Test the App

1. Open http://localhost:3000 in your browser
2. You should see the AI Productivity Assistant dashboard
3. Try:
   - **Creating a todo**: Click "Create Task" button
   - **Chatting with AI**: Type a message in the chat
   - **AI suggestions**: Ask "What should I work on?"

---

## 📋 Testing Checklist

**Backend Health:**
- [ ] Visit http://localhost:8000/docs (Swagger UI should show all endpoints)
- [ ] Health check: GET http://localhost:8000/health

**Frontend:**
- [ ] Frontend loads at http://localhost:3000
- [ ] No console errors (check DevTools)
- [ ] Can create a todo and see it appear

**Integration:**
- [ ] Create a todo from frontend
- [ ] Check backend logs (should see POST /todos request)
- [ ] Chat with AI and get response
- [ ] AI should be able to create/complete todos via tools

---

## 🐛 Common Issues & Fixes

### Issue: "GROQ_API_KEY environment variable is not set"
**Solution:**
- Make sure backend/.env has GROQ_API_KEY set
- Restart the backend server after updating .env

### Issue: Frontend can't reach backend (CORS error)
**Solution:**
- Make sure backend is running on http://localhost:8000
- Check frontend/.env.local has NEXT_PUBLIC_API_URL=http://localhost:8000
- Reload frontend page (hard refresh with Ctrl+Shift+R)

### Issue: Chat is very slow
**Solution:**
- Groq sometimes has queues; response time is usually 0.5-2 seconds
- Check Groq console (console.groq.com) to see usage
- Try again; queues clear quickly

### Issue: Todo creation fails silently
**Solution:**
- Open browser DevTools (F12)
- Go to Network tab
- Look for the failed POST request
- Click it and see the error response
- Share the error message for debugging

---

## 📁 Project Structure (After Phase 1)

```
ai-productivity-assistant/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat.py          # Chat endpoints
│   │   │   └── todos.py         # Todo CRUD endpoints
│   │   ├── core/
│   │   │   ├── config.py        # ✨ Updated with Groq config
│   │   │   ├── database.py      # DB setup (SQLite + PostgreSQL)
│   │   │   └── __init__.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── claude_service.py # ✨ Now uses Groq API
│   │   │   └── todo_service.py
│   │   ├── tools/
│   │   └── main.py              # FastAPI app
│   ├── .env                     # ✨ Add Groq API key here
│   ├── .env.example            # Template
│   ├── requirements.txt         # ✨ Updated with groq, psycopg2
│   └── venv/
│
├── frontend/
│   ├── app/                     # Next.js app directory
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/              # ✨ v0.app components
│   │   ├── chat-panel.tsx
│   │   ├── task-panel.tsx
│   │   ├── dashboard-header.tsx
│   │   └── ticker-footer.tsx
│   ├── lib/
│   │   └── api.ts              # ✨ New API client
│   ├── styles/
│   ├── .env.local              # ✨ Backend URL
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔍 What's Different from Original Setup

| Aspect | Before | Now |
|--------|--------|-----|
| **Frontend** | React/Vite | Next.js 16 (v0.app) |
| **AI Model** | Ollama (local, 4.4GB) | Groq API (cloud, instant) |
| **Frontend UI** | Custom dark theme | Professional Radix UI |
| **API Client** | Zustand + custom hooks | Typed API client (lib/api.ts) |
| **Database** | SQLite only | SQLite (local) + PostgreSQL (prod) |

---

## ✨ What's Ready for Next Phase

After successful local testing, we'll add:

**Phase 2:**
- Error handling & validation
- Structured logging
- Better error messages

**Phase 3:**
- JWT authentication
- Rate limiting
- Security hardening

**Phase 4:**
- Unit & integration tests
- Performance optimization
- Bug fixes

**Phase 5:**
- Docker setup
- Database migrations
- Production documentation

**Phase 6:**
- Deploy to Railway (backend)
- Deploy to Vercel (frontend)
- Production monitoring

---

## 🎯 Next Steps

1. **Get Groq API key** from https://console.groq.com/
2. **Add it to backend/.env**
3. **Start both servers** (backend + frontend)
4. **Test the checklist above**
5. **Report any bugs** - we'll fix them before Phase 2

---

## 💡 Tips for Testing

- Keep both terminal windows visible so you can see logs
- Use browser DevTools (F12) to monitor network requests
- Check terminal logs when something doesn't work
- Hard refresh frontend with Ctrl+Shift+R if styles look wrong
- If Groq is slow, wait a moment - free tier has shared resources

---

**Questions?** Check the logs first - they usually tell you what's wrong! 🚀
