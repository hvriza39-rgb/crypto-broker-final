'use client';

import { useState, useCallback } from 'react';

export type Toast = { id: string; title?: string; message: string; type?: 'success' | 'error' | 'info' };

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, ...t }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3000);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(x => x.id !== id));
  }, []);

  return { toasts, push, remove };
}
