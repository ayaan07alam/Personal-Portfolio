'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function SmoothCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'text' | 'view'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const cursorTypeRef = useRef(cursorType);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    cursorTypeRef.current = cursorType;
  }, [cursorType]);

  useEffect(() => {
    // Only show custom cursor on fine pointer devices (desktop)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let rafId: number = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorData = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      let nextType: 'default' | 'hover' | 'text' | 'view' = 'default';

      if (cursorData === 'view') {
        nextType = 'view';
      } else if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-trigger')
      ) {
        nextType = 'hover';
      } else if (cursorData === 'text') {
        nextType = 'text';
      }

      if (nextType !== cursorTypeRef.current) {
        setCursorType(nextType);
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        willChange: 'transform',
      }}
      className={`hidden md:flex fixed top-0 left-0 rounded-full pointer-events-none z-[9999] items-center justify-center transition-all duration-200 ease-out overflow-hidden ${
        cursorType === 'hover' ? 'w-16 h-16 bg-white/20 border border-white/40 backdrop-blur-sm' : ''
      } ${cursorType === 'default' ? 'w-4 h-4 bg-white opacity-90 mix-blend-difference' : ''} ${
        cursorType === 'text' ? 'w-1.5 h-8 bg-purple-500 opacity-90 mix-blend-screen rounded-sm' : ''
      } ${cursorType === 'view' ? 'w-20 h-20 bg-white/10 backdrop-blur-md border border-white/30' : ''} ${
        isClicking ? 'scale-75' : 'scale-100'
      }`}
    >
      {cursorType === 'default' && <div className="absolute inset-0 m-auto w-1 h-1 bg-black rounded-full" />}
      <AnimatePresence>
        {cursorType === 'view' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-white font-mono text-[10px] uppercase tracking-widest font-bold"
          >
            View
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
