---
id: 002
title: Create Frontend Integration Implementation Plan
stage: plan
date: 2026-02-10
surface: agent
model: claude-haiku-4-5
feature: 003-frontend-integration
branch: 003-frontend-integration
user: C.z
command: /sp.plan
labels: ["frontend", "nextjs", "planning", "architecture", "typescript", "react"]
links:
  spec: specs/003-frontend-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-frontend-integration/plan.md
  - specs/003-frontend-integration/research.md
  - specs/003-frontend-integration/data-model.md
  - specs/003-frontend-integration/contracts/api-types.ts
  - specs/003-frontend-integration/quickstart.md
tests:
  - Constitution check passed (all 6 principles satisfied)
---

## Prompt

User requested to create implementation plan for Spec-3: Frontend & Integration with guidance on:

Create:
- Frontend architecture using Next.js App Router
- Auth-aware routing and protected pages
- API client layer with automatic JWT header injection
- Task management UI components

Decisions needing documentation:
- Page and component structure for task workflows
- Strategy for handling loading, error, and empty states
- Auth redirect behavior for unauthenticated users
- JWT storage and request attachment mechanism

Implementation steps:
1. Setup Next.js App Router structure
2. Configure Better Auth signup and signin flows
3. Implement protected routes requiring authentication
4. Build API client that automatically attaches JWT
5. Create task UI (list, create, edit, delete, toggle completion)
6. Implement loading, error, and empty UI states
7. Ensure responsive layout for desktop and mobile
8. Validate integration with secured backend APIs

Testing & validation:
- Verify full signup and signin flow
- Confirm JWT is attached to all API requests
- Ensure unauthenticated users are redirected

## Response snapshot

Created comprehensive implementation plan with Phase 0 (Research) and Phase 1 (Design & Contracts):

**Plan.md - Implementation Plan:**
- Technical context: TypeScript 5.3+, Node.js 20+, Next.js 16+, React 19+, Better Auth, TanStack Query
- Constitution check: All 6 principles satisfied (Spec-First, Agentic Integrity, Security by Design, Deterministic Behavior, Separation of Concerns, Reproducibility)
- Project structure: Next.js App Router with route groups (auth)/ and (protected)/, organized by feature
- 10 implementation phases: Foundation, Auth Foundation, Auth UI, Protected Routing, Task List, Task Creation, Task Editing, Task Completion, Task Deletion, Responsive Design
- Agent delegation: nextjs-app-builder (primary), auth-security-specialist (consulting)
- Success criteria mapping: All 12 success criteria from spec mapped to implementation approach
- Risk mitigation: High (backend changes, JWT security), Medium (session expiration, network errors), Low (browser compatibility, performance)

**Research.md - Technology Decisions (8 decisions):**
1. Next.js App Router: Use App Router with route groups for auth/protected pages
2. Better Auth Integration: JWT-based auth with Better Auth client library
3. JWT Storage: localStorage with XSS mitigation (CSP headers, input sanitization)
4. API Client: Fetch API wrapper + TanStack Query for server state management
5. State Management: React Context for auth state, TanStack Query for server state
6. Form Handling: React Hook Form for performance and validation
7. UI Components: Tailwind CSS with custom components (no pre-built library)
8. Loading/Error States: React Suspense for loading, Error Boundaries for errors

**Data-Model.md - TypeScript Types:**
- Authentication types: User, AuthState, AuthOperations, AuthResponse
- Task types: Task, TaskCreateRequest, TaskUpdateRequest
- API response types: ErrorResponse, ErrorDetail, ApiError class
- Form state types: SigninFormState, SignupFormState, TaskFormState
- UI state types: LoadingState, ModalState, TaskListState
- Component prop types: ButtonProps, InputProps, CardProps
- Hook return types: UseAuthReturn, UseTasksReturn
- Type organization in types/ directory with index.ts re-exports

**Contracts/api-types.ts - API Interfaces:**
- Complete TypeScript interfaces matching backend API (Spec-1 and Spec-2)
- Authentication endpoints: signup, signin, me
- Task endpoints: list, create, read, update, delete, complete
- Error response types with validation details
- API_ENDPOINTS constants for all routes
- HTTP_STATUS constants for expected status codes
- ApiError class with helper methods (isAuthError, isValidationError, getUserMessage)
- Type guards for runtime type checking

**Quickstart.md - Setup Guide:**
- Prerequisites: Node.js 20+, npm 10+, backend API running
- Project setup: Create Next.js app with TypeScript and Tailwind
- Dependencies: @tanstack/react-query, react-hook-form, better-auth
- Environment variables: NEXT_PUBLIC_API_URL configuration
- Development workflow: Start backend, start frontend dev server
- Project structure overview with all directories explained
- Configuration files: next.config.js, tailwind.config.js, tsconfig.json
- Manual testing checklist: Auth flow, task management, responsive design, error handling
- Troubleshooting: Port conflicts, backend connection, TypeScript errors
- Production deployment: Build process, environment variables, deployment platforms

**Agent Context Updated:**
- Added TypeScript 5.3+, Node.js 20+ to language stack
- Added Next.js 16+, React 19+, Better Auth, TanStack Query to framework stack
- Added localStorage for JWT token persistence to database/storage info

**ADR Candidates Identified:**
1. JWT Storage in localStorage vs httpOnly Cookies (security implications)
2. TanStack Query vs SWR for Server State (TypeScript support, features)
3. Custom Components vs shadcn/ui (bundle size, control)

## Outcome

- ✅ Impact: Complete implementation plan with research, data model, API contracts, and setup guide for Next.js frontend
- 🧪 Tests: Constitution check passed (all 6 principles), manual testing checklist created
- 📁 Files: Created plan.md, research.md, data-model.md, contracts/api-types.ts, quickstart.md, updated CLAUDE.md
- 🔁 Next prompts: Run /sp.tasks to generate task breakdown, then /sp.implement to execute with nextjs-app-builder agent
- 🧠 Reflection: Plan addresses all user requirements (auth flows, protected routes, JWT injection, task UI, responsive design). Technology stack chosen for simplicity and spec compliance. All architectural decisions documented with rationale and trade-offs.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution check PASS (all 6 principles satisfied)
- Prompt variant (if applicable): Standard /sp.plan workflow with Phase 0 (Research) and Phase 1 (Design & Contracts)
- Next experiment (smallest change to try): Proceed to task generation with clear agent assignments for each implementation phase
