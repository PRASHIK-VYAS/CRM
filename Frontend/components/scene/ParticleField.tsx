'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildLayouts, buildLineSegments, COUNT } from '@/lib/particleLayouts';
import { clamp, smoothstep } from '@/lib/useScrollProgress';
import { makeGlowTexture } from '@/lib/glowTexture';
import { COLORS } from '@/lib/colors';

const BRAND = new THREE.Color(COLORS.white); // organized / cluster / tunnel state
const MUTED = new THREE.Color(COLORS.muted); // scattered "chaos" state

export default function ParticleField() {
  const { camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const travelerRef = useRef<THREE.Mesh>(null);

  const glowTex = useMemo(() => makeGlowTexture(), []);
  const layouts = useMemo(() => buildLayouts(), []);
  const live = useMemo(() => new Float32Array(COUNT * 3), []);
  const liveColor = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) MUTED.toArray(arr, i * 3);
    return arr;
  }, []);

  const lastLineMode = useRef<'scatter' | 'cluster'>('scatter');

  useFrame(() => {
    const pointsGeo = pointsRef.current?.geometry;
    if (!pointsGeo) return;

    // ---- read section positions from the DOM ----
    const hero = document.getElementById('hero');
    const problem = document.getElementById('problem');
    const solution = document.getElementById('solution');
    const pipeline = document.getElementById('pipeline');
    const cta = document.getElementById('cta');
    if (!hero || !problem || !solution || !pipeline || !cta) return;

    const vh = window.innerHeight;
    const pipelineRect = pipeline.getBoundingClientRect();
    const solutionRect = solution.getBoundingClientRect();
    const ctaRect = cta.getBoundingClientRect();

    const pSolution = clamp((vh - solutionRect.top) / (solutionRect.height + vh), 0, 1);
    const pPipeline = clamp((vh - pipelineRect.top) / (pipelineRect.height + vh * 0.4), 0, 1);
    const pCta = clamp((vh - ctaRect.top) / (ctaRect.height + vh), 0, 1);

    let from: Float32Array, to: Float32Array, mix: number, tint: 'muted' | 'brand';

    if (pipelineRect.top > vh * 0.6) {
      // problem -> solution: scatter (chaos) blends into cluster (organized)
      mix = smoothstep(pSolution);
      from = layouts.scatter;
      to = layouts.cluster;
      tint = mix < 0.5 ? 'muted' : 'brand';
    } else if (ctaRect.top > vh * 0.5) {
      // pipeline: cluster blends into tunnel, camera dollies through
      mix = smoothstep(pPipeline);
      from = layouts.cluster;
      to = layouts.tunnel;
      tint = 'brand';
    } else {
      // cta: tunnel settles into calm grid
      mix = smoothstep(pCta);
      from = layouts.tunnel;
      to = layouts.settled;
      tint = 'brand';
    }

    const posAttr = pointsGeo.attributes.position as THREE.BufferAttribute;
    const colAttr = pointsGeo.attributes.color as THREE.BufferAttribute;
    const targetColor = tint === 'muted' ? MUTED : BRAND;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      live[ix] = THREE.MathUtils.lerp(from[ix], to[ix], mix);
      live[iy] = THREE.MathUtils.lerp(from[iy], to[iy], mix);
      live[iz] = THREE.MathUtils.lerp(from[iz], to[iz], mix);

      liveColor[ix] = THREE.MathUtils.lerp(liveColor[ix], targetColor.r, 0.08);
      liveColor[iy] = THREE.MathUtils.lerp(liveColor[iy], targetColor.g, 0.08);
      liveColor[iz] = THREE.MathUtils.lerp(liveColor[iz], targetColor.b, 0.08);
    }
    posAttr.array.set(live);
    posAttr.needsUpdate = true;
    colAttr.array.set(liveColor);
    colAttr.needsUpdate = true;

    // ---- connective lines: only meaningful pre-pipeline ----
    if (lineRef.current) {
      if (pipelineRect.top > vh * 0.5) {
        const wantMode: 'scatter' | 'cluster' = mix < 0.5 ? 'scatter' : 'cluster';
        if (wantMode !== lastLineMode.current) {
          const segs = buildLineSegments(
            wantMode === 'scatter' ? layouts.scatter : layouts.cluster,
            wantMode,
            layouts.clusterAssign
          );
          lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(segs, 3));
          lastLineMode.current = wantMode;
        }
        lineRef.current.visible = true;
        (lineRef.current.material as THREE.LineBasicMaterial).opacity =
          0.12 * (1 - Math.abs(mix - 0.5) * 0.6);
      } else {
        lineRef.current.visible = false;
      }
    }

    // ---- camera: dolly through the tunnel during the pipeline section ----
    if (pipelineRect.top <= vh * 0.6 && ctaRect.top > vh * 0.5) {
      const t = clamp(pPipeline, 0, 1);
      camera.position.z = 20 - t * 60;
      camera.position.x = Math.sin(t * 10) * 0.6;
      camera.position.y = Math.cos(t * 8) * 0.4;
      camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, camera.position.z - 15);
      if (travelerRef.current) {
        travelerRef.current.visible = true;
        travelerRef.current.position.set(0, 0, camera.position.z - 6);
      }
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 22, 0.05);
      camera.lookAt(0, 0, 0);
      if (travelerRef.current) travelerRef.current.visible = false;
    }

    // ---- ambient rotation ----
    if (pointsRef.current) pointsRef.current.rotation.y += 0.0007;

    // ---- stage card highlighting (DOM side-effect, mirrors the pipeline progress) ----
    const stageCards = document.querySelectorAll('.stage-card');
    const t = clamp(pPipeline, 0, 1);
    const activeIdx = Math.min(3, Math.floor(t * 4));
    stageCards.forEach((el, idx) => {
      el.classList.toggle('active', idx === activeIdx || (t > 0.05 && idx < activeIdx));
    });
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={layouts.scatter} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COUNT} array={liveColor} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.55}
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>

      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </lineSegments>

      <mesh ref={travelerRef} visible={false}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color="#1E88E5" />
      </mesh>
    </>
  );
}
