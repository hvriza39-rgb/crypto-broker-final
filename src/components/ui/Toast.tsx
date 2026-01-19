'use client';

import clsx from 'clsx';
import { Toast as ToastType } from '../../hooks/useToast';

export default function Toast({ toasts }: { toasts: ToastType[] }) {
  const color = (t: ToastType['type']) =>
    t === 'success' ? 'bg-success/20 text-success' : t === 'error' ? 'bg-danger/20 text-danger' : 'bg-accent/20 text-accent';

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div key={t.id} className={clsx('rounded-md px-4 py-2 border border-border backdrop-blur', color(t.type))}>
          {t.title && <div className="font-medium">{t.title}</div>}
          <div className="text-sm">{t.message}</div>
        </div>
      ))}
    </div>
  );
}
