'use client';

import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string };

export default function Input({ className, label, hint, ...props }: Props) {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
          {label}
        </span>
      )}
      <input
        className={clsx(
          // CHANGED: rounded-lg (standard) instead of rounded-xl
          // CHANGED: py-3 (taller) instead of py-2.5
          'w-full rounded-lg bg-[#111827] border border-white/10 px-4 py-3 text-white transition-all duration-200',
          'focus:bg-[#1f2937] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none',
          'placeholder:text-gray-600 text-sm md:text-base',
          className
        )}
        {...props}
      />
      {hint && <span className="text-xs text-gray-500 italic px-1">{hint}</span>}
    </label>
  );
}