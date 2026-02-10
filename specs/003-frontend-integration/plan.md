# Implementation Plan: Frontend & Integration

**Branch**: `003-frontend-integration` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-frontend-integration/spec.md`

## Summary

Build a Next.js 16+ App Router frontend application that integrates with the existing FastAPI backend (Spec-1) and JWT authentication system (Spec-2). The frontend will provide user authentication flows (signup, signin, signout), task management UI (create, read, update, delete, complete), and responsive design for desktop and mobile devices. All API communication will automatically include JWT tokens for authentication, and the application will enforce client-side route protection for authenticated pages.

## Technical Context

**Language/Version**: TypeScript 5.3+, Node.js 20+
**Primary Dependencies**: Next.js 16+, React 19+, Better Auth (client), TanStack Query (API state management)
**Storage**: Browser localStorage for JWT token persistence, no local database
**Testing**: Manual testing via browser (automated tests out of scope per spec)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 years)
**Project Type**: Web application (frontend only, integrates with existing backend)
**Performance Goals**: Initial page load <2s, API response feedback <2s, smooth 60fps animations
**Constraints**: No offline support, requires stable internet, stateless frontend (no server-side rendering of protected content)
**Scale/Scope**: 7 user stories, ~15-20 components, 5-7 pages/routes, support 100+ tasks per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Spec-First Development
- Spec-3 created and approved before planning
- All requirements map to user stories in spec.md
- Following workflow: Spec → Plan → Tasks → Implement
- Each phase independently reviewable

### ✅ Principle II: Agentic Integrity
- All code will be generated via Claude Code agents
- Agent delegation plan:
  - **nextjs-app-builder**: Primary agent for all frontend work (pages, components, routing, UI)
  - **auth-security-specialist**: Consultation for JWT storage and auth flow security
- Complete PHR audit trail for all development steps
- No manual code editing

### ✅ Principle III: Security by Design
- JWT token required for all task API requests
- Token automatically attached via API client wrapper
- Protected routes redirect unauthenticated users to signin
- No client-side user ID trust (always from JWT token)
- Token stored securely (httpOnly cookies preferred, localStorage fallback)
- Clear token on signout

### ✅ Principle IV: Deterministic Behavior
- All API calls have defined success/error states
- Loading, error, and empty states explicitly handled
- Form validation with clear error messages
- Predictable navigation flows (signin → dashboard, signout → signin)

### ✅ Principle V: Separation of Concerns
- Frontend: Next.js App Router (presentation and user interaction only)
- No business logic in frontend (validation is UX only, backend enforces)
- Clear API contract with backend (TypeScript interfaces)
- Authentication handled by Better Auth client + backend JWT validation

### ✅ Principle VI: Reproducibility
- Complete documentation of all architectural decisions
- ADR candidates: JWT storage mechanism, state management approach, UI component strategy
- PHRs for all implementation phases
- Environment setup documented in quickstart.md

**Gate Status**: ✅ PASSED - All principles satisfied, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/003-frontend-integration/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - TypeScript types and frontend state
├── quickstart.md        # Phase 1 output - setup and development guide
├── contracts/           # Phase 1 output - TypeScript API interfaces
│   └── api-types.ts     # TypeScript interfaces for backend API
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/                      # Next.js App Router directory
│   ├── (auth)/              # Route group for auth pages
│   │   ├── signin/
│   │   │   └── page.tsx     # Signin page
│   │   └── signup/
│   │       └── page.tsx     # Signup page
│   ├── (protected)/         # Route group for authenticated pages
│   │   ├── dashboard/
│   │   │   └── page.tsx     # Main task dashboard
│   │   └── layout.tsx       # Protected layout with auth check
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page (redirects to signin or dashboard)
│   └── globals.css          # Global styles
├── components/              # Reusable UI components
│   ├── auth/
│   │   ├── SigninForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── SignoutButton.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── CreateTaskForm.tsx
│   │   ├── EditTaskForm.tsx
│   │   └── DeleteTaskDialog.tsx
│   ├── ui/                  # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Container.tsx
├── lib/                     # Utility libraries
│   ├── api/
│   │   ├── client.ts        # API client with JWT injection
│   │   ├── auth.ts          # Auth API calls (signup, signin, me)
│   │   └── tasks.ts         # Task API calls (CRUD operations)
│   ├── auth/
│   │   ├── token.ts         # JWT token storage/retrieval
│   │   └── context.tsx      # Auth context provider
│   └── utils/
│       ├── validation.ts    # Form validation helpers
│       └── formatting.ts    # Date/text formatting
├── types/                   # TypeScript type definitions
│   ├── api.ts              # API request/response types
│   ├── auth.ts             # Auth-related types
│   └── task.ts             # Task-related types
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Auth state and operations
│   ├── useTasks.ts         # Task data fetching and mutations
│   └── useApi.ts           # Generic API call hook
├── public/                  # Static assets
│   └── favicon.ico
├── .env.local.example       # Environment variables template
├── .env.local               # Environment variables (gitignored)
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── README.md                # Frontend setup and development guide
```

**Structure Decision**: Web application structure with Next.js App Router. The `app/` directory uses route groups to separate authenticated and unauthenticated pages. Components are organized by feature (auth, tasks, ui, layout). The `lib/` directory contains business logic for API communication and authentication. TypeScript types are centralized in the `types/` directory for reusability.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - table not needed.

## Phase 0: Research & Technology Decisions

*Output: research.md with all technology choices documented*

### Research Tasks

1. **Next.js App Router Architecture**
   - Research: App Router vs Pages Router patterns
   - Research: Route groups for auth/protected pages
   - Research: Layout composition and nested layouts
   - Research: Server Components vs Client Components usage

2. **Better Auth Integration**
   - Research: Better Auth client-side setup
   - Research: JWT token management with Better Auth
   - Research: Auth state persistence across page refreshes

3. **JWT Storage Strategy**
   - Research: localStorage vs cookies vs sessionStorage
   - Research: Security implications of each approach
   - Research: XSS and CSRF protection strategies
   - Decision: Choose storage mechanism

4. **API Client Architecture**
   - Research: Fetch API wrapper vs Axios vs TanStack Query
   - Research: Automatic JWT header injection patterns
   - Research: Error handling and retry logic
   - Decision: Choose API client approach

5. **State Management**
   - Research: React Context vs Zustand vs Jotai vs none
   - Research: Server state (API data) vs client state (UI state)
   - Research: TanStack Query for server state management
   - Decision: Choose state management strategy

6. **Form Handling**
   - Research: React Hook Form vs Formik vs native
   - Research: Validation strategies (client-side only)
   - Research: Error message display patterns
   - Decision: Choose form handling approach

7. **UI Component Strategy**
   - Research: Tailwind CSS utility-first approach
   - Research: shadcn/ui component library
   - Research: Custom components vs pre-built
   - Decision: Choose UI component strategy

8. **Loading and Error States**
   - Research: Suspense boundaries for loading states
   - Research: Error boundaries for error handling
   - Research: Optimistic UI updates
   - Decision: Choose state handling patterns

## Phase 1: Design & Contracts

*Output: data-model.md, contracts/, quickstart.md*

### Data Model (Frontend Types)

**File**: `data-model.md`

Frontend data model focuses on TypeScript types for:
- User authentication state
- Task entities (matching backend schema)
- API request/response shapes
- Form state and validation
- UI state (loading, errors, modals)

### API Contracts (TypeScript Interfaces)

**Directory**: `contracts/`

TypeScript interfaces matching backend API:
- Authentication endpoints (signup, signin, me)
- Task endpoints (list, create, read, update, delete, complete)
- Error response shapes
- HTTP status code handling

### Quickstart Guide

**File**: `quickstart.md`

Setup instructions for:
- Node.js and npm installation
- Environment variable configuration (API base URL)
- Dependency installation
- Development server startup
- Build and deployment process

## Implementation Approach

### Phase Breakdown

**Phase 1: Foundation & Setup**
- Initialize Next.js 16+ project with TypeScript
- Configure Tailwind CSS
- Set up project structure (directories, files)
- Configure environment variables
- Install dependencies (Better Auth, TanStack Query, etc.)

**Phase 2: Authentication Foundation**
- Implement JWT token storage utilities
- Create auth context provider
- Build API client with JWT injection
- Implement auth API calls (signup, signin, me)

**Phase 3: Authentication UI**
- Build signin page and form
- Build signup page and form
- Implement signout functionality
- Add form validation and error handling
- Test authentication flow end-to-end

**Phase 4: Protected Routing**
- Create protected route layout
- Implement auth check and redirect logic
- Build dashboard page structure
- Add header with signout button

**Phase 5: Task List & Viewing**
- Implement task API calls (list, read)
- Build TaskList component
- Build TaskItem component
- Add loading, error, and empty states
- Test task viewing with backend

**Phase 6: Task Creation**
- Build CreateTaskForm component
- Implement task creation API call
- Add form validation
- Handle success and error states
- Test task creation flow

**Phase 7: Task Editing**
- Build EditTaskForm component
- Implement task update API call
- Pre-fill form with existing data
- Handle cancel and save actions
- Test task editing flow

**Phase 8: Task Completion**
- Add completion toggle to TaskItem
- Implement task completion API call
- Update UI to show completed state
- Handle optimistic updates
- Test completion toggle

**Phase 9: Task Deletion**
- Build DeleteTaskDialog component
- Implement task deletion API call
- Add confirmation dialog
- Handle success and error states
- Test task deletion flow

**Phase 10: Responsive Design & Polish**
- Add responsive breakpoints (mobile, tablet, desktop)
- Test on different screen sizes
- Optimize layout for touch devices
- Add loading animations
- Polish error messages and UX

## Agent Delegation

**Primary Agent**: nextjs-app-builder
- Responsible for all frontend implementation
- Pages, components, routing, API integration
- UI/UX implementation
- Responsive design

**Consulting Agent**: auth-security-specialist
- Review JWT storage implementation
- Validate auth flow security
- Ensure proper token handling

## Success Criteria Mapping

From spec.md, mapped to implementation:

- **SC-001**: Account creation in under 1 minute → Simple signup form with minimal fields
- **SC-002**: Signin and view tasks in under 5 seconds → Optimized API calls, loading states
- **SC-003**: Create task in under 30 seconds → Quick task creation form
- **SC-004**: 95% first-attempt success → Clear validation, helpful error messages
- **SC-005**: Display correctly on 320px to 2560px → Responsive Tailwind breakpoints
- **SC-006**: Touch device accessibility → Large tap targets, mobile-friendly forms
- **SC-007**: Feedback within 2 seconds → Loading spinners, optimistic updates
- **SC-008**: 100% graceful error handling → Error boundaries, retry options
- **SC-009**: Support 100+ tasks → Efficient rendering, consider virtualization if needed
- **SC-010**: 90% can navigate without docs → Intuitive UI, clear labels
- **SC-011**: 24-hour session → JWT token persistence in storage
- **SC-012**: Zero data loss → Preserve form data on errors, confirm destructive actions

## Risk Mitigation

### High Risk
1. **Backend API Changes**: Frontend breaks if backend contracts change
   - Mitigation: Use TypeScript interfaces matching backend OpenAPI spec, integration tests

2. **JWT Token Security**: XSS attacks could steal tokens from localStorage
   - Mitigation: Research secure storage (httpOnly cookies preferred), implement CSP headers

### Medium Risk
3. **Session Expiration**: User loses work when token expires
   - Mitigation: Detect 401 responses, prompt re-authentication, preserve unsaved data

4. **Network Errors**: Poor UX if API calls fail
   - Mitigation: Comprehensive error handling, retry logic, offline detection

### Low Risk
5. **Browser Compatibility**: May not work on older browsers
   - Mitigation: Target modern browsers only (per spec assumptions)

6. **Performance with Large Lists**: Slow rendering with 100+ tasks
   - Mitigation: Implement virtual scrolling if needed, optimize re-renders

## Next Steps

1. **Generate research.md**: Document all technology decisions with rationale
2. **Generate data-model.md**: Define TypeScript types for frontend state
3. **Generate contracts/api-types.ts**: TypeScript interfaces for backend API
4. **Generate quickstart.md**: Setup and development guide
5. **Update agent context**: Add Next.js, React, TypeScript to agent knowledge
6. **Proceed to /sp.tasks**: Break down into actionable implementation tasks

---

**Plan Status**: Ready for Phase 0 Research
**Next Command**: Continue with research.md generation
