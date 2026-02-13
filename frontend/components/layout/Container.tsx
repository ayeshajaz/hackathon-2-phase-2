/**
 * Container Component
 *
 * Reusable container component for consistent spacing and max-width.
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 md:px-8', className)}>
      {children}
    </div>
  );
}
