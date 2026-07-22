'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';

const IntroScene = dynamic(() => import('./scene/IntroScene'), { ssr: false });

const BOOT_LINES = [
  'INITIALIZING PLACEMENT OS',
  'CALIBRATING RECRUITER NETWORK',
  'COMPILING OUTREACH GRAPH',
];

const SESSION_KEY = 'CorpLink.-intro-seen';

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'checking' | 'playing' | 'done'>('checking');
  const [lineIndex, setLineIndex] = useState(0);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen || reducedMotion) {
      setPhase('done');
    } else {
      setPhase('playing');
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const timers = [0.6, 1.7, 3.1].map((sec, i) =>
      setTimeout(() => setLineIndex(i + 1), sec * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  function finish() {
    sessionStorage.setItem(SESSION_KEY, '1');
    setPhase('done');
  }

  return (
    <>
      {phase === 'playing' && (
        <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center">
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 22], fov: 60 }} gl={{ antialias: true, alpha: true }}>
              <IntroScene onComplete={finish} />
            </Canvas>
          </div>

          <div className="absolute bottom-12 left-0 w-full flex flex-col items-center gap-4 px-6">
            <div className="font-mono text-xs tracking-[0.2em] text-white/70 h-4">
              {BOOT_LINES[Math.min(lineIndex, BOOT_LINES.length - 1)]}
              {lineIndex < BOOT_LINES.length && <span className="animate-pulse">_</span>}
            </div>
            <button
              onClick={finish}
              className="font-mono text-[11px] tracking-wider text-mute hover:text-white transition-colors border border-border rounded-full px-4 py-1.5"
            >
              SKIP INTRO
            </button>
          </div>
        </div>
      )}

      <div
        className={`transition-opacity duration-700 ${
          phase === 'done' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {phase !== 'checking' && children}
      </div>
    </>
  );
}
