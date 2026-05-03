'use client';

import { ReactLenis } from 'lenis/react';

/** Inertial scrolling — complements Framer transitions for a softer, desktop-app feel */
export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.12,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.85,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
