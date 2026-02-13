/**
 * Authentication API Calls
 *
 * Functions for user authentication operations.
 */

import { post, get } from './client';
import { AuthResponse, SignupRequest, SigninRequest } from '@/types/api';
import { User } from '@/types/auth';

/**
 * Sign up a new user
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/signup', data);
}

/**
 * Sign in an existing user
 */
export async function signin(data: SigninRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/signin', data);
}

/**
 * Get current user information
 */
export async function me(): Promise<User> {
  return get<User>('/api/auth/me');
}
