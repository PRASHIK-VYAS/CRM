'use client';

import dynamic from 'next/dynamic';
import IntroGate from '@/components/IntroGate';
import Nav from '@/components/Nav';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import Pipeline from '@/components/sections/Pipeline';
import Modules from '@/components/sections/Modules';
import Roles from '@/components/sections/Roles';
import Cta from '@/components/sections/Cta';
import Footer from '@/components/Footer';

// Three.js touches `window`/`document`, so the scene must never render
// during server-side rendering — load it client-only.
const Scene = dynamic(() => import('@/components/scene/Scene'), { ssr: false });

export default function Page() {
  return (
    <IntroGate>
      <Scene />
      <div className="grain" />
      <Nav />

      <main className="relative z-[2]">
        <Hero />
        <Problem />
        <Solution />
        <Pipeline />
        <Modules />
        <Roles />
        <Cta />
      </main>

      <Footer />
    </IntroGate>
  );
}
