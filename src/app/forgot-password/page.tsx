'use client';

import { useState } from 'react';
// 👇 FIX: Using relative paths to find components reliably
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add API logic here later
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1221] p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-sm text-gray-400">Enter your email to receive reset instructions</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
            <div className="text-center text-sm text-gray-400">
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 animate-in fade-in">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-gray-300">
              If an account exists for <strong>{email}</strong>, you will receive an email shortly.
            </p>
            <Button variant="secondary" onClick={() => setSubmitted(false)}>
              Try another email
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}