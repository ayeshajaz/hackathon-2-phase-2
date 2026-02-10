# Spec-2: Authentication & API Security

**Feature**: User Authentication with Better Auth and JWT Token Validation
**Status**: Draft
**Created**: 2026-02-10
**Owner**: Backend Team
**Dependencies**: Spec-1 (Backend Core & Data Layer)

---

## Overview

Transform the current trusted user_id system into a secure authentication system using Better Auth and JWT tokens. Users will sign up, sign in, and receive JWT tokens that must be validated on every API request. The backend will extract the authenticated user identity from the JWT token and enforce data ownership, eliminating the need for user_id in URL paths.

### Current State (Spec-1)
- Task API endpoints accept `user_id` as a path parameter (e.g., `/api/{user_id}/tasks`)
- No authentication or authorization
- User identity is trusted from the URL path
- Any client can access any user's data by changing the user_id parameter

### Target State (Spec-2)
- Users must sign up and sign in to receive JWT tokens
- All task API endpoints require valid JWT token in `Authorization: Bearer <token>` header
- User identity is extracted from the validated JWT token
- URL paths no longer contain user_id (e.g., `/api/tasks` instead of `/api/{user_id}/tasks`)
- Backend enforces data ownership: users can only access their own tasks

---

## User Stories

### P1: User Registration and Authentication
**As a** new user
**I want to** sign up with email and password
**So that** I can create an account and access the task management system

**Acceptance Criteria:**
- User can sign up with email and password
- Password is securely hashed (bcrypt/argon2) before storage
- User receives a JWT token upon successful signup
- Duplicate email addresses are rejected with clear error message
- Password must meet minimum security requirements (8+ characters)

**As a** returning user
**I want to** sign in with my credentials
**So that** I can access my tasks

**Acceptance Criteria:**
- User can sign in with email and password
- Successful signin returns a JWT token
- Invalid credentials return 401 Unauthorized with clear error message
- JWT token contains user ID, email, and expiration time

---

### P2: Secure Task API Endpoints
**As an** authenticated user
**I want** all task operations to require authentication
**So that** only I can access and manage my tasks

**Acceptance Criteria:**
- All task endpoints require valid JWT token in Authorization header
- Missing token returns 401 Unauthorized
- Invalid/expired token returns 401 Unauthorized with specific error message
- User identity is extracted from JWT token, not URL path
- Task operations automatically filter by authenticated user ID
- URL paths no longer contain user_id parameter

**Endpoints to secure:**
- `GET /api/tasks` - List authenticated user's tasks
- `POST /api/tasks` - Create task for authenticated user
- `GET /api/tasks/{id}` - Get task (must belong to authenticated user)
- `PUT /api/tasks/{id}` - Update task (must belong to authenticated user)
- `PATCH /api/tasks/{id}/complete` - Complete task (must belong to authenticated user)
- `DELETE /api/tasks/{id}` - Delete task (must belong to authenticated user)

---

### P3: Token Management and Security
**As a** system administrator
**I want** JWT tokens to be securely generated and validated
**So that** the authentication system is secure and reliable

**Acceptance Criteria:**
- JWT secret is stored in environment variable, never hardcoded
- Tokens have reasonable expiration time (e.g., 24 hours)
- Token signature is validated on every request
- Expired tokens are rejected with 401 and clear error message
- Token payload includes: user_id, email, issued_at, expires_at
- Token validation middleware is reusable across all protected endpoints

---

## Functional Requirements

### Authentication Endpoints

**FR-1: User Signup**
- Endpoint: `POST /api/auth/signup`
- Request body: `{ "email": "user@example.com", "password": "securepass123" }`
- Response: `{ "user": { "id": "uuid", "email": "user@example.com" }, "token": "jwt_token" }`
- Status codes: 201 Created, 400 Bad Request (validation), 409 Conflict (duplicate email)

**FR-2: User Signin**
- Endpoint: `POST /api/auth/signin`
- Request body: `{ "email": "user@example.com", "password": "securepass123" }`
- Response: `{ "user": { "id": "uuid", "email": "user@example.com" }, "token": "jwt_token" }`
- Status codes: 200 OK, 401 Unauthorized (invalid credentials)

**FR-3: Get Current User**
- Endpoint: `GET /api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Response: `{ "id": "uuid", "email": "user@example.com", "created_at": "2026-02-10T10:00:00Z" }`
- Status codes: 200 OK, 401 Unauthorized

### Security Requirements

**FR-4: Password Security**
- Passwords must be hashed using bcrypt or argon2
- Minimum password length: 8 characters
- Never store or log plaintext passwords
- Password validation on signup

**FR-5: JWT Token Generation**
- Use PyJWT library for token generation
- Token payload: `{ "user_id": "uuid", "email": "user@example.com", "exp": timestamp, "iat": timestamp }`
- Token signed with HS256 algorithm
- Secret key from environment variable `JWT_SECRET`
- Token expiration: 24 hours (configurable)

**FR-6: JWT Token Validation**
- Middleware extracts token from `Authorization: Bearer <token>` header
- Validates token signature using JWT_SECRET
- Checks token expiration
- Extracts user_id from token payload
- Attaches user_id to request context for route handlers
- Returns 401 for missing, invalid, or expired tokens

**FR-7: User Data Model**
- Create `users` table with columns:
  - `id` (UUID, primary key)
  - `email` (String, unique, indexed)
  - `hashed_password` (String)
  - `created_at` (DateTime)
  - `updated_at` (DateTime)
- Add foreign key relationship: `tasks.owner_user_id` references `users.id`

**FR-8: Update Task Endpoints**
- Remove `user_id` from URL paths
- Use authenticated user_id from JWT token
- Maintain user isolation at database query level
- Return 404 for tasks not owned by authenticated user

### Error Handling

**FR-9: Authentication Errors**
- 401 Unauthorized: Missing, invalid, or expired token
- 401 Unauthorized: Invalid signin credentials
- 409 Conflict: Email already exists during signup
- 400 Bad Request: Validation errors (weak password, invalid email)

**FR-10: Authorization Errors**
- 404 Not Found: Task doesn't exist or doesn't belong to authenticated user
- Never reveal whether a task exists if user doesn't own it

---

## Non-Functional Requirements

### Security
- **NFR-1**: JWT secret must be at least 32 characters, stored in environment variable
- **NFR-2**: All authentication endpoints must use HTTPS in production
- **NFR-3**: Password hashing must use bcrypt with cost factor 12 or argon2
- **NFR-4**: Token validation must complete in <10ms
- **NFR-5**: Rate limiting on auth endpoints: 5 requests per minute per IP

### Performance
- **NFR-6**: Authentication middleware adds <5ms overhead per request
- **NFR-7**: Signup/signin endpoints respond in <200ms (p95)
- **NFR-8**: Database queries for user lookup use indexed email column

### Reliability
- **NFR-9**: Authentication failures are logged with context (email, IP, timestamp)
- **NFR-10**: System remains functional if Better Auth service is unavailable (graceful degradation)

### Maintainability
- **NFR-11**: JWT validation logic is centralized in reusable middleware
- **NFR-12**: User model follows same SQLModel patterns as Task model
- **NFR-13**: Authentication code is well-documented with security considerations

---

## Success Criteria

1. ✅ Users can sign up with email and password
2. ✅ Users can sign in and receive JWT token
3. ✅ All task endpoints require valid JWT token
4. ✅ Authenticated user can only access their own tasks
5. ✅ Invalid/expired tokens are rejected with 401
6. ✅ URL paths no longer contain user_id parameter
7. ✅ Password hashing uses bcrypt or argon2
8. ✅ JWT secret is stored in environment variable
9. ✅ Database migration adds users table and foreign key
10. ✅ Comprehensive error messages for authentication failures
11. ✅ API documentation updated with authentication requirements
12. ✅ Manual testing confirms end-to-end authentication flow

---

## Out of Scope

The following are explicitly **not** included in this specification:

- OAuth/social login (Google, GitHub, etc.)
- Password reset/forgot password functionality
- Email verification
- Multi-factor authentication (MFA)
- Refresh tokens
- Session management beyond JWT
- User profile management (update email, change password)
- Role-based access control (RBAC)
- API rate limiting (beyond basic auth endpoint protection)
- Frontend authentication UI (covered in future spec)

---

## Dependencies

### External Dependencies
- **Better Auth**: JWT token generation and validation library
- **PyJWT**: Python JWT implementation
- **passlib[bcrypt]**: Password hashing library
- **python-jose**: Alternative JWT library (if Better Auth doesn't provide JWT)

### Internal Dependencies
- **Spec-1**: Backend Core & Data Layer must be complete
- **Database**: Neon PostgreSQL with existing tasks table
- **Alembic**: Database migrations for users table

### Environment Variables
```bash
# Existing
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# New for Spec-2
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

---

## Risks

### High Risk
1. **JWT Secret Exposure**: If JWT_SECRET is leaked, all tokens can be forged
   - Mitigation: Use strong secret, rotate periodically, never commit to git

2. **Password Security**: Weak hashing or storage could expose user credentials
   - Mitigation: Use bcrypt with cost factor 12, never log passwords

### Medium Risk
3. **Token Expiration**: Long-lived tokens increase security risk
   - Mitigation: Set reasonable expiration (24 hours), implement refresh tokens in future

4. **Migration Complexity**: Adding users table and foreign key to existing tasks
   - Mitigation: Test migration thoroughly, backup database before applying

### Low Risk
5. **Performance Overhead**: JWT validation on every request adds latency
   - Mitigation: Optimize validation logic, use caching if needed

6. **Breaking Changes**: Removing user_id from URLs breaks existing API clients
   - Mitigation: This is expected for hackathon project, document migration guide

---

## API Behavior Changes

### Before (Spec-1)
```bash
# Create task for user123
POST /api/user123/tasks
Body: { "title": "My task" }

# List tasks for user123
GET /api/user123/tasks
```

### After (Spec-2)
```bash
# Sign up
POST /api/auth/signup
Body: { "email": "user@example.com", "password": "securepass123" }
Response: { "user": {...}, "token": "eyJhbGc..." }

# Sign in
POST /api/auth/signin
Body: { "email": "user@example.com", "password": "securepass123" }
Response: { "user": {...}, "token": "eyJhbGc..." }

# Create task (authenticated)
POST /api/tasks
Headers: Authorization: Bearer eyJhbGc...
Body: { "title": "My task" }

# List tasks (authenticated)
GET /api/tasks
Headers: Authorization: Bearer eyJhbGc...
```

---

## Next Steps

After this specification is approved:
1. Run `/sp.plan` to create implementation plan
2. Run `/sp.tasks` to generate task breakdown
3. Run `/sp.implement` to execute implementation
4. Create Spec-3 for Frontend (Next.js with Better Auth integration)

---

## References

- [Better Auth Documentation](https://www.better-auth.com/)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
