---
id: 002
title: Create project constitution
stage: constitution
date: 2026-02-10
surface: agent
model: claude-haiku-4-5-20251001
feature: none
branch: master
user: C.z
command: /sp.constitution
labels: ["constitution", "governance", "principles", "project-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

Project: Todo Full-Stack Web Application (Phase II – Web & Multi-User)

Objective:
Transform a console-based todo application into a modern, secure, multi-user full-stack web application using a fully spec-driven, agentic development workflow. All development must be performed via Claude Code and Spec-Kit Plus with no manual coding.

Core principles:
- Spec-first development (no implementation without approved specs)
- Agentic integrity (all code generated via Claude Code only)
- Security by design (authentication, authorization, and data isolation enforced at all layers)
- Deterministic behavior (clear inputs, outputs, and state transitions)
- Separation of concerns (frontend, backend, auth, and data layers clearly scoped)
- Reproducibility (any reviewer can re-run the process from specs alone)

Key standards:
- Every feature must map directly to an explicit requirement in a spec
- Every API endpoint must have: Defined inputs, Defined outputs, Auth requirements, Error states
- All data access must be user-scoped and enforced server-side
- Authentication must be stateless and JWT-based
- No hard-coded secrets; environment variables only
- Frontend must never trust user identity without backend verification
- All assumptions must be stated explicitly in specs

Technology constraints:
- Frontend: Next.js 16+ (App Router only)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT
- API style: REST (no GraphQL)
- Communication: JSON over HTTPS

Development constraints:
- No manual coding allowed at any stage
- All implementation must follow the flow: Write spec → Generate plan → Break into tasks → Implement via Claude Code
- Each phase must be reviewable independently
- No skipping steps or merging phases
- No speculative features beyond stated requirements

Security constraints:
- All API routes require a valid JWT after authentication is enabled
- Requests without valid tokens must return 401 Unauthorized
- Users may only access or modify their own tasks
- JWT secret must be shared securely between frontend and backend
- Token expiry must be enforced
- Backend must never rely on client-provided user IDs

Data constraints:
- Persistent storage required (no in-memory storage)
- Task ownership must be enforced at the database query level
- Schema migrations must be deterministic
- No data leakage between users under any scenario

Quality standards:
- Clear, readable, production-grade code structure
- Meaningful error handling and status codes
- Consistent naming across frontend, backend, and database
- No dead code or unused endpoints
- Responsive and accessible UI

Success criteria:
- All 5 basic-level features implemented as a web application
- Multi-user support with strict user isolation
- Secure authentication and authorization fully enforced
- Backend API fully functional and protected
- Frontend successfully consumes secured API
- Entire project can be evaluated via specs, prompts, and generated code alone

## Response snapshot

Created comprehensive project constitution (version 1.0.0) with the following structure:

**Core Principles (6)**:
1. Spec-First Development (NON-NEGOTIABLE) - No implementation without approved specs
2. Agentic Integrity - All code via Claude Code only, no manual coding
3. Security by Design - Authentication, authorization, data isolation at all layers
4. Deterministic Behavior - Clear inputs, outputs, state transitions
5. Separation of Concerns - Frontend, backend, auth, data layers clearly scoped
6. Reproducibility - Process re-runnable from specs alone

**Additional Sections**:
- Technology Constraints - Mandatory stack (Next.js 16+, FastAPI, SQLModel, Neon, Better Auth) and prohibited practices
- Development Workflow - Mandatory process flow with agent delegation rules
- Security Requirements - Authentication, authorization, secrets management, data protection
- Data Integrity - Storage requirements, user isolation, migration policy
- Quality Standards - Code quality, API design, frontend quality, testing
- Success Criteria - Feature, technical, process completeness and demonstration requirements
- Governance - Constitution authority, amendment process, compliance, review requirements

**Key Features**:
- All placeholders filled with concrete values
- No bracketed tokens remaining
- Sync Impact Report included as HTML comment
- Version 1.0.0 ratified and amended on 2026-02-10
- Agent delegation rules explicitly defined
- JWT authentication flow documented
- Multi-user isolation requirements specified

**Template Alignment**:
- Reviewed spec-template.md, plan-template.md, tasks-template.md
- Templates align with constitution principles
- Constitution Check section in plan-template references constitution file
- User story prioritization in spec-template supports incremental delivery
- Task organization by user story enables independent implementation

## Outcome

- ✅ Impact: Project constitution established as authoritative governance document, defining all principles, constraints, and workflows for the full-stack web application transformation
- 🧪 Tests: No tests required (governance document)
- 📁 Files: Created .specify/memory/constitution.md (263 lines, version 1.0.0)
- 🔁 Next prompts: Begin feature specification using /sp.specify for first feature (e.g., user authentication, task management)
- 🧠 Reflection: Constitution provides clear boundaries for agentic development, ensures security-first approach, and establishes reproducibility as core requirement. All six principles are testable and enforceable.

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution created successfully with all placeholders filled
- Graders run and results (PASS/FAIL): N/A (governance document)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Create first feature specification to validate constitution principles in practice
