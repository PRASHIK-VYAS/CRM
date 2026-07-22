'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Wire this up to your real password-reset endpoint later.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  }

  return (
    <AuthLayout
      eyebrow="Account Recovery"
      title="Reset your password"
      subtitle={
        sent
          ? "Check your inbox — if that email is on file, we've sent a reset link."
          : "Enter the email tied to your placement cell account and we'll send you a reset link."
      }
    >
      {!sent ? (
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

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 font-semibold text-sm px-6 py-3.5 rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-12 h-12 rounded-full bg-brand/15 border border-brand-dim flex items-center justify-center text-brand text-xl">
            ✓
          </div>
          <button
            onClick={() => setSent(false)}
            className="text-xs text-mute hover:text-white transition-colors"
          >
            Didn&apos;t get it? Send again
          </button>
        </div>
      )}

      <p className="text-xs text-mute text-center mt-6">
        <Link href="/login" className="text-brand hover:text-brand-hover transition-colors">
          ← Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
