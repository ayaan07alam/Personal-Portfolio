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
            className={`relative bg-[#000000] overflow-hidden py-28 md:py-40 ${className}`}
        >
            <div className="pointer-events-none absolute inset-0 z-0 grid-fine opacity-[0.12]" aria-hidden />
            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-brand-500/[0.045] blur-[130px] rounded-full" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
                {/* Section Header */}
                <div className="mb-16 md:mb-24 max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.28em] text-brand-400/80 uppercase mb-5"
                    >
                        <span className="h-px w-8 bg-gradient-to-r from-brand-500/80 to-transparent" aria-hidden />
                        {label}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-white tracking-[-0.03em] text-balance leading-[1.05]"
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
