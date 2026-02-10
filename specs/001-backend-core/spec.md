# Feature Specification: Backend Core & Data Layer

**Feature Branch**: `001-backend-core`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Backend Core & Data Layer - FastAPI, SQLModel, Neon PostgreSQL with Task CRUD operations"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Retrieve Tasks (Priority: P1)

As a backend developer or API consumer, I need to create new tasks and retrieve all tasks for a specific user so that I can establish the foundational data persistence layer.

**Why this priority**: This is the core functionality that enables any task management system. Without the ability to create and retrieve tasks, no other operations are possible. This provides immediate value by demonstrating persistent storage and user-scoped data access.

**Independent Test**: Can be fully tested by making POST requests to create tasks and GET requests to retrieve them. Verifies database connectivity, data persistence across restarts, and user-scoped filtering.

**Acceptance Scenarios**:

1. **Given** the backend is running and connected to Neon PostgreSQL, **When** a POST request is made to `/api/{user_id}/tasks` with task data (title, description), **Then** a new task is created with a unique ID, timestamps, and owner_user_id matching the URL parameter, and a 201 Created response is returned with the task data
2. **Given** multiple tasks exist for different users, **When** a GET request is made to `/api/{user_id}/tasks`, **Then** only tasks belonging to that specific user_id are returned in the response
3. **Given** a specific task exists, **When** a GET request is made to `/api/{user_id}/tasks/{task_id}`, **Then** the task details are returned if it belongs to the user, or a 404 Not Found is returned if it doesn't exist or belongs to another user
4. **Given** tasks have been created, **When** the backend is restarted, **Then** all previously created tasks are still retrievable from the database

---

### User Story 2 - Update and Complete Tasks (Priority: P2)

As a backend developer or API consumer, I need to update task details and mark tasks as complete so that task state can be managed throughout its lifecycle.

**Why this priority**: After creating tasks, users need to modify them and track completion status. This is essential for a functional task management system and builds on the P1 foundation.

**Independent Test**: Can be tested by creating a task (using P1 functionality), then making PUT requests to update it and PATCH requests to mark it complete. Verifies state management and partial updates.

**Acceptance Scenarios**:

1. **Given** a task exists for a user, **When** a PUT request is made to `/api/{user_id}/tasks/{task_id}` with updated title and description, **Then** the task is updated with new values, the updated_at timestamp is refreshed, and a 200 OK response is returned with the updated task
2. **Given** a task exists with completed=false, **When** a PATCH request is made to `/api/{user_id}/tasks/{task_id}/complete`, **Then** the task's completed status is set to true, updated_at is refreshed, and a 200 OK response is returned
3. **Given** a task belongs to user A, **When** user B attempts to update it via PUT `/api/userB/tasks/{task_id}`, **Then** a 404 Not Found response is returned (enforcing user isolation)
4. **Given** an invalid task_id is provided, **When** a PUT or PATCH request is made, **Then** a 404 Not Found response is returned

---

### User Story 3 - Delete Tasks (Priority: P3)

As a backend developer or API consumer, I need to delete tasks so that users can remove unwanted or completed tasks from their list.

**Why this priority**: Deletion completes the full CRUD lifecycle. While important, it's lower priority than create/read/update because the system is functional without it. Users can still manage tasks effectively with P1 and P2.

**Independent Test**: Can be tested by creating a task (P1), then making a DELETE request and verifying it no longer appears in GET requests. Verifies complete lifecycle management.

**Acceptance Scenarios**:

1. **Given** a task exists for a user, **When** a DELETE request is made to `/api/{user_id}/tasks/{task_id}`, **Then** the task is permanently removed from the database and a 204 No Content response is returned
2. **Given** a task has been deleted, **When** a GET request is made for that task_id, **Then** a 404 Not Found response is returned
3. **Given** a task belongs to user A, **When** user B attempts to delete it via DELETE `/api/userB/tasks/{task_id}`, **Then** a 404 Not Found response is returned (enforcing user isolation)
4. **Given** an invalid task_id is provided, **When** a DELETE request is made, **Then** a 404 Not Found response is returned

---

### Edge Cases

- What happens when a POST request is made with missing required fields (e.g., no title)?
  - System returns 400 Bad Request with validation error details
- What happens when a GET request is made for a user_id that has no tasks?
  - System returns 200 OK with an empty array
- What happens when the database connection is lost during a request?
  - System returns 503 Service Unavailable with appropriate error message
- What happens when a PUT request is made with invalid data types?
  - System returns 400 Bad Request with validation error details
- What happens when concurrent requests attempt to update the same task?
  - Last write wins (standard database behavior); updated_at timestamp reflects the final update
- What happens when a task_id in the URL doesn't match the user_id's tasks?
  - System returns 404 Not Found (user isolation enforced)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a FastAPI application entry point that starts the backend server
- **FR-002**: System MUST establish and maintain a connection to Neon Serverless PostgreSQL database
- **FR-003**: System MUST define a Task data model with the following attributes: id (auto-generated), title (required string), description (optional string), completed (boolean, default false), owner_user_id (required string), created_at (auto-generated timestamp), updated_at (auto-generated timestamp)
- **FR-004**: System MUST implement GET `/api/{user_id}/tasks` endpoint that returns all tasks belonging to the specified user_id
- **FR-005**: System MUST implement POST `/api/{user_id}/tasks` endpoint that creates a new task with the provided data and assigns owner_user_id from the URL parameter
- **FR-006**: System MUST implement GET `/api/{user_id}/tasks/{id}` endpoint that returns a specific task if it belongs to the specified user_id
- **FR-007**: System MUST implement PUT `/api/{user_id}/tasks/{id}` endpoint that updates a task's title and description if it belongs to the specified user_id
- **FR-008**: System MUST implement DELETE `/api/{user_id}/tasks/{id}` endpoint that permanently removes a task if it belongs to the specified user_id
- **FR-009**: System MUST implement PATCH `/api/{user_id}/tasks/{id}/complete` endpoint that marks a task as completed if it belongs to the specified user_id
- **FR-010**: System MUST filter all database queries by owner_user_id to ensure users can only access their own tasks
- **FR-011**: System MUST return 404 Not Found when a task_id doesn't exist or doesn't belong to the specified user_id
- **FR-012**: System MUST return 400 Bad Request when request data fails validation (missing required fields, invalid data types)
- **FR-013**: System MUST return 201 Created for successful POST requests with the created task in the response body
- **FR-014**: System MUST return 200 OK for successful GET, PUT, and PATCH requests with the task data in the response body
- **FR-015**: System MUST return 204 No Content for successful DELETE requests with no response body
- **FR-016**: System MUST automatically set created_at timestamp when a task is created
- **FR-017**: System MUST automatically update updated_at timestamp when a task is modified
- **FR-018**: System MUST persist all task data to the Neon PostgreSQL database (no in-memory storage)
- **FR-019**: System MUST maintain clear separation between data models, API routes, and database access logic
- **FR-020**: System MUST accept and return data in JSON format for all endpoints

### Key Entities

- **Task**: Represents a single todo item with title, optional description, completion status, ownership information, and timestamps. Each task belongs to exactly one user (identified by owner_user_id). Tasks are the primary data entity in this system and support full CRUD operations.

### Assumptions

- **Database Connection**: The Neon PostgreSQL connection string will be provided via environment variable (DATABASE_URL)
- **User Identity**: The user_id in the URL path is trusted input for this phase; authentication will be added in a future spec
- **Data Validation**: Title is required and must be a non-empty string; description is optional; completed is boolean
- **Pagination**: Initial implementation returns all tasks for a user without pagination (acceptable for MVP; pagination can be added later if needed)
- **Concurrency**: Standard database transaction handling is sufficient; no special locking mechanisms required
- **Error Responses**: All error responses include a JSON body with error details for debugging

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Backend application starts successfully and establishes connection to Neon PostgreSQL within 5 seconds
- **SC-002**: All CRUD operations (create, read, update, delete) complete successfully for valid requests
- **SC-003**: Tasks persist across backend restarts (data survives application lifecycle)
- **SC-004**: User isolation is enforced - users can only access tasks where owner_user_id matches the URL parameter
- **SC-005**: API responds with appropriate HTTP status codes (200, 201, 204, 400, 404) for all scenarios
- **SC-006**: All endpoints return consistent JSON response formats
- **SC-007**: Backend can handle at least 100 concurrent requests without errors
- **SC-008**: Database queries execute in under 100ms for typical operations (single task retrieval, task list for one user)
- **SC-009**: Backend is ready for authentication integration (user_id parameter can be replaced with authenticated user identity)
- **SC-010**: All functional requirements (FR-001 through FR-020) are verifiable through API testing tools (Postman, curl, automated tests)
