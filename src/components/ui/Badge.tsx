import React from 'react';
import clsx from 'clsx';

export default function Badge({ children, color = 'accent' }: { children: React.ReactNode; color?: 'accent' | 'success' | 'warning' | 'danger' }) {
  const map: Record<string, string> = {
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger'
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs border border-border', map[color])}>
      {children}
    </span>
  );
}
