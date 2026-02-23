from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="medium")  # high | medium | low
    status = Column(String, nullable=False, default="pending")  # pending | completed
    due_date = Column(String, nullable=True)  # YYYY-MM-DD format
    created_at = Column(String, server_default=func.now())
    updated_at = Column(String, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Todo(id={self.id}, title={self.title}, priority={self.priority}, status={self.status})>"
