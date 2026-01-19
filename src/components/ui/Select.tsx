import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export default function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>
      <div className="relative">
        <select
          className={`w-full appearance-none bg-[#0b1220] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors ${className}`}
          {...props}
        >
          {children}
        </select>
        {/* Custom Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}