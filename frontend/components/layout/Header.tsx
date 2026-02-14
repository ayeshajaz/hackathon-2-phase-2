/**
 * Header Component
 *
 * Application header with user info, hamburger menu, and signout button.
 * Responsive: Adapts layout for mobile, tablet, and desktop.
 */

'use client';

import { useAuth } from '@/lib/auth/context';
import { SignoutButton } from '@/components/auth/SignoutButton';


interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="backdrop-blur-xl bg-slate-950/40 border-b border-white/20 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Hamburger menu (mobile only) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold bg-indigo-300 bg-clip-text text-transparent lg:hidden">
              Task Manager
            </h1>
          </div>

          {/* Right section - User info and signout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium shadow-lg">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-200 hidden md:block">
                  {user.email}
                </span>
              </div>
            )}
            <SignoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
