# Data Model: Frontend Types & State

**Feature**: 003-frontend-integration
**Date**: 2026-02-10
**Purpose**: Define TypeScript types for frontend state, API contracts, and UI state

---

## Overview

This document defines the TypeScript types used throughout the frontend application. Unlike backend data models that define database schemas, frontend data models focus on:
- API request/response shapes
- Application state (auth, UI)
- Form state and validation
- Component props and interfaces

---

## 1. Authentication Types

### User

Represents an authenticated user in the application.

```typescript
export interface User {
  id: string;           // UUID from backend
  email: string;        // User's email address
  created_at: string;   // ISO 8601 timestamp
}
```

**Source**: Backend `/api/auth/me` response
**Usage**: Stored in auth context, displayed in UI

---

### Auth State

Application-wide authentication state managed by React Context.

```typescript
export interface AuthState {
  user: User | null;              // Current user or null if not authenticated
  loading: boolean;               // True while checking auth status
  error: string | null;           // Error message if auth operation failed
  isAuthenticated: boolean;       // Computed: user !== null
}
```

**Usage**: Provided by AuthContext, consumed by useAuth hook

---

### Auth Operations

Functions available through auth context for authentication operations.

```typescript
export interface AuthOperations {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;  // Re-fetch current user
}
```

**Usage**: Called by auth forms and signout button

---

## 2. Task Types

### Task

Represents a task entity matching the backend schema.

```typescript
export interface Task {
  id: number;                    // Task ID (auto-increment from backend)
  title: string;                 // Task title (required, max 200 chars)
  description: string | null;    // Optional description
  completed: boolean;            // Completion status
  owner_user_id: string;         // UUID of task owner (from JWT)
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

**Source**: Backend `/api/tasks` endpoints
**Usage**: Displayed in TaskList, TaskItem components

---

### Task Create Request

Request body for creating a new task.

```typescript
export interface TaskCreateRequest {
  title: string;                 // Required, max 200 characters
  description?: string;          // Optional
}
```

**Source**: User input from CreateTaskForm
**Target**: Backend `POST /api/tasks`

---

### Task Update Request

Request body for updating an existing task.

```typescript
export interface TaskUpdateRequest {
  title: string;                 // Required, max 200 characters
  description?: string;          // Optional
}
```

**Source**: User input from EditTaskForm
**Target**: Backend `PUT /api/tasks/{id}`

---

## 3. API Response Types

### Auth Response

Response from signup and signin endpoints.

```typescript
export interface AuthResponse {
  user: User;                    // User account information
  token: string;                 // JWT access token
}
```

**Source**: Backend `POST /api/auth/signup` and `POST /api/auth/signin`
**Usage**: Extract token for storage, user for auth state

---

### Error Response

Standard error response from backend API.

```typescript
export interface ErrorResponse {
  detail: string | ErrorDetail[];  // Error message or array of validation errors
}

export interface ErrorDetail {
  loc: string[];                 // Location of error (e.g., ["body", "email"])
  msg: string;                   // Error message
  type: string;                  // Error type (e.g., "value_error.email")
}
```

**Source**: Backend error responses (400, 401, 404, 409, 503)
**Usage**: Display error messages to user

---

## 4. Form State Types

### Signin Form State

State for the signin form.

```typescript
export interface SigninFormState {
  email: string;
  password: string;
}
```

**Usage**: React Hook Form state for signin page

---

### Signup Form State

State for the signup form.

```typescript
export interface SignupFormState {
  email: string;
  password: string;
}
```

**Usage**: React Hook Form state for signup page

---

### Task Form State

State for create and edit task forms.

```typescript
export interface TaskFormState {
  title: string;
  description: string;
}
```

**Usage**: React Hook Form state for CreateTaskForm and EditTaskForm

---

## 5. UI State Types

### Loading State

Generic loading state for async operations.

```typescript
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
```

**Usage**: Component-level state for API calls

---

### Modal State

State for modal dialogs (e.g., delete confirmation).

```typescript
export interface ModalState {
  isOpen: boolean;
  data?: any;                    // Optional data passed to modal
}
```

**Usage**: Component state for DeleteTaskDialog

---

### Task List State

State for the task list view.

```typescript
export interface TaskListState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;              // Computed: tasks.length === 0
}
```

**Usage**: Managed by TanStack Query in TaskList component

---

## 6. API Client Types

### API Request Options

Options for API client requests.

```typescript
export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;        // Whether to include JWT token (default: true)
}
```

**Usage**: Passed to apiClient function

---

### API Error

Custom error class for API errors.

```typescript
export class ApiError extends Error {
  status: number;                // HTTP status code
  response: ErrorResponse;       // Parsed error response

  constructor(status: number, response: ErrorResponse) {
    super(response.detail as string);
    this.status = status;
    this.response = response;
  }
}
```

**Usage**: Thrown by apiClient, caught by error handlers

---

## 7. Component Prop Types

### Button Props

Props for the Button component.

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}
```

---

### Input Props

Props for the Input component.

```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

---

### Card Props

Props for the Card component.

```typescript
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

---

## 8. Hook Return Types

### useAuth Hook

Return type for the useAuth hook.

```typescript
export interface UseAuthReturn extends AuthState, AuthOperations {
  // Combines AuthState and AuthOperations
}
```

**Usage**: `const { user, signin, signout } = useAuth();`

---

### useTasks Hook

Return type for the useTasks hook.

```typescript
export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  createTask: (data: TaskCreateRequest) => Promise<Task>;
  updateTask: (id: number, data: TaskUpdateRequest) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<Task>;
  refetch: () => Promise<void>;
}
```

**Usage**: `const { tasks, createTask, deleteTask } = useTasks();`

---

## Type Organization

Types are organized in the `types/` directory:

```
types/
├── api.ts          # API request/response types, ApiError
├── auth.ts         # User, AuthState, AuthOperations, AuthResponse
├── task.ts         # Task, TaskCreateRequest, TaskUpdateRequest
├── form.ts         # Form state types
├── ui.ts           # UI state types, component props
└── index.ts        # Re-exports all types
```

---

## Type Safety Guidelines

1. **Always type API responses**: Use TypeScript interfaces for all API calls
2. **Avoid `any`**: Use `unknown` if type is truly unknown, then narrow with type guards
3. **Use strict mode**: Enable `strict: true` in tsconfig.json
4. **Validate at boundaries**: Validate API responses match expected types
5. **Export all types**: Make types available for reuse across components

---

## Validation Rules

Frontend validation is for UX only (backend enforces all rules):

### Email Validation
- Must be valid email format
- Checked by HTML5 input type="email" and React Hook Form

### Password Validation
- Minimum 8 characters
- Checked by React Hook Form minLength rule

### Task Title Validation
- Required (not empty)
- Maximum 200 characters
- Checked by React Hook Form required and maxLength rules

### Task Description Validation
- Optional
- No maximum length (backend may enforce)

---

**Data Model Status**: ✅ Complete
**Next**: Generate API contracts (TypeScript interfaces)
