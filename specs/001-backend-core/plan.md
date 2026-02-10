# Implementation Plan: Backend Core & Data Layer

**Branch**: `001-backend-core` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-backend-core/spec.md`

## Summary

Establish a persistent, multi-user backend foundation using FastAPI, SQLModel, and Neon Serverless PostgreSQL. Implement complete CRUD operations for task management with user-scoped data access enforced at the database query level. This backend provides RESTful API endpoints for task operations and prepares the foundation for future authentication integration.

**Primary Requirement**: Create a production-ready backend API that persists task data to Neon PostgreSQL with strict user isolation, supporting all CRUD operations through RESTful endpoints.

**Technical Approach**: Use FastAPI for the web framework, SQLModel for ORM and data validation, and Neon Serverless PostgreSQL for persistent storage. Implement user-scoped queries by filtering all database operations by owner_user_id parameter from the URL path.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.104+, SQLModel 0.0.14+, psycopg2-binary 2.9+, uvicorn 0.24+ (ASGI server), pydantic 2.5+ (data validation)
**Storage**: Neon Serverless PostgreSQL (connection via DATABASE_URL environment variable)
**Testing**: pytest 7.4+, httpx 0.25+ (for async API testing)
**Target Platform**: Linux server / Docker container
**Project Type**: Web application (backend only - this spec)
**Performance Goals**: <100ms database query time for typical operations, support 100+ concurrent requests, <5 second startup time
**Constraints**: Persistent storage only (no in-memory data), user isolation enforced at database level, all queries must filter by owner_user_id
**Scale/Scope**: Multi-user backend, single Task entity, 6 REST endpoints, prepared for authentication integration in future spec

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Spec-First Development ✅ PASS
- Complete specification exists at specs/001-backend-core/spec.md
- All 20 functional requirements documented
- 3 prioritized user stories with acceptance scenarios
- Following workflow: spec → plan → tasks → implement

### Principle II: Agentic Integrity ✅ PASS
- Implementation will use backend-api-architect agent for API routes
- Implementation will use database-schema-design agent for data models
- Implementation will use neon-db-optimizer agent for query optimization
- Complete PHR audit trail maintained

### Principle III: Security by Design ⚠️ PARTIAL COMPLIANCE (Justified)
- User isolation enforced at database query level (owner_user_id filtering)
- All queries filter by user_id from URL parameter
- **Deviation**: user_id in URL is trusted input (no JWT validation in this spec)
- **Justification**: Authentication enforcement explicitly deferred to Spec-2 per project phasing strategy. This spec establishes data layer foundation with user-scoped queries. The owner_user_id parameter can be directly replaced with authenticated user identity in Spec-2 without data model changes.
- **Mitigation**: All queries already enforce user isolation; only the source of user_id changes (URL → JWT) in future spec

### Principle IV: Deterministic Behavior ✅ PASS
- All 6 endpoints have defined inputs, outputs, error states
- HTTP status codes specified (200, 201, 204, 400, 404, 503)
- State transitions documented (task creation, updates, completion, deletion)
- Error handling comprehensive with JSON error responses

### Principle V: Separation of Concerns ✅ PASS
- Backend only (no frontend in this spec)
- Clear separation: models/ (data), api/routes/ (endpoints), database/ (connection)
- No business logic in data models (pure SQLModel definitions)
- No data access logic in route handlers (delegated to service layer if needed)

### Principle VI: Reproducibility ✅ PASS
- Complete specification with all requirements
- Implementation plan documents all architectural decisions
- PHRs created for each phase
- Environment variables documented (DATABASE_URL)
- All dependencies explicitly declared

**Gate Status**: ✅ PASS with justified deviation (authentication deferred by design)

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-core/
├── spec.md              # Feature specification
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (Task entity schema)
├── quickstart.md        # Phase 1 output (setup and testing guide)
├── contracts/           # Phase 1 output (OpenAPI specs)
│   └── tasks-api.yaml   # REST API contract for task endpoints
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database connection and session management
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py             # Task SQLModel definition
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tasks.py        # Task CRUD endpoints
│   └── schemas/
│       ├── __init__.py
│       └── task.py             # Pydantic request/response schemas
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # pytest fixtures (test database, client)
│   ├── test_tasks_api.py       # API endpoint tests
│   └── test_task_model.py      # Data model tests
├── .env.example                # Environment variable template
├── requirements.txt            # Python dependencies
└── README.md                   # Backend setup instructions
```

**Structure Decision**: Web application structure (Option 2) with backend only. Frontend will be added in a future spec. The backend/ directory contains all FastAPI application code with clear separation between models (data definitions), api/routes (HTTP endpoints), and database (connection management). Tests are colocated with source code for easy discovery.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principle III: user_id in URL is trusted (no JWT validation) | Phased implementation strategy - establish data layer foundation before adding authentication complexity | Implementing authentication in this spec would violate Principle I (spec-first) as authentication is not in scope for this spec. Deferring allows independent validation of data persistence and user-scoped queries before adding auth layer. |

**Justification**: The deviation is intentional and documented in the specification. The data model and query patterns are designed to support authentication - the owner_user_id field and filtering logic remain unchanged when JWT authentication is added. This phased approach enables:
1. Independent testing of data persistence and CRUD operations
2. Validation of user isolation at database level
3. Clear demonstration of backend architecture before auth complexity
4. Easier debugging and validation for hackathon judges

The alternative (implementing auth in this spec) would require:
- Better Auth integration (not specified in this spec)
- JWT token generation and validation
- Frontend for login/signup (out of scope)
- Mixing concerns across multiple specs

This would violate the spec-first principle and make the backend spec overly complex.
