'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { macSpringTransition } from '@/lib/motion-presets';

type AboutJsonSnippetProps = {
  name: string;
  role: string;
  location: string;
  interests: string[];
  currentlyLearning: string;
  funFact: string;
};

export default function AboutJsonSnippet({
  name,
  role,
  location,
  interests,
  currentlyLearning,
  funFact,
}: AboutJsonSnippetProps) {
  const reduce = useReducedMotion();
  const blob = JSON.stringify(
    {
      name,
      role,
      location,
      interests,
      currently_learning: currentlyLearning,
      fun_fact: funFact,
    },
    null,
    2,
  );

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28, rotateX: 6 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={macSpringTransition}
      style={{ perspective: 1200, transformOrigin: 'center top' }}
      className="relative rounded-2xl border border-white/[0.09] bg-zinc-950/80 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_28px_100px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.04] overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.03]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-auto text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
          about.json
        </span>
      </div>
      <pre className="p-5 text-[11px] sm:text-xs leading-relaxed text-zinc-300 font-mono overflow-x-auto text-left [scrollbar-width:thin]">
        {blob}
      </pre>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      />
    </motion.div>
  );
}
