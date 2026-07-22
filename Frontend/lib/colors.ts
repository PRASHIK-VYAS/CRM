/**
 * Single source of truth for colors used inside Three.js code (raw hex),
 * mirroring the Tailwind palette in tailwind.config.ts. Three.js materials
 * can't read Tailwind classes, so this file exists to keep the two in sync
 * — if you change the brand color, change it here AND in tailwind.config.ts.
 */
export const COLORS = {
  bg: '#0a1622',
  brand: '#1E88E5',
  brandHover: '#42A5F5',
  white: '#FFFFFF',
  muted: '#37474f',
} as const;
