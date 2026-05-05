'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
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
  const [data, setData] = useState<HeroData | null>(null);
  
  // Typewriter State
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
      className="relative min-h-[100svh] w-full bg-[#000000] overflow-hidden flex flex-col justify-center pt-24 pb-32"
    >
      <HeroBackground />

      <div className="relative z-10 w-full max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-[-5vh]">
        
        {/* Left Column: Massive Typography & Subtitle */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          className="flex flex-col gap-6 w-full max-w-[600px] mx-auto lg:mx-0 text-center lg:text-left z-20"
        >
          {/* Status Badge */}
          <motion.div
            variants={titleVariants}
            className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-2 pl-2.5 pr-5 backdrop-blur-md cursor-default"
          >
            <span className="relative flex h-2 w-2 ml-1">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.2em] text-emerald-300/90 uppercase">
              System Online
            </span>
          </motion.div>

          {/* Massive Name */}
          <div className="flex flex-col">
            <motion.h1
              variants={titleVariants}
              className="font-display font-black tracking-[-0.04em] uppercase leading-[0.85] text-stroke-premium"
              style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
            >
              {firstName}
            </motion.h1>
            <motion.h1
              variants={titleVariants}
              className="font-display font-black tracking-[-0.04em] uppercase leading-[0.85] text-stroke-premium -mt-[2%]"
              style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
            >
              {lastName.endsWith('.') ? lastName.slice(0, -1) : lastName}
              <span className="text-brand-500">.</span>
            </motion.h1>
          </div>

          {/* Typewriter Role */}
          <motion.div
            variants={titleVariants}
            className="flex items-center justify-center lg:justify-start gap-3 px-6 py-3.5 rounded-2xl border border-white/[0.05] bg-black/40 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] w-fit mx-auto lg:mx-0"
          >
            <span className="text-brand-400 font-mono text-sm">&gt;</span>
            <span className="text-sm md:text-base font-mono text-zinc-300 tracking-tight min-h-[1.5rem] inline-flex">
              <span>{displayed}</span>
              <motion.span
                animate={reduce ? { opacity: 1 } : { opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: reduce ? 0 : Infinity, repeatType: 'reverse', ease: 'linear' }}
                className="inline-block w-[2px] h-[1.1em] rounded-sm ml-1 self-center bg-brand-400/90 shadow-[0_0_12px_rgba(167,139,250,0.7)]"
              />
            </span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={titleVariants}
            className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-5 mt-4"
          >
            <motion.a
              href="#projects"
              whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={macSpringTransition}
              className="btn-primary flex items-center gap-2.5 shadow-[0_16px_40px_-12px_rgba(124,58,237,0.5)] rounded-xl px-7 py-3.5"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <div className="flex items-center gap-3">
              <Link
                href={resumeUrl}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all group"
                aria-label="Resume"
              >
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              </Link>
              <a
                href={GITHUB}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all group"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Floating 3D Workspace */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ ...macSpringTransition, delay: 0.4 }}
          className="relative flex items-center justify-center lg:justify-end"
          style={{ perspective: 1000 }}
        >
          {/* Floating Tech Nodes */}
          <motion.div 
            className="absolute -top-10 right-10 glass-card-v3 p-3 rounded-2xl shadow-xl z-20"
            animate={{ y: [-10, 10, -10], rotateZ: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          >
            <Database className="w-6 h-6 text-brand-400" />
          </motion.div>
          <motion.div 
            className="absolute bottom-20 -left-4 glass-card-v3 p-3 rounded-2xl shadow-xl z-20"
            animate={{ y: [10, -10, 10], rotateZ: [5, -5, 5] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
          >
            <Server className="w-6 h-6 text-sky-400" />
          </motion.div>
          <motion.div 
            className="absolute top-1/2 -right-6 glass-card-v3 p-3 rounded-2xl shadow-xl z-20"
            animate={{ y: [-8, 8, -8], rotateZ: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          >
            <Cloud className="w-6 h-6 text-emerald-400" />
          </motion.div>

          <motion.img 
              src="/images/developer_workspace.png" 
              alt="3D Developer Workspace"
              animate={reduce ? undefined : { y: [-15, 10, -15] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-full max-w-[550px] lg:max-w-[700px] object-contain drop-shadow-[0_40px_80px_rgba(139,92,246,0.25)] relative z-10"
          />
          
          {/* Ambient light pulse behind the image */}
          <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-brand-500/20 blur-[100px] z-0"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </motion.div>

      </div>

      {/* The HUD Bottom Bar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...macSpringTransition, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 hud-glass px-4 md:px-10 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 z-20"
      >
        {/* Telemetry Stats */}
        <div className="flex items-center gap-8 md:gap-16">
            {[
              { n: 10, suffix: '+', label: 'Projects' },
              { n: 2, suffix: '+', label: 'Years Exp' },
              { n: 5, suffix: '+', label: 'Tech Stacks' },
            ].map((s) => (
              <div key={s.label} className="text-left flex flex-col">
                <AnimatedCounter
                  target={s.n}
                  suffix={s.suffix}
                  className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums tracking-tight"
                />
                <p className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1 leading-none">
                  {s.label}
                </p>
              </div>
            ))}
        </div>

        {/* Mini Terminal Status */}
        <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 rounded-xl border border-white/[0.05] bg-black/50">
           <Terminal className="w-4 h-4 text-brand-400" />
           <span className="text-[11px] font-mono text-zinc-400 tracking-wider">
               MAIN.THREAD == <span className="text-emerald-400">"RUNNING"</span>
           </span>
        </div>
        
        {/* Contact Quick Link */}
        <div className="hidden md:block">
           <a
              href={`mailto:${emailDefault}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-mono uppercase tracking-widest text-brand-400 border border-brand-500/20 bg-brand-500/[0.05] hover:bg-brand-500/[0.1] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Transmit Signal
            </a>
        </div>
      </motion.div>
    </section>
  );
}
