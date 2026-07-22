'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeGlowTexture } from '@/lib/glowTexture';
import { COLORS } from '@/lib/colors';
import { sampleTextPoints, resamplePoints } from '@/lib/textParticles';
import { smoothstep, clamp } from '@/lib/useScrollProgress';

const COUNT = 500;

// Timeline, in seconds. Each phase blends into the next.
const T_IGNITE = 0.6;
const T_BURST = 1.7;
const T_FORM = 3.1;
const T_HOLD = 4.0;
const T_DISPERSE = 4.8;

export default function IntroScene({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number | null>(null);
  const finished = useRef(false);

  const glowTex = useMemo(() => makeGlowTexture(), []);

  const { burstPos, textPos, live, liveColor } = useMemo(() => {
    const burst = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // random point roughly on a sphere shell — the "explosion" target
      const r = 8 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      burst[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      burst[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      burst[i * 3 + 2] = r * Math.cos(phi) * 0.6;
    }

    const rawText = sampleTextPoints('CorpLink.', { width: 900, height: 260, fontSize: 150, density: 5 });
    const sampled = resamplePoints(rawText, COUNT);
    const text = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      text[i * 3] = sampled[i].x * 0.017;
      text[i * 3 + 1] = sampled[i].y * 0.017;
      text[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }

    return {
      burstPos: burst,
      textPos: text,
      live: new Float32Array(COUNT * 3),
      liveColor: new Float32Array(COUNT * 3),
    };
  }, []);

  useFrame((state) => {
    if (finished.current) return;
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - startTime.current;

    const geo = pointsRef.current?.geometry;
    if (!geo) return;

    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colAttr = geo.attributes.color as THREE.BufferAttribute;

    let mix = 0;
    let from = burstPos;
    let to = burstPos;
    let colorMix = 0; // 0 = dim blue-grey, 1 = white

    if (t < T_IGNITE) {
      // everything still collapsed near the core, gently trembling
      const jitter = (i: number) => (Math.sin(t * 9 + i) * 0.05);
      for (let i = 0; i < COUNT; i++) {
        live[i * 3] = jitter(i);
        live[i * 3 + 1] = jitter(i + 50);
        live[i * 3 + 2] = jitter(i + 100);
      }
      colorMix = 0;
      if (coreRef.current) {
        const s = 0.3 + (t / T_IGNITE) * 1.4;
        coreRef.current.scale.setScalar(s);
        (coreRef.current.material as THREE.MeshBasicMaterial).opacity = clamp(t / T_IGNITE, 0, 1);
      }
    } else if (t < T_BURST) {
      mix = smoothstep((t - T_IGNITE) / (T_BURST - T_IGNITE));
      from = new Float32Array(COUNT * 3); // origin
      to = burstPos;
      for (let i = 0; i < COUNT * 3; i++) live[i] = THREE.MathUtils.lerp(from[i], to[i], mix);
      colorMix = mix * 0.3;
      if (coreRef.current) {
        (coreRef.current.material as THREE.MeshBasicMaterial).opacity = clamp(1 - mix * 2, 0, 1);
      }
    } else if (t < T_FORM) {
      mix = smoothstep((t - T_BURST) / (T_FORM - T_BURST));
      for (let i = 0; i < COUNT * 3; i++) live[i] = THREE.MathUtils.lerp(burstPos[i], textPos[i], mix);
      colorMix = 0.3 + mix * 0.7;
    } else if (t < T_HOLD) {
      for (let i = 0; i < COUNT * 3; i++) live[i] = textPos[i];
      colorMix = 1;
    } else if (t < T_DISPERSE) {
      mix = smoothstep((t - T_HOLD) / (T_DISPERSE - T_HOLD));
      for (let i = 0; i < COUNT; i++) {
        const dx = textPos[i * 3] * (1 + mix * 6);
        const dy = textPos[i * 3 + 1] * (1 + mix * 6);
        const dz = textPos[i * 3 + 2] - mix * 40;
        live[i * 3] = dx;
        live[i * 3 + 1] = dy;
        live[i * 3 + 2] = dz;
      }
      colorMix = 1;
      camera.position.z = THREE.MathUtils.lerp(22, 10, mix);
    } else if (!finished.current) {
      finished.current = true;
      camera.position.z = 22;
      onComplete();
    }

    posAttr.array.set(live);
    posAttr.needsUpdate = true;

    const muted = new THREE.Color(COLORS.muted);
    const white = new THREE.Color(COLORS.white);
    for (let i = 0; i < COUNT; i++) {
      const c = muted.clone().lerp(white, colorMix);
      liveColor[i * 3] = c.r;
      liveColor[i * 3 + 1] = c.g;
      liveColor[i * 3 + 2] = c.b;
    }
    colAttr.array.set(liveColor);
    colAttr.needsUpdate = true;
  });

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color={COLORS.brand} transparent opacity={0} />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={live} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COUNT} array={liveColor} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
    </>
  );
}
