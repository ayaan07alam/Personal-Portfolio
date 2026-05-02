'use client';

import { useRef, useState } from 'react';
import { ReactNode } from 'react';

interface MouseGlowProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;
    glowSize?: number;
}

export default function MouseGlow({
    children,
    className = '',
    glowColor = 'rgba(139, 92, 246, 0.06)',
    glowSize = 600,
}: MouseGlowProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            className={`relative ${className}`}
        >
            {/* Ambient glow that follows cursor */}
            <div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
                style={{
                    opacity: active ? 1 : 0,
                    background: `radial-gradient(${glowSize}px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 50%)`,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
