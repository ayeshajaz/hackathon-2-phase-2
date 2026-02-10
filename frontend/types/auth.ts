/**
 * Authentication Type Definitions
 *
 * Types for user authentication, sessions, and auth state management.
 */

/**
 * User account information
 */
export interface User {
  id: string;           // UUID
  email: string;
  created_at: string;   // ISO 8601 timestamp
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth context value
 */
export interface AuthContextValue extends AuthState {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => void;
  refreshUser: () => Promise<void>;
}
