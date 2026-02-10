"""
Request and response schemas for task operations.

This module defines Pydantic models for task creation and updates,
separate from the database model to control what fields can be set by clients.
"""

from pydantic import BaseModel, Field
from typing import Optional


class TaskCreate(BaseModel):
    """
    Schema for creating a new task.

    Only title and description can be provided by the client.
    Other fields (id, owner_user_id, completed, timestamps) are set by the server.

    Attributes:
        title: Task title (required, max 200 characters)
        description: Optional detailed description
    """

    title: str = Field(..., max_length=200, description="Task title")
    description: Optional[str] = Field(None, description="Optional task description")


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.

    Only title and description can be updated via PUT endpoint.
    Completion status is updated via separate PATCH endpoint.

    Attributes:
        title: Updated task title (required, max 200 characters)
        description: Updated task description (optional)
    """

    title: str = Field(..., max_length=200, description="Updated task title")
    description: Optional[str] = Field(None, description="Updated task description")
