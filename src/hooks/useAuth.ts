'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Cookie-based session: middleware also guards server routes.
export function useAuthGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = r.ok ? await r.json() : { user: null };
        if (cancelled) return;
        const ok = !!data?.user;
        setAuthed(ok);
        setLoading(false);
        if (!ok) router.replace('/login');
      } catch {
        if (cancelled) return;
        setAuthed(false);
        setLoading(false);
        router.replace('/login');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { loading, authed };
}

export async function logout(router?: ReturnType<typeof useRouter>) {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } finally {
    router?.replace('/login');
  }
}
