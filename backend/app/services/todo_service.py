from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, date
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate


def create_todo(db: Session, todo_create: dict) -> dict:
    """Create a new todo."""
    db_todo = Todo(
        title=todo_create.get("title"),
        priority=todo_create.get("priority", "medium"),
        due_date=todo_create.get("due_date"),
        status="pending"
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return format_todo(db_todo)


def get_todo(db: Session, todo_id: int) -> dict:
    """Get a todo by ID."""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    return format_todo(todo) if todo else None


def list_todos_filtered(db: Session, filter_type: str = "all") -> list:
    """List todos with optional filtering."""
    today_str = date.today().isoformat()
    query = db.query(Todo)

    if filter_type == "today":
        query = query.filter(
            and_(
                Todo.due_date == today_str,
                Todo.status == "pending"
            )
        )
    elif filter_type == "high_priority":
        query = query.filter(
            and_(
                Todo.priority == "high",
                Todo.status == "pending"
            )
        )
    elif filter_type == "backlog":
        query = query.filter(
            and_(
                Todo.due_date < today_str,
                Todo.status == "pending"
            )
        )
    # "all" returns everything

    todos = query.order_by(Todo.priority.desc(), Todo.created_at.desc()).all()
    return [format_todo(t) for t in todos]


def update_todo(db: Session, todo_id: int, todo_update: dict) -> dict:
    """Update a todo by ID."""
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        return None

    update_data = {k: v for k, v in todo_update.items() if v is not None}
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return format_todo(db_todo)


def complete_todo(db: Session, todo_id: int, title_hint: str = None) -> dict:
    """Mark a todo as completed."""
    db_todo = find_todo_by_id_or_hint(db, todo_id, title_hint)
    if not db_todo:
        return {"error": f"Todo not found (id={todo_id}, hint={title_hint})"}

    db_todo.status = "completed"
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return format_todo(db_todo)


def delete_todo(db: Session, todo_id: int, title_hint: str = None) -> dict:
    """Delete a todo by ID."""
    db_todo = find_todo_by_id_or_hint(db, todo_id, title_hint)
    if not db_todo:
        return {"error": f"Todo not found (id={todo_id}, hint={title_hint})"}

    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted successfully", "id": todo_id}


def find_todo_by_id_or_hint(db: Session, todo_id: int, title_hint: str = None) -> Todo:
    """Find todo by ID, or by title hint if ID not found."""
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if db_todo:
        return db_todo

    if title_hint:
        # Case-insensitive partial match
        db_todo = db.query(Todo).filter(
            Todo.title.ilike(f"%{title_hint}%")
        ).first()
        return db_todo

    return None


def format_todo(todo: Todo) -> dict:
    """Convert Todo ORM object to dict."""
    if not todo:
        return None

    return {
        "id": todo.id,
        "title": todo.title,
        "priority": todo.priority,
        "status": todo.status,
        "due_date": todo.due_date,
        "created_at": todo.created_at,
        "updated_at": todo.updated_at
    }


def get_high_priority_and_overdue(db: Session) -> list:
    """Get high priority + overdue tasks for ticker."""
    today_str = date.today().isoformat()

    high_priority = db.query(Todo).filter(
        and_(Todo.priority == "high", Todo.status == "pending")
    ).all()

    overdue = db.query(Todo).filter(
        and_(
            Todo.due_date < today_str,
            Todo.status == "pending"
        )
    ).all()

    # Combine and deduplicate
    combined = {t.id: format_todo(t) for t in high_priority + overdue}
    return list(combined.values())
