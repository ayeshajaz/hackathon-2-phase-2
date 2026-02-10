# Implementation Plan: Authentication & API Security

**Feature**: Spec-2 - User Authentication with Better Auth and JWT Token Validation
**Status**: Draft
**Created**: 2026-02-10
**Dependencies**: Spec-1 (Backend Core & Data Layer)

---

## Constitution Compliance Check

### ✅ Principle I: Spec-First Development
- Spec-2 created and approved before implementation
- Clear requirements and acceptance criteria defined
- Workflow: Spec → Plan → Tasks → Implement

### ✅ Principle II: Agentic Integrity
- Implementation via Claude Code agents only
- Agent delegation plan:
  - **auth-security-specialist**: User model, password hashing, JWT generation/validation, auth endpoints
  - **backend-api-architect**: Update task endpoints, remove user_id from URLs, JWT middleware integration
  - **database-schema-design**: Users table schema, foreign key relationships
  - **neon-db-optimizer**: Review database queries after implementation

### ✅ Principle III: Security by Design
- JWT tokens required for all task endpoints
- Password hashing with bcrypt (cost factor 12)
- JWT secret in environment variable
- User isolation enforced at database query level
- Token expiration enforced (24 hours)

### ✅ Principle IV: Deterministic Behavior
- All auth endpoints have defined inputs, outputs, error states
- JWT validation middleware has clear behavior
- Error handling with specific status codes (401, 409, 400, 404)

### ✅ Principle V: Separation of Concerns
- Authentication logic isolated in auth routes
- JWT middleware reusable across endpoints
- User model separate from Task model
- Clear API contracts for auth and task operations

### ✅ Principle VI: Reproducibility
- Complete plan with research, data model, API contracts
- ADR candidates identified (JWT library choice, password hashing algorithm)
- PHR created for each phase

---

## Project Structure

```
backend/
├── src/
│   ├── main.py                    # [MODIFY] Register auth routes
│   ├── database.py                # [NO CHANGE] Existing database connection
│   ├── models/
│   │   ├── task.py                # [MODIFY] Add foreign key to users table
│   │   └── user.py                # [CREATE] User SQLModel with hashed_password
│   ├── schemas/
│   │   ├── task.py                # [NO CHANGE] Existing task schemas
│   │   ├── user.py                # [CREATE] UserCreate, UserResponse schemas
│   │   └── auth.py                # [CREATE] SignupRequest, SigninRequest, AuthResponse
│   ├── api/
│   │   ├── routes/
│   │   │   ├── tasks.py           # [MODIFY] Remove user_id param, use JWT user_id
│   │   │   └── auth.py            # [CREATE] Signup, signin, get current user endpoints
│   │   └── middleware/
│   │       └── jwt_auth.py        # [CREATE] JWT validation middleware
│   └── utils/
│       ├── password.py            # [CREATE] Password hashing utilities
│       └── jwt_utils.py           # [CREATE] JWT generation and validation
├── alembic/
│   └── versions/
│       └── [NEW]_add_users_table.py  # [CREATE] Migration for users table
├── .env                           # [MODIFY] Add JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS
├── .env.example                   # [MODIFY] Add JWT environment variables
└── requirements.txt               # [MODIFY] Add PyJWT, passlib[bcrypt]
```

---

## Research & Technology Decisions

### 1. JWT Library Selection

**Options Considered:**
- **PyJWT**: Pure Python, widely used, simple API
- **python-jose**: Includes cryptographic backends, more features
- **Better Auth SDK**: If Better Auth provides JWT utilities

**Decision**: Use **PyJWT 2.8.0**

**Rationale:**
- Lightweight and focused on JWT only
- Well-maintained with 5k+ GitHub stars
- Simple API: `jwt.encode()` and `jwt.decode()`
- No unnecessary dependencies
- FastAPI documentation uses PyJWT in examples

**Trade-offs:**
- ✅ Pros: Simple, lightweight, well-documented
- ❌ Cons: Requires separate library for password hashing

**ADR Candidate**: Yes - JWT library choice affects long-term maintainability

---

### 2. Password Hashing Algorithm

**Options Considered:**
- **bcrypt**: Industry standard, well-tested, configurable cost factor
- **argon2**: Winner of Password Hashing Competition, more secure
- **scrypt**: Memory-hard, good for preventing hardware attacks

**Decision**: Use **bcrypt with cost factor 12**

**Rationale:**
- Industry standard with 20+ years of battle-testing
- Passlib library provides excellent bcrypt support
- Cost factor 12 balances security and performance (~300ms per hash)
- FastAPI security documentation recommends bcrypt
- Easier to find security audits and best practices

**Trade-offs:**
- ✅ Pros: Battle-tested, widely supported, good performance
- ❌ Cons: Argon2 is technically more secure, but bcrypt is sufficient for this use case

**ADR Candidate**: Yes - Password hashing affects security posture

---

### 3. JWT Token Expiration Strategy

**Options Considered:**
- **Short-lived tokens (1 hour) + refresh tokens**: More secure, complex
- **Medium-lived tokens (24 hours)**: Balanced approach
- **Long-lived tokens (7 days)**: Simpler, less secure

**Decision**: Use **24-hour expiration without refresh tokens**

**Rationale:**
- Balances security and user experience
- Refresh tokens are out of scope for Spec-2
- 24 hours is reasonable for a hackathon project
- Users can re-authenticate daily without friction
- Reduces attack window compared to long-lived tokens

**Trade-offs:**
- ✅ Pros: Simple implementation, reasonable security
- ❌ Cons: Users must re-authenticate daily, no seamless token refresh

**ADR Candidate**: No - Standard practice, not architecturally significant

---

### 4. User ID Format

**Options Considered:**
- **Auto-increment Integer**: Simple, sequential
- **UUID v4**: Random, globally unique, no enumeration risk
- **ULID**: Sortable, timestamp-based

**Decision**: Use **UUID v4**

**Rationale:**
- Prevents user enumeration attacks
- Globally unique across distributed systems
- PostgreSQL has native UUID support
- SQLModel supports UUID fields easily
- No sequential ID leakage

**Trade-offs:**
- ✅ Pros: Secure, no enumeration, globally unique
- ❌ Cons: Larger storage (16 bytes vs 4 bytes), not human-readable

**ADR Candidate**: No - Standard security practice

---

### 5. JWT Middleware Implementation

**Options Considered:**
- **FastAPI Dependency Injection**: Reusable, testable, idiomatic
- **Custom Middleware Class**: Global, automatic
- **Decorator Pattern**: Explicit per-route

**Decision**: Use **FastAPI Dependency Injection**

**Rationale:**
- Idiomatic FastAPI pattern
- Reusable across routes with `Depends(get_current_user)`
- Easy to test and mock
- Clear dependency chain
- Allows optional authentication (public routes)

**Trade-offs:**
- ✅ Pros: Testable, flexible, idiomatic
- ❌ Cons: Must add `Depends()` to each protected route

**ADR Candidate**: No - Standard FastAPI pattern

---

## Data Model Changes

### New Entity: User

```python
# src/models/user.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        nullable=False
    )
    email: str = Field(
        max_length=255,
        unique=True,
        index=True,
        nullable=False
    )
    hashed_password: str = Field(
        max_length=255,
        nullable=False
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
```

**Indexes:**
- Primary key on `id` (UUID)
- Unique index on `email` for fast lookup and duplicate prevention

**Constraints:**
- `email` must be unique
- `hashed_password` never null
- Timestamps auto-managed

---

### Modified Entity: Task

```python
# src/models/task.py - CHANGES ONLY
from sqlmodel import SQLModel, Field, Relationship
import uuid

class Task(SQLModel, table=True):
    # ... existing fields ...

    # CHANGE: owner_user_id type from String to UUID
    owner_user_id: uuid.UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True
    )

    # OPTIONAL: Add relationship (for ORM convenience)
    # owner: Optional["User"] = Relationship(back_populates="tasks")
```

**Migration Required:**
- Change `owner_user_id` from `String(100)` to `UUID`
- Add foreign key constraint: `tasks.owner_user_id` → `users.id`
- Existing data migration: Drop existing tasks (acceptable for hackathon)

---

## API Contract Changes

### New Endpoints: Authentication

#### 1. POST /api/auth/signup

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response (201 Created):**
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

**Error Responses:**
- 400 Bad Request: Invalid email format or weak password
- 409 Conflict: Email already exists

---

#### 2. POST /api/auth/signin

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response (200 OK):**
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

**Error Responses:**
- 401 Unauthorized: Invalid email or password

---

#### 3. GET /api/auth/me

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "created_at": "2026-02-10T10:00:00Z"
}
```

**Error Responses:**
- 401 Unauthorized: Missing, invalid, or expired token

---

### Modified Endpoints: Tasks

**URL Changes:**
- Before: `/api/{user_id}/tasks`
- After: `/api/tasks`

**Authentication:**
- All endpoints require `Authorization: Bearer <token>` header
- User ID extracted from JWT token, not URL

#### Updated Endpoints:

1. **GET /api/tasks** - List authenticated user's tasks
2. **POST /api/tasks** - Create task for authenticated user
3. **GET /api/tasks/{id}** - Get task (must belong to authenticated user)
4. **PUT /api/tasks/{id}** - Update task (must belong to authenticated user)
5. **PATCH /api/tasks/{id}/complete** - Complete task (must belong to authenticated user)
6. **DELETE /api/tasks/{id}** - Delete task (must belong to authenticated user)

**New Error Response:**
- 401 Unauthorized: Missing, invalid, or expired token

---

## JWT Token Structure

### Token Payload

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "exp": 1707652800,
  "iat": 1707566400
}
```

**Fields:**
- `user_id`: UUID of authenticated user
- `email`: User's email address
- `exp`: Expiration timestamp (Unix epoch)
- `iat`: Issued at timestamp (Unix epoch)

### Token Generation

```python
# src/utils/jwt_utils.py
import jwt
from datetime import datetime, timedelta
import os

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
```

---

## Implementation Approach

### Phase 1: Foundation (Dependencies & Configuration)
1. Add PyJWT and passlib[bcrypt] to requirements.txt
2. Update .env.example with JWT environment variables
3. Create utility modules: password.py, jwt_utils.py

### Phase 2: Data Layer (User Model & Migration)
4. Create User SQLModel in src/models/user.py
5. Create user schemas in src/schemas/user.py and auth.py
6. Generate Alembic migration for users table
7. Update Task model to use UUID foreign key
8. Test migration: alembic upgrade head

### Phase 3: Authentication Logic (Auth Endpoints)
9. Create password hashing utilities in src/utils/password.py
10. Create JWT utilities in src/utils/jwt_utils.py
11. Create auth routes in src/api/routes/auth.py
12. Implement POST /api/auth/signup
13. Implement POST /api/auth/signin
14. Implement GET /api/auth/me
15. Register auth routes in src/main.py

### Phase 4: JWT Middleware (Token Validation)
16. Create JWT middleware in src/api/middleware/jwt_auth.py
17. Implement get_current_user dependency
18. Test middleware with valid/invalid/expired tokens

### Phase 5: Secure Task Endpoints (Update Existing Routes)
19. Update task routes to use get_current_user dependency
20. Remove user_id from URL paths
21. Update database queries to use authenticated user_id
22. Update error handling for 401 responses
23. Test all task endpoints with JWT authentication

### Phase 6: Documentation & Testing
24. Update OpenAPI documentation with authentication requirements
25. Update README.md with authentication setup instructions
26. Create quickstart guide for authentication flow
27. Manual testing: signup → signin → create task → list tasks

---

## Complexity Tracking

### High Complexity (Requires Careful Design)
- **JWT Middleware**: Must handle missing, invalid, expired tokens correctly
- **Database Migration**: Changing owner_user_id from String to UUID with foreign key
- **Error Handling**: Distinguishing between authentication (401) and authorization (404) errors

### Medium Complexity (Standard Implementation)
- **Password Hashing**: Using passlib with bcrypt
- **JWT Generation**: Using PyJWT with standard payload
- **Auth Endpoints**: Standard signup/signin patterns

### Low Complexity (Straightforward)
- **User Model**: Standard SQLModel with UUID primary key
- **Schemas**: Pydantic models for request/response
- **Environment Variables**: Adding JWT configuration

---

## Risk Mitigation

### Risk 1: JWT Secret Exposure
**Mitigation:**
- Use strong random secret (32+ characters)
- Store in .env, never commit to git
- Add .env to .gitignore
- Document secret generation in README

### Risk 2: Migration Data Loss
**Mitigation:**
- Backup database before migration
- Test migration in development first
- Document rollback procedure
- Acceptable to drop existing tasks for hackathon

### Risk 3: Breaking Changes to Task API
**Mitigation:**
- Document URL changes clearly
- Update all examples in README
- Create migration guide for API clients
- Expected for hackathon project

### Risk 4: Token Expiration UX
**Mitigation:**
- Clear error messages for expired tokens
- Document re-authentication flow
- 24-hour expiration is reasonable
- Refresh tokens out of scope

---

## Testing Strategy

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Signup with valid email and password
- [ ] Signup with duplicate email (expect 409)
- [ ] Signup with weak password (expect 400)
- [ ] Signin with valid credentials
- [ ] Signin with invalid credentials (expect 401)
- [ ] Get current user with valid token
- [ ] Get current user with invalid token (expect 401)
- [ ] Get current user with expired token (expect 401)

**Task Operations with JWT:**
- [ ] Create task with valid token
- [ ] Create task without token (expect 401)
- [ ] List tasks with valid token (only user's tasks)
- [ ] Get task with valid token (owned by user)
- [ ] Get task with valid token (not owned by user, expect 404)
- [ ] Update task with valid token (owned by user)
- [ ] Delete task with valid token (owned by user)
- [ ] All task operations without token (expect 401)

**Token Validation:**
- [ ] Valid token with correct signature
- [ ] Invalid token with wrong signature (expect 401)
- [ ] Expired token (expect 401)
- [ ] Malformed token (expect 401)
- [ ] Missing Authorization header (expect 401)

---

## Success Criteria

1. ✅ Users can sign up with email and password
2. ✅ Users can sign in and receive JWT token
3. ✅ All task endpoints require valid JWT token
4. ✅ Authenticated user can only access their own tasks
5. ✅ Invalid/expired tokens are rejected with 401
6. ✅ URL paths no longer contain user_id parameter
7. ✅ Password hashing uses bcrypt with cost factor 12
8. ✅ JWT secret is stored in environment variable
9. ✅ Database migration adds users table and foreign key
10. ✅ Comprehensive error messages for authentication failures
11. ✅ API documentation updated with authentication requirements
12. ✅ Manual testing confirms end-to-end authentication flow

---

## Architectural Decision Records (ADRs)

### ADR Candidates Identified:

1. **ADR-001: JWT Library Selection (PyJWT vs python-jose)**
   - Decision: PyJWT 2.8.0
   - Rationale: Lightweight, well-maintained, FastAPI-recommended
   - Impact: Long-term dependency, affects token generation/validation

2. **ADR-002: Password Hashing Algorithm (bcrypt vs argon2)**
   - Decision: bcrypt with cost factor 12
   - Rationale: Battle-tested, industry standard, good performance
   - Impact: Security posture, password verification performance

**Suggestion**: Document these decisions after plan approval
- Run: `/sp.adr "JWT Library Selection - PyJWT vs python-jose"`
- Run: `/sp.adr "Password Hashing Algorithm - bcrypt vs argon2"`

---

## Next Steps

1. **Approve this plan** - Review and confirm implementation approach
2. **Create ADRs** - Document JWT library and password hashing decisions
3. **Generate tasks** - Run `/sp.tasks` to break down into actionable tasks
4. **Implement** - Run `/sp.implement` to execute all tasks with proper agent delegation
5. **Create PHR** - Document planning phase in Prompt History Record

---

## Dependencies

### New Python Packages
```txt
PyJWT==2.8.0
passlib[bcrypt]==1.7.4
```

### Environment Variables
```bash
# Existing
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# New for Spec-2
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

### Database Migration
- Alembic migration to create users table
- Alembic migration to update tasks.owner_user_id to UUID with foreign key

---

**Plan Status**: Ready for Review
**Next Command**: `/sp.tasks` (after plan approval)
