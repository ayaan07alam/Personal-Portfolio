'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, LayoutGroup, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, FileText, Sun, Moon } from 'lucide-react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { macSpringTransition } from '@/lib/motion-presets';
import { useTheme } from '@/components/ThemeProvider';

const GITHUB = 'https://github.com/ayaan07alam';
const LINKEDIN = 'https://linkedin.com/in/ayaan07alam';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'streak-matrix', label: 'Streak' },
  { id: 'projects', label: 'Projects' },
  { id: 'philosophy', label: 'Values' },
  { id: 'experience', label: 'Experience' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
  const { scrollY } = useScroll();

  const spyIds = NAV.map((n) => n.id);
  const activeId = useScrollSpy([...spyIds], 140);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24);
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('hero_section').select('resume_url').single();
      if (data?.resume_url) setResumeUrl(data.resume_url);
    })();
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[90] transition-[background-color,border-color] duration-300 ${
        scrolled
          ? 'bg-[#050507]/95 border-b border-white/[0.08] shadow-xl'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-10 h-[3.5rem] sm:h-[4rem] flex items-center justify-between gap-3 lg:gap-8">
        <button
          type="button"
          onClick={() => go('home')}
          className="flex items-center gap-2.5 shrink-0 text-left rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
          aria-label="Home"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.1] overflow-hidden">
            <span className="absolute inset-0 mesh-gradient opacity-50" aria-hidden />
            <span className="relative font-display font-extrabold text-xs tracking-tight text-white">AA</span>
          </span>
          <span className="flex flex-col min-w-0">
            <span className="font-display font-semibold text-sm leading-tight text-white tracking-tight truncate">
              Ayaan Alam
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] truncate">
              Portfolio
            </span>
          </span>
        </button>

        <LayoutGroup>
          <nav
            aria-label="Primary"
            className="hidden xl:flex flex-1 items-center justify-center gap-1 px-6"
          >
            {NAV.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="top-nav-pillow"
                      className="absolute inset-0 rounded-lg bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/[0.08]"
                      transition={macSpringTransition}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors duration-200"
            aria-label="Toggle Light/Dark Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-[18px] h-[18px] text-amber-400" strokeWidth={2} />
            ) : (
              <Moon className="w-[18px] h-[18px] text-indigo-400" strokeWidth={2} />
            )}
          </motion.button>

          <motion.a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.96 }}
            className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors duration-300"
            aria-label="GitHub"
          >
            <Github className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </motion.a>
          <motion.a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.96 }}
            className="hidden sm:flex p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </motion.a>

          <Link
            href={resumeUrl}
            target="_blank"
            prefetch={false}
            className="hidden md:inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-zinc-200 bg-white/[0.05] ring-1 ring-white/[0.1] hover:bg-white/[0.09] hover:ring-white/[0.16] transition-colors duration-300 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-brand-400" strokeWidth={2} />
            CV
          </Link>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => go('contact')}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200"
          >
            <Mail className="w-3.5 h-3.5 opacity-95" strokeWidth={2} />
            <span className="hidden sm:inline">Say hello</span>
            <ArrowUpRight className="sm:hidden w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Compact link strip — laptops between lg and xl */}
      <LayoutGroup id="compact-nav-strip">
        <div className="hidden lg:flex xl:hidden border-t border-white/[0.04] bg-[#000000]/50 backdrop-blur-md">
          <nav
            aria-label="Section shortcuts"
            className="max-w-[92rem] mx-auto px-6 w-full overflow-x-auto flex items-center gap-1 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {NAV.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={`relative shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="top-nav-pillow-compact"
                      className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/[0.07]"
                      transition={macSpringTransition}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </LayoutGroup>
    </header>
  );
}
