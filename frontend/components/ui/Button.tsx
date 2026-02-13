/**
 * Button Component
 *
 * Reusable button component with premium variants and loading states.
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:scale-105 hover:shadow-glow-lg focus:ring-indigo-500',
    secondary: 'border-2 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20 hover:scale-105 focus:ring-indigo-500',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:scale-105 hover:shadow-glow-lg focus:ring-red-500',
    ghost: 'bg-transparent text-gray-200 hover:bg-white/10 hover:scale-105 focus:ring-gray-500',
  };

  const loadingStyles = isLoading ? 'opacity-75 cursor-wait' : '';

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], loadingStyles, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
