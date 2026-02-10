/**
 * API Type Definitions
 *
 * Types for API requests, responses, and error handling.
 */

import { User } from './auth';
import { Task } from './task';

// ============================================================================
// Request Types
// ============================================================================

/**
 * Signup request body
 */
export interface SignupRequest {
  email: string;
  password: string;
}

/**
 * Signin request body
 */
export interface SigninRequest {
  email: string;
  password: string;
}

/**
 * Task creation request body
 */
export interface TaskCreateRequest {
  title: string;
  description?: string;
}

/**
 * Task update request body
 */
export interface TaskUpdateRequest {
  title: string;
  description?: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Authentication response (signup/signin)
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Error detail for validation errors
 */
export interface ErrorDetail {
  loc: string[];
  msg: string;
  type: string;
}

/**
 * Error response from API
 */
export interface ErrorResponse {
  detail: string | ErrorDetail[];
}

// ============================================================================
// API Client Types
// ============================================================================

/**
 * Options for API requests
 */
export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * API error class
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

  isAuthError(): boolean {
    return this.status === 401;
  }

  isValidationError(): boolean {
    return this.status === 400;
  }

  getUserMessage(): string {
    if (typeof this.response.detail === 'string') {
      return this.response.detail;
    }

    if (Array.isArray(this.response.detail) && this.response.detail.length > 0) {
      return this.response.detail[0].msg;
    }

    switch (this.status) {
      case 401:
        return 'Authentication required. Please sign in.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This email is already registered.';
      case 503:
        return 'Service temporarily unavailable. Please try again.';
      default:
        return 'An unexpected error occurred.';
    }
  }
}
