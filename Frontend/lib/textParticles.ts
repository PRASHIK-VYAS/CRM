/**
 * Renders text to an offscreen 2D canvas, then samples the opaque pixels
 * into a list of points. This is the classic "particles form the shape of
 * text" technique — the intro animation uses this to make particles fly
 * into the exact shape of the word "PLACED."
 */
export function sampleTextPoints(
  text: string,
  opts: { width: number; height: number; fontSize: number; density?: number }
): { x: number; y: number }[] {
  const { width, height, fontSize, density = 4 } = opts;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: { x: number; y: number }[] = [];

  for (let y = 0; y < height; y += density) {
    for (let x = 0; x < width; x += density) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        points.push({ x: x - width / 2, y: -(y - height / 2) });
      }
    }
  }
  return points;
}

/** Picks `count` points evenly-ish from a larger point list (or pads by repeating). */
export function resamplePoints(
  points: { x: number; y: number }[],
  count: number
): { x: number; y: number }[] {
  if (points.length === 0) return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    out.push(points[Math.floor((i / count) * points.length)]);
  }
  return out;
}
