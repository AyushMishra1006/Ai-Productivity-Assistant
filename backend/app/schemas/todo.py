from pydantic import BaseModel
from typing import Optional
from enum import Enum


class PriorityEnum(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class StatusEnum(str, Enum):
    pending = "pending"
    completed = "completed"


class TodoCreate(BaseModel):
    title: str
    priority: PriorityEnum = PriorityEnum.medium
    due_date: Optional[str] = None  # YYYY-MM-DD


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    due_date: Optional[str] = None
    status: Optional[StatusEnum] = None


class TodoOut(BaseModel):
    id: int
    title: str
    priority: str
    status: str
    due_date: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
