# Todo Full-Stack Web Application Constitution

<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- Modified principles: N/A (initial creation)
- Added sections: Core Principles (6), Technology Constraints, Development Workflow, Security Requirements, Data Integrity, Quality Standards, Success Criteria, Governance
- Removed sections: N/A
- Templates requiring updates:
  ✅ constitution.md (this file)
  ⚠ plan-template.md (pending review)
  ⚠ spec-template.md (pending review)
  ⚠ tasks-template.md (pending review)
- Follow-up TODOs: Review and align all template files with new constitution principles
-->

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)

No implementation without approved specifications. Every feature, endpoint, and component MUST:
- Have an explicit specification document before any code is written
- Map directly to stated requirements in the spec
- Follow the workflow: Write spec → Generate plan → Break into tasks → Implement
- Be reviewable independently at each phase
- Never skip steps or merge phases

**Rationale**: Spec-first development ensures reproducibility, clear requirements, and prevents scope creep. Any reviewer can validate the process from specs alone.

### II. Agentic Integrity

All code MUST be generated via Claude Code and Spec-Kit Plus only. Manual coding is strictly prohibited.

**Requirements**:
- No manual code editing at any stage
- All implementation through Claude Code agents
- Proper agent delegation (auth-security-specialist, nextjs-app-builder, database-schema-design, backend-api-architect)
- Complete audit trail via Prompt History Records (PHRs)

**Rationale**: Ensures process consistency, reproducibility, and allows evaluation of the agentic development workflow itself.

### III. Security by Design

Authentication, authorization, and data isolation MUST be enforced at all layers.

**Requirements**:
- All API routes require valid JWT after authentication is enabled
- Requests without valid tokens MUST return 401 Unauthorized
- Users may only access or modify their own data
- JWT secret MUST be shared securely between frontend and backend via environment variables
- Token expiry MUST be enforced
- Backend MUST never rely on client-provided user IDs
- Frontend MUST never trust user identity without backend verification

**Rationale**: Multi-user applications require strict security boundaries to prevent data leakage and unauthorized access.

### IV. Deterministic Behavior

All system components MUST have clear inputs, outputs, and state transitions.

**Requirements**:
- Every API endpoint MUST define: inputs, outputs, auth requirements, error states
- All assumptions MUST be stated explicitly in specs
- State transitions MUST be predictable and documented
- Error handling MUST be comprehensive with meaningful status codes

**Rationale**: Deterministic systems are testable, debuggable, and maintainable.

### V. Separation of Concerns

Frontend, backend, authentication, and data layers MUST be clearly scoped and independent.

**Requirements**:
- Frontend: Next.js 16+ App Router (presentation and user interaction only)
- Backend: Python FastAPI (business logic and data access)
- Authentication: Better Auth with JWT (identity and session management)
- Database: Neon Serverless PostgreSQL with SQLModel ORM (persistent storage)
- Clear API contracts between layers
- No business logic in frontend
- No presentation logic in backend

**Rationale**: Clear boundaries enable independent development, testing, and maintenance of each layer.

### VI. Reproducibility

Any reviewer MUST be able to re-run the entire development process from specs alone.

**Requirements**:
- Complete documentation of all decisions via specs, plans, and tasks
- Architectural Decision Records (ADRs) for significant choices
- Prompt History Records (PHRs) for all development steps
- No undocumented manual interventions
- Environment setup documented
- All dependencies explicitly declared

**Rationale**: Reproducibility enables validation, learning, and process improvement.

## Technology Constraints

**Mandatory Stack**:
- Frontend: Next.js 16+ (App Router only, no Pages Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- API Style: REST (no GraphQL)
- Communication: JSON over HTTPS

**Prohibited**:
- Manual coding or editing
- Hard-coded secrets or credentials
- In-memory storage for persistent data
- Client-side user identity trust
- Mixing App Router and Pages Router patterns

## Development Workflow

**Mandatory Process**:
1. Write specification using `/sp.specify`
2. Generate architectural plan using `/sp.plan`
3. Break into testable tasks using `/sp.tasks`
4. Implement via Claude Code with proper agent delegation
5. Create PHR for each significant step
6. Suggest ADR for architectural decisions

**Agent Delegation Rules**:
- Authentication work → auth-security-specialist agent
- Frontend work → nextjs-app-builder agent
- Database work → database-schema-design agent (followed by neon-db-optimizer)
- Backend API work → backend-api-architect agent

**Phase Independence**:
- Each phase MUST be reviewable independently
- No skipping steps
- No merging phases
- No speculative features beyond stated requirements

## Security Requirements

**Authentication**:
- Stateless JWT-based authentication only
- Token-based session management
- Secure token storage and transmission
- Token expiry enforcement

**Authorization**:
- User-scoped data access enforced at database query level
- Server-side authorization checks on every protected endpoint
- No client-side authorization decisions

**Secrets Management**:
- All secrets in environment variables
- No hard-coded credentials
- Secure sharing of JWT secret between frontend and backend
- No secrets in version control

**Data Protection**:
- No data leakage between users under any scenario
- User isolation enforced at database level
- Audit trail for sensitive operations

## Data Integrity

**Storage Requirements**:
- Persistent storage required (no in-memory storage)
- Task ownership enforced at database query level
- Schema migrations MUST be deterministic
- Data validation at model level

**User Isolation**:
- Every data access MUST filter by authenticated user
- Database queries MUST enforce ownership
- No cross-user data visibility
- Strict foreign key relationships

**Migration Policy**:
- All schema changes via migrations
- Migrations MUST be reversible where possible
- Migration testing required before deployment

## Quality Standards

**Code Quality**:
- Clear, readable, production-grade code structure
- Meaningful variable and function names
- Consistent naming across frontend, backend, and database
- No dead code or unused endpoints
- Proper error handling with meaningful messages

**API Design**:
- RESTful conventions followed
- Consistent endpoint naming
- Proper HTTP status codes
- Comprehensive error responses
- OpenAPI/Swagger documentation

**Frontend Quality**:
- Responsive design (mobile, tablet, desktop)
- Accessible UI (WCAG guidelines)
- Loading states and error handling
- Consistent styling and components

**Testing**:
- API endpoints testable via tools (Postman, curl)
- Frontend components functional and responsive
- Error scenarios handled gracefully

## Success Criteria

**Feature Completeness**:
- All 5 basic-level features implemented as web application
- Multi-user support with strict user isolation
- Secure authentication and authorization fully enforced

**Technical Completeness**:
- Backend API fully functional and protected
- Frontend successfully consumes secured API
- Database properly structured with relationships
- JWT authentication flow working end-to-end

**Process Completeness**:
- Entire project evaluable via specs, prompts, and generated code alone
- Complete audit trail via PHRs
- ADRs for all significant architectural decisions
- No manual coding interventions

**Demonstration**:
- Project clearly demonstrates agentic development workflow
- Process is reproducible by reviewers
- Each phase independently reviewable

## Governance

**Constitution Authority**:
This constitution supersedes all other development practices and guidelines. All development work MUST comply with these principles.

**Amendment Process**:
- Amendments require explicit documentation
- Version bump according to semantic versioning (MAJOR.MINOR.PATCH)
- MAJOR: Backward incompatible principle changes
- MINOR: New principles or material expansions
- PATCH: Clarifications, wording fixes, non-semantic refinements
- All amendments MUST include rationale and migration plan

**Compliance**:
- All specs, plans, and tasks MUST verify compliance with constitution
- PHRs MUST reference relevant constitutional principles
- ADRs MUST justify decisions against constitutional constraints
- Any deviation MUST be explicitly documented and justified

**Review Requirements**:
- Constitution review before starting new features
- Principle compliance check during spec approval
- Architectural decisions validated against constraints
- Post-implementation review for adherence

**Documentation**:
- Use CLAUDE.md for runtime development guidance
- Use constitution.md for immutable project principles
- Keep both files synchronized
- Update dependent templates when constitution changes

**Version**: 1.0.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10
