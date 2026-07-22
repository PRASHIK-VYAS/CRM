'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const AmbientScene = dynamic(() => import('@/components/scene/AmbientScene'), { ssr: false });

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <AmbientScene />
      <div className="grain" />

      <div className="relative z-[2] min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-[420px]">
          <Link
            href="/"
            className="font-display font-bold text-lg tracking-tight block text-center mb-10"
          >
            CorpLink<span className="text-brand">.</span>
          </Link>

          <div className="bg-panel border border-border rounded-2xl px-8 py-9 backdrop-blur-xl">
            <div className="font-mono text-xs tracking-[0.18em] text-brand-soft/80 uppercase mb-3">
              {eyebrow}
            </div>
            <h1 className="font-display font-semibold text-2xl mb-2">{title}</h1>
            <p className="text-mute text-sm mb-7 leading-relaxed">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
