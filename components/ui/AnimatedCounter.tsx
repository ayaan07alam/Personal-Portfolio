'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion';

interface AnimatedCounterProps {
    target: number;
    suffix?: string;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({ target, suffix = '', duration = 2, className = '' }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const motionVal = useMotionValue(0);
    const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        if (isInView) {
            motionVal.set(target);
        }
    }, [isInView, motionVal, target]);

    useEffect(() => {
        const unsubscribe = spring.on('change', (v) => {
            setDisplay(Math.round(v).toString());
        });
        return unsubscribe;
    }, [spring]);

    return (
        <motion.span ref={ref} className={className}>
            {display}{suffix}
        </motion.span>
    );
}
