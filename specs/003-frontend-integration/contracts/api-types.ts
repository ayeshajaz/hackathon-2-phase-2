/**
 * API Type Definitions
 *
 * TypeScript interfaces matching the backend API contracts from:
 * - Spec-1: Backend Core & Data Layer
 * - Spec-2: Authentication & API Security
 *
 * These types ensure type safety when communicating with the backend API.
 */

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * User account information
 * Source: GET /api/auth/me
 */
export interface User {
  id: string;           // UUID
  email: string;
  created_at: string;   // ISO 8601 timestamp
}

/**
 * Request body for user signup
 * Target: POST /api/auth/signup
 */
export interface SignupRequest {
  email: string;        // Valid email format
  password: string;     // Minimum 8 characters
}

/**
 * Request body for user signin
 * Target: POST /api/auth/signin
 */
export interface SigninRequest {
  email: string;
  password: string;
}

/**
 * Response from signup and signin endpoints
 * Source: POST /api/auth/signup, POST /api/auth/signin
 */
export interface AuthResponse {
  user: User;
  token: string;        // JWT access token
}

// ============================================================================
// Task Types
// ============================================================================

/**
 * Task entity
 * Source: GET /api/tasks, GET /api/tasks/{id}
 */
export interface Task {
  id: number;                    // Auto-increment ID
  title: string;                 // Max 200 characters
  description: string | null;    // Optional
  completed: boolean;
  owner_user_id: string;         // UUID (from JWT token)
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}

/**
 * Request body for creating a task
 * Target: POST /api/tasks
 */
export interface TaskCreateRequest {
  title: string;                 // Required, max 200 characters
  description?: string;          // Optional
}

/**
 * Request body for updating a task
 * Target: PUT /api/tasks/{id}
 */
export interface TaskUpdateRequest {
  title: string;                 // Required, max 200 characters
  description?: string;          // Optional
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard error response from backend
 * Source: All error responses (400, 401, 404, 409, 503)
 */
export interface ErrorResponse {
  detail: string | ErrorDetail[];
}

/**
 * Detailed validation error
 * Source: 400 Bad Request responses
 */
export interface ErrorDetail {
  loc: string[];                 // Location of error (e.g., ["body", "email"])
  msg: string;                   // Error message
  type: string;                  // Error type (e.g., "value_error.email")
}

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * Backend API endpoints
 * Base URL configured via environment variable: NEXT_PUBLIC_API_URL
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_SIGNIN: '/api/auth/signin',
  AUTH_ME: '/api/auth/me',

  // Tasks
  TASKS_LIST: '/api/tasks',                    // GET, POST
  TASKS_DETAIL: (id: number) => `/api/tasks/${id}`,  // GET, PUT, DELETE
  TASKS_COMPLETE: (id: number) => `/api/tasks/${id}/complete`,  // PATCH
} as const;

// ============================================================================
// HTTP Status Codes
// ============================================================================

/**
 * Expected HTTP status codes from backend API
 */
export const HTTP_STATUS = {
  OK: 200,                      // Successful GET, PUT, PATCH
  CREATED: 201,                 // Successful POST
  NO_CONTENT: 204,              // Successful DELETE
  BAD_REQUEST: 400,             // Validation error
  UNAUTHORIZED: 401,            // Missing, invalid, or expired token
  NOT_FOUND: 404,               // Resource not found
  CONFLICT: 409,                // Email already exists (signup)
  SERVICE_UNAVAILABLE: 503,     // Database error
} as const;

// ============================================================================
// API Client Types
// ============================================================================

/**
 * Options for API client requests
 */
export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;        // Whether to include JWT token (default: true)
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  response: ErrorResponse;

  constructor(status: number, response: ErrorResponse) {
    const message = typeof response.detail === 'string'
      ? response.detail
      : 'API request failed';
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }

  /**
   * Check if error is due to authentication failure
   */
  isAuthError(): boolean {
    return this.status === HTTP_STATUS.UNAUTHORIZED;
  }

  /**
   * Check if error is due to validation failure
   */
  isValidationError(): boolean {
    return this.status === HTTP_STATUS.BAD_REQUEST;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    if (typeof this.response.detail === 'string') {
      return this.response.detail;
    }

    // For validation errors, return first error message
    if (Array.isArray(this.response.detail) && this.response.detail.length > 0) {
      return this.response.detail[0].msg;
    }

    // Fallback messages based on status code
    switch (this.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return 'Authentication required. Please sign in.';
      case HTTP_STATUS.NOT_FOUND:
        return 'Resource not found.';
      case HTTP_STATUS.CONFLICT:
        return 'This email is already registered.';
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return 'Service temporarily unavailable. Please try again.';
      default:
        return 'An unexpected error occurred.';
    }
  }
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if response is an ErrorResponse
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'detail' in response
  );
}

/**
 * Type guard to check if error detail is an array
 */
export function isErrorDetailArray(detail: unknown): detail is ErrorDetail[] {
  return Array.isArray(detail) && detail.length > 0 && 'loc' in detail[0];
}

// ============================================================================
// Exports
// ============================================================================

export type {
  User,
  SignupRequest,
  SigninRequest,
  AuthResponse,
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  ErrorResponse,
  ErrorDetail,
  ApiRequestOptions,
};

export {
  API_ENDPOINTS,
  HTTP_STATUS,
  ApiError,
  isErrorResponse,
  isErrorDetailArray,
};
