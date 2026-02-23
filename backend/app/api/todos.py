from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.todo import TodoCreate, TodoUpdate, TodoOut
from app.services.todo_service import (
    create_todo, get_todo, list_todos_filtered, update_todo, complete_todo, delete_todo
)

router = APIRouter()


@router.get("", response_model=list)
async def list_todos(
    filter: str = Query("all", regex="^(all|today|high_priority|backlog)$"),
    db: Session = Depends(get_db)
):
    """Get todos with optional filtering."""
    return list_todos_filtered(db, filter)


@router.get("/{todo_id}", response_model=TodoOut)
async def get_todo_by_id(todo_id: int, db: Session = Depends(get_db)):
    """Get a specific todo by ID."""
    todo = get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.post("", response_model=TodoOut)
async def create_new_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """Create a new todo."""
    return create_todo(db, todo.dict(exclude_none=True))


@router.patch("/{todo_id}", response_model=TodoOut)
async def update_todo_by_id(
    todo_id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)
):
    """Update a todo."""
    result = update_todo(db, todo_id, todo_update.dict(exclude_none=True))
    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")
    return result


@router.patch("/{todo_id}/complete", response_model=TodoOut)
async def mark_todo_complete(todo_id: int, db: Session = Depends(get_db)):
    """Mark a todo as complete."""
    result = complete_todo(db, todo_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.delete("/{todo_id}")
async def delete_todo_by_id(todo_id: int, db: Session = Depends(get_db)):
    """Delete a todo."""
    result = delete_todo(db, todo_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
