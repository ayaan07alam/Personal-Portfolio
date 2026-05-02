'use client';

import { motion } from 'framer-motion';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    once?: boolean;
}

export default function TextReveal({ text, className = '', delay = 0, once = true }: TextRevealProps) {
    const words = text.split(' ');

    return (
        <span className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block">
                    <motion.span
                        initial={{ y: '100%', opacity: 0 }}
                        whileInView={{ y: '0%', opacity: 1 }}
                        viewport={{ once, margin: '-40px' }}
                        transition={{
                            duration: 0.5,
                            delay: delay + i * 0.06,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

export function GradientTextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
    const words = text.split(' ');

    return (
        <span className={`inline-flex flex-wrap gap-x-[0.3em] gradient-text ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block">
                    <motion.span
                        initial={{ y: '110%', opacity: 0 }}
                        whileInView={{ y: '0%', opacity: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{
                            duration: 0.6,
                            delay: delay + i * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
