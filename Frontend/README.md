# CorpLink — Placement CRM Landing Page

Next.js 14 (App Router) + Tailwind + `@react-three/fiber`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. First load plays a ~5s intro (particles ignite →
burst → snap into the word "CorpLink" → hold → disperse into the landing
page). It only plays once per browser session (`sessionStorage`) — refresh
without closing the tab and it won't replay. There's a "SKIP INTRO" button,
and it's auto-skipped entirely if the visitor has `prefers-reduced-motion`
enabled.

After the intro: scroll the landing page — the 3D particle field behind it
morphs as you go (scattered "chaos" → organized clusters → a tunnel the
camera dollies through, synced to the pipeline stage cards → a calm settled
grid at the end).

Also try `/login` and `/forgot-password` — glass-card auth forms over a
calmer, non-scroll-driven particle background.

## How it's structured

```
app/
  layout.tsx        Loads fonts (Space Grotesk / Inter / JetBrains Mono), sets metadata
  page.tsx           Landing page: wraps everything in <IntroGate>, mounts
                      Scene + all content sections
  login/page.tsx      Sign-in form (email/password), links to forgot-password
  forgot-password/page.tsx
                      Email input -> simulated "reset link sent" state
  globals.css         Tailwind + a few things that don't map cleanly to
                      utility classes (grain overlay, stage-card transition)

components/
  IntroGate.tsx        Plays the intro once per session, then crossfades
                       into its children (the real page). Handles the
                       sessionStorage flag, the skip button, reduced-motion,
                       and the boot-sequence caption text underneath the intro.
  AuthLayout.tsx       Shared glass-card shell for /login and /forgot-password
  Nav.tsx, Footer.tsx, StatCounter.tsx
  scene/
    Scene.tsx            Fixed <Canvas> behind the landing page (z-0)
    ParticleField.tsx     Landing page animation. Reads scroll position every
                          frame via useFrame(), lerps between four precomputed
                          particle layouts, moves the camera during the
                          pipeline section.
    IntroScene.tsx        The intro animation. A local clock (not scroll)
                          drives five phases: ignite -> burst -> form text ->
                          hold -> disperse. Calls onComplete() when done.
    AmbientScene.tsx       Calm, slowly-rotating particle backdrop for the
                          auth pages — same visual language, no scroll logic.
  sections/
    Hero.tsx, Problem.tsx, Solution.tsx, Pipeline.tsx,
    Modules.tsx, Roles.tsx, Cta.tsx
    Plain content, scrolls normally on top of the canvas (z-2).

lib/
  colors.ts            Central hex constants for Three.js materials — kept
                       in sync by hand with the Tailwind palette below.
  glowTexture.ts        Shared soft-glow sprite texture, used by all three
                       particle scenes (landing, intro, ambient).
  textParticles.ts      Renders text to an offscreen canvas and samples the
                       opaque pixels into points — this is how IntroScene
                       gets the exact shape of "CorpLink" as particle targets.
  particleLayouts.ts   Pure math — the four particle states used by the
                       landing page (scatter, cluster, tunnel, settled).
  useScrollProgress.ts  clamp/smoothstep helpers + a simple 0-1 scroll hook.
```

## Color system

Brand blue is `#1E88E5` + white, on a dark navy background (`#0a1622`) — dark
backgrounds make the particle glow effects actually read; a pure white
background would wash them out. If you want a genuinely light/white
*background* theme instead, the two files to change are:

- `tailwind.config.ts` — the `colors` block (used by every component's
  className)
- `lib/colors.ts` — the same colors as raw hex, used by the three Three.js
  scene files, which can't read Tailwind classes

Keep these two in sync by hand; there's a comment in `lib/colors.ts` as a
reminder.

## The one deliberately "impure" part

`ParticleField.tsx` reaches out and touches the DOM directly inside
`useFrame` — it calls `document.getElementById(...)` and toggles
`classList` on `.stage-card` elements. That's not idiomatic React (normally
you'd lift that into state, or use an `IntersectionObserver` + context), but
it's the simplest way to keep the 3D scene and the scroll-based section
layout in sync without re-rendering React on every scroll pixel. `useFrame`
already runs ~60 times a second outside React's render cycle, so doing plain
DOM reads there is cheap and doesn't fight the framework.

If you want to make this more "correct" later: replace the
`getElementById` calls with refs passed down via context from `page.tsx`,
and drive the `.active` class through React state instead of `classList`
directly.

## Things to tune

- **Particle count** — `COUNT` in `lib/particleLayouts.ts` (currently 220).
  Push it higher once you're happy with everything else; it's the main
  performance lever.
- **Colors / fonts** — `tailwind.config.ts` (`amber`, `chaos`, `mute` etc.)
  and `app/layout.tsx` (font choices).
- **Section pacing** — `Pipeline.tsx`'s `min-h-[260vh]` controls how much
  scroll distance the tunnel dolly takes; the percentages inside
  `ParticleField.tsx`'s `useFrame` (`vh * 0.6`, `vh * 0.5` etc.) control
  where each transition kicks in relative to section boundaries.
