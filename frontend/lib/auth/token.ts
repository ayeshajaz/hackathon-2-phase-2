/**
 * JWT Token Storage Utilities
 *
 * Handles storing, retrieving, and clearing JWT tokens in localStorage.
 */

const TOKEN_KEY = 'auth_token';

/**
 * Get the stored JWT token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store a JWT token
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Clear the stored JWT token
 */
export function clearToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if a token exists
 */
export function hasToken(): boolean {
  return getToken() !== null;
}
