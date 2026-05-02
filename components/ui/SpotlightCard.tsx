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
            className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-colors duration-500 hover:border-white/[0.12] ${className}`}
        >
            {/* Spotlight gradient — follows mouse */}
            <div
                className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />

            {/* Border glow — follows mouse */}
            <div
                className="pointer-events-none absolute -inset-px z-0 rounded-2xl transition-opacity duration-500"
                style={{
                    opacity: opacity * 0.5,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor.replace('0.15', '0.3')}, transparent 40%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1px',
                    borderRadius: '1rem',
                }}
            />

            <div className="relative z-10">{children}</div>
        </Component>
    );
}
