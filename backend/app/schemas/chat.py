from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class TodoContext(BaseModel):
    id: int
    title: str
    priority: Optional[str] = None
    status: Optional[str] = None


class ChatContext(BaseModel):
    todos: List[Dict[str, Any]] = []
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    messages: List[Dict[str, Any]]  # Message list: [{"role": "user", "content": "..."}, ...]
    context: Optional[ChatContext] = None  # Context with todos and metadata
