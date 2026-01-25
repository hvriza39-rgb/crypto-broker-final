'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
// app/admin/login/page.tsx


// WITH THESE LINES:
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import InlineAlert from '../../../components/ui/InlineAlert';

// 1. We move the main logic into this inner component
function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get('redirect') || '/admin/users';

  const [email, setEmail] = useState('admin@broker.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Parse the response data
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Login failed');
      }

      // 👇 CRITICAL FIX 1: Verify the token exists and save it securely
      if (!data.token) {
        throw new Error("Server error: No token received.");
      }
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

      // 👇 CRITICAL FIX 2: Force hard reload to bypass Next.js cache
      window.location.href = redirect;

    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold">Admin Login</h1>
            <p className="text-sm text-muted mt-1">Sign in to manage users and transactions.</p>
          </div>

          {error && <InlineAlert variant="error">{error}</InlineAlert>}

          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// 2. The main page component wraps the form in Suspense
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <Suspense fallback={<div>Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}