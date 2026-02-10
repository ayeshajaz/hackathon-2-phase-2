# Task Management Backend API

RESTful API for managing user tasks with JWT authentication and persistent storage in Neon Serverless PostgreSQL.

## Features

- ✅ Complete CRUD operations for tasks
- ✅ JWT-based authentication (signup, signin)
- ✅ Secure user authentication with bcrypt password hashing
- ✅ User-scoped data access (multi-user support)
- ✅ Persistent storage with Neon PostgreSQL
- ✅ FastAPI with automatic OpenAPI documentation
- ✅ SQLModel for type-safe database operations
- ✅ User isolation enforced at database query level

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **ORM**: SQLModel 0.0.14
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT tokens with PyJWT 2.8.0
- **Password Hashing**: bcrypt via passlib 1.7.4
- **Server**: Uvicorn (ASGI)
- **Validation**: Pydantic 2.5.0

## Prerequisites

- Python 3.11 or higher
- Neon PostgreSQL account and database
- pip (Python package manager)

## Setup Instructions

### 1. Clone Repository

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

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your configuration
```

**Required environment variables**:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT Authentication Configuration
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

**Get your Neon connection string**:
1. Log in to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Copy the connection string from the dashboard
4. Paste it into your `.env` file

**Generate a secure JWT secret**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output and use it as your `JWT_SECRET`

### 5. Run Database Migrations

**IMPORTANT**: Apply database migrations to create the users and tasks tables:

```bash
# Apply all migrations to create database schema
alembic upgrade head
```

This will create the `users` and `tasks` tables with all required columns in your Neon PostgreSQL database.

**Verify migration**:
- Check Neon dashboard to confirm both `users` and `tasks` tables exist
- Or run: `alembic current` to see the current migration version

**For detailed migration documentation**, see [MIGRATIONS.md](./MIGRATIONS.md)

### 6. Run the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/signin` | Sign in and get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Task Operations

**All task endpoints require JWT authentication via `Authorization: Bearer <token>` header**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | List all tasks for authenticated user | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| GET | `/api/tasks/{id}` | Get a specific task | Yes |
| PUT | `/api/tasks/{id}` | Update a task | Yes |
| PATCH | `/api/tasks/{id}/complete` | Mark task as complete | Yes |
| DELETE | `/api/tasks/{id}` | Delete a task | Yes |

### Example Usage

#### 1. Sign Up (Register New User)

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2026-02-10T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Sign In (Get JWT Token)

```bash
curl -X POST "http://localhost:8000/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2026-02-10T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token** - you'll need it for all subsequent requests!

#### 3. Get Current User

```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Create a Task (Authenticated)

```bash
curl -X POST "http://localhost:8000/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the backend API"
  }'
```

#### 5. List All Tasks (Authenticated)

```bash
curl -X GET "http://localhost:8000/api/tasks" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 6. Get Specific Task (Authenticated)

```bash
curl -X GET "http://localhost:8000/api/tasks/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 7. Update Task (Authenticated)

```bash
curl -X PUT "http://localhost:8000/api/tasks/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Complete project documentation (updated)",
    "description": "Write comprehensive docs including API examples"
  }'
```

#### Mark Task Complete

```bash
curl -X PATCH "http://localhost:8000/api/user123/tasks/1/complete"
```

#### Delete Task

```bash
curl -X DELETE "http://localhost:8000/api/user123/tasks/1"
```

## Data Model

### Task

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Unique task identifier (auto-generated) |
| title | String | Task title (required, max 200 chars) |
| description | String | Optional detailed description |
| completed | Boolean | Completion status (default: false) |
| owner_user_id | String | User who owns this task |
| created_at | DateTime | Timestamp when task was created |
| updated_at | DateTime | Timestamp when task was last modified |

## User Isolation

All API endpoints enforce user isolation:
- Tasks are filtered by `owner_user_id` at the database query level
- Users can only access their own tasks
- Attempting to access another user's task returns 404 Not Found

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Successful GET, PUT, PATCH |
| 201 | Created - Successful POST |
| 204 | No Content - Successful DELETE |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Task not found or doesn't belong to user |
| 503 | Service Unavailable - Database connection error |

## Database Migrations

This project uses **Alembic** for database schema management. Migrations allow you to version control your database schema and apply changes safely.

### Quick Commands

```bash
# Apply all pending migrations
alembic upgrade head

# Check current migration version
alembic current

# View migration history
alembic history

# Create new migration after model changes
alembic revision --autogenerate -m "Description of changes"

# Rollback last migration
alembic downgrade -1
```

### Initial Setup

The initial migration creates the `tasks` table with all required columns. Run this after configuring your `.env` file:

```bash
alembic upgrade head
```

### Making Schema Changes

1. Update your SQLModel models in `src/models/`
2. Generate migration: `alembic revision --autogenerate -m "Add new field"`
3. Review the generated migration file in `alembic/versions/`
4. Apply migration: `alembic upgrade head`

**For detailed migration documentation**, see [MIGRATIONS.md](./MIGRATIONS.md)

### Development vs Production

**Production (Recommended)**:
- Always use Alembic migrations
- Run `alembic upgrade head` before starting the app
- Never use `drop_all()` - it deletes all data!

**Development (Optional)**:
- You can uncomment `SQLModel.metadata.create_all(engine)` in `src/main.py` for quick local dev
- This auto-creates tables but doesn't handle schema changes

## Development

### Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database connection and session management
│   ├── models/
│   │   └── task.py          # Task SQLModel definition
│   ├── api/
│   │   └── routes/
│   │       └── tasks.py     # Task CRUD endpoints
│   └── schemas/
│       └── task.py          # Request/response schemas
├── tests/                   # Test directory (future)
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment variable template
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

### Running in Production

For production deployment, use a production-grade ASGI server:

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Troubleshooting

### Database Connection Errors

**Error**: `could not connect to server`

**Solution**:
- Verify DATABASE_URL in .env is correct
- Check Neon database is running (not paused)
- Verify network connectivity

### Import Errors

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

### Port Already in Use

**Error**: `[Errno 48] Address already in use`

**Solution**:
- Stop other process using port 8000
- Or use different port: `uvicorn src.main:app --port 8001`

## Next Steps

- Add authentication with Better Auth (Spec-2)
- Add frontend with Next.js (future spec)
- Add automated tests
- Add pagination for task lists
- Add task filtering and sorting

## License

This project is part of the Todo Full-Stack Web Application hackathon project.

## Support

For detailed setup and testing instructions, see:
- [Quickstart Guide](../specs/001-backend-core/quickstart.md)
- [API Specification](../specs/001-backend-core/spec.md)
- [Implementation Plan](../specs/001-backend-core/plan.md)
