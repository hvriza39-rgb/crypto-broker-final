'use client';

import { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string };

export default function Select({ className, label, hint, children, ...props }: Props) {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          className={clsx(
            // CHANGED: rounded-lg (standard) and py-3 (taller)
            'w-full appearance-none rounded-lg bg-[#111827] border border-white/10 px-4 py-3 text-white transition-all duration-200',
            'focus:bg-[#1f2937] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none',
            'placeholder:text-gray-600 text-sm md:text-base',
            className
          )}
          {...props}
        >
          {children}
        </select>
        
        {/* Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {hint && <span className="text-xs text-gray-500 italic px-1">{hint}</span>}
    </label>
  );
}