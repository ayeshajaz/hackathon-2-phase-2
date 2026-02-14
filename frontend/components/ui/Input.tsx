/**
 * Input Component
 *
 * Reusable input component with premium styling, label and error states.
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const inputId = props.id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 border rounded-lg',
            'bg-indigo-500/30 backdrop-blur-sm',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
            'transition-all duration-300 ease-in-out',
            'text-white placeholder-gray-300',
            'disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60',
            error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-white/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-300 bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
