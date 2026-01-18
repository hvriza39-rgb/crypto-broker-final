'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

export default function Button({ 
  className, 
  variant = 'primary', 
  loading, 
  disabled, 
  children, 
  ...props 
}: Props) {
  return (
    <button
      disabled={loading || disabled}
      className={clsx(
        // Base styles: Match Input height (py-3) and rounding (rounded-lg)
        'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b1220]',
        
        // Variants
        variant === 'primary' && 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 focus:ring-blue-500',
        variant === 'secondary' && 'bg-white/5 hover:bg-white/10 text-white border border-white/10 focus:ring-gray-500',
        variant === 'danger' && 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 focus:ring-red-500',
        variant === 'ghost' && 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white',

        // Loading/Disabled state
        (loading || disabled) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}