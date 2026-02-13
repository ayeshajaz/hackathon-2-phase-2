/**
 * Card Component
 *
 * Reusable card container component with premium styling.
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'flat' | 'elevated' | 'interactive';
}

export function Card({ children, className = '', variant = 'flat' }: CardProps) {
  const variantStyles = {
    flat: 'shadow-xl',
    elevated: 'shadow-2xl',
    interactive: 'shadow-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300',
  };

  return (
    <div className={cn(
      'backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6',
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
}
