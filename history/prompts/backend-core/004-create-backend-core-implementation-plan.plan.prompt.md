---
id: 004
title: Create backend core implementation plan
stage: plan
date: 2026-02-10
surface: agent
model: claude-haiku-4-5-20251001
feature: backend-core
branch: 001-backend-core
user: C.z
command: /sp.plan
labels: ["plan", "architecture", "backend", "fastapi", "sqlmodel", "neon", "api-design"]
links:
  spec: specs/001-backend-core/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-backend-core/plan.md
  - specs/001-backend-core/research.md
  - specs/001-backend-core/data-model.md
  - specs/001-backend-core/contracts/tasks-api.yaml
  - specs/001-backend-core/quickstart.md
  - CLAUDE.md
tests:
  - none
---

## Prompt

/sp.plan

Create:
- High-level backend architecture (FastAPI + SQLModel + Neon)
- Database schema for Task with user ownership
- REST API contract for task CRUD operations

Decisions needing documentation:
- Task schema fields (id, title, description, completed, owner_user_id, timestamps)
- User-task ownership enforcement via owner_user_id
- API route structure and naming
- Error handling strategy and HTTP status code usage

Testing & validation:
- Verify CRUD operations persist data in Neon PostgreSQL
- Confirm user-scoped queries return only owned tasks
- Validate task access isolation by user_id
- Ensure persistence across backend restarts

## Response snapshot

Created comprehensive implementation plan for Backend Core & Data Layer (001-backend-core):

**Phase 0: Research (research.md)**
- 8 technology decisions documented with rationale
- FastAPI, SQLModel, Neon PostgreSQL best practices
- Database connection management strategy
- API route structure and naming conventions
- Error handling with HTTP status codes
- User isolation enforcement at query level
- Testing strategy with pytest and httpx
- Implementation priorities (P1: Create/Read, P2: Update/Complete, P3: Delete)

**Phase 1: Design (data-model.md, contracts/, quickstart.md)**
- Complete Task entity schema with 7 fields
- SQLModel definition with validation rules
- Request/response schemas (TaskCreate, TaskUpdate, TaskResponse)
- Database indexes for performance (owner_user_id, composite)
- User isolation strategy at database query level
- OpenAPI 3.0 specification with 6 endpoints
- Comprehensive quickstart guide with setup and testing instructions

**Constitution Check Results**:
- ✅ Principle I: Spec-First Development - PASS
- ✅ Principle II: Agentic Integrity - PASS
- ⚠️ Principle III: Security by Design - PARTIAL (justified deviation: auth deferred to Spec-2)
- ✅ Principle IV: Deterministic Behavior - PASS
- ✅ Principle V: Separation of Concerns - PASS
- ✅ Principle VI: Reproducibility - PASS
- **Gate Status**: PASS with justified deviation

**Project Structure Defined**:
- Backend directory structure (models/, api/routes/, schemas/, database.py, main.py)
- Test structure (test_tasks_api.py, test_task_model.py, conftest.py)
- Documentation structure (spec, plan, research, data-model, contracts, quickstart)

**Key Architectural Decisions**:
1. FastAPI with uvicorn ASGI server
2. SQLModel for ORM and validation (single model definition)
3. Neon Serverless PostgreSQL with connection pooling
4. Dependency injection for database sessions
5. RESTful API with `/api/{user_id}/tasks` pattern
6. User isolation enforced at database query level (WHERE owner_user_id = :user_id)
7. Consistent JSON error responses with HTTP status codes
8. pytest with httpx for API testing

**API Endpoints Specified**:
- GET /api/{user_id}/tasks - List all tasks
- POST /api/{user_id}/tasks - Create task
- GET /api/{user_id}/tasks/{id} - Get specific task
- PUT /api/{user_id}/tasks/{id} - Update task
- DELETE /api/{user_id}/tasks/{id} - Delete task
- PATCH /api/{user_id}/tasks/{id}/complete - Mark complete

**Agent Context Updated**:
- Added Python 3.11+ to CLAUDE.md
- Added FastAPI, SQLModel, psycopg2-binary, uvicorn, pydantic
- Added Neon Serverless PostgreSQL
- Preserved manual additions between markers

## Outcome

- ✅ Impact: Complete architectural plan created with all design artifacts, enabling implementation phase with clear technical direction and validated constitutional compliance
- 🧪 Tests: No tests required (planning documents)
- 📁 Files: Created plan.md, research.md, data-model.md, tasks-api.yaml, quickstart.md; updated CLAUDE.md
- 🔁 Next prompts: Run /sp.tasks to break plan into implementable tasks
- 🧠 Reflection: Planning phase successfully completed with comprehensive documentation. Constitution check identified intentional deviation (auth deferred) with clear justification. All technical decisions documented with rationale. Data model designed for user isolation. API contracts fully specified with OpenAPI. Quickstart guide provides complete setup and testing instructions. Ready for task breakdown and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning artifacts created successfully
- Graders run and results (PASS/FAIL): Constitution Check PASS (with justified deviation)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Proceed to /sp.tasks to validate how plan translates to concrete implementation tasks
