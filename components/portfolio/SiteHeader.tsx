'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const GITHUB = 'https://github.com/ayaan07alam';
const LINKEDIN = 'https://linkedin.com/in/ayaan07alam';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 32);
  });

  const go = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[90] transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? 'bg-[#050507]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-14 md:h-[4.25rem] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go('#home')}
          className="flex items-center gap-2 sm:gap-3 text-left shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]"
          aria-label="Scroll to top"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] overflow-hidden">
            <span className="absolute inset-0 mesh-gradient opacity-40" aria-hidden />
            <span className="relative font-display font-extrabold text-xs tracking-tighter text-white">AA</span>
          </span>
          <span className="flex flex-col min-w-0">
            <span className="font-display font-semibold text-sm md:text-base text-white tracking-tight truncate">
              Ayaan Alam
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.22em] hidden sm:block truncate">
              Engineer · Portfolio
            </span>
          </span>
        </button>

        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Secondary navigation"
        >
          <motion.a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] ring-1 ring-transparent hover:ring-white/[0.08] transition-colors"
            aria-label="GitHub profile"
          >
            <Github className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </motion.a>
          <motion.a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] ring-1 ring-transparent hover:ring-white/[0.08] transition-colors hidden sm:flex"
            aria-label="LinkedIn profile"
          >
            <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </motion.a>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => go('#contact')}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white bg-white/[0.06] ring-1 ring-white/[0.1] hover:bg-white/[0.1] hover:ring-white/[0.16] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-brand-400" strokeWidth={2} />
            Let&apos;s talk
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => go('#contact')}
            className="sm:hidden p-2.5 rounded-xl text-brand-400 hover:bg-white/[0.05] ring-1 ring-white/[0.08]"
            aria-label="Contact"
          >
            <Mail className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </motion.button>
        </nav>
      </div>
    </header>
  );
}
