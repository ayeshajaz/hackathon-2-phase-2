---
id: 002
title: Create Authentication & API Security Implementation Plan
stage: plan
date: 2026-02-10
surface: agent
model: claude-haiku-4-5
feature: 002-auth-security
branch: 001-backend-core
user: C.z
command: /sp.plan
labels: ["authentication", "jwt", "planning", "architecture", "security"]
links:
  spec: specs/002-auth-security/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-auth-security/plan.md
tests:
  - None (planning phase)
---

## Prompt

User requested to continue with the planning phase for Spec-2: Authentication & API Security after specification was created.

## Response snapshot

Created comprehensive implementation plan with:

**Constitution Compliance:**
- ✅ All 6 principles verified (Spec-First, Agentic Integrity, Security by Design, Deterministic Behavior, Separation of Concerns, Reproducibility)
- Agent delegation plan: auth-security-specialist, backend-api-architect, database-schema-design, neon-db-optimizer

**5 Technology Decisions with Rationale:**
1. **JWT Library**: PyJWT 2.8.0 (lightweight, FastAPI-recommended) - ADR candidate
2. **Password Hashing**: bcrypt with cost factor 12 (battle-tested, industry standard) - ADR candidate
3. **Token Expiration**: 24 hours without refresh tokens (balanced security/UX)
4. **User ID Format**: UUID v4 (prevents enumeration, globally unique)
5. **JWT Middleware**: FastAPI Dependency Injection (idiomatic, testable)

**Data Model Changes:**
- New User entity: UUID primary key, email (unique, indexed), hashed_password, timestamps
- Modified Task entity: owner_user_id changed from String(100) to UUID with foreign key to users.id
- Database migration required to add users table and update tasks table

**API Contract Changes:**
- New endpoints: POST /api/auth/signup, POST /api/auth/signin, GET /api/auth/me
- Modified task endpoints: Remove user_id from URLs (/api/{user_id}/tasks → /api/tasks)
- All task endpoints require Authorization: Bearer <token> header
- User identity extracted from JWT token, not URL parameter

**6 Implementation Phases (27 tasks):**
1. Foundation: Dependencies & configuration (3 tasks)
2. Data Layer: User model & migration (5 tasks)
3. Authentication Logic: Auth endpoints (7 tasks)
4. JWT Middleware: Token validation (3 tasks)
5. Secure Task Endpoints: Update existing routes (5 tasks)
6. Documentation & Testing: Docs and manual testing (4 tasks)

**Risk Mitigation:**
- JWT secret exposure: Use .env, never commit
- Migration data loss: Backup, test in dev first
- Breaking changes: Document URL changes, migration guide
- Token expiration UX: Clear error messages, 24h is reasonable

**ADR Candidates Identified:**
- ADR-001: JWT Library Selection (PyJWT vs python-jose)
- ADR-002: Password Hashing Algorithm (bcrypt vs argon2)

## Outcome

- ✅ Impact: Complete implementation plan with research, data model, API contracts, and 6-phase approach
- 🧪 Tests: Manual testing checklist with 20+ test cases for authentication and task operations
- 📁 Files: Created specs/002-auth-security/plan.md
- 🔁 Next prompts: Create ADRs for significant decisions, then run /sp.tasks to generate task breakdown
- 🧠 Reflection: Plan addresses breaking changes (URL structure), data migration (String to UUID), and security requirements (JWT, bcrypt). Agent delegation clearly defined for each phase.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (planning phase)
- Prompt variant (if applicable): Standard /sp.plan workflow
- Next experiment (smallest change to try): Proceed to task generation with clear agent assignments
