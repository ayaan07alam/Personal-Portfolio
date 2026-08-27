'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import { motion, useReducedMotion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Terminal,
  Database,
  Server,
  Cloud
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { HeroSection as HeroData } from '@/types';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { macSpringTransition, staggerItem } from '@/lib/motion-presets';
import HeroBackground from './HeroBackground';

const ROLES = [
  'Software Development Engineer',
  'Backend & Full-Stack Developer',
  'Java & Spring Boot Specialist',
  'System Design & APIs',
];

const GITHUB = 'https://github.com/ayaan07alam';
const LINKEDIN = 'https://linkedin.com/in/ayaan07alam';

export default function HeroSection() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [data, setData] = useState<HeroData | null>(null);
  
  // Typewriter State
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Spotlight State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const target = e.currentTarget as HTMLElement;
    const { left, top } = target.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

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

  // Typewriter Logic
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

  const resumeUrl = data?.resume_url ?? '/resume.pdf';
  const emailDefault = 'ayaanalam78670@gmail.com';

  const titleVariants = reduce ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : staggerItem(28);

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 overflow-hidden flex flex-col justify-center pt-20 pb-20 lg:pt-24 lg:pb-32 group"
    >
      <HeroBackground />

      {/* Interactive Mouse Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${useSpring(mouseX, { stiffness: 50, damping: 20 })}px ${useSpring(mouseY, { stiffness: 50, damping: 20 })}px,
              rgba(99, 102, 241, 0.06),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-4 items-center mt-[-5vh]">
        
        {/* Left Column: Massive Typography & Subtitle */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 }
            }
          }}
          className="flex flex-col gap-8 text-center lg:text-left"
        >
          {/* Status Badge */}
          <motion.div
            variants={titleVariants}
            className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 pl-2.5 pr-5 shadow-sm cursor-default"
          >
            <span className="relative flex h-2 w-2 ml-1">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.2em] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
              System Online
            </span>
          </motion.div>

          {/* Massive Name */}
          <div className="flex flex-col -my-4 select-none">
            <motion.h1
              variants={titleVariants}
              className="font-display font-black tracking-[-0.04em] uppercase leading-none text-slate-950 dark:text-white transition-colors duration-200"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 8rem)' }}
            >
              {firstName}
            </motion.h1>
            <motion.h1
              variants={titleVariants}
              className="font-display font-black tracking-[-0.04em] uppercase leading-none flex items-end justify-center lg:justify-start transition-colors duration-200"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 8rem)' }}
            >
              <span className="text-indigo-600 dark:text-indigo-400">
                {lastName.endsWith('.') ? lastName.slice(0, -1) : lastName}
              </span>
              <span className="text-slate-950 dark:text-white">.</span>
              {/* Glowing Pulse Dot */}
              <span className="inline-block w-[clamp(0.8rem,2vw,1.5rem)] h-[clamp(0.8rem,2vw,1.5rem)] rounded-full bg-indigo-600 dark:bg-indigo-500 animate-pulse ml-3 mb-[clamp(0.8rem,2vw,1.5rem)] shadow-[0_0_20px_rgba(79,70,229,0.7)]" />
            </motion.h1>
          </div>

          {/* Typewriter Role */}
          <motion.div
            variants={titleVariants}
            className="flex items-center justify-center lg:justify-start gap-3 px-5 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm w-fit mx-auto lg:mx-0 z-10"
          >
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm font-bold">&gt;</span>
            <span className="text-sm md:text-base font-mono text-[var(--text-main)] tracking-tight min-h-[1.5rem] inline-flex">
              <span>{displayed}</span>
              <motion.span
                animate={reduce ? { opacity: 1 } : { opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: reduce ? 0 : Infinity, repeatType: 'reverse', ease: 'linear' }}
                className="inline-block w-[2px] h-[1.1em] rounded-sm ml-1 self-center bg-indigo-500"
              />
            </span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={titleVariants}
            className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-5 mt-2"
          >
            <motion.a
              href="#projects"
              whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={macSpringTransition}
              className="btn-primary flex items-center gap-2.5 shadow-[0_16px_40px_-12px_rgba(79,70,229,0.35)] dark:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.5)] rounded-xl px-7 py-3.5"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <div className="flex items-center gap-3">
              <Link
                href={resumeUrl}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] shadow-sm flex items-center justify-center transition-all group"
                aria-label="Resume"
              >
                <Download className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
              </Link>
              <a
                href={GITHUB}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] shadow-sm flex items-center justify-center transition-all group"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] shadow-sm flex items-center justify-center transition-all group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Floating 3D Workspace */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ ...macSpringTransition, delay: 0.4 }}
          className="relative hidden lg:flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          {/* Floating Tech Nodes */}
          <motion.div 
            className="absolute -top-4 right-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-md p-3.5 rounded-2xl shadow-lg dark:shadow-2xl z-30 hover:scale-110 transition-transform duration-300"
            animate={{ y: [-12, 12, -12], rotateZ: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          >
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <motion.div 
            className="absolute bottom-6 left-0 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-md p-3.5 rounded-2xl shadow-lg dark:shadow-2xl z-30 hover:scale-110 transition-transform duration-300"
            animate={{ y: [15, -15, 15], rotateZ: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
          >
            <Server className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </motion.div>
          <motion.div 
            className="absolute top-1/2 -right-4 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-md p-3.5 rounded-2xl shadow-lg dark:shadow-2xl z-30 hover:scale-110 transition-transform duration-300"
            animate={{ y: [-10, 10, -10], rotateZ: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          >
            <Cloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </motion.div>

          {/* Borderless Floating 3D Workspace */}
          <div className="relative z-10 flex items-center justify-center p-2">
            <motion.img 
              src={isDark ? "/images/developer_workspace_transparent.png" : "/images/developer_workspace_light.png"} 
              alt="3D Developer Workspace"
              animate={reduce ? undefined : { y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full max-w-[540px] xl:max-w-[620px] object-contain filter drop-shadow-[0_25px_40px_rgba(79,70,229,0.18)] dark:drop-shadow-[0_25px_50px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          
          {/* Ambient soft glow backdrop */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-500/30 dark:via-purple-500/25 blur-[90px] z-0 pointer-events-none"
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </motion.div>

      </div>

      {/* The HUD Bottom Bar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...macSpringTransition, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 bg-[var(--bg-main)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] px-4 md:px-10 py-3 md:py-5 flex flex-row justify-center md:justify-between items-center gap-4 z-20 transition-colors duration-200"
      >
        {/* Telemetry Stats */}
        <div className="flex items-center gap-8 md:gap-16">
            {[
              { n: 10, suffix: '+', label: 'Projects' },
              { n: 2, suffix: '+', label: 'Years Exp' },
              { n: 5, suffix: '+', label: 'Tech Stacks' },
            ].map((s) => (
              <div key={s.label} className="text-left flex flex-col items-center md:items-start">
                <AnimatedCounter
                  target={s.n}
                  suffix={s.suffix}
                  className="font-display text-xl md:text-3xl font-bold text-[var(--text-main)] tabular-nums tracking-tight"
                />
                <p className="text-[9px] md:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1 leading-none">
                  {s.label}
                </p>
              </div>
            ))}
        </div>

        {/* Mini Terminal Status */}
        <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm">
           <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
           <span className="text-[11px] font-mono text-[var(--text-muted)] tracking-wider">
               MAIN.THREAD == <span className="text-emerald-600 dark:text-emerald-400 font-bold">"RUNNING"</span>
           </span>
        </div>
        
        {/* Contact Quick Link */}
        <div className="hidden md:block">
           <a
              href={`mailto:${emailDefault}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Transmit Signal
            </a>
        </div>
      </motion.div>
    </section>
  );
}
