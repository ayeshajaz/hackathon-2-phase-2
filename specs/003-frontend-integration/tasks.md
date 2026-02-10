---
description: "Task list for Frontend & Integration implementation"
---

# Tasks: Frontend & Integration

**Input**: Design documents from `/specs/003-frontend-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-types.ts, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `frontend/` directory at repository root
- Frontend paths: `frontend/app/`, `frontend/components/`, `frontend/lib/`, `frontend/types/`, `frontend/hooks/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create Next.js 16+ project with TypeScript in frontend/ directory using create-next-app
- [X] T002 Install dependencies: @tanstack/react-query, react-hook-form, better-auth in frontend/package.json
- [X] T003 [P] Configure Tailwind CSS in frontend/tailwind.config.js
- [X] T004 [P] Create TypeScript configuration in frontend/tsconfig.json with strict mode
- [X] T005 [P] Create environment variables template in frontend/.env.local.example
- [X] T006 Create project directory structure: app/, components/, lib/, types/, hooks/, public/
- [X] T007 [P] Configure Next.js settings in frontend/next.config.js
- [X] T008 [P] Create global styles in frontend/app/globals.css with Tailwind directives

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Create TypeScript type definitions for User in frontend/types/auth.ts
- [X] T010 [P] Create TypeScript type definitions for Task in frontend/types/task.ts
- [X] T011 [P] Create TypeScript type definitions for API requests/responses in frontend/types/api.ts
- [X] T012 Copy API contracts from specs/003-frontend-integration/contracts/api-types.ts to frontend/types/api-contracts.ts
- [X] T013 Create JWT token storage utilities in frontend/lib/auth/token.ts (getToken, setToken, clearToken)
- [X] T014 Create API client with JWT injection in frontend/lib/api/client.ts
- [X] T015 Create auth API calls in frontend/lib/api/auth.ts (signup, signin, me)
- [X] T016 [P] Create task API calls in frontend/lib/api/tasks.ts (list, create, read, update, delete, complete)
- [X] T017 Create auth context provider in frontend/lib/auth/context.tsx with AuthProvider and useAuth hook
- [X] T018 [P] Create reusable Button component in frontend/components/ui/Button.tsx
- [X] T019 [P] Create reusable Input component in frontend/components/ui/Input.tsx
- [X] T020 [P] Create reusable Card component in frontend/components/ui/Card.tsx
- [X] T021 [P] Create LoadingSpinner component in frontend/components/ui/LoadingSpinner.tsx
- [X] T022 [P] Create ErrorMessage component in frontend/components/ui/ErrorMessage.tsx
- [X] T023 Create root layout in frontend/app/layout.tsx with AuthProvider and TanStack Query setup
- [X] T024 Create landing page in frontend/app/page.tsx with redirect logic (authenticated → dashboard, unauthenticated → signin)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication and Account Access (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, sign in, sign out, and access protected pages

**Independent Test**: Create a new account, sign in with credentials, verify redirect to dashboard, sign out, verify redirect to signin page, attempt to access protected page while unauthenticated

### Implementation for User Story 1

- [X] T025 [P] [US1] Create route group directory for auth pages at frontend/app/(auth)/
- [X] T026 [P] [US1] Create route group directory for protected pages at frontend/app/(protected)/
- [X] T027 [P] [US1] Create SignupForm component in frontend/components/auth/SignupForm.tsx with email/password fields and validation
- [X] T028 [P] [US1] Create SigninForm component in frontend/components/auth/SigninForm.tsx with email/password fields and validation
- [X] T029 [P] [US1] Create SignoutButton component in frontend/components/auth/SignoutButton.tsx
- [X] T030 [US1] Create signup page in frontend/app/(auth)/signup/page.tsx using SignupForm component
- [X] T031 [US1] Create signin page in frontend/app/(auth)/signin/page.tsx using SigninForm component
- [X] T032 [US1] Create protected layout in frontend/app/(protected)/layout.tsx with auth check and redirect logic
- [X] T033 [US1] Create Header component in frontend/components/layout/Header.tsx with SignoutButton
- [X] T034 [US1] Create dashboard page structure in frontend/app/(protected)/dashboard/page.tsx with Header
- [X] T035 [US1] Add form validation for email format and password length (8+ chars) in SignupForm
- [X] T036 [US1] Add error handling for signup failures (409 conflict, 400 validation) in SignupForm
- [X] T037 [US1] Add error handling for signin failures (401 unauthorized) in SigninForm
- [X] T038 [US1] Implement automatic redirect to dashboard after successful signup
- [X] T039 [US1] Implement automatic redirect to dashboard after successful signin
- [X] T040 [US1] Implement token clearing and redirect to signin on signout

**Checkpoint**: At this point, User Story 1 should be fully functional - users can signup, signin, signout, and access protected pages

---

## Phase 4: User Story 2 - View Task List (Priority: P2)

**Goal**: Display all tasks belonging to the authenticated user with loading, error, and empty states

**Independent Test**: Sign in, view task list (should show empty state if no tasks), verify loading indicator appears during fetch, verify error message if backend is unavailable

### Implementation for User Story 2

- [X] T041 [P] [US2] Create useTasks custom hook in frontend/hooks/useTasks.ts using TanStack Query for task fetching
- [X] T042 [P] [US2] Create TaskList component in frontend/components/tasks/TaskList.tsx to display array of tasks
- [X] T043 [P] [US2] Create TaskItem component in frontend/components/tasks/TaskItem.tsx to display individual task
- [X] T044 [US2] Integrate TaskList component into dashboard page in frontend/app/(protected)/dashboard/page.tsx
- [X] T045 [US2] Add loading state to TaskList using LoadingSpinner component
- [X] T046 [US2] Add error state to TaskList using ErrorMessage component with retry button
- [X] T047 [US2] Add empty state to TaskList with message "No tasks yet" and prompt to create one
- [X] T048 [US2] Display task title, description, and completion status in TaskItem component
- [X] T049 [US2] Add visual styling to distinguish completed tasks (strikethrough, checkmark icon)
- [X] T050 [US2] Verify tasks are filtered by authenticated user (only show user's own tasks)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can authenticate and view their task list

---

## Phase 5: User Story 3 - Create New Tasks (Priority: P2)

**Goal**: Allow users to create new tasks with title and optional description

**Independent Test**: Sign in, click "Create Task" button, enter task title and description, submit form, verify new task appears in list

### Implementation for User Story 3

- [X] T051 [P] [US3] Create CreateTaskForm component in frontend/components/tasks/CreateTaskForm.tsx with title and description fields
- [X] T052 [P] [US3] Create Container component in frontend/components/layout/Container.tsx for consistent spacing
- [X] T053 [US3] Add createTask mutation to useTasks hook in frontend/hooks/useTasks.ts
- [X] T054 [US3] Add "Create Task" button to dashboard page that opens CreateTaskForm
- [X] T055 [US3] Implement form validation for required title field (not empty, max 200 chars)
- [X] T056 [US3] Add form submission handler that calls createTask mutation
- [X] T057 [US3] Add loading state to submit button during task creation
- [X] T058 [US3] Add error handling for creation failures (400 validation, 401 unauthorized, 503 service unavailable)
- [X] T059 [US3] Implement success feedback (clear form, show success message, auto-refresh task list)
- [X] T060 [US3] Preserve form data if submission fails to prevent data loss
- [X] T061 [US3] Add cancel button to close CreateTaskForm without saving

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - users can authenticate, view tasks, and create new tasks

---

## Phase 6: User Story 4 - Edit Existing Tasks (Priority: P3)

**Goal**: Allow users to update task title and description

**Independent Test**: Sign in, create a task, click "Edit" button on task, modify title/description, save changes, verify updated task displays new information

### Implementation for User Story 4

- [X] T062 [P] [US4] Create EditTaskForm component in frontend/components/tasks/EditTaskForm.tsx with pre-filled title and description fields
- [X] T063 [US4] Add updateTask mutation to useTasks hook in frontend/hooks/useTasks.ts
- [X] T064 [US4] Add "Edit" button to TaskItem component that opens EditTaskForm
- [X] T065 [US4] Pre-fill EditTaskForm with existing task data (title, description)
- [X] T066 [US4] Implement form validation for required title field (not empty, max 200 chars)
- [X] T067 [US4] Add form submission handler that calls updateTask mutation
- [X] T068 [US4] Add loading state to submit button during task update
- [X] T069 [US4] Add error handling for update failures (400 validation, 401 unauthorized, 404 not found)
- [X] T070 [US4] Implement success feedback (close form, show success message, auto-refresh task list)
- [X] T071 [US4] Add cancel button to close EditTaskForm without saving changes

**Checkpoint**: At this point, User Stories 1-4 should all work independently - users can authenticate, view, create, and edit tasks

---

## Phase 7: User Story 5 - Mark Tasks as Complete (Priority: P3)

**Goal**: Allow users to toggle task completion status with visual feedback

**Independent Test**: Sign in, create a task, mark it as complete, verify visual change (strikethrough/checkmark), refresh page, verify completion status persists

### Implementation for User Story 5

- [X] T072 [US5] Add toggleComplete mutation to useTasks hook in frontend/hooks/useTasks.ts
- [X] T073 [US5] Add completion toggle button/checkbox to TaskItem component
- [X] T074 [US5] Implement click handler that calls toggleComplete mutation with task ID
- [X] T075 [US5] Add optimistic UI update to immediately show completion state change
- [X] T076 [US5] Add error handling for completion failures (401 unauthorized, 404 not found)
- [X] T077 [US5] Implement rollback of optimistic update if API call fails
- [X] T078 [US5] Add visual distinction for completed tasks (strikethrough text, checkmark icon, different background)
- [X] T079 [US5] Verify completion status persists after page refresh

**Checkpoint**: At this point, User Stories 1-5 should all work independently - users can authenticate, view, create, edit, and complete tasks

---

## Phase 8: User Story 6 - Delete Tasks (Priority: P3)

**Goal**: Allow users to permanently delete tasks with confirmation dialog

**Independent Test**: Sign in, create a task, click "Delete" button, confirm deletion in dialog, verify task is removed from list

### Implementation for User Story 6

- [X] T080 [P] [US6] Create DeleteTaskDialog component in frontend/components/tasks/DeleteTaskDialog.tsx with confirmation message
- [X] T081 [US6] Add deleteTask mutation to useTasks hook in frontend/hooks/useTasks.ts
- [X] T082 [US6] Add "Delete" button to TaskItem component that opens DeleteTaskDialog
- [X] T083 [US6] Implement confirmation dialog with "Cancel" and "Delete" buttons
- [X] T084 [US6] Add delete handler that calls deleteTask mutation with task ID
- [X] T085 [US6] Add loading state to delete button during task deletion
- [X] T086 [US6] Add error handling for deletion failures (401 unauthorized, 404 not found)
- [X] T087 [US6] Implement success feedback (close dialog, show success message, auto-refresh task list)
- [X] T088 [US6] Add optimistic UI update to immediately remove task from list
- [X] T089 [US6] Implement rollback of optimistic update if API call fails

**Checkpoint**: At this point, User Stories 1-6 should all work independently - users can authenticate, view, create, edit, complete, and delete tasks

---

## Phase 9: User Story 7 - Responsive Design and Mobile Access (Priority: P4)

**Goal**: Ensure application works on all screen sizes from mobile (320px) to desktop (2560px)

**Independent Test**: Access application on mobile device (or resize browser to 320px), verify all features remain accessible and usable, test on tablet (768px) and desktop (1280px+)

### Implementation for User Story 7

- [X] T090 [P] [US7] Add responsive breakpoints to Header component using Tailwind (sm:, md:, lg:)
- [X] T091 [P] [US7] Add responsive breakpoints to TaskList component for grid/list layout
- [X] T092 [P] [US7] Add responsive breakpoints to TaskItem component for compact mobile view
- [X] T093 [P] [US7] Add responsive breakpoints to CreateTaskForm component for full-width mobile
- [X] T094 [P] [US7] Add responsive breakpoints to EditTaskForm component for full-width mobile
- [X] T095 [P] [US7] Add responsive breakpoints to SigninForm component for centered mobile layout
- [X] T096 [P] [US7] Add responsive breakpoints to SignupForm component for centered mobile layout
- [X] T097 [US7] Increase tap target sizes for mobile (minimum 44x44px for buttons)
- [X] T098 [US7] Test layout on mobile width (320px-767px) and verify all features accessible
- [X] T099 [US7] Test layout on tablet width (768px-1023px) and verify optimal spacing
- [X] T100 [US7] Test layout on desktop width (1024px+) and verify efficient use of space
- [X] T101 [US7] Add touch-friendly interactions (no hover-only features)
- [X] T102 [US7] Verify forms are usable on mobile keyboards (appropriate input types)

**Checkpoint**: All user stories should now be independently functional across all device sizes

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T103 [P] Add loading animations and transitions to all components for smooth UX
- [X] T104 [P] Improve error messages to be more user-friendly and actionable
- [X] T105 [P] Add success toast notifications for all mutations (create, update, delete, complete)
- [X] T106 [P] Optimize re-renders using React.memo for TaskItem components
- [X] T107 [P] Add keyboard navigation support (Tab, Enter, Escape)
- [X] T108 [P] Add ARIA labels for accessibility (screen reader support)
- [X] T109 Implement session expiration detection and re-authentication prompt
- [X] T110 Add Content Security Policy headers in next.config.js for XSS protection
- [X] T111 Test application with 100+ tasks to verify performance
- [X] T112 Run through quickstart.md validation checklist
- [X] T113 Create frontend README.md with setup instructions
- [X] T114 Verify all environment variables are documented in .env.local.example

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P2 → P3 → P3 → P3 → P4)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run parallel with US1)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run parallel with US1, US2)
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run parallel with US1-3)
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run parallel with US1-4)
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run parallel with US1-5)
- **User Story 7 (P4)**: Can start after Foundational (Phase 2) - Should be done after US1-6 for comprehensive testing

### Within Each User Story

- Models/types before API calls
- API calls before components
- Core components before integration into pages
- Basic functionality before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005, T007, T008)
- All Foundational tasks marked [P] can run in parallel within their dependencies
- Once Foundational phase completes, User Stories 1-6 can start in parallel (if team capacity allows)
- All responsive design tasks in US7 marked [P] can run in parallel (T090-T096)
- All polish tasks marked [P] can run in parallel (T103-T108)

---

## Parallel Example: User Story 1

```bash
# Launch all form components for User Story 1 together:
Task: "Create SignupForm component in frontend/components/auth/SignupForm.tsx"
Task: "Create SigninForm component in frontend/components/auth/SigninForm.tsx"
Task: "Create SignoutButton component in frontend/components/auth/SignoutButton.tsx"

# Launch all page components for User Story 1 together (after forms complete):
Task: "Create signup page in frontend/app/(auth)/signup/page.tsx"
Task: "Create signin page in frontend/app/(auth)/signin/page.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch all components for User Story 2 together:
Task: "Create useTasks custom hook in frontend/hooks/useTasks.ts"
Task: "Create TaskList component in frontend/components/tasks/TaskList.tsx"
Task: "Create TaskItem component in frontend/components/tasks/TaskItem.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
4. **STOP and VALIDATE**: Test authentication flow independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Add User Story 7 → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
   - Developer B: User Story 2 (View Tasks)
   - Developer C: User Story 3 (Create Tasks)
3. Stories complete and integrate independently
4. Continue with remaining stories (US4-7) in parallel

---

## Summary

- **Total Tasks**: 114 tasks
- **Setup Phase**: 8 tasks
- **Foundational Phase**: 16 tasks (CRITICAL - blocks all user stories)
- **User Story 1 (P1)**: 16 tasks - Authentication and account access
- **User Story 2 (P2)**: 10 tasks - View task list
- **User Story 3 (P2)**: 11 tasks - Create new tasks
- **User Story 4 (P3)**: 10 tasks - Edit existing tasks
- **User Story 5 (P3)**: 8 tasks - Mark tasks as complete
- **User Story 6 (P3)**: 10 tasks - Delete tasks
- **User Story 7 (P4)**: 13 tasks - Responsive design
- **Polish Phase**: 12 tasks - Cross-cutting improvements

**Parallel Opportunities**: 35 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1) = 40 tasks

**Format Validation**: ✅ All tasks follow checklist format with checkbox, Task ID, [P] marker (where applicable), [Story] label (for user story phases), and file paths

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Tests are not included as they were not explicitly requested in the specification
