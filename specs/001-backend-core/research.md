# Research: Backend Core & Data Layer

**Feature**: Backend Core & Data Layer
**Date**: 2026-02-10
**Phase**: Phase 0 - Technology Research and Decisions

## Overview

This document captures the research findings and technology decisions for implementing the backend core and data layer. All technology choices are mandated by the project constitution, so this research focuses on best practices, implementation patterns, and architectural decisions within those constraints.

## Technology Stack Decisions

### Decision 1: FastAPI as Web Framework

**Decision**: Use FastAPI 0.104+ as the web framework for the backend API.

**Rationale**:
- Mandated by project constitution (Technology Constraints)
- Native async/await support for high concurrency
- Automatic OpenAPI documentation generation
- Built-in request/response validation via Pydantic
- Excellent performance (comparable to Node.js and Go)
- Type hints throughout for better IDE support and error detection

**Alternatives Considered**:
- Flask: Simpler but lacks async support and automatic validation
- Django REST Framework: More opinionated, heavier, overkill for this scope
- **Rejected because**: Constitution mandates FastAPI

**Best Practices**:
- Use APIRouter for organizing endpoints by resource
- Leverage dependency injection for database sessions
- Use Pydantic models for request/response validation
- Enable CORS middleware for future frontend integration
- Use uvicorn as ASGI server for production

### Decision 2: SQLModel for ORM

**Decision**: Use SQLModel 0.0.14+ as the ORM layer.

**Rationale**:
- Mandated by project constitution
- Combines SQLAlchemy (ORM) with Pydantic (validation)
- Single model definition serves as both database model and API schema
- Type-safe database operations
- Excellent integration with FastAPI
- Reduces code duplication (no separate ORM and schema models)

**Alternatives Considered**:
- SQLAlchemy alone: More verbose, requires separate Pydantic models
- Tortoise ORM: Async-first but less mature ecosystem
- **Rejected because**: Constitution mandates SQLModel

**Best Practices**:
- Use SQLModel for table definitions with `table=True`
- Use separate Pydantic models for request/response when needed (e.g., TaskCreate, TaskUpdate)
- Leverage Field() for validation constraints and defaults
- Use relationships for foreign keys (prepared for future User model)
- Enable automatic timestamp updates via `onupdate` parameter

### Decision 3: Neon Serverless PostgreSQL

**Decision**: Use Neon Serverless PostgreSQL as the database.

**Rationale**:
- Mandated by project constitution
- Serverless architecture (auto-scaling, pay-per-use)
- PostgreSQL compatibility (full SQL support)
- Built-in connection pooling
- Excellent for development and production
- No infrastructure management required

**Alternatives Considered**:
- Traditional PostgreSQL: Requires server management
- SQLite: Not suitable for multi-user production
- **Rejected because**: Constitution mandates Neon

**Best Practices**:
- Use connection pooling via SQLAlchemy engine
- Store connection string in DATABASE_URL environment variable
- Use psycopg2-binary for PostgreSQL driver
- Enable connection pool pre-ping to handle serverless cold starts
- Set appropriate pool size and timeout values

### Decision 4: Database Connection Management

**Decision**: Use SQLAlchemy engine with connection pooling and dependency injection for session management.

**Rationale**:
- FastAPI best practice for database sessions
- Ensures proper connection lifecycle (open/close)
- Prevents connection leaks
- Supports async operations if needed in future
- Enables transaction management

**Implementation Pattern**:
```python
# database.py
from sqlmodel import create_engine, Session

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def get_session():
    with Session(engine) as session:
        yield session

# routes/tasks.py
@app.get("/api/{user_id}/tasks")
def get_tasks(user_id: str, session: Session = Depends(get_session)):
    # session automatically closed after request
```

**Best Practices**:
- Use dependency injection for sessions (Depends(get_session))
- Enable pool_pre_ping for serverless environments
- Set pool_size and max_overflow based on expected load
- Use context managers for automatic session cleanup

### Decision 5: API Route Structure

**Decision**: Use `/api/{user_id}/tasks` pattern for all task endpoints.

**Rationale**:
- Explicitly scopes all operations to a user
- Prepares for authentication (user_id from JWT in future)
- RESTful resource-based routing
- Clear ownership semantics in URL
- Easy to enforce user isolation at route level

**Endpoint Design**:
- `GET /api/{user_id}/tasks` - List all tasks for user
- `POST /api/{user_id}/tasks` - Create new task for user
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Mark task complete

**Best Practices**:
- Use path parameters for resource identifiers
- Use request body for create/update data
- Return appropriate HTTP status codes
- Include resource in response body (except DELETE)
- Use consistent JSON response format

### Decision 6: Error Handling Strategy

**Decision**: Use FastAPI exception handlers with consistent JSON error responses.

**Rationale**:
- Provides consistent error format across all endpoints
- Enables proper HTTP status codes
- Includes error details for debugging
- Supports validation errors from Pydantic

**Error Response Format**:
```json
{
  "detail": "Error message",
  "error_type": "ValidationError|NotFoundError|DatabaseError"
}
```

**HTTP Status Codes**:
- 200 OK: Successful GET, PUT, PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE
- 400 Bad Request: Validation errors, missing required fields
- 404 Not Found: Resource not found or doesn't belong to user
- 503 Service Unavailable: Database connection errors

**Best Practices**:
- Use HTTPException for expected errors
- Catch database exceptions and convert to 503
- Include validation error details in 400 responses
- Log errors for debugging (but don't expose internals to client)

### Decision 7: User Isolation Enforcement

**Decision**: Filter all database queries by owner_user_id at the query level.

**Rationale**:
- Enforces user isolation at database layer (defense in depth)
- Prevents accidental cross-user data access
- Prepares for authentication (user_id from JWT)
- Simple to implement with SQLModel where() clauses

**Implementation Pattern**:
```python
# Get tasks for user
tasks = session.exec(
    select(Task).where(Task.owner_user_id == user_id)
).all()

# Get specific task for user
task = session.exec(
    select(Task)
    .where(Task.id == task_id)
    .where(Task.owner_user_id == user_id)
).first()
```

**Best Practices**:
- Always include owner_user_id filter in queries
- Return 404 if task not found OR doesn't belong to user (don't leak existence)
- Set owner_user_id from URL parameter on create
- Never trust client-provided owner_user_id in request body

### Decision 8: Testing Strategy

**Decision**: Use pytest with httpx for API testing and in-memory SQLite for test database.

**Rationale**:
- pytest is Python standard for testing
- httpx provides async HTTP client for FastAPI testing
- In-memory SQLite for fast, isolated tests
- TestClient from FastAPI for integration tests

**Test Coverage**:
- API endpoint tests (all CRUD operations)
- User isolation tests (cross-user access attempts)
- Validation tests (missing fields, invalid data)
- Error handling tests (404, 400, 503)
- Data model tests (SQLModel validation)

**Best Practices**:
- Use pytest fixtures for test database and client
- Reset database between tests
- Test both success and error scenarios
- Test user isolation explicitly
- Use TestClient for synchronous tests

## Implementation Priorities

### Phase 1: Foundation (P1 - MVP)
1. Database connection and session management
2. Task SQLModel definition
3. GET /api/{user_id}/tasks (list)
4. POST /api/{user_id}/tasks (create)
5. GET /api/{user_id}/tasks/{id} (retrieve single)

**Rationale**: Establishes core persistence and retrieval. Demonstrates database connectivity, user-scoped queries, and data persistence across restarts.

### Phase 2: State Management (P2)
1. PUT /api/{user_id}/tasks/{id} (update)
2. PATCH /api/{user_id}/tasks/{id}/complete (mark complete)

**Rationale**: Adds state management capabilities. Builds on P1 foundation.

### Phase 3: Lifecycle Completion (P3)
1. DELETE /api/{user_id}/tasks/{id} (delete)

**Rationale**: Completes CRUD lifecycle. System is functional without it.

## Open Questions

None - all technical decisions are clear based on constitution mandates and specification requirements.

## References

- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Neon Documentation: https://neon.tech/docs/
- Pydantic Documentation: https://docs.pydantic.dev/
- pytest Documentation: https://docs.pytest.org/
