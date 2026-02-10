/**
 * Signin Page
 *
 * User authentication page.
 */

import { SigninForm } from '@/components/auth/SigninForm';
import { Card } from '@/components/ui/Card';

export default function SigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your tasks
          </p>
        </div>

        <Card>
          <SigninForm />
        </Card>
      </div>
    </div>
  );
}
