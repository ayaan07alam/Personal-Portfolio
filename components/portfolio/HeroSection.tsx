'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { HeroSection as HeroData } from '@/types';
import ParticleField from '@/components/ui/ParticleField';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const ROLES = [
    'Software Development Engineer',
    'Backend & Full-Stack Developer',
    'Java & Spring Boot Expert',
    'System Design Enthusiast',
];

export default function HeroSection() {
    const [data, setData] = useState<HeroData | null>(null);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [roleIdx, setRoleIdx] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
    const opacity = useTransform(scrollYProgress, [0.3, 0.8], [1, 0]);
    const overlayOpacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

    const roles = useMemo(
        () => (data?.subtitle ? [data.subtitle, ...ROLES.filter((r) => r !== data.subtitle)] : ROLES),
        [data?.subtitle]
    );

    useEffect(() => {
        async function load() {
            try { const { data: d } = await supabase.from('hero_section').select('*').single(); if (d) setData(d); }
            catch (e) { console.error(e); }
        }
        load();
    }, []);

    useEffect(() => {
        setDisplayed('');
        setDeleting(false);
        setRoleIdx(0);
    }, [data?.subtitle]);

    // ── Typewriter: VERY SLOW and deliberate (preserved exactly) ──
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const currentRoles = roles;
        const fullText = currentRoles[roleIdx];
        const tick = () => {
            if (!deleting) {
                setDisplayed(cur => {
                    const next = fullText.substring(0, cur.length + 1);
                    if (next === fullText) {
                        timerRef.current = setTimeout(() => setDeleting(true), 4500);
                    } else {
                        timerRef.current = setTimeout(tick, 160);
                    }
                    return next;
                });
            } else {
                setDisplayed(cur => {
                    const next = fullText.substring(0, cur.length - 1);
                    if (next === '') {
                        setDeleting(false);
                        setRoleIdx(i => (i + 1) % currentRoles.length);
                    } else {
                        timerRef.current = setTimeout(tick, 50);
                    }
                    return next;
                });
            }
        };
        timerRef.current = setTimeout(tick, 400);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [roleIdx, deleting, roles]);

    const nameParts = (data?.title || 'Ayaan Alam').replace("Hi, I'm ", "").split(' ');
    const firstName = nameParts[0] || 'Ayaan';
    const lastName = nameParts.slice(1).join(' ') || 'Alam';

    const desc = data?.description ?? 'Building scalable, performant backend systems and beautiful full-stack applications that make a real difference.';
    const status = 'Available for Hire'; // Static or from data if we add it
    const resumeUrl = data?.resume_url ?? '/resume.pdf';

    return (
        <section ref={containerRef} id="home" className="relative h-[200vh] w-full bg-[#050507]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Interactive particle network */}
                <motion.div style={{ opacity }} className="absolute inset-0 z-0">
                    <ParticleField particleCount={70} maxDistance={130} mouseRadius={180} speed={0.25} />
                </motion.div>

                <div className="pointer-events-none absolute inset-0 z-[1] mesh-gradient opacity-90 motion-reduce:opacity-40" />

                {/* Subtle grid overlay */}
                <div className="pointer-events-none absolute inset-0 z-[1] grid-fine opacity-[0.5] motion-reduce:opacity-[0.2]" />

                {/* Ambient glows */}
                <div className="pointer-events-none absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-brand-500/[0.08] blur-[120px] z-[1]" />
                <div className="pointer-events-none absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] rounded-full bg-sky-500/[0.06] blur-[100px] z-[1]" />

                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#050507]" />

                {/* Fade overlay for smooth transition out */}
                <motion.div style={{ opacity: overlayOpacity }} className="pointer-events-none absolute inset-0 z-20 bg-[#050507]" />

                {/* Content */}
                <motion.div style={{ scale, opacity }} className="relative z-10 flex flex-col items-center text-center px-6 py-32 max-w-5xl mx-auto origin-center mt-[-5vh]">
                    {/* Status badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-10"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-mono tracking-[0.2em] text-emerald-400/90 uppercase">{status}</span>
                    </motion.div>

                    {/* Cinematic Name Reveal */}
                    <div className="relative mb-8 flex flex-col items-center w-full">
                        <motion.div
                            initial={{ y: 100, opacity: 0, rotateX: 30 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 origin-bottom"
                            style={{ perspective: 1000 }}
                        >
                            <h1 
                                className="font-display font-black tracking-[-0.045em] text-white leading-[0.85] text-center mix-blend-difference"
                                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
                                data-cursor="text"
                            >
                                {firstName}
                            </h1>
                        </motion.div>
                        
                        <motion.div
                            initial={{ y: 100, opacity: 0, rotateX: 30 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 -mt-2 md:-mt-6 origin-bottom group"
                            style={{ perspective: 1000 }}
                        >
                            <h1 
                                className="font-display font-black tracking-[-0.045em] gradient-text leading-[0.85] text-center"
                                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
                                data-cursor="text"
                            >
                                {lastName}{lastName.endsWith('.') ? '' : '.'}
                            </h1>
                            {/* Cinematic stroke ghost layer */}
                            <h1 
                                className="absolute top-0 left-0 font-display font-black tracking-[-0.045em] text-stroke-hover transition-all duration-700 leading-[0.85] text-center w-full z-[-1] group-hover:translate-x-3 group-hover:translate-y-3 opacity-60"
                                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', WebkitTextStroke: '2px rgba(139, 92, 246, 0.4)' }}
                            >
                                {lastName}{lastName.endsWith('.') ? '' : '.'}
                            </h1>
                        </motion.div>
                    </div>

                {/* ── Typewriter — glowing code block style ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    className="mb-8 px-6 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm inline-flex items-center gap-3"
                >
                    <span className="text-brand-400 font-mono text-sm">{'>'}</span>
                    <div className="text-base md:text-lg font-mono text-zinc-200 tracking-tight min-h-[1.5rem] flex items-center">
                        <span>{displayed}</span>
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                            className="inline-block w-[2px] h-[1.15em] rounded-sm ml-0.5 flex-shrink-0"
                            style={{ backgroundColor: '#a78bfa', boxShadow: '0 0 14px rgba(167,139,250,0.9), 0 0 4px rgba(167,139,250,0.6)' }}
                        />
                    </div>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="text-base md:text-lg text-zinc-400/90 leading-relaxed max-w-xl mb-10 text-pretty"
                >
                    {desc}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.85 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-16"
                >
                    <a href="#projects" className="btn-primary flex items-center gap-2.5 group animate-glow-pulse">
                        <span>Explore My Work</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href={resumeUrl} target="_blank" className="btn-ghost flex items-center gap-2.5">
                        <Download className="w-4 h-4" />
                        <span>Resume</span>
                    </a>
                </motion.div>

                {/* Stats row with animated counters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="flex items-center gap-12 md:gap-16"
                >
                    {[
                        { n: 10, suffix: '+', label: 'Projects' },
                        { n: 2, suffix: '+', label: 'Years Exp.' },
                        { n: 5, suffix: '+', label: 'Tech Stacks' },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <AnimatedCounter target={s.n} suffix={s.suffix} className="text-3xl md:text-4xl font-black text-white" />
                            <span className="text-[10px] font-mono text-zinc-600 tracking-[0.2em] uppercase mt-1">{s.label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase">Scroll</span>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
                    <ChevronDown className="w-4 h-4 text-zinc-700" />
                </motion.div>
            </motion.div>
            </div>
        </section>
    );
}
