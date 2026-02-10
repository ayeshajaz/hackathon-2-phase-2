/**
 * Signup Page
 *
 * User registration page.
 */

import { SignupForm } from '@/components/auth/SignupForm';
import { Card } from '@/components/ui/Card';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">
            Sign up to start managing your tasks
          </p>
        </div>

        <Card>
          <SignupForm />
        </Card>
      </div>
    </div>
  );
}
