import React from 'react';

export default function Table({ headers, children }: { headers: string[], children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-white/5 uppercase text-gray-300">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {children}
        </tbody>
      </table>
    </div>
  );
}