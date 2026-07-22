'use client';

import { Canvas } from '@react-three/fiber';
import ParticleField from './ParticleField';
import { COLORS } from '@/lib/colors';

/**
 * The 3D canvas sits fixed behind all page content (z-index 0).
 * Content sections scroll on top of it; ParticleField reads scroll
 * position each frame and morphs itself accordingly.
 */
export default function Scene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 22], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <fogExp2 attach="fog" args={[COLORS.bg, 0.012]} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
