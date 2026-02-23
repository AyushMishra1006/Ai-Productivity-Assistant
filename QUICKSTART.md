# Quick Start Guide

## ✅ Servers Running

Your app is now live! Access it here:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🎯 First Steps

1. **Important:** Set your `ANTHROPIC_API_KEY` in `backend/.env`
   ```
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   ```
   Get your key from: https://console.anthropic.com/

2. **Reload the frontend** (http://localhost:5173) after setting the API key

3. **Try these commands in the chat:**
   - "Add buy groceries to my list"
   - "What do I have today?"
   - "Mark buy groceries as done"
   - "Show me all my tasks"

## 📁 Project Structure

```
ai-productivity-assistant/
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # useChat hook
│   │   ├── store/        # Zustand todo store
│   │   ├── services/     # API client
│   │   └── utils/        # Helpers (SSE parser)
│   └── vite.config.js    # Config with proxy
│
├── backend/              # FastAPI Python app
│   ├── app/
│   │   ├── api/         # REST endpoints
│   │   ├── models/      # SQLAlchemy ORM
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── tools/       # Claude tool definitions
│   ├── requirements.txt
│   └── .env             # API key config
│
└── README.md            # Full documentation
```

## 🔌 API Endpoints

### Todos
- `GET /todos?filter=all` - Get all todos
- `GET /todos?filter=today` - Get today's todos
- `GET /todos?filter=high_priority` - Get high priority
- `GET /todos?filter=backlog` - Get overdue
- `POST /todos` - Create new todo
- `PATCH /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo
- `PATCH /todos/{id}/complete` - Mark complete

### Chat (SSE Stream)
- `POST /chat/stream` - Stream chat with tool use

### Health
- `GET /health` - Health check
- `GET /` - API info

## 🤖 Claude Tool Use

The chat automatically detects when you want to manage todos:

| User Says | Action |
|-----------|--------|
| "add X to my list" | Creates todo |
| "show me X" / "what do I have" | Lists todos |
| "mark X as done" | Completes todo |
| "remove X" | Deletes todo |

Claude uses these tools automatically - no special commands needed!

## 🎨 UI Features

**Left: Todo List**
- Filter by: All, Today, High Priority, Backlog
- Create/complete/delete tasks
- Color-coded priorities

**Right: AI Chat**
- Chat with Claude
- Real-time streaming responses
- Tool call indicators while processing

**Bottom: Ticker**
- Scrolling news-style ticker
- Shows high-priority tasks
- Shows overdue/backlog items

## 🧪 Test the Chat

1. Type: "Add meeting with John tomorrow at 2pm"
2. Watch Claude create the task automatically
3. Type: "What's on my agenda today?"
4. Claude will list today's tasks
5. Type: "Mark the meeting as done"
6. Claude completes it for you

## 🐛 Troubleshooting

**"Claude API key error"**
- Set `ANTHROPIC_API_KEY` in `backend/.env`
- Reload the frontend
- Check key at https://console.anthropic.com

**"Failed to fetch"**
- Ensure backend is running: `http://localhost:8000/health`
- Frontend may need refresh

**"Todos not showing"**
- Check browser console (F12) for errors
- Verify backend is running
- Check Network tab to see API responses

## 🚀 Production Deployment

When ready to deploy:

1. **Backend → Render**
   - Push to GitHub
   - New web service on Render
   - Set `ANTHROPIC_API_KEY` env var
   - Set `ALLOWED_ORIGINS` to your Vercel domain

2. **Frontend → Vercel**
   - Push to GitHub
   - New project on Vercel
   - Set `VITE_API_URL` to your Render domain
   - Deploy!

See `README.md` for detailed deployment instructions.

## 📚 File Locations

**Backend Core Files:**
- `app/main.py` - FastAPI app entry point
- `app/services/claude_service.py` - Agentic streaming loop (CRITICAL)
- `app/tools/definitions.py` - Claude tool schemas
- `app/api/chat.py` - Chat SSE endpoint
- `app/api/todos.py` - Todo CRUD endpoints

**Frontend Core Files:**
- `src/App.jsx` - Root component
- `src/hooks/useChat.js` - Chat state & streaming
- `src/store/todoStore.js` - Zustand todo store
- `src/components/layout/AppShell.jsx` - 3-panel layout
- `src/services/api.js` - API client

## ✨ Next Steps

After confirming it works:

1. Customize the theme (edit `tailwind.config.js`)
2. Add more features (email digest, habit tracker, etc.)
3. Deploy to Render + Vercel
4. Share with friends or make it public!

---

**Enjoy your AI Productivity Assistant!** 🚀

Questions? See `README.md` for full documentation.
