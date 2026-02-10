"""
Task management API routes.

This module implements RESTful endpoints for task CRUD operations
with JWT authentication and user-scoped data access.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Annotated
from datetime import datetime
import uuid

from ...database import get_session
from ...models.task import Task
from ...schemas.task import TaskCreate, TaskUpdate
from ..middleware.jwt_auth import get_current_user

router = APIRouter(prefix="/api", tags=["tasks"])


@router.post(
    "/tasks",
    response_model=Task,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Creates a new task for the authenticated user",
)
def create_task(
    task_data: TaskCreate,
    user_id: Annotated[uuid.UUID, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Create a new task for the authenticated user.

    Requires JWT authentication via Authorization header.

    Args:
        task_data: Task creation data (title, description)
        user_id: UUID of authenticated user (extracted from JWT token)
        session: Database session (injected)

    Returns:
        Task: Created task with all fields including auto-generated id and timestamps

    Raises:
        HTTPException 401: Missing, invalid, or expired JWT token
        HTTPException 400: Validation error (missing required fields)
        HTTPException 503: Database connection error
    """
    try:
        # Create new task with owner_user_id from authenticated user
        new_task = Task(
            title=task_data.title,
            description=task_data.description,
            owner_user_id=user_id,
            completed=False,
        )

        session.add(new_task)
        session.commit()
        session.refresh(new_task)

        return new_task

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database error: {str(e)}",
        )


@router.get(
    "/tasks",
    response_model=List[Task],
    status_code=status.HTTP_200_OK,
    summary="List all tasks for authenticated user",
    description="Retrieves all tasks belonging to the authenticated user",
)
def list_tasks(
    user_id: Annotated[uuid.UUID, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Retrieve all tasks for the authenticated user.

    Requires JWT authentication via Authorization header.

    Args:
        user_id: UUID of authenticated user (extracted from JWT token)
        session: Database session (injected)

    Returns:
        List[Task]: Array of tasks (empty array if user has no tasks)

    Raises:
        HTTPException 401: Missing, invalid, or expired JWT token
        HTTPException 503: Database connection error
    """
    try:
        # Query tasks filtered by authenticated user's owner_user_id
        statement = select(Task).where(Task.owner_user_id == user_id)
        tasks = session.exec(statement).all()

        return tasks

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database error: {str(e)}",
        )


@router.get(
    "/tasks/{task_id}",
    response_model=Task,
    status_code=status.HTTP_200_OK,
    summary="Get a specific task",
    description="Retrieves a single task by ID if it belongs to the authenticated user",
)
def get_task(
    task_id: int,
    user_id: Annotated[uuid.UUID, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Retrieve a specific task for the authenticated user.

    Requires JWT authentication via Authorization header.

    Args:
        task_id: Task identifier from URL path
        user_id: UUID of authenticated user (extracted from JWT token)
        session: Database session (injected)

    Returns:
        Task: Task data if found and belongs to authenticated user

    Raises:
        HTTPException 401: Missing, invalid, or expired JWT token
        HTTPException 404: Task not found or doesn't belong to authenticated user
        HTTPException 503: Database connection error
    """
    try:
        # Query task filtered by both task_id and authenticated user's owner_user_id
        statement = (
            select(Task)
            .where(Task.id == task_id)
            .where(Task.owner_user_id == user_id)
        )
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        return task

    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database error: {str(e)}",
        )


@router.put(
    "/tasks/{task_id}",
    response_model=Task,
    status_code=status.HTTP_200_OK,
    summary="Update a task",
    description="Updates title and description of an existing task",
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: Annotated[uuid.UUID, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Update an existing task for the authenticated user.

    Requires JWT authentication via Authorization header.

    Args:
        task_id: Task identifier from URL path
        task_data: Task update data (title, description)
        user_id: UUID of authenticated user (extracted from JWT token)
        session: Database session (injected)

    Returns:
        Task: Updated task with refreshed updated_at timestamp

    Raises:
        HTTPException 401: Missing, invalid, or expired JWT token
        HTTPException 400: Validation error
        HTTPException 404: Task not found or doesn't belong to authenticated user
        HTTPException 503: Database connection error
    """
    try:
        # Query task filtered by both task_id and authenticated user's owner_user_id
        statement = (
            select(Task)
            .where(Task.id == task_id)
            .where(Task.owner_user_id == user_id)
        )
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        # Update task fields
        task.title = task_data.title
        task.description = task_data.description
        task.updated_at = datetime.utcnow()

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database error: {str(e)}",
        )


@router.patch(
    "/tasks/{task_id}/complete",
    response_model=Task,
    status_code=status.HTTP_200_OK,
    summary="Mark a task as complete",
    description="Sets the completed status of a task to true",
)
def complete_task(
    task_id: int,
    user_id: Annotated[uuid.UUID, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Mark a task as complete for the authenticated user.

    Requires JWT authentication via Authorization header.

    Args:
        task_id: Task identifier from URL path
        user_id: UUID of authenticated user (extracted from JWT token)
        session: Database session (injected)

    Returns:
        Task: Updated task with completed=true and refreshed updated_at timestamp

    Raises:
        HTTPException 401: Missing, invalid, or expired JWT token
        HTTPException 404: Task not found or doesn't belong to authenticated user
        HTTPException 503: Database connection error
    """
    try:
        # Query task filtered by both task_id and authenticated user's owner_user_id
        statement = (
            select(Task)
            .where(Task.id == task_id)
            .where(Task.owner_user_id == user_id)
        )
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        # Mark task as complete
        task.completed = True
        task.updated_at = datetime.utcnow()

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database error: {str(e)}",
        )


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    description="Permanently removes a task if it belongs to the authenticated user",
)
def delete_task(
    task_id: int,
    user_id: Annotated[uuid.UUID, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Delete a task for the authenticated user.

    Requires JWT authentication via Authorization header.

    Args:
        task_id: Task identifier from URL path
        user_id: UUID of authenticated user (extracted from JWT token)
        session: Database session (injected)

    Returns:
        None: 204 No Content on success

    Raises:
        HTTPException 401: Missing, invalid, or expired JWT token
        HTTPException 404: Task not found or doesn't belong to authenticated user
        HTTPException 503: Database connection error
    """
    try:
        # Query task filtered by both task_id and authenticated user's owner_user_id
        statement = (
            select(Task)
            .where(Task.id == task_id)
            .where(Task.owner_user_id == user_id)
        )
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        # Delete task
        session.delete(task)
        session.commit()

        return None

    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database error: {str(e)}",
        )
