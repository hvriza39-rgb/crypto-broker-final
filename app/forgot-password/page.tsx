'use client';

import Card from '@components/ui/Card';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="text-sm text-muted">UI-only placeholder. Connect your backend to send reset links.</p>
        </div>

        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <Button className="w-full" onClick={() => alert(`Reset link sent to ${email || '(empty)'} (demo)`)}>Send reset link</Button>

        <p className="text-sm text-muted text-center">
          Back to <Link href="/login" className="text-accent hover:text-accent-600">Login</Link>
        </p>
      </Card>
    </div>
  );
}
