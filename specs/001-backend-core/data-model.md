# Data Model: Backend Core & Data Layer

**Feature**: Backend Core & Data Layer
**Date**: 2026-02-10
**Phase**: Phase 1 - Data Model Design

## Overview

This document defines the data model for the task management backend. The model is designed to support multi-user task management with strict user isolation enforced at the database level.

## Entities

### Task

**Description**: Represents a single todo item belonging to a user. Tasks support full CRUD operations and track completion status.

**Table Name**: `tasks`

**Fields**:

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique identifier for the task |
| title | String(200) | NOT NULL | Task title (required) |
| description | Text | NULL | Optional detailed description |
| completed | Boolean | NOT NULL, Default: false | Completion status |
| owner_user_id | String(100) | NOT NULL, Indexed | User who owns this task |
| created_at | DateTime | NOT NULL, Auto-generated | Timestamp when task was created |
| updated_at | DateTime | NOT NULL, Auto-updated | Timestamp when task was last modified |

**Indexes**:
- Primary key on `id`
- Index on `owner_user_id` (for efficient user-scoped queries)
- Composite index on `(owner_user_id, id)` (for single task lookups)

**Validation Rules**:
- `title`: Required, non-empty string, max 200 characters
- `description`: Optional, text field (no length limit)
- `completed`: Boolean, defaults to false
- `owner_user_id`: Required, non-empty string, max 100 characters
- `created_at`: Auto-generated on insert, immutable
- `updated_at`: Auto-generated on insert, auto-updated on modification

**Relationships**:
- None in this spec (prepared for future User entity relationship)
- `owner_user_id` will become a foreign key to User.id in future spec

**State Transitions**:
```
[New] --POST--> [Created, completed=false]
[Created] --PUT--> [Updated, updated_at refreshed]
[Created] --PATCH /complete--> [Completed, completed=true]
[Created/Completed] --DELETE--> [Deleted]
```

**SQLModel Definition** (Implementation Reference):
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, nullable=False)
    owner_user_id: str = Field(max_length=100, nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )
```

## Request/Response Schemas

### TaskCreate (Request Body for POST)

**Purpose**: Data required to create a new task

**Fields**:
- `title`: string (required, max 200 chars)
- `description`: string (optional)

**Notes**:
- `owner_user_id` is set from URL parameter, not request body
- `completed` defaults to false
- `id`, `created_at`, `updated_at` are auto-generated

**Example**:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the backend API"
}
```

### TaskUpdate (Request Body for PUT)

**Purpose**: Data for updating an existing task

**Fields**:
- `title`: string (required, max 200 chars)
- `description`: string (optional)

**Notes**:
- Cannot update `id`, `owner_user_id`, `completed`, `created_at`
- `updated_at` is automatically refreshed
- `completed` status changed via separate PATCH endpoint

**Example**:
```json
{
  "title": "Complete project documentation (updated)",
  "description": "Write comprehensive docs including API examples"
}
```

### TaskResponse (Response Body)

**Purpose**: Complete task data returned by API

**Fields**:
- `id`: integer
- `title`: string
- `description`: string | null
- `completed`: boolean
- `owner_user_id`: string
- `created_at`: string (ISO 8601 datetime)
- `updated_at`: string (ISO 8601 datetime)

**Example**:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the backend API",
  "completed": false,
  "owner_user_id": "user123",
  "created_at": "2026-02-10T10:30:00Z",
  "updated_at": "2026-02-10T10:30:00Z"
}
```

## Database Schema (SQL)

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    owner_user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient user-scoped queries
CREATE INDEX idx_tasks_owner_user_id ON tasks(owner_user_id);

-- Composite index for single task lookups by user
CREATE INDEX idx_tasks_owner_user_id_id ON tasks(owner_user_id, id);

-- Trigger to auto-update updated_at (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## User Isolation Strategy

**Enforcement Level**: Database query level

**Implementation**:
- All SELECT queries include `WHERE owner_user_id = :user_id`
- INSERT operations set `owner_user_id` from URL parameter
- UPDATE/DELETE operations include `WHERE owner_user_id = :user_id AND id = :task_id`
- Return 404 if task not found OR doesn't belong to user (don't leak existence)

**Query Examples**:
```python
# List tasks for user
tasks = session.exec(
    select(Task).where(Task.owner_user_id == user_id)
).all()

# Get specific task for user
task = session.exec(
    select(Task)
    .where(Task.id == task_id)
    .where(Task.owner_user_id == user_id)
).first()

# Update task for user
task = session.exec(
    select(Task)
    .where(Task.id == task_id)
    .where(Task.owner_user_id == user_id)
).first()
if task:
    task.title = new_title
    task.description = new_description
    session.add(task)
    session.commit()
    session.refresh(task)
```

## Migration Strategy

**Initial Migration**: Create tasks table with all fields and indexes

**Future Migrations** (prepared for):
- Add User table
- Convert owner_user_id to foreign key referencing User.id
- Add cascade delete behavior (when user deleted, delete their tasks)

**Migration Tool**: Alembic (SQLAlchemy migration tool)
- Not required for initial implementation (SQLModel.metadata.create_all())
- Recommended for production deployments

## Data Validation

**Field-Level Validation**:
- `title`: Non-empty, max 200 characters (enforced by Pydantic)
- `description`: Optional, no length limit
- `completed`: Boolean type validation
- `owner_user_id`: Non-empty, max 100 characters

**Business Rules**:
- Tasks can only be accessed by their owner
- Task ownership cannot be transferred (owner_user_id immutable after creation)
- Completed status can only be set to true via PATCH endpoint (not via PUT)
- Timestamps are system-managed (cannot be set by client)

## Performance Considerations

**Indexes**:
- `owner_user_id` index enables fast user-scoped queries
- Composite `(owner_user_id, id)` index optimizes single task lookups
- Primary key index on `id` for general lookups

**Query Optimization**:
- All queries filter by owner_user_id first (uses index)
- Limit result sets to reasonable sizes (pagination in future)
- Use connection pooling to reduce connection overhead

**Expected Performance**:
- List tasks for user: <50ms (with index)
- Get single task: <10ms (with composite index)
- Create task: <20ms (single INSERT)
- Update task: <30ms (SELECT + UPDATE)
- Delete task: <30ms (SELECT + DELETE)

## Testing Considerations

**Test Cases**:
- Create task with valid data
- Create task with missing title (validation error)
- Create task with title > 200 chars (validation error)
- Retrieve tasks for user (empty list, multiple tasks)
- Retrieve single task (exists, not found, belongs to different user)
- Update task (valid, not found, belongs to different user)
- Delete task (valid, not found, belongs to different user)
- Mark task complete (valid, not found, belongs to different user)
- Verify timestamps (created_at set, updated_at refreshed)
- Verify user isolation (user A cannot access user B's tasks)

**Test Data**:
- Multiple users with multiple tasks each
- Tasks with and without descriptions
- Completed and incomplete tasks
- Edge cases (empty description, max length title)
