---
name: auth-skill
description: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions

1. **User Signup**
   - Validate user input (email, password)
   - Hash passwords before storing
   - Prevent duplicate accounts

2. **User Signin**
   - Verify credentials securely
   - Compare hashed passwords
   - Handle invalid login attempts

3. **Password Security**
   - Use strong hashing algorithms (bcrypt / argon2)
   - Apply proper salting
   - Never store plain-text passwords

4. **JWT Authentication**
   - Generate JWT on successful login
   - Store tokens securely (httpOnly cookies or secure storage)
   - Verify tokens on protected routes
   - Handle token expiration and refresh

5. **Better Auth Integration**
   - Configure Better Auth provider
   - Connect auth flow with frontend and backend
   - Manage sessions and middleware
   - Protect routes using Better Auth guards

## Best Practices
- Use environment variables for secrets
- Set proper token expiration times
- Use HTTPS in production
- Implement logout and token invalidation
- Add rate limiting to auth endpoints

## Example Structure
```ts
// Signup
const hashedPassword = await bcrypt.hash(password, 10);
await db.user.create({
  email,
  password: hashedPassword,
});

// Signin
const isValid = await bcrypt.compare(password, user.password);
if (!isValid) throw new Error('Invalid credentials');

// JWT
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
