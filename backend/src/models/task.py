"""
Task data model for the task management system.

This module defines the Task SQLModel which serves as both the database table
definition and the Pydantic model for validation.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid


class Task(SQLModel, table=True):
    """
    Task model representing a todo item.

    Each task belongs to a user (identified by owner_user_id) and tracks
    completion status along with creation and update timestamps.

    Attributes:
        id: Unique task identifier (auto-generated)
        title: Task title (required, max 200 characters)
        description: Optional detailed description
        completed: Completion status (default: False)
        owner_user_id: User who owns this task (required, max 100 characters)
        created_at: Timestamp when task was created (auto-generated)
        updated_at: Timestamp when task was last modified (auto-updated)
    """

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, nullable=False)
    owner_user_id: uuid.UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        description="UUID of the user who owns this task"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"onupdate": datetime.utcnow},
    )
