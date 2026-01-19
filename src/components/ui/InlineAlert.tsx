import { ReactNode } from 'react';

interface InlineAlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
}

export default function InlineAlert({ variant = 'info', children }: InlineAlertProps) {
  const styles = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className={`px-4 py-3 rounded-lg border text-sm ${styles[variant]}`}>
      {children}
    </div>
  );
}