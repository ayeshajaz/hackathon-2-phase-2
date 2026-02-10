# Authentication Flow Documentation

This document provides detailed information about the JWT-based authentication system implemented in the Task Management API.

## Overview

The API uses **JWT (JSON Web Tokens)** for stateless authentication. Users must sign up to create an account, then sign in to receive a JWT token that must be included in all subsequent requests to protected endpoints.

## Authentication Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Client    │         │   Backend   │         │   Database   │
└──────┬──────┘         └──────┬──────┘         └──────┬───────┘
       │                       │                        │
       │  POST /api/auth/signup│                        │
       ├──────────────────────>│                        │
       │  {email, password}    │                        │
       │                       │  Hash password         │
       │                       │  (bcrypt cost 12)      │
       │                       │                        │
       │                       │  INSERT INTO users     │
       │                       ├───────────────────────>│
       │                       │                        │
       │                       │  Generate JWT token    │
       │  {user, token}        │  (HS256, 24h exp)      │
       │<──────────────────────┤                        │
       │                       │                        │
       │  POST /api/tasks      │                        │
       │  Authorization: Bearer│                        │
       ├──────────────────────>│                        │
       │                       │  Verify JWT signature  │
       │                       │  Extract user_id       │
       │                       │                        │
       │                       │  INSERT INTO tasks     │
       │                       │  (owner_user_id=...)   │
       │                       ├───────────────────────>│
       │  {task}               │                        │
       │<──────────────────────┤                        │
```

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
- `user_id`: UUID of the authenticated user
- `email`: User's email address
- `exp`: Expiration timestamp (Unix epoch) - 24 hours from issuance
- `iat`: Issued at timestamp (Unix epoch)

### Token Format

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzA3NjUyODAwLCJpYXQiOjE3MDc1NjY0MDB9.signature
```

**Structure:**
- **Header**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` (algorithm and type)
- **Payload**: `eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzA3NjUyODAwLCJpYXQiOjE3MDc1NjY0MDB9` (claims)
- **Signature**: `signature` (HMAC SHA256 signature)

## Authentication Endpoints

### 1. POST /api/auth/signup

Register a new user account.

**Request:**
```http
POST /api/auth/signup HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Success Response (201 Created):**
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
- `400 Bad Request`: Invalid email format or password too short (< 8 characters)
- `409 Conflict`: Email already registered

**Password Requirements:**
- Minimum 8 characters
- No maximum length (hashed with bcrypt)

---

### 2. POST /api/auth/signin

Authenticate and receive a JWT token.

**Request:**
```http
POST /api/auth/signin HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Success Response (200 OK):**
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
- `401 Unauthorized`: Invalid email or password

---

### 3. GET /api/auth/me

Get current authenticated user's information.

**Request:**
```http
GET /api/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "created_at": "2026-02-10T10:00:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing, invalid, or expired token
- `404 Not Found`: User not found in database

## Protected Endpoints

All task endpoints require JWT authentication:

- `GET /api/tasks` - List authenticated user's tasks
- `POST /api/tasks` - Create task for authenticated user
- `GET /api/tasks/{id}` - Get task (must belong to authenticated user)
- `PUT /api/tasks/{id}` - Update task (must belong to authenticated user)
- `PATCH /api/tasks/{id}/complete` - Complete task (must belong to authenticated user)
- `DELETE /api/tasks/{id}` - Delete task (must belong to authenticated user)

### Authorization Header Format

```
Authorization: Bearer <token>
```

**Example:**
```http
GET /api/tasks HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzA3NjUyODAwLCJpYXQiOjE3MDc1NjY0MDB9.signature
```

## Security Features

### Password Hashing

- **Algorithm**: bcrypt
- **Cost Factor**: 12 (approximately 300ms per hash)
- **Library**: passlib 1.7.4
- Passwords are **never** stored in plaintext
- Passwords are **never** logged

### JWT Token Security

- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: Stored in environment variable `JWT_SECRET`
- **Expiration**: 24 hours (configurable via `JWT_EXPIRATION_HOURS`)
- **Signature Verification**: Every request validates token signature
- **No Refresh Tokens**: Users must re-authenticate after expiration

### User Isolation

- User ID extracted from JWT token, **not** from URL or request body
- Database queries filter by authenticated user's UUID
- Users can **only** access their own tasks
- Attempting to access another user's task returns `404 Not Found` (not `403 Forbidden` to prevent enumeration)

## Error Handling

### Authentication Errors (401 Unauthorized)

**Missing Token:**
```json
{
  "detail": "Not authenticated"
}
```

**Invalid Token:**
```json
{
  "detail": "Invalid token"
}
```

**Expired Token:**
```json
{
  "detail": "Token has expired"
}
```

**Invalid Credentials (Signin):**
```json
{
  "detail": "Invalid email or password"
}
```

### Authorization Errors (404 Not Found)

When a user tries to access a task that doesn't belong to them:
```json
{
  "detail": "Task not found"
}
```

**Note**: We return `404` instead of `403` to prevent task ID enumeration attacks.

### Validation Errors (400 Bad Request)

**Weak Password:**
```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "ensure this value has at least 8 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

### Conflict Errors (409 Conflict)

**Duplicate Email:**
```json
{
  "detail": "Email already registered"
}
```

## Environment Configuration

Required environment variables in `.env`:

```bash
# JWT Configuration
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

**Generate a secure JWT secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Security Requirements:**
- `JWT_SECRET` must be at least 32 characters
- Never commit `JWT_SECRET` to version control
- Use different secrets for development and production
- Rotate secrets periodically in production

## Testing Authentication

### 1. Sign Up

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Save the returned token.

### 2. Sign In

```bash
curl -X POST "http://localhost:8000/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 3. Access Protected Endpoint

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:8000/api/tasks" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Invalid Token

```bash
curl -X GET "http://localhost:8000/api/tasks" \
  -H "Authorization: Bearer invalid_token"
```

Expected: `401 Unauthorized`

### 5. Test Missing Token

```bash
curl -X GET "http://localhost:8000/api/tasks"
```

Expected: `401 Unauthorized`

## Common Issues

### Issue: "JWT_SECRET environment variable is not set"

**Solution**: Add `JWT_SECRET` to your `.env` file:
```bash
JWT_SECRET=your-secret-key-at-least-32-characters-long
```

### Issue: "Token has expired"

**Solution**: Sign in again to get a new token. Tokens expire after 24 hours.

### Issue: "Invalid email or password"

**Solution**: Verify credentials are correct. Passwords are case-sensitive.

### Issue: "Email already registered"

**Solution**: Use a different email or sign in with existing account.

## Best Practices

1. **Store tokens securely** - Use secure storage (e.g., httpOnly cookies, secure localStorage)
2. **Handle token expiration** - Implement automatic re-authentication or refresh logic
3. **Use HTTPS in production** - Never send tokens over unencrypted connections
4. **Validate on every request** - Backend validates token signature on every protected endpoint
5. **Don't expose user IDs** - User identity comes from JWT token, not URL parameters
6. **Log authentication events** - Track failed login attempts for security monitoring

## Migration from Spec-1

### Breaking Changes

**URL Structure:**
- Before: `/api/{user_id}/tasks`
- After: `/api/tasks`

**Authentication:**
- Before: No authentication, user_id in URL
- After: JWT token required in Authorization header

**Migration Steps:**
1. Update all API clients to include `Authorization: Bearer <token>` header
2. Remove `user_id` from URL paths
3. Implement signup/signin flow in frontend
4. Store and manage JWT tokens securely

## References

- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
