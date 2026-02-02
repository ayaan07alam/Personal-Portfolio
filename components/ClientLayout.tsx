'use client';

import React from "react";
import Navbar from "@/components/portfolio/Navbar";
import SmoothScrolling from "@/components/SmoothScrolling";
import SmoothCursor from "@/components/SmoothCursor";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScrolling>
            <FilmGrain />
            <SmoothCursor />
            <Navbar />
            {children}
        </SmoothScrolling>
    );
}

function FilmGrain() {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
            <svg className="w-full h-full">
                <filter id="noiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.6"
                        stitchTiles="stitch"
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
        </div>
    );
}
