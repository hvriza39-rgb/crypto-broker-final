import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Crypto Broker Dashboard',
  description: 'Modern user dashboard for crypto trading'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
