# Tasks: Premium UI Upgrade

**Input**: Design documents from `/specs/004-premium-ui/`
**Prerequisites**: plan.md (component specifications), spec.md (user stories), research.md (design system)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` directory at repository root
- **Components**: `frontend/components/` for reusable components
- **Pages**: `frontend/app/` for Next.js App Router pages
- **Styles**: `frontend/` for global styles and Tailwind config

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies

- [X] T001 Verify Next.js 16+ and Tailwind CSS 3.4+ are installed in frontend/package.json
- [X] T002 Verify existing component structure in frontend/components/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design system configuration that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Configure Tailwind design tokens in frontend/tailwind.config.js (indigo-600 primary, spacing scale, shadows)
- [X] T004 Update global styles in frontend/app/globals.css (base styles, smooth scrolling, focus-visible)
- [X] T005 Create utility function for className merging in frontend/lib/utils.ts (cn helper)

**Checkpoint**: Design system foundation ready - component implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core UI Components Upgrade (Priority: P1) 🎯 MVP

**Goal**: Upgrade all foundational UI components (buttons, inputs, cards, loading spinners, error messages) to premium modern SaaS design standards with consistent styling, proper spacing, and visual hierarchy.

**Independent Test**: Navigate through all pages and verify that buttons, inputs, and cards display with new premium styling (rounded corners, shadows, hover effects, proper spacing) while maintaining all existing functionality.

### Implementation for User Story 1

- [X] T006 [P] [US1] Upgrade Button component in frontend/components/ui/Button.tsx (primary, secondary, danger, ghost variants with rounded-lg, shadows, transitions)
- [X] T007 [P] [US1] Upgrade Input component in frontend/components/ui/Input.tsx (rounded-lg, focus states with indigo-500 ring, error states, label styling)
- [X] T008 [P] [US1] Upgrade Card component in frontend/components/ui/Card.tsx (rounded-2xl, shadow-sm, border-gray-200, p-6, hover effects)
- [X] T009 [P] [US1] Upgrade LoadingSpinner component in frontend/components/ui/LoadingSpinner.tsx (animate-spin, indigo-600 color, size variants)
- [X] T010 [P] [US1] Upgrade ErrorMessage component in frontend/components/ui/ErrorMessage.tsx (bg-red-50, border-red-200, rounded-lg, icon + message layout)

**Checkpoint**: At this point, all foundational UI components should display with premium styling and be ready for use in pages

---

## Phase 4: User Story 2 - Authentication Pages Redesign (Priority: P1)

**Goal**: Redesign login and signup pages with elegant, centered layouts, professional branding, clean white backgrounds, and modern form styling that creates a premium first impression.

**Independent Test**: Access /signin and /signup pages and verify elegant centered layouts, modern form styling, proper spacing, and smooth transitions while maintaining all authentication functionality.

### Implementation for User Story 2

- [X] T011 [P] [US2] Upgrade SigninForm component in frontend/components/auth/SigninForm.tsx (use upgraded Input and Button components, proper spacing, validation feedback)
- [X] T012 [P] [US2] Upgrade SignupForm component in frontend/components/auth/SignupForm.tsx (use upgraded Input and Button components, consistent with signin, validation feedback)
- [X] T013 [US2] Redesign signin page in frontend/app/(auth)/signin/page.tsx (centered card max-w-md, gradient background bg-gradient-to-br from-gray-50 to-gray-100, min-h-screen flex items-center justify-center)
- [X] T014 [US2] Redesign signup page in frontend/app/(auth)/signup/page.tsx (consistent with signin page, centered card, gradient background)
- [X] T015 [P] [US2] Upgrade SignoutButton component in frontend/components/auth/SignoutButton.tsx (ghost variant styling, hover effects)

**Checkpoint**: At this point, authentication pages should display with premium centered layouts and elegant form styling

---

## Phase 5: User Story 3 - Dashboard Layout Enhancement (Priority: P2)

**Goal**: Transform the dashboard with a modern SaaS layout including a polished sidebar navigation, spacious content area with proper padding, clean header with user info, and card-based task display with visual hierarchy.

**Independent Test**: Sign in and access the dashboard, verify sidebar navigation, header styling, task list layout, and responsive behavior while maintaining all task management functionality.

### Implementation for User Story 3

- [X] T016 [P] [US3] Create new Sidebar component in frontend/components/layout/Sidebar.tsx (fixed left, w-64, bg-white, border-r, navigation items with active states, mobile hamburger)
- [X] T017 [P] [US3] Upgrade Header component in frontend/components/layout/Header.tsx (bg-white, border-b, user info display, signout button, hamburger menu for mobile)
- [X] T018 [P] [US3] Upgrade Container component in frontend/components/layout/Container.tsx (max-w-7xl mx-auto, responsive padding px-4 md:px-8)
- [X] T019 [US3] Update protected layout in frontend/app/(protected)/layout.tsx (integrate Sidebar, Header, two-column layout with sidebar + main content)
- [X] T020 [US3] Redesign dashboard page in frontend/app/(protected)/dashboard/page.tsx (bg-gray-50, spacious padding p-8, welcome message with typography hierarchy, integrate task list)

**Checkpoint**: At this point, dashboard should display with modern sidebar navigation, clean header, and spacious layout

---

## Phase 6: User Story 4 - Task Management UI Polish (Priority: P2)

**Goal**: Enhance task creation, editing, and deletion interfaces with modern modal designs, better form layouts, clear action buttons, and smooth animations for a premium task management experience.

**Independent Test**: Create, edit, complete, and delete tasks, verify modal designs, form layouts, button styling, and animations while maintaining all task CRUD functionality.

### Implementation for User Story 4

- [X] T021 [P] [US4] Upgrade TaskList component in frontend/components/tasks/TaskList.tsx (grid layout grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4, empty state, loading state with skeleton cards)
- [X] T022 [P] [US4] Upgrade TaskItem component in frontend/components/tasks/TaskItem.tsx (rounded-2xl card, shadow-sm hover:shadow-md, hover:scale-[1.02], border-gray-200 hover:border-indigo-200, completion states, action buttons)
- [X] T023 [P] [US4] Upgrade CreateTaskForm component in frontend/components/tasks/CreateTaskForm.tsx (modal with backdrop, slide-up animation, rounded-2xl, form layout with labels, action buttons)
- [X] T024 [P] [US4] Upgrade EditTaskForm component in frontend/components/tasks/EditTaskForm.tsx (consistent with CreateTaskForm, pre-filled data, modal design)
- [X] T025 [P] [US4] Upgrade DeleteTaskDialog component in frontend/components/tasks/DeleteTaskDialog.tsx (confirmation modal max-w-md, warning icon, clear action buttons with danger variant)

**Checkpoint**: At this point, all task management interfaces should display with modern modal designs and polished styling

---

## Phase 7: User Story 5 - Responsive Design Refinement (Priority: P2)

**Goal**: Refine responsive behavior across all screen sizes (mobile 320px to desktop 2560px+) with proper breakpoints, touch-friendly interactions, and adaptive layouts that maintain premium aesthetics on all devices.

**Independent Test**: Access the application on different screen sizes (mobile, tablet, desktop) and verify layouts adapt properly, touch targets are adequate, and premium styling is maintained.

### Implementation for User Story 5

- [X] T026 [US5] Add responsive utilities to Sidebar component (hidden lg:block, mobile overlay with backdrop, slide-in animation)
- [X] T027 [US5] Add responsive utilities to Header component (hamburger menu lg:hidden, responsive padding, mobile-friendly user dropdown)
- [X] T028 [US5] Verify responsive grid in TaskList component (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, proper gap spacing)
- [X] T029 [US5] Verify responsive forms in authentication pages (max-w-md, mx-4 on mobile, proper touch targets 44x44px minimum)
- [X] T030 [US5] Verify responsive modals (max-w-lg, mx-4 on mobile, proper backdrop behavior)
- [X] T031 [US5] Add responsive padding to dashboard page (p-4 md:p-8, proper spacing on all screen sizes)

**Checkpoint**: At this point, all layouts should adapt properly across mobile, tablet, and desktop screen sizes

---

## Phase 8: User Story 6 - Empty States and Loading States (Priority: P3)

**Goal**: Design elegant empty states for when users have no tasks, and polished loading states for all async operations, providing clear feedback and maintaining premium aesthetics during all application states.

**Independent Test**: View the dashboard with no tasks (empty state) and perform actions that trigger loading states, verify elegant designs and clear messaging.

### Implementation for User Story 6

- [X] T032 [P] [US6] Add elegant empty state to TaskList component (centered content, illustration/icon, welcoming message text-lg font-medium, subtitle text-sm text-gray-600, CTA button)
- [X] T033 [P] [US6] Add loading skeleton state to TaskList component (animate-pulse bg-gray-200 rounded-2xl h-32, multiple skeletons in grid)
- [X] T034 [P] [US6] Add loading state to Button component (spinner icon, disabled state, opacity-75 cursor-wait)
- [X] T035 [P] [US6] Add loading state to form submissions (CreateTaskForm, EditTaskForm with loading buttons)
- [X] T036 [US6] Add smooth transitions between empty and populated states (fade-in animations, smooth state changes)

**Checkpoint**: At this point, empty and loading states should provide clear feedback with elegant designs

---

## Phase 9: User Story 7 - Animations and Micro-interactions (Priority: P3)

**Goal**: Add subtle animations and micro-interactions throughout the application (hover effects, transitions, fade-ins, slide-ins) that enhance the premium feel without being distracting or impacting performance.

**Independent Test**: Interact with all UI elements and verify smooth transitions, hover effects, and animations that enhance the experience without causing performance issues.

### Implementation for User Story 7

- [X] T037 [US7] Add hover transitions to all Button variants (transition-all duration-200, shadow changes, color shifts)
- [X] T038 [US7] Add hover effects to TaskItem cards (hover:shadow-md, hover:scale-[1.02], hover:border-indigo-200, transition-all duration-200)
- [X] T039 [US7] Add modal animations to CreateTaskForm and EditTaskForm (slide-up from bottom, backdrop fade-in, duration-300)
- [X] T040 [US7] Add modal animations to DeleteTaskDialog (fade-in, backdrop animation)
- [X] T041 [US7] Add page transition animations (fade-in content on load, smooth navigation)
- [X] T042 [US7] Add focus animations to Input components (ring-2 ring-indigo-500 transition, smooth focus states)
- [X] T043 [US7] Add completion animation to TaskItem (checkmark transition, opacity change, smooth state change)
- [X] T044 [US7] Add prefers-reduced-motion support (respect user motion preferences, disable animations when requested)

**Checkpoint**: At this point, all animations and micro-interactions should enhance the premium feel without impacting performance

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements that affect multiple user stories

- [X] T045 [P] Verify color consistency across all components (indigo-600 primary used consistently)
- [X] T046 [P] Verify spacing consistency across all components (Tailwind spacing scale used consistently)
- [X] T047 [P] Verify typography hierarchy across all pages (font sizes, weights, line heights consistent)
- [X] T048 [P] Verify shadow consistency across all cards and interactive elements
- [X] T049 [P] Verify border radius consistency (rounded-2xl for cards, rounded-lg for buttons/inputs)
- [ ] T050 Verify accessibility (WCAG AA contrast ratios, keyboard navigation, focus states, touch targets 44x44px)
- [ ] T051 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] T052 Test on multiple screen sizes (320px, 768px, 1024px, 1920px, 2560px)
- [ ] T053 Verify all existing functionality works (signup, signin, create task, edit task, delete task, complete task, signout)
- [ ] T054 Run manual testing checklist from specs/004-premium-ui/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 (uses upgraded Button and Input components)
- **User Story 3 (P2)**: Depends on User Story 1 (uses upgraded Card and Button components)
- **User Story 4 (P2)**: Depends on User Story 1 (uses upgraded Button, Input, Card components)
- **User Story 5 (P2)**: Depends on User Stories 1-4 (verifies responsive behavior of all components)
- **User Story 6 (P3)**: Depends on User Stories 1 and 4 (adds states to existing components)
- **User Story 7 (P3)**: Depends on User Stories 1-6 (adds animations to all components)

### Within Each User Story

- Tasks marked [P] can run in parallel (different files, no dependencies)
- Tasks without [P] may depend on previous tasks in the same story
- Complete all tasks in a story before moving to next priority

### Parallel Opportunities

- All Setup tasks can run in parallel
- All Foundational tasks can run in parallel (within Phase 2)
- Within User Story 1: All 5 component tasks (T006-T010) can run in parallel
- Within User Story 2: T011, T012, T015 can run in parallel; T013, T014 run after T011, T012
- Within User Story 3: T016, T017, T018 can run in parallel; T019, T020 run after
- Within User Story 4: All 5 tasks (T021-T025) can run in parallel
- Within User Story 6: T032, T033, T034, T035 can run in parallel
- Within Phase 10: T045-T049 can run in parallel

---

## Parallel Example: User Story 1 (Core UI Components)

```bash
# Launch all component upgrades for User Story 1 together:
Task: "Upgrade Button component in frontend/components/ui/Button.tsx"
Task: "Upgrade Input component in frontend/components/ui/Input.tsx"
Task: "Upgrade Card component in frontend/components/ui/Card.tsx"
Task: "Upgrade LoadingSpinner component in frontend/components/ui/LoadingSpinner.tsx"
Task: "Upgrade ErrorMessage component in frontend/components/ui/ErrorMessage.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Core UI Components)
4. Complete Phase 4: User Story 2 (Authentication Pages)
5. **STOP and VALIDATE**: Test authentication flow with new premium UI
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Design system ready
2. Add User Story 1 → Test components independently → Foundation ready
3. Add User Story 2 → Test auth pages → Deploy/Demo (MVP!)
4. Add User Story 3 → Test dashboard → Deploy/Demo
5. Add User Story 4 → Test task management → Deploy/Demo
6. Add User Story 5 → Test responsive → Deploy/Demo
7. Add User Story 6 → Test empty/loading states → Deploy/Demo
8. Add User Story 7 → Test animations → Deploy/Demo (Complete!)
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Core UI Components)
3. Once User Story 1 is done:
   - Developer A: User Story 2 (Authentication Pages)
   - Developer B: User Story 3 (Dashboard Layout)
   - Developer C: User Story 4 (Task Management UI)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- This is a pure UI/UX enhancement - no backend, API, or business logic changes
- All styling uses Tailwind CSS utility classes
- Maintain 100% existing functionality throughout all changes
- Test thoroughly on multiple screen sizes and devices
- Verify accessibility standards (WCAG AA) throughout
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
