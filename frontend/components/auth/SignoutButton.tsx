/**
 * Signout Button Component
 *
 * Button to sign out the current user.
 */

'use client';

import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';

export function SignoutButton() {
  const { signout } = useAuth();

  return (
    <Button variant="secondary" onClick={signout}>
      Sign Out
    </Button>
  );
}
