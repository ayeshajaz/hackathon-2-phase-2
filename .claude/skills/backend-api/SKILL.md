---
name: backend-api
description: Generate backend routes, handle requests and responses, and connect applications to a database.
---

# Backend API Development

## Instructions

1. **Route creation**
   - Define RESTful routes (GET, POST, PUT, DELETE)
   - Organize routes by feature or resource
   - Use clear and consistent URL naming

2. **Request & response handling**
   - Validate incoming request data
   - Handle query params, route params, and request bodies
   - Return structured JSON responses
   - Use proper HTTP status codes (200, 201, 400, 401, 404, 500)

3. **Database integration**
   - Connect to a database (SQL or NoSQL)
   - Perform CRUD operations
   - Use environment variables for DB credentials
   - Handle connection and query errors safely

4. **Error handling**
   - Centralized error middleware
   - Meaningful error messages
   - Avoid exposing sensitive information

## Best Practices
- Follow REST API conventions
- Keep controllers thin and logic reusable
- Validate data before DB operations
- Use async/await for readability
- Secure routes where required (auth middleware)

## Example Structure
```ts
// routes/user.routes.ts
import express from 'express';
import { createUser, getUsers } from '../controllers/user.controller';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);

export default router;
