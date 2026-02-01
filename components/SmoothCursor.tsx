'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function SmoothCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for movement - Stiffer for magnetic feel
    const springX = useSpring(mouseX, { stiffness: 450, damping: 25 });
    const springY = useSpring(mouseY, { stiffness: 450, damping: 25 });

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check for pointer triggers
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-trigger')
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
                translateX: '-50%',
                translateY: '-50%'
            }}
            className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white transition-all duration-300 ease-out
                ${isHovered ? 'w-20 h-20 opacity-30 mix-blend-difference' : 'w-4 h-4 opacity-100'}
                ${isClicking ? 'scale-75' : 'scale-100'}
            `}
        >
            {/* Center dot for precision */}
            {!isHovered && <div className="absolute inset-0 m-auto w-1 h-1 bg-black rounded-full" />}
        </motion.div>
    );
}
