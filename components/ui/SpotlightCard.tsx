'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    spotlightColor?: string;
    as?: 'div' | 'article';
}

export default function SpotlightCard({
    children,
    className = '',
    spotlightColor = 'rgba(139, 92, 246, 0.15)',
    as = 'div',
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const Component = as === 'article' ? motion.article : motion.div;

    return (
        <Component
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden rounded-[2rem] bg-[#0a0a0a] shadow-2xl transition-colors duration-500 hover:bg-[#111] ${className}`}
        >
            {/* Spotlight gradient — follows mouse */}
            <div
                className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />

            {/* Hardware inner shadow (Apple style) */}
            <div className="pointer-events-none absolute inset-0 z-0 rounded-[2rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]" />

            <div className="relative z-10">{children}</div>
        </Component>
    );
}
