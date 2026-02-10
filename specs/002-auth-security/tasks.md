---
description: "Task list for Authentication & API Security implementation"
---

# Tasks: Authentication & API Security

**Input**: Design documents from `/specs/002-auth-security/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)
**Dependencies**: Spec-1 (Backend Core & Data Layer) must be complete

**Tests**: Manual testing checklist included in plan.md. No automated tests requested in specification.

**Organization**: Tasks are grouped by implementation phase and mapped to user stories for independent testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## User Story Mapping

- **US1**: User Registration and Authentication (signup, signin, JWT tokens)
- **US2**: Secure Task API Endpoints (JWT validation, user isolation)
- **US3**: Token Management and Security (JWT generation, validation middleware)

## Path Conventions

- **Backend**: `backend/src/`, `backend/alembic/versions/`
- Paths shown below follow the web application structure from plan.md

---

## Phase 1: Foundation (Dependencies & Configuration)

**Purpose**: Add required dependencies and environment configuration for JWT authentication

**Agent**: backend-api-architect

- [ ] T001 [P] Add PyJWT==2.8.0 and passlib[bcrypt]==1.7.4 to backend/requirements.txt
- [ ] T002 [P] Update backend/.env.example with JWT environment variables (JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS) and add documentation comments
- [ ] T003 [P] Create backend/src/utils/__init__.py file

**Checkpoint**: Dependencies and configuration ready for implementation

---

## Phase 2: Data Layer (User Model & Migration)

**Purpose**: Create User model and database migration to support authentication

**Agent**: database-schema-design (then neon-db-optimizer for review)

- [ ] T004 [P] [US1] Create User SQLModel in backend/src/models/user.py with fields (id as UUID primary key, email as unique indexed string, hashed_password as string, created_at, updated_at) following same patterns as Task model
- [ ] T005 [P] [US1] Create UserCreate schema in backend/src/schemas/user.py with email and password fields, add email validation
- [ ] T006 [P] [US1] Create UserResponse schema in backend/src/schemas/user.py with id, email, created_at fields (exclude hashed_password)
- [ ] T007 [P] [US1] Create SignupRequest, SigninRequest, and AuthResponse schemas in backend/src/schemas/auth.py for authentication endpoints
- [ ] T008 [US1] Generate Alembic migration to create users table with all columns and indexes using: alembic revision --autogenerate -m "Add users table"
- [ ] T009 [US1] Update Task model in backend/src/models/task.py to change owner_user_id from String(100) to UUID type and add foreign_key="users.id"
- [ ] T010 [US1] Generate Alembic migration to update tasks.owner_user_id to UUID with foreign key constraint using: alembic revision --autogenerate -m "Update tasks owner_user_id to UUID with foreign key"
- [ ] T011 [US1] Apply migrations to database using: alembic upgrade head (verify in Neon console that users table exists and tasks.owner_user_id is UUID)

**Checkpoint**: Database schema updated with users table and foreign key relationship

---

## Phase 3: Authentication Logic (Auth Endpoints)

**Purpose**: Implement password hashing, JWT generation, and authentication endpoints

**Agent**: auth-security-specialist

- [ ] T012 [P] [US1] [US3] Create password hashing utilities in backend/src/utils/password.py with hash_password() and verify_password() functions using passlib with bcrypt cost factor 12
- [ ] T013 [P] [US3] Create JWT utilities in backend/src/utils/jwt_utils.py with create_access_token() and verify_token() functions using PyJWT, reading JWT_SECRET, JWT_ALGORITHM, and JWT_EXPIRATION_HOURS from environment
- [ ] T014 [US1] Create auth routes file backend/src/api/routes/auth.py with APIRouter initialization
- [ ] T015 [US1] Implement POST /api/auth/signup endpoint in backend/src/api/routes/auth.py that validates email/password, checks for duplicate email (return 409 Conflict), hashes password, creates user in database, generates JWT token, returns AuthResponse with user and token (201 Created)
- [ ] T016 [US1] Implement POST /api/auth/signin endpoint in backend/src/api/routes/auth.py that validates credentials, verifies password hash, generates JWT token, returns AuthResponse with user and token (200 OK) or 401 Unauthorized for invalid credentials
- [ ] T017 [US1] Implement GET /api/auth/me endpoint in backend/src/api/routes/auth.py that requires authentication (will add dependency in Phase 4), returns UserResponse with current user data (200 OK)
- [ ] T018 [US1] Register auth routes with FastAPI app in backend/src/main.py using app.include_router() with prefix="/api/auth"

**Checkpoint**: Authentication endpoints functional (signup, signin work; /me endpoint needs JWT middleware from Phase 4)

---

## Phase 4: JWT Middleware (Token Validation)

**Purpose**: Create reusable JWT validation middleware for protecting endpoints

**Agent**: auth-security-specialist

- [ ] T019 [P] [US3] Create middleware directory backend/src/api/middleware/__init__.py
- [ ] T020 [US2] [US3] Create JWT authentication middleware in backend/src/api/middleware/jwt_auth.py with get_current_user() dependency function that extracts token from Authorization header, validates token using verify_token(), handles missing/invalid/expired tokens (raise 401 HTTPException), returns user_id from token payload
- [ ] T021 [US1] Update GET /api/auth/me endpoint in backend/src/api/routes/auth.py to use Depends(get_current_user) to get authenticated user_id, query user from database, return UserResponse

**Checkpoint**: JWT middleware functional and testable via /api/auth/me endpoint

---

## Phase 5: Secure Task Endpoints (Update Existing Routes)

**Purpose**: Remove user_id from URLs and enforce JWT authentication on all task endpoints

**Agent**: backend-api-architect

- [ ] T022 [US2] Update GET /api/tasks endpoint in backend/src/api/routes/tasks.py to remove {user_id} path parameter, add Depends(get_current_user) to get authenticated user_id, filter tasks by authenticated user_id, handle 401 for missing/invalid token
- [ ] T023 [US2] Update POST /api/tasks endpoint in backend/src/api/routes/tasks.py to remove {user_id} path parameter, add Depends(get_current_user), use authenticated user_id for owner_user_id field, handle 401 for missing/invalid token
- [ ] T024 [US2] Update GET /api/tasks/{id} endpoint in backend/src/api/routes/tasks.py to remove {user_id} path parameter, add Depends(get_current_user), filter by authenticated user_id and task_id, return 404 if task doesn't exist or doesn't belong to user, handle 401 for missing/invalid token
- [ ] T025 [US2] Update PUT /api/tasks/{id} endpoint in backend/src/api/routes/tasks.py to remove {user_id} path parameter, add Depends(get_current_user), filter by authenticated user_id and task_id, return 404 if task doesn't exist or doesn't belong to user, handle 401 for missing/invalid token
- [ ] T026 [US2] Update PATCH /api/tasks/{id}/complete endpoint in backend/src/api/routes/tasks.py to remove {user_id} path parameter, add Depends(get_current_user), filter by authenticated user_id and task_id, return 404 if task doesn't exist or doesn't belong to user, handle 401 for missing/invalid token
- [ ] T027 [US2] Update DELETE /api/tasks/{id} endpoint in backend/src/api/routes/tasks.py to remove {user_id} path parameter, add Depends(get_current_user), filter by authenticated user_id and task_id, return 404 if task doesn't exist or doesn't belong to user, handle 401 for missing/invalid token

**Checkpoint**: All task endpoints secured with JWT authentication, user_id removed from URLs

---

## Phase 6: Documentation & Testing

**Purpose**: Update documentation and perform comprehensive manual testing

**Agent**: backend-api-architect

- [ ] T028 [P] Update backend/README.md with authentication setup instructions (JWT environment variables, signup/signin flow, Authorization header format)
- [ ] T029 [P] Create backend/docs/authentication.md with detailed authentication flow documentation, JWT token structure, error handling, and example curl commands for signup, signin, and authenticated requests
- [ ] T030 [P] Update OpenAPI documentation in backend/src/main.py with security scheme definition for Bearer token authentication
- [ ] T031 Manual testing: Execute complete authentication flow (signup → signin → create task → list tasks → get task → update task → complete task → delete task) and verify all endpoints require valid JWT token, expired tokens are rejected, users can only access their own tasks

**Checkpoint**: Documentation complete and manual testing confirms end-to-end authentication flow

---

## Testing Strategy

### Manual Testing Checklist (from plan.md)

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

## Success Criteria (from spec.md)

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

## Agent Delegation Summary

- **Phase 1**: backend-api-architect (dependencies, configuration)
- **Phase 2**: database-schema-design → neon-db-optimizer (user model, migrations)
- **Phase 3**: auth-security-specialist (password hashing, JWT, auth endpoints)
- **Phase 4**: auth-security-specialist (JWT middleware)
- **Phase 5**: backend-api-architect (update task endpoints)
- **Phase 6**: backend-api-architect (documentation, testing)

---

## Breaking Changes

**URL Structure Changes:**
- Before: `/api/{user_id}/tasks`
- After: `/api/tasks`

**Authentication Requirements:**
- Before: No authentication, user_id trusted from URL
- After: All task endpoints require `Authorization: Bearer <token>` header

**Migration Impact:**
- Existing tasks table: owner_user_id changes from String to UUID
- Acceptable data loss: Drop existing tasks during migration (hackathon project)

---

**Task Status**: Ready for Implementation
**Next Command**: `/sp.implement` (after task approval)
