'use client';

import { ReactLenis } from 'lenis/react';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    return (
        // <ReactLenis root options={{
        //     duration: 1.2,
        //     easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
        //     orientation: 'vertical',
        //     gestureOrientation: 'vertical',
        //     smoothWheel: true,
        //     wheelMultiplier: 1,
        //     touchMultiplier: 2,
        // }}>
        <>
            {children}
        </>
        // </ReactLenis>
    );
}
