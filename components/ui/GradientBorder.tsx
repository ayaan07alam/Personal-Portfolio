'use client';

import { ReactNode } from 'react';

interface GradientBorderProps {
    children: ReactNode;
    className?: string;
    borderWidth?: number;
    animated?: boolean;
}

export default function GradientBorder({
    children,
    className = '',
    borderWidth = 1,
    animated = true,
}: GradientBorderProps) {
    return (
        <div className={`relative group ${className}`}>
            {/* Rotating conic gradient border */}
            <div
                className={`absolute -inset-[${borderWidth}px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]`}
                style={{
                    background: animated
                        ? 'conic-gradient(from var(--angle, 0deg), #8b5cf6, #6366f1, #38bdf8, #34d399, #8b5cf6)'
                        : 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
                    animation: animated ? 'gradient-rotate 4s linear infinite' : 'none',
                    borderRadius: '1rem',
                }}
            />
            {/* Inner content with background to create border effect */}
            <div className="relative bg-[#0a0a0f] rounded-2xl z-10">
                {children}
            </div>
        </div>
    );
}
