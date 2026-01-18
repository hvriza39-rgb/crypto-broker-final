import clsx from 'clsx';
import { ReactNode } from 'react';

export default function InlineAlert({
  variant = 'info',
  children,
  className,
}: {
  variant?: 'info' | 'success' | 'error';
  children: ReactNode;
  className?: string;
}) {
  const styles =
    variant === 'success'
      ? 'bg-success/20 text-success'
      : variant === 'error'
      ? 'bg-danger/20 text-danger'
      : 'bg-accent/20 text-accent';

  return (
    <div className={clsx('rounded-md px-3 py-2 text-sm border border-border', styles, className)}>
      {children}
    </div>
  );
}
