# Quickstart Guide: Backend Core & Data Layer

**Feature**: Backend Core & Data Layer
**Date**: 2026-02-10
**Phase**: Phase 1 - Setup and Testing Guide

## Overview

This guide provides step-by-step instructions for setting up, running, and testing the backend API. Follow these instructions to get the backend running locally and verify all CRUD operations.

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Neon PostgreSQL account and database
- Git (for cloning repository)
- curl or Postman (for API testing)

## Environment Setup

### 1. Clone Repository and Navigate to Backend

```bash
cd backend/
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Required packages** (requirements.txt):
```
fastapi==0.104.1
sqlmodel==0.0.14
psycopg2-binary==2.9.9
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
pytest==7.4.3
httpx==0.25.2
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# .env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Get your Neon PostgreSQL connection string**:
1. Log in to Neon console (https://console.neon.tech/)
2. Select your project
3. Copy the connection string from the dashboard
4. Replace the placeholder in `.env` with your actual connection string

**Example Neon connection string**:
```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 5. Initialize Database

The database tables will be created automatically on first run. SQLModel will create the `tasks` table with all required fields and indexes.

**Manual initialization** (optional):
```python
# Run this in Python shell if needed
from src.database import engine
from src.models.task import Task
from sqlmodel import SQLModel

SQLModel.metadata.create_all(engine)
```

## Running the Backend

### Start the Development Server

```bash
# From backend/ directory
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify server is running**:
- Open browser to http://localhost:8000/docs
- You should see the FastAPI automatic documentation (Swagger UI)

## API Testing

### Using curl

#### 1. Create a Task (POST)

```bash
curl -X POST "http://localhost:8000/api/user123/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the backend API"
  }'
```

**Expected response** (201 Created):
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

#### 2. List All Tasks for User (GET)

```bash
curl -X GET "http://localhost:8000/api/user123/tasks"
```

**Expected response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the backend API",
    "completed": false,
    "owner_user_id": "user123",
    "created_at": "2026-02-10T10:30:00Z",
    "updated_at": "2026-02-10T10:30:00Z"
  }
]
```

#### 3. Get Specific Task (GET)

```bash
curl -X GET "http://localhost:8000/api/user123/tasks/1"
```

**Expected response** (200 OK):
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

#### 4. Update Task (PUT)

```bash
curl -X PUT "http://localhost:8000/api/user123/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation (updated)",
    "description": "Write comprehensive docs including API examples"
  }'
```

**Expected response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation (updated)",
  "description": "Write comprehensive docs including API examples",
  "completed": false,
  "owner_user_id": "user123",
  "created_at": "2026-02-10T10:30:00Z",
  "updated_at": "2026-02-10T12:15:00Z"
}
```

#### 5. Mark Task Complete (PATCH)

```bash
curl -X PATCH "http://localhost:8000/api/user123/tasks/1/complete"
```

**Expected response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation (updated)",
  "description": "Write comprehensive docs including API examples",
  "completed": true,
  "owner_user_id": "user123",
  "created_at": "2026-02-10T10:30:00Z",
  "updated_at": "2026-02-10T14:20:00Z"
}
```

#### 6. Delete Task (DELETE)

```bash
curl -X DELETE "http://localhost:8000/api/user123/tasks/1"
```

**Expected response** (204 No Content):
```
(empty response body)
```

### Using Postman

1. Import the OpenAPI specification from `specs/001-backend-core/contracts/tasks-api.yaml`
2. Set base URL to `http://localhost:8000`
3. Use the pre-configured requests for each endpoint
4. Postman will automatically validate request/response schemas

### Using FastAPI Swagger UI

1. Navigate to http://localhost:8000/docs
2. Expand any endpoint
3. Click "Try it out"
4. Fill in parameters and request body
5. Click "Execute"
6. View response below

## Testing User Isolation

### Verify User Isolation Works

```bash
# Create task for user123
curl -X POST "http://localhost:8000/api/user123/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "User 123 task"}'

# Try to access as user456 (should return 404)
curl -X GET "http://localhost:8000/api/user456/tasks/1"
```

**Expected**: 404 Not Found (user456 cannot access user123's task)

### Verify Data Persistence

```bash
# Create a task
curl -X POST "http://localhost:8000/api/user123/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Persistence test"}'

# Stop the server (Ctrl+C)
# Restart the server
uvicorn src.main:app --reload

# Retrieve the task (should still exist)
curl -X GET "http://localhost:8000/api/user123/tasks"
```

**Expected**: Task still exists after restart

## Running Tests

### Run All Tests

```bash
# From backend/ directory
pytest
```

**Expected output**:
```
============================= test session starts ==============================
collected 15 items

tests/test_tasks_api.py ..............                                   [93%]
tests/test_task_model.py .                                               [100%]

============================== 15 passed in 2.34s ===============================
```

### Run Specific Test File

```bash
pytest tests/test_tasks_api.py
```

### Run with Verbose Output

```bash
pytest -v
```

### Run with Coverage Report

```bash
pytest --cov=src --cov-report=html
```

## Validation Checklist

Use this checklist to verify the backend is working correctly:

- [ ] Server starts without errors
- [ ] Database connection established (check logs)
- [ ] Swagger UI accessible at /docs
- [ ] Create task returns 201 with task data
- [ ] List tasks returns 200 with array
- [ ] Get specific task returns 200 with task data
- [ ] Update task returns 200 with updated data
- [ ] Mark complete returns 200 with completed=true
- [ ] Delete task returns 204
- [ ] Deleted task returns 404 on subsequent GET
- [ ] User isolation enforced (user A cannot access user B's tasks)
- [ ] Tasks persist across server restarts
- [ ] Validation errors return 400 (missing title, etc.)
- [ ] Invalid task_id returns 404
- [ ] All tests pass

## Troubleshooting

### Database Connection Errors

**Error**: `could not connect to server`

**Solution**:
- Verify DATABASE_URL in .env is correct
- Check Neon database is running (not paused)
- Verify network connectivity
- Check firewall settings

### Import Errors

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`
- Verify Python version is 3.11+

### Port Already in Use

**Error**: `[Errno 48] Address already in use`

**Solution**:
- Stop other process using port 8000
- Or use different port: `uvicorn src.main:app --port 8001`

### Table Does Not Exist

**Error**: `relation "tasks" does not exist`

**Solution**:
- Run database initialization (see step 5 in Environment Setup)
- Or restart server (tables created on startup)

## Next Steps

After verifying the backend works:

1. **Run /sp.tasks** to generate implementation tasks
2. **Implement backend** using backend-api-architect agent
3. **Run tests** to verify implementation
4. **Optimize queries** using neon-db-optimizer agent
5. **Proceed to Spec-2** for authentication integration

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json
- **OpenAPI YAML**: specs/001-backend-core/contracts/tasks-api.yaml

## Support

For issues or questions:
- Review specification: specs/001-backend-core/spec.md
- Review implementation plan: specs/001-backend-core/plan.md
- Check data model: specs/001-backend-core/data-model.md
- Review research decisions: specs/001-backend-core/research.md
