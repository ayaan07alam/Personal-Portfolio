'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function SmoothCursor() {
    const [cursorType, setCursorType] = useState<'default' | 'hover' | 'text' | 'view'>('default');
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
            
            // Check for specific cursor data attributes
            const cursorData = target.closest('[data-cursor]')?.getAttribute('data-cursor');
            
            if (cursorData === 'view') {
                setCursorType('view');
            } else if (cursorData === 'text' || target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3') {
                // If it's a link inside text, prefer hover
                if (target.closest('a') || target.closest('button')) {
                    setCursorType('hover');
                } else {
                    setCursorType('text');
                }
            } else if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-trigger')
            ) {
                setCursorType('hover');
            } else {
                setCursorType('default');
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
                translateY: '-50%',
                willChange: "transform"
            }}
            className={`hidden md:flex fixed top-0 left-0 rounded-full pointer-events-none z-[9999] items-center justify-center transition-all duration-300 ease-out overflow-hidden
                ${cursorType === 'hover' ? 'w-20 h-20 bg-white opacity-30 mix-blend-difference' : ''}
                ${cursorType === 'default' ? 'w-4 h-4 bg-white opacity-100 mix-blend-difference' : ''}
                ${cursorType === 'text' ? 'w-1.5 h-10 bg-brand-500 opacity-80 mix-blend-screen rounded-sm' : ''}
                ${cursorType === 'view' ? 'w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20' : ''}
                ${isClicking ? 'scale-75' : 'scale-100'}
            `}
        >
            {/* Center dot for precision in default state */}
            {cursorType === 'default' && <div className="absolute inset-0 m-auto w-1 h-1 bg-black rounded-full" />}
            
            {/* "View" text for project hover */}
            <AnimatePresence>
                {cursorType === 'view' && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-white font-mono text-[11px] uppercase tracking-widest font-bold"
                    >
                        View
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
