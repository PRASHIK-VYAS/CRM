'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildLayouts, COUNT } from '@/lib/particleLayouts';
import { makeGlowTexture } from '@/lib/glowTexture';
import { COLORS } from '@/lib/colors';

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const layouts = useMemo(() => buildLayouts(), []);
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const white = new THREE.Color(COLORS.white);
    for (let i = 0; i < COUNT; i++) white.toArray(arr, i * 3);
    return arr;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0006;
      pointsRef.current.rotation.x = Math.sin(Date.now() * 0.00005) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={layouts.cluster} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        map={glowTex}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

/** Fixed full-screen background scene used behind the login / forgot-password forms. */
export default function AmbientScene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 22], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <fogExp2 attach="fog" args={[COLORS.bg, 0.02]} />
        <AmbientParticles />
      </Canvas>
    </div>
  );
}
