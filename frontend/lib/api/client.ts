/**
 * API Client
 *
 * Centralized API client with automatic JWT token injection and error handling.
 */

import { getToken } from '@/lib/auth/token';
import { ApiError, ErrorResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Make an API request with automatic JWT token injection
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  // Build headers object
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with any headers from options
  if (options.headers) {
    const optionsHeaders = new Headers(options.headers);
    optionsHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 204 No Content (successful DELETE)
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse response body
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(response.status, data as ErrorResponse);
    }

    return data as T;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(503, {
        detail: 'Network error. Please check your connection.',
      });
    }

    // Handle other errors
    throw new ApiError(500, {
      detail: 'An unexpected error occurred.',
    });
  }
}

/**
 * Make a GET request
 */
export async function get<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET' });
}

/**
 * Make a POST request
 */
export async function post<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Make a PUT request
 */
export async function put<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Make a PATCH request
 */
export async function patch<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Make a DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' });
}
