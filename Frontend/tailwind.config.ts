import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a1622',
        panel: 'rgba(255,255,255,0.05)',
        border: 'rgba(30,136,229,0.28)',
        brand: {
          DEFAULT: '#1E88E5',
          soft: '#FFFFFF',
          hover: '#42A5F5',
          dim: 'rgba(30,136,229,0.35)',
        },
        'muted-state': '#37474f',
        ink: '#FFFFFF',
        mute: '#b0bec5',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
