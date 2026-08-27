'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, Layers, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const BOOT_STAGES = [
  { threshold: 0, label: 'KERNEL_INITIALIZATION', detail: 'Allocating system memory & core dependencies...', icon: Terminal },
  { threshold: 20, label: 'DATABASE_CLUSTER_SYNC', detail: 'Connecting to Supabase cloud infrastructure...', icon: Database },
  { threshold: 45, label: 'COMPILING_REACTIVE_DOM', detail: 'Hydrating Next.js & Framer animation modules...', icon: Layers },
  { threshold: 70, label: 'SHADOW_GPU_ACCELERATION', detail: 'Loading 3D workspace assets & shaders...', icon: Cpu },
  { threshold: 90, label: 'SECURITY_PROTOCOL_VERIFY', detail: 'Verifying SSL telemetry & system integrity...', icon: ShieldCheck },
  { threshold: 100, label: 'SYSTEM_READY', detail: 'Executing interface launch sequence...', icon: CheckCircle2 },
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock scrolling while loading
    document.body.style.overflow = 'hidden';

    const duration = 2000; // 2 seconds boot time
    const interval = 20;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const ratio = step / steps;
      // Smooth ease-out quart curve
      const easedRatio = 1 - Math.pow(1 - ratio, 4);
      const currentProgress = Math.min(Math.round(easedRatio * 100), 100);

      setProgress(currentProgress);

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = '';
        }, 400);
      }
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, []);

  const activeStage = useMemo(() => {
    for (let i = BOOT_STAGES.length - 1; i >= 0; i--) {
      if (progress >= BOOT_STAGES[i].threshold) {
        return BOOT_STAGES[i];
      }
    }
    return BOOT_STAGES[0];
  }, [progress]);

  const StageIcon = activeStage.icon;

  // Circle radius math for circular SVG progress indicator
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[10000] flex flex-col justify-between bg-[#040407] text-white select-none overflow-hidden p-6 md:p-12 font-sans"
        >
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
          
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

          {/* Top Header Telemetry */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Terminal className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-widest text-zinc-200 uppercase">
                  AYAAN ALAM // SYSTEM OS
                </span>
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
                  ARCHITECT_CORE_v2.6
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold uppercase tracking-wider">SYSTEM_ONLINE</span>
            </div>
          </div>

          {/* Centerpiece: Glowing Arc Scanner & Counter */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="relative flex items-center justify-center">
              
              {/* Outer Rotating SVG Tech Ring */}
              <svg className="w-64 h-64 sm:w-80 sm:h-80 -rotate-90" viewBox="0 0 220 220">
                {/* Track */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  className="stroke-zinc-800/60"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  className="stroke-indigo-500 transition-all duration-150 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Pulsing Outer Neon Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute inset-0 m-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-indigo-500/20 pointer-events-none"
              />

              {/* Center Counter Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-baseline"
                >
                  <span 
                    className="font-display font-black text-6xl sm:text-8xl tracking-tight bg-gradient-to-br from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {progress}
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl text-indigo-400 font-bold ml-1">%</span>
                </motion.div>

                {/* Subsystem Icon & Label */}
                <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-mono text-zinc-300">
                  <StageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="tracking-wider">{activeStage.label}</span>
                </div>
              </div>
            </div>

            {/* Micro Progress Bar & Status Text */}
            <div className="w-full max-w-md mt-8 flex flex-col gap-2">
              <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                <span className="truncate max-w-[80%] text-zinc-400">
                  &gt; {activeStage.detail}
                </span>
                <span className="text-indigo-400 font-semibold">{progress}/100</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Zap className="w-3 h-3 text-amber-400" /> LATENCY: 14ms
              </span>
              <span className="hidden sm:inline text-zinc-700">|</span>
              <span className="hidden sm:inline text-zinc-400">ENCRYPTION: TLS_1.3</span>
            </div>

            <div>
              <span>AYAAN ALAM © {new Date().getFullYear()} // ALL RIGHTS RESERVED</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
