/**
 * Header Component
 *
 * Application header with user info and signout button.
 * Responsive: Adapts layout for mobile, tablet, and desktop.
 */

'use client';

import { useAuth } from '@/lib/auth/context';
import { SignoutButton } from '@/components/auth/SignoutButton';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 py-3 sm:py-0 sm:h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Task Manager
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {user && (
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
                {user.email}
              </span>
            )}
            <SignoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
