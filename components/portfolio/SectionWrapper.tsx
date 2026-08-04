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
      className={`relative bg-[var(--bg-main)] overflow-hidden py-24 lg:py-32 transition-colors duration-200 ${className}`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="mb-14 lg:mb-20 max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 text-xs font-mono tracking-widest text-indigo-500 uppercase mb-4"
          >
            <span className="h-px w-6 bg-indigo-500/60" aria-hidden />
            {label}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight leading-tight text-balance"
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
