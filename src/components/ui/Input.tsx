import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>
      <input 
        className={`w-full bg-[#0b1220] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}