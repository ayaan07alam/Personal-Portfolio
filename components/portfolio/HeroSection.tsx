'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { HeroSection as HeroData } from '@/types';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { macSpringTransition, staggerReveal, staggerItem } from '@/lib/motion-presets';

const ROLES = [
  'Software Development Engineer',
  'Backend & Full-Stack Developer',
  'Java & Spring Boot Specialist',
  'System Design & APIs',
];

const GITHUB = 'https://github.com/ayaan07alam';
const LINKEDIN = 'https://linkedin.com/in/ayaan07alam';

function FloatingOrbs() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-28 h-[min(560px,80vw)] w-[min(560px,80vw)] rounded-full bg-violet-500/[0.12] blur-[100px]"
        animate={{ opacity: [0.45, 0.72, 0.45], scale: [1, 1.05, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[-20%] left-[-10%] h-[70vw] max-h-[520px] w-[70vw] max-w-[520px] rounded-full bg-sky-500/[0.1] blur-[110px]"
        animate={{ opacity: [0.35, 0.6, 0.35], x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-[22%] h-40 w-40 rounded-full bg-emerald-500/[0.08] blur-[70px]"
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </>
  );
}

export default function HeroSection() {
  const reduce = useReducedMotion();
  const [data, setData] = useState<HeroData | null>(null);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const roles = useMemo(
    () => (data?.subtitle ? [data.subtitle, ...ROLES.filter((r) => r !== data.subtitle)] : ROLES),
    [data?.subtitle],
  );

  useEffect(() => {
    async function load() {
      try {
        const { data: d } = await supabase.from('hero_section').select('*').single();
        if (d) setData(d);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setDisplayed('');
    setDeleting(false);
    setRoleIdx(0);
  }, [data?.subtitle]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const currentRoles = roles;
    const fullText = currentRoles[roleIdx];
    const tick = () => {
      if (!fullText) return;
      if (!deleting) {
        setDisplayed((cur) => {
          const next = fullText.substring(0, cur.length + 1);
          if (next === fullText) {
            timerRef.current = setTimeout(() => setDeleting(true), 3400);
          } else {
            timerRef.current = setTimeout(tick, 115);
          }
          return next;
        });
      } else {
        setDisplayed((cur) => {
          const next = fullText.substring(0, cur.length - 1);
          if (next === '') {
            setDeleting(false);
            setRoleIdx((i) => (i + 1) % currentRoles.length);
          } else {
            timerRef.current = setTimeout(tick, 42);
          }
          return next;
        });
      }
    };
    timerRef.current = setTimeout(tick, 320);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [roleIdx, deleting, roles]);

  const nameParts = (data?.title || 'Ayaan Alam').replace(/^Hi,? I'm\s+/i, '').trim().split(' ');
  const firstName = nameParts[0] || 'Ayaan';
  const lastName = nameParts.slice(1).join(' ') || 'Alam';
  const fullName = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim();

  const desc =
    data?.description ??
    'Building scalable backends and thoughtful full‑stack experiences — performance, clarity, and long‑term architecture first.';
  const status = data?.availability_status ?? 'Available for opportunities';
  const resumeUrl = data?.resume_url ?? '/resume.pdf';
  const emailDefault = 'ayaanalam78670@gmail.com';

  const containerVariants = reduce
    ? ({ hidden: { opacity: 1 }, visible: { opacity: 1 } } as const)
    : staggerReveal(0.05, 0.06);
  const itemVariants = reduce
    ? ({ hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } } as const)
    : staggerItem(14);
  const titleVariants = reduce ? itemVariants : staggerItem(28);

  return (
    <section
      id="home"
      className="relative min-h-[100svh] w-full bg-[#000000] pt-[5.75rem] sm:pt-24 lg:pt-28 pb-16 md:pb-24 overflow-hidden"
    >
      <FloatingOrbs />

      <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-[0.65]" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 grid-fine opacity-[0.35] bg-[linear-gradient(to_bottom,#000000,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_55%)]"
      />

      <div className="relative z-10 max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-10 w-full grid lg:grid-cols-[1.12fr_minmax(0,0.8fr)] gap-14 lg:gap-20 xl:gap-28 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left flex flex-col"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] py-2 pl-2.5 pr-5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] max-w-[100%]"
          >
            <span className="relative flex h-2 w-2 ml-1">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.18em] text-emerald-300/90 uppercase">
              {status}
            </span>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="font-display text-zinc-400 text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium mb-3 tracking-wide"
          >
            Hello,&nbsp;
            <span className="text-white">I&apos;m</span>
          </motion.p>

          <motion.h1
            variants={titleVariants}
            className="font-display font-black tracking-[-0.04em] text-white leading-[0.95]"
            style={{ fontSize: 'clamp(2.85rem,7.5vw,5.85rem)' }}
          >
            {firstName}
            <span className="inline text-white/30 mx-3 font-light select-none" aria-hidden>
              |
            </span>
            <span className="gradient-text">{lastName.endsWith('.') ? lastName.slice(0, -1) : lastName}</span>
            {!lastName.endsWith('.') && <span className="text-brand-400/70">.</span>}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center gap-3 px-5 py-3.5 rounded-2xl border border-white/[0.07] bg-zinc-950/40 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.04] max-w-2xl"
          >
            <span className="text-brand-400 font-mono text-sm">&gt;</span>
            <span className="text-sm md:text-base font-mono text-zinc-200 tracking-tight min-h-[1.5rem] inline-flex flex-wrap gap-y-1">
              <span>{displayed}</span>
              <motion.span
                animate={reduce ? { opacity: 1 } : { opacity: [1, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: reduce ? 0 : Infinity,
                  repeatType: 'reverse',
                  ease: 'linear',
                }}
                className="inline-block w-[2px] h-[1.1em] rounded-sm ml-1 self-center bg-brand-400/90 shadow-[0_0_12px_rgba(167,139,250,0.7)]"
              />
            </span>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-[15px] md:text-[17px] text-zinc-400 leading-[1.7] max-w-2xl text-pretty border-l border-white/[0.08] pl-6 ml-1"
          >
            {desc}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-11 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <motion.a
              href="#projects"
              whileHover={reduce ? undefined : { scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={macSpringTransition}
              className="btn-primary flex items-center gap-2.5 shadow-[0_16px_50px_-12px_rgba(124,58,237,0.55)] hover:shadow-[0_22px_60px_-10px_rgba(124,58,237,0.6)] rounded-2xl"
            >
              <span>View projects</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <Link
              href={resumeUrl}
              target="_blank"
              prefetch={false}
              className="btn-ghost flex items-center gap-2.5 rounded-2xl ring-1 ring-white/[0.08] hover:ring-white/[0.14] bg-white/[0.03]"
            >
              <Download className="w-4 h-4" />
              Resume / CV
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap items-center gap-3 md:gap-4"
          >
            <motion.a
              href={GITHUB}
              target="_blank"
              whileHover={{ y: -2 }}
              transition={macSpringTransition}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium text-zinc-400 bg-white/[0.03] hover:bg-white/[0.06] hover:text-white border border-white/[0.08] hover:border-white/[0.13] shadow-sm transition-colors"
            >
              <Github className="w-[18px] h-[18px]" strokeWidth={1.85} /> GitHub
            </motion.a>
            <motion.a
              href={LINKEDIN}
              target="_blank"
              whileHover={{ y: -2 }}
              transition={macSpringTransition}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium text-zinc-400 bg-white/[0.03] hover:bg-white/[0.06] hover:text-white border border-white/[0.08] hover:border-white/[0.13] shadow-sm transition-colors"
            >
              <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.85} /> LinkedIn
            </motion.a>
            <motion.a
              href={`mailto:${emailDefault}`}
              whileHover={{ y: -2 }}
              transition={macSpringTransition}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium text-brand-400/95 bg-brand-500/[0.08] hover:bg-brand-500/[0.12] border border-brand-500/20 hover:border-brand-400/35 shadow-sm transition-colors"
            >
              <Mail className="w-[18px] h-[18px]" strokeWidth={2} /> Email
            </motion.a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-14 pt-11 border-t border-white/[0.06] grid grid-cols-3 gap-10 max-w-lg"
          >
            {[
              { n: 10, suffix: '+', label: 'Projects shipped' },
              { n: 2, suffix: '+', label: 'Years hands-on' },
              { n: 5, suffix: '+', label: 'Stacks & tools' },
            ].map((s) => (
              <div key={s.label} className="text-left">
                <AnimatedCounter
                  target={s.n}
                  suffix={s.suffix}
                  className="font-display text-3xl sm:text-[2.125rem] font-bold text-white tabular-nums tracking-tight"
                />
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.22em] mt-2 leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-col gap-2 text-zinc-600"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
            <motion.div
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ repeat: reduce ? 0 : Infinity, duration: 1.85, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right column — layered card stack */}
        {!reduce && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...macSpringTransition, delay: 0.35 }}
            className="relative hidden lg:block h-[min(620px,calc(100svh-9rem))] min-h-[400px]"
          >
            <div className="absolute inset-[8%_4%_-4%_-4%] rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-transparent to-sky-500/10 blur-xl" />
            <motion.div
              className="absolute left-8 top-[6%] w-[92%] h-[42%] glass-card-v3 rotate-[-3deg] z-10"
              animate={{ rotate: [-3, -3.8, -3], y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
            >
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-6">
                    Current focus
                  </p>
                  <p className="font-display text-3xl text-white font-bold tracking-tight leading-tight mb-6">
                    {fullName}
                  </p>
                  <div className="space-y-2 text-[13px] text-zinc-400 font-mono">
                    <p>
                      <span className="text-brand-400">└</span> Clean architecture · APIs · Cloud-ready
                      systems
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-zinc-600 font-mono">~/portfolio/overview</span>
              </div>
            </motion.div>
            <motion.div
              className="absolute right-0 bottom-[10%] w-[94%] h-[48%] glass-card-v3 rotate-[2.5deg] z-20"
              animate={{ rotate: [2.5, 1.9, 2.5], y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 1 }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="flex h-11 items-center gap-4 px-6 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  <span className="h-2 w-2 rounded-full bg-zinc-600/80" />
                  <span className="h-2 w-2 rounded-full bg-zinc-700" />
                </span>
                <span className="text-[10px] font-mono text-zinc-600 truncate">portfolio — zsh — 104×42</span>
              </div>
              <pre className="p-8 text-[13px] leading-relaxed font-mono text-zinc-300 overflow-hidden text-left whitespace-pre-wrap">
                {[
                  `$ ssh ${firstName.toLowerCase()}@portfolio.dev`,
                  '> Building reliable systems…',
                  '> Stack: Spring · Next.js · PostgreSQL · AWS',
                ].join('\n')}
              </pre>
              <motion.div
                className="absolute bottom-10 right-12 h-3 w-[40%] rounded-full bg-brand-500/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.8, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
