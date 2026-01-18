'use client';

import { useEffect, useState } from 'react';

export default function AdminHeader() {
  const [name, setName] = useState<string>('...');

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const n = data?.admin?.name || data?.admin?.email || 'Admin';
        setName(n);
      })
      .catch(() => setName('Admin'));
  }, []);

  return (
    <div className="border-b border-border bg-surface">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="font-medium">Admin Dashboard</div>
        <div className="text-sm text-muted">Signed in as {name}</div>
      </div>
    </div>
  );
}
