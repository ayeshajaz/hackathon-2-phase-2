/**
 * Signup Page
 *
 * User registration page with dark gradient theme.
 */

import { SignupForm } from '@/components/auth/SignupForm';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-indigo-300 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-100">
            Sign up to start managing your tasks
          </p>
        </div>

        <Card className="shadow-2xl">
          <SignupForm />
          <div className="mt-6 text-center">
            <p className="text-gray-100 text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="text-indigo-300 hover:text-indigo-400 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
