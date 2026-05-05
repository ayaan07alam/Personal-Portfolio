'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Terminal,
  Code2
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { HeroSection as HeroData } from '@/types';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { macSpringTransition } from '@/lib/motion-presets';
import HeroBackground from './HeroBackground';

const GITHUB = 'https://github.com/ayaan07alam';
const LINKEDIN = 'https://linkedin.com/in/ayaan07alam';

// The code snippet to type out
const CODE_SNIPPET = `import { Engineer } from '@system/core';

const developer = new Engineer({
  name: "Ayaan Alam",
  role: "Backend & Full-Stack",
  focus: [
    "System Architecture", 
    "Scalable APIs",
    "Cloud Infrastructure"
  ],
  status: "Optimizing the future"
});

await developer.initialize();
developer.deploy();`;

export default function HeroSection() {
  const reduce = useReducedMotion();
  const [data, setData] = useState<HeroData | null>(null);
  const [typedCode, setTypedCode] = useState('');
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Live Typing Effect for the IDE
  useEffect(() => {
    let i = 0;
    const typeWriter = () => {
      if (i < CODE_SNIPPET.length) {
        setTypedCode(CODE_SNIPPET.substring(0, i + 1));
        i++;
        // Variable speed to make it look like human typing
        const speed = Math.random() * 30 + 10;
        typingTimerRef.current = setTimeout(typeWriter, speed);
      }
    };
    
    // Start typing after a short delay
    typingTimerRef.current = setTimeout(typeWriter, 800);

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  // Syntax Highlighting parser
  const renderHighlightedCode = (code: string) => {
    // Very basic regex-based highlighting for this specific snippet
    let highlighted = code
      .replace(/import|from|const|new|await/g, '<span class="text-brand-400">$&</span>')
      .replace(/Engineer/g, '<span class="text-emerald-400">$&</span>')
      .replace(/name:|role:|focus:|status:/g, '<span class="text-sky-300">$&</span>')
      .replace(/"(.*?)"/g, '<span class="text-amber-300">"$&"</span>')
      .replace(/\/\/.*/g, '<span class="text-zinc-500">$&</span>')
      .replace(/initialize|deploy/g, '<span class="text-violet-300">$&</span>');

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const resumeUrl = data?.resume_url ?? '/resume.pdf';
  const emailDefault = 'ayaanalam78670@gmail.com';

  return (
    <section
      id="home"
      className="relative min-h-[100svh] w-full bg-[#000000] overflow-hidden flex flex-col justify-center pt-24 pb-32"
    >
      <HeroBackground />

      <div className="relative z-10 w-full max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-[-5vh]">
        
        {/* Left Column: The Live IDE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...macSpringTransition, delay: 0.2 }}
          className="flex flex-col gap-8 w-full max-w-[600px] mx-auto lg:mx-0"
        >
          {/* Status Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] py-2 pl-2.5 pr-5 backdrop-blur-md cursor-default">
            <span className="relative flex h-2 w-2 ml-1">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.2em] text-emerald-300/90 uppercase">
              System Online
            </span>
          </div>

          {/* IDE Window */}
          <div className="w-full glass-card-v3 rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]">
            {/* IDE Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-mono">
                <Code2 className="w-3.5 h-3.5" />
                <span>system_config.ts</span>
              </div>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
            
            {/* IDE Body (Live Typing) */}
            <div className="p-6 md:p-8 bg-black/40 min-h-[320px] font-mono text-[13px] md:text-[14px] leading-relaxed text-zinc-300 whitespace-pre-wrap">
              {renderHighlightedCode(typedCode)}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2.5 h-4 bg-brand-400 ml-1 align-middle shadow-[0_0_8px_rgba(167,139,250,0.8)]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-4">
            <motion.a
              href="#projects"
              whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={macSpringTransition}
              className="btn-primary flex items-center gap-2.5 shadow-[0_16px_40px_-12px_rgba(124,58,237,0.5)] rounded-xl px-7 py-3.5"
            >
              <span>Initialize Execution</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <div className="flex items-center gap-3">
              <Link
                href={resumeUrl}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all"
                aria-label="Resume"
              >
                <Download className="w-4 h-4 text-zinc-400 hover:text-white" />
              </Link>
              <a
                href={GITHUB}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-zinc-400 hover:text-white" />
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                className="w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-zinc-400 hover:text-white" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Floating 3D Workspace */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ ...macSpringTransition, delay: 0.4 }}
          className="relative flex items-center justify-center lg:justify-end"
          style={{ perspective: 1000 }}
        >
          <motion.img 
              src="/images/developer_workspace.png" 
              alt="3D Developer Workspace"
              animate={reduce ? undefined : { y: [-15, 10, -15], rotateZ: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-full max-w-[550px] lg:max-w-[700px] object-contain drop-shadow-[0_40px_80px_rgba(139,92,246,0.25)]"
          />
          
          {/* Ambient light pulse behind the image */}
          <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-brand-500/20 blur-[100px] -z-10"
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
