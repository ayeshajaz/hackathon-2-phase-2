---
name: database-schema-design
description: Design relational database schemas, create tables, and manage migrations efficiently.
---

# Database Schema & Migrations

## Instructions

1. **Schema design**
   - Identify entities and relationships
   - Normalize data (avoid redundancy)
   - Define primary and foreign keys

2. **Table creation**
   - Choose appropriate data types
   - Apply constraints (NOT NULL, UNIQUE)
   - Use indexes for performance

3. **Migrations**
   - Version-controlled schema changes
   - Create up and down migration files
   - Apply migrations safely across environments

## Best Practices
- Follow naming conventions consistently
- Keep schemas simple and scalable
- Avoid over-normalization
- Always test migrations before production
- Back up data before major changes

## Example Structure
```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migration example
ALTER TABLE users
ADD COLUMN password_hash TEXT NOT NULL;
