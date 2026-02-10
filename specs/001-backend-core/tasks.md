---

description: "Task list template for feature implementation"
---

# Tasks: Backend Core & Data Layer

**Input**: Design documents from `/specs/001-backend-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the feature specification, so no test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `backend/tests/`
- Paths shown below follow the web application structure from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure per implementation plan (backend/src/, backend/tests/, backend/src/models/, backend/src/api/routes/, backend/src/schemas/)
- [x] T002 Create requirements.txt with dependencies: fastapi==0.104.1, sqlmodel==0.0.14, psycopg2-binary==2.9.9, uvicorn[standard]==0.24.0, pydantic==2.5.0, python-dotenv==1.0.0
- [x] T003 [P] Create .env.example file with DATABASE_URL placeholder in backend/
- [x] T004 [P] Create __init__.py files in backend/src/, backend/src/models/, backend/src/api/, backend/src/api/routes/, backend/src/schemas/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement database connection and session management in backend/src/database.py with SQLAlchemy engine, connection pooling (pool_pre_ping=True), and get_session() dependency injection function
- [x] T006 [P] Create Task SQLModel definition in backend/src/models/task.py with all fields (id, title, description, completed, owner_user_id, created_at, updated_at) and validation rules per data-model.md
- [x] T007 [P] Create TaskCreate schema in backend/src/schemas/task.py for POST request body (title, description)
- [x] T008 [P] Create TaskUpdate schema in backend/src/schemas/task.py for PUT request body (title, description)
- [x] T009 Create FastAPI application entry point in backend/src/main.py with app initialization, CORS middleware, and database table creation on startup

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Retrieve Tasks (Priority: P1) 🎯 MVP

**Goal**: Establish foundational data persistence layer with create and retrieve operations

**Independent Test**: Make POST requests to create tasks and GET requests to retrieve them. Verify database connectivity, data persistence across restarts, and user-scoped filtering.

### Implementation for User Story 1

- [x] T010 [P] [US1] Implement POST /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py that creates a new task with owner_user_id from URL parameter, validates request body with TaskCreate schema, returns 201 Created with task data, handles 400 Bad Request for validation errors
- [x] T011 [P] [US1] Implement GET /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py that retrieves all tasks filtered by owner_user_id, returns 200 OK with array of tasks (empty array if no tasks)
- [x] T012 [P] [US1] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py that retrieves a specific task filtered by owner_user_id and task_id, returns 200 OK with task data or 404 Not Found if task doesn't exist or doesn't belong to user
- [x] T013 [US1] Add error handling for database connection errors (503 Service Unavailable) to all User Story 1 endpoints in backend/src/api/routes/tasks.py
- [x] T014 [US1] Register task routes with FastAPI app in backend/src/main.py using APIRouter

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update and Complete Tasks (Priority: P2)

**Goal**: Add state management capabilities for task updates and completion tracking

**Independent Test**: Create a task (using P1 functionality), then make PUT requests to update it and PATCH requests to mark it complete. Verify state management and partial updates.

### Implementation for User Story 2

- [x] T015 [P] [US2] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py that updates task title and description, filters by owner_user_id and task_id, validates request body with TaskUpdate schema, refreshes updated_at timestamp, returns 200 OK with updated task or 404 Not Found
- [x] T016 [P] [US2] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/src/api/routes/tasks.py that sets completed=true, filters by owner_user_id and task_id, refreshes updated_at timestamp, returns 200 OK with updated task or 404 Not Found
- [x] T017 [US2] Add error handling for validation errors (400 Bad Request) and database errors (503 Service Unavailable) to User Story 2 endpoints in backend/src/api/routes/tasks.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Delete Tasks (Priority: P3)

**Goal**: Complete CRUD lifecycle with task deletion capability

**Independent Test**: Create a task (P1), then make a DELETE request and verify it no longer appears in GET requests. Verify complete lifecycle management.

### Implementation for User Story 3

- [x] T018 [US3] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py that permanently removes task from database, filters by owner_user_id and task_id, returns 204 No Content on success or 404 Not Found if task doesn't exist or doesn't belong to user
- [x] T019 [US3] Add error handling for database errors (503 Service Unavailable) to DELETE endpoint in backend/src/api/routes/tasks.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 [P] Create README.md in backend/ with setup instructions, environment variables, running the server, and API documentation links
- [x] T021 [P] Verify all endpoints return consistent JSON response formats per contracts/tasks-api.yaml
- [x] T022 Validate quickstart.md instructions by following setup steps and testing all CRUD operations
- [x] T023 [P] Add logging for database connection status and request errors in backend/src/main.py
- [x] T024 Verify user isolation by testing cross-user access attempts (user A cannot access user B's tasks)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services (already in Foundational phase)
- Services before endpoints (N/A - no separate service layer in this spec)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Endpoints within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all endpoints for User Story 1 together:
Task: "Implement POST /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py"
Task: "Implement GET /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py"
Task: "Implement GET /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Agent Delegation

**Recommended agents for implementation**:

- **Phase 2 (Foundational)**:
  - T005 (database.py): backend-api-architect agent
  - T006 (Task model): database-schema-design agent
  - T007-T008 (schemas): backend-api-architect agent
  - T009 (main.py): backend-api-architect agent

- **Phase 3 (User Story 1)**:
  - T010-T014: backend-api-architect agent

- **Phase 4 (User Story 2)**:
  - T015-T017: backend-api-architect agent

- **Phase 5 (User Story 3)**:
  - T018-T019: backend-api-architect agent

- **After all implementation**:
  - neon-db-optimizer agent for query optimization review

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Tests are NOT included as they were not requested in the specification
