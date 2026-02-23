# AI Productivity Assistant

A personal-use web app combining an AI chat assistant with todo list management. Built with React, FastAPI, and Claude API.

## Features

✨ **AI Chat with Claude** - Natural conversation with tool use for todo management
📝 **Smart Todo List** - Create, prioritize, and track tasks
🎯 **Priority & Filtering** - Filter by today/high-priority/backlog
📊 **Live Ticker** - Shows high-priority and overdue tasks at the bottom
🎨 **VSCode Dark Theme** - Familiar, developer-friendly interface

## Architecture

```
ai-productivity-assistant/
├── frontend/          # React + Vite + Tailwind CSS
│   └── src/          # React components, hooks, services
├── backend/          # Python FastAPI + SQLite
│   └── app/          # API routes, services, models
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **Anthropic API Key** (get from https://console.anthropic.com/)

### Backend Setup

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   # or
   source venv/bin/activate      # On macOS/Linux
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   # Edit .env with your Anthropic API key
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ALLOWED_ORIGINS=http://localhost:5173
   ```

4. **Run the server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Server will start at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   # .env is pre-configured for local development
   VITE_API_URL=http://localhost:8000
   ```

3. **Run the dev server:**
   ```bash
   npm run dev
   ```

   App will be at `http://localhost:5173`

## Usage

1. **View todos** - Middle panel shows your todo list
2. **Add todos** - Click "Add Task" button or say "add X to my list" in chat
3. **Chat with Claude** - Right panel for AI assistant
4. **Monitor tasks** - Bottom ticker shows high-priority and overdue items

### Chat Commands

Try saying things like:

- "Add buy groceries to my list"
- "What do I have today?"
- "Mark X as done"
- "Show me high priority tasks"
- "Delete X from my list"

Claude will automatically detect todo-related commands and update your list!

## Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS (VSCode dark theme)
- Zustand (state management)
- Lucide Icons

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- Anthropic Claude API
- SQLite (database)

## API Endpoints

### Todos
- `GET /todos?filter=all|today|high_priority|backlog` - List todos
- `POST /todos` - Create todo
- `PATCH /todos/{id}` - Update todo
- `PATCH /todos/{id}/complete` - Mark complete
- `DELETE /todos/{id}` - Delete todo

### Chat
- `POST /chat/stream` - Stream chat response (SSE)

### Health
- `GET /health` - Health check

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Create new web service on Render.com
3. Select GitHub repo and `backend` directory
4. Set environment variables:
   - `ANTHROPIC_API_KEY` - Your Anthropic key
   - `ALLOWED_ORIGINS` - Your Vercel domain
5. Deploy!

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Create new project on Vercel
3. Select GitHub repo and `frontend` directory
4. Set environment variable:
   - `VITE_API_URL` - Your Render backend URL
5. Deploy!

## Development Notes

- The frontend uses a proxy for local development (see `vite.config.js`)
- SSE streaming is used for real-time chat responses
- Claude tool use handles todo operations
- Zustand store syncs todo state across chat and UI
- SQLite DB persists todos (in `/mnt/data` on Render with persistent disk)

## Future Enhancements

- Email integration (Gmail summary)
- More todo fields (tags, notes, subtasks)
- Dark/light theme toggle
- Conversation history persistence
- Rich text in messages

## Troubleshooting

**Backend won't start:**
- Check `ANTHROPIC_API_KEY` is set correctly
- Ensure port 8000 is available
- Check Python version (3.9+)

**Frontend can't connect to backend:**
- Verify `VITE_API_URL` is correct
- Check CORS origins in backend `.env`
- Ensure backend is running

**Todos not appearing:**
- Check browser console for errors
- Verify API endpoint is responding: `curl http://localhost:8000/todos`
- Check SQLite DB exists: `backend/todos.db`

## License

MIT - Feel free to use and modify!

---

**Built with ❤️ using Claude, React, and FastAPI**
