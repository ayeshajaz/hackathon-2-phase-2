/**
 * Error Message Component
 *
 * Reusable error message display with premium styling and optional retry button.
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={cn('bg-red-500/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm', className)}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-red-300">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button variant="secondary" onClick={onRetry} className="text-sm">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
