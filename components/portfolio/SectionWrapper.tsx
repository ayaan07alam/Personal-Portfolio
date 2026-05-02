'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionWrapperProps {
    id?: string;
    label: string;
    title: string;
    titleAccent?: string;
    children: ReactNode;
    className?: string;
}

export default function SectionWrapper({
    id,
    label,
    title,
    titleAccent,
    children,
    className = '',
}: SectionWrapperProps) {
    return (
        <section
            id={id}
            className={`relative bg-[#050507] overflow-hidden py-28 md:py-36 ${className}`}
        >
            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/[0.03] blur-[120px] rounded-full" />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
                {/* Section Header */}
                <div className="mb-16 md:mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-[11px] font-mono tracking-[0.25em] text-brand-400/70 uppercase mb-4"
                    >
                        {label}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
                    >
                        {title}
                        {titleAccent && (
                            <span className="gradient-text ml-3">{titleAccent}</span>
                        )}
                    </motion.h2>
                </div>

                {children}
            </div>
        </section>
    );
}
