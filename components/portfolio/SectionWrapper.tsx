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
      {/* Subtle top divider line with gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="mb-14 lg:mb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] mb-4 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
              {label}
            </span>
          </motion.div>

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
