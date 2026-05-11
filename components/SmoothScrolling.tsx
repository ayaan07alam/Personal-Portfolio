'use client';

import { ReactLenis } from 'lenis/react';

/** Inertial scrolling — desktop only. Mobile gets native touch (no Lenis override). */
export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
