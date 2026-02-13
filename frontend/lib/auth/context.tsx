/**
 * Authentication Context
 *
 * Provides authentication state and operations throughout the application.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextValue, User } from '@/types/auth';
import { signup as signupApi, signin as signinApi, me as meApi } from '@/lib/api/auth';
import { setToken, clearToken, hasToken } from './token';
import { ApiError } from '@/types/api';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Load user from token on mount
   */
  useEffect(() => {
    const loadUser = async () => {
      if (hasToken()) {
        try {
          const userData = await meApi();
          setUser(userData);
        } catch (error) {
          // Token is invalid or expired, clear it
          clearToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Sign up a new user
   */
  const signup = useCallback(async (email: string, password: string) => {
    try {
      const response = await signupApi({ email, password });
      setToken(response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Signup failed');
    }
  }, [router]);

  /**
   * Sign in an existing user
   */
  const signin = useCallback(async (email: string, password: string) => {
    try {
      const response = await signinApi({ email, password });
      setToken(response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Signin failed');
    }
  }, [router]);

  /**
   * Sign out the current user
   */
  const signout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push('/signin');
  }, [router]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (hasToken()) {
      try {
        const userData = await meApi();
        setUser(userData);
      } catch (error) {
        clearToken();
        setUser(null);
        router.push('/signin');
      }
    }
  }, [router]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    signin,
    signup,
    signout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
