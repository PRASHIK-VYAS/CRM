'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Wire this up to your real auth endpoint later.
    setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <AuthLayout
      eyebrow="Placement Cell Access"
      title="Sign in"
      subtitle="Your dashboard, your recruiters, your pipeline — right where you left it."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-mute uppercase tracking-wide">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@college.edu"
            className="bg-white/5 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-mute/60 outline-none focus:border-brand transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-mute uppercase tracking-wide">Password</span>
            <Link href="/forgot-password" className="text-xs text-brand hover:text-brand-hover transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-white/5 border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-mute/60 outline-none focus:border-brand transition-colors"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 font-semibold text-sm px-6 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-xs text-mute text-center mt-6">
        No account yet?{' '}
        <a href="#" className="text-brand hover:text-brand-hover transition-colors">
          Request access
        </a>
      </p>
    </AuthLayout>
  );
}
