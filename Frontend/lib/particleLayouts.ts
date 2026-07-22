export const COUNT = 220;
export const CLUSTERS = 5;

export interface Layouts {
  scatter: Float32Array;
  cluster: Float32Array;
  tunnel: Float32Array;
  settled: Float32Array;
  clusterAssign: number[];
}

/**
 * Precomputes four particle layouts:
 *  - scatter: wide random cloud ("chaos" / spreadsheet problem state)
 *  - cluster: particles orbiting 5 industry-group centers
 *  - tunnel:  a long helix the camera dollies through (pipeline section)
 *  - settled: a calm flat grid (closing state)
 *
 * Kept outside React so it only ever runs once, not on every render.
 */
export function buildLayouts(): Layouts {
  const scatter = new Float32Array(COUNT * 3);
  const cluster = new Float32Array(COUNT * 3);
  const tunnel = new Float32Array(COUNT * 3);
  const settled = new Float32Array(COUNT * 3);
  const clusterAssign: number[] = [];

  const clusterCenters: [number, number, number][] = [];
  for (let i = 0; i < CLUSTERS; i++) {
    const a = (i / CLUSTERS) * Math.PI * 2;
    clusterCenters.push([Math.cos(a) * 9, Math.sin(a) * 6, Math.sin(a * 2) * 3]);
  }

  for (let i = 0; i < COUNT; i++) {
    clusterAssign.push(i % CLUSTERS);

    // scatter
    scatter[i * 3] = (Math.random() - 0.5) * 34;
    scatter[i * 3 + 1] = (Math.random() - 0.5) * 20;
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 18;

    // cluster
    const center = clusterCenters[clusterAssign[i]];
    const r = 1.4 + Math.random() * 2.6;
    const ang = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * 2.2;
    cluster[i * 3] = center[0] + Math.cos(ang) * r;
    cluster[i * 3 + 1] = center[1] + Math.sin(ang) * r * 0.6 + h;
    cluster[i * 3 + 2] = center[2] + Math.sin(ang) * r;

    // tunnel (helix descending along -z)
    const t = i / COUNT;
    const tunnelZ = 18 - t * 120;
    const tr = 5.2 + Math.sin(t * 30) * 0.3;
    const tAng = t * Math.PI * 18;
    tunnel[i * 3] = Math.cos(tAng) * tr;
    tunnel[i * 3 + 1] = Math.sin(tAng) * tr;
    tunnel[i * 3 + 2] = tunnelZ;

    // settled (flat grid)
    const gx = (i % 15) - 7;
    const gy = Math.floor(i / 15) % 8 - 4;
    settled[i * 3] = gx * 1.6;
    settled[i * 3 + 1] = gy * 1.6;
    settled[i * 3 + 2] = -Math.floor(i / 120) * 4;
  }

  return { scatter, cluster, tunnel, settled, clusterAssign };
}

/** Builds line-segment endpoints connecting particles, for the network look. */
export function buildLineSegments(
  positions: Float32Array,
  mode: 'scatter' | 'cluster',
  clusterAssign: number[]
): Float32Array {
  const segs: number[] = [];

  if (mode === 'cluster') {
    for (let c = 0; c < CLUSTERS; c++) {
      const members: number[] = [];
      for (let i = 0; i < COUNT; i++) if (clusterAssign[i] === c) members.push(i);
      for (let k = 0; k < members.length; k++) {
        const a = members[k];
        const b = members[(k + 3) % members.length];
        segs.push(
          positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
          positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
        );
      }
    }
  } else {
    for (let i = 0; i < COUNT; i += 2) {
      const a = i;
      const b = (i + 17) % COUNT;
      segs.push(
        positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
        positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
      );
    }
  }

  return new Float32Array(segs);
}
