'use client';

import { useEffect, useRef, useState } from 'react';

export default function StatCounter({
  label,
  target,
  suffix = '',
  live = false,
  duration = 1400,
}: {
  label: string;
  target: number;
  suffix?: string;
  live?: boolean;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const settledRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.floor(t * target));
      if (t < 1) requestAnimationFrame(step);
      else settledRef.current = true;
    }
    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      if (!settledRef.current) return;
      setValue((v) => Math.max(0, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 3200);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div className="bg-panel border border-border rounded-2xl px-5 py-4 backdrop-blur-md">
      <div className="text-xs text-mute uppercase tracking-wide">{label}</div>
      <div className="font-mono text-3xl text-brand-soft mt-1">
        {value}
        {suffix && <span className="text-base text-mute ml-1">{suffix}</span>}
      </div>
    </div>
  );
}
