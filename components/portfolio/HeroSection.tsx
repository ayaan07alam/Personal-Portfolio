'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Download, Terminal, Code2, Cpu, Globe, ExternalLink, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { HeroSection as HeroData } from '@/types';
import HeroBackground from './HeroBackground';

export default function HeroSection() {
    const [data, setData] = useState<HeroData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Mouse Physics for 3D Tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics
    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    // 3D Transforms
    const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: heroData } = await supabase.from('hero_section').select('*').single();
                if (heroData) setData(heroData);
            } catch (error) { console.error(error); }
        }
        fetchData();
    }, []);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        // Normalize coordinates to -0.5 to 0.5
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }

    const defaultData = {
        title: "AYAAN ALAM",
        subtitle: "Software Development Engineer, Backend & Full-Stack Engineer",
        description: "Designing, developing, and deploying scalable backend and full-stack web applications. Expert in Java, Spring Boot, RESTful APIs, and modern frontend frameworks.",
        availability_status: "Available for Hire"
    };

    const content = data || defaultData;

    // Typewriter Logic
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // Parse subtitle for multiple roles (comma separated)
    const designations = content.subtitle.split(',').map(s => s.trim());
    const texts = [content.title, ...designations];

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const handleType = () => {
            const i = loopNum % texts.length;
            const fullText = texts[i];

            setDisplayText(current => {
                if (isDeleting) {
                    return fullText.substring(0, current.length - 1);
                } else {
                    return fullText.substring(0, current.length + 1);
                }
            });

            // Speed settings: Typing=50ms, Deleting=25ms (Smoother & Faster)
            let typeSpeed = isDeleting ? 25 : 50;

            if (!isDeleting && displayText === fullText) {
                typeSpeed = 2000; // Pause at end
                setIsDeleting(true);
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setLoopNum(prev => prev + 1);
                typeSpeed = 300; // Pause before new word
            }

            timer = setTimeout(handleType, typeSpeed);
        };

        timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, loopNum, texts, typingSpeed]);

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white perspective-1000 flex items-center justify-center py-20 lg:py-0"
            onMouseMove={handleMouseMove}
            style={{ perspective: '2000px' }}
        >
            {/* Premium Animated Background */}
            <HeroBackground />

            {/* Subtle Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none z-0" />

            {/* Main 3D Container */}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center"
            >
                {/* Left: Typography & Actions */}
                <div className="flex flex-col items-center lg:items-start gap-6 md:gap-8 order-2 lg:order-1 text-center lg:text-left lg:pr-12" style={{ transform: 'translateZ(50px)' }}>
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-tech-500"></span>
                        </span>
                        <span className="text-xs md:text-sm font-mono tracking-widest text-zinc-400 uppercase">{content.availability_status}</span>
                    </div>

                    <div className="relative flex items-center justify-center lg:justify-start w-full">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white mix-blend-difference">
                            <span className="sr-only">Ayaan Alam - Software Engineer</span>
                            <span aria-hidden="true">{displayText}</span>
                            <span className="animate-pulse text-tech-500" aria-hidden="true">_</span>
                        </h1>
                    </div>

                    <p className="text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed border-none lg:border-l-2 lg:border-brand-500 lg:pl-6">
                        {content.description}
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-4">
                        <a href="#projects" className="group relative px-6 py-3 md:px-8 md:py-4 bg-white text-black font-bold flex items-center gap-2 rounded-full hover:scale-105 transition-all text-sm md:text-base overflow-hidden ripple">
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative">Explore Work</span>
                            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="/resume.pdf" target="_blank" className="group relative px-6 py-3 md:px-8 md:py-4 bg-white/5 border border-white/10 text-white font-medium flex items-center gap-2 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-sm md:text-base overflow-hidden">
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative">Resume</span>
                            <Download className="w-4 h-4 relative group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Right: Floating 3D Interface Card */}
                <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end xl:justify-center" style={{ transform: 'translateZ(100px)' }}>
                    {/* Premium Ambient Background Effects */}
                    <div className="absolute inset-0 -z-10 pointer-events-none translate-z-0">
                        {/* 1. Large Ambient Glow - Soft and Cinematic */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-brand-500/20 blur-[50px] rounded-full mix-blend-screen animate-pulse-slow" />

                        {/* 2. Rotating Tech Rings - Subtle Detail */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] border border-white/5 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
                    </div>

                    {/* The "Access Pass" Card */}
                    <div className="relative group w-64 md:w-80 aspect-[3/4] select-none transform transition-transform duration-500 hover:scale-[1.02]">

                        {/* 1. Holographic Shine Effect - Dynamic Position */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent z-20 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
                            style={{
                                opacity: useTransform(smoothY, [-0.5, 0.5], [0, 1]),
                                background: useMotionTemplate`linear-gradient(${useTransform(smoothX, [-0.5, 0.5], ['100deg', '240deg'])}, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)`
                            }}
                        />

                        {/* 2. Main Glass Body */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">

                            {/* Top Bar (Scanner) */}
                            <div className="h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 animate-gradient-x" />
                            <div className="p-5 md:p-6 pb-0 flex justify-between items-start">
                                <Terminal className="w-5 h-5 md:w-6 md:h-6 text-tech-500 opacity-80" />
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">Clearance</span>
                                    <span className="text-[10px] md:text-xs font-bold text-tech-400 uppercase tracking-wider glow-text-sm">Class A</span>
                                </div>
                            </div>

                            {/* Avatar / Identity Section */}
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                {/* Animated Avatar Placeholder (Orbit) */}
                                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                                    <div className="absolute inset-0 rounded-full border border-tech-500/30 animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-2 rounded-full border border-dotted border-tech-500/50 animate-[spin_15s_linear_infinite_reverse]" />
                                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-tech-500/10 backdrop-blur-sm overflow-hidden">
                                        <User className="w-8 h-8 md:w-10 md:h-10 text-tech-400" />
                                    </div>
                                    {/* Scanning Line */}
                                    <div className="absolute inset-0 w-full h-1 bg-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-scan-vertical" />
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-1">AYAAN ALAM</h2>
                                <p className="text-[10px] md:text-xs font-mono text-tech-400 uppercase tracking-widest mb-6">Full Stack Architect</p>

                                {/* Skills Grid (as "Modules") */}
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <div className="bg-white/5 border border-white/5 rounded p-2 flex flex-col items-center gap-1 group/skill hover:bg-white/10 transition-colors">
                                        <Code2 className="w-3 h-3 md:w-4 md:h-4 text-zinc-400 group-hover/skill:text-white" />
                                        <span className="text-[8px] md:text-[10px] text-zinc-500 uppercase">Frontend</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded p-2 flex flex-col items-center gap-1 group/skill hover:bg-white/10 transition-colors">
                                        <Cpu className="w-3 h-3 md:w-4 md:h-4 text-zinc-400 group-hover/skill:text-white" />
                                        <span className="text-[8px] md:text-[10px] text-zinc-500 uppercase">Backend</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer (Barcode) */}
                            <div className="p-5 md:p-6 pt-0 mt-auto">
                                <div className="h-10 md:h-12 bg-white/5 rounded border border-white/5 flex items-center justify-center gap-1 overflow-hidden opacity-50">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className={`w-[2px] bg-zinc-500 h-${Math.random() > 0.5 ? 'full' : '1/2'}`} />
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[8px] md:text-[9px] text-zinc-600 font-mono">ID: 8492-AX-2026</span>
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-tech-500 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Back Glow */}
                        <div className="absolute -inset-4 bg-tech-500/20 blur-3xl rounded-[3rem] -z-10 animate-pulse-slow" />
                    </div>
                </div>
            </motion.div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-12 flex items-center gap-4 md:gap-8 text-[10px] md:text-xs font-mono text-zinc-600 tracking-widest uppercase z-10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
                    System Online
                </div>
                <div className="hidden md:block font-mono tabular-nums">
                    {time || '00:00:00 UTC'}
                </div>
            </div>
            <div className="absolute top-0 left-0 p-4 md:p-12 opacity-[0.03] pointer-events-none select-none overflow-hidden w-full">
                <h2 className="text-[5rem] md:text-[10rem] lg:text-[14rem] font-bold leading-none tracking-tighter text-white whitespace-nowrap -ml-4 md:-ml-12">AYAAN ALAM</h2>
            </div>
            <div className="absolute bottom-0 right-0 p-4 md:p-12 opacity-10 pointer-events-none">
                <h2 className="text-[6rem] md:text-[12rem] font-bold leading-none tracking-tighter text-white">2026</h2>
            </div>
        </section>
    );
}

function GlassCard({ children, title, subtitle, icon }: { children: React.ReactNode, title: string, subtitle: string, icon: any }) {
    return (
        <div className="relative group w-full max-w-md mx-auto">
            {/* Glow backing */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>

            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{title}</h3>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{subtitle}</p>
                        </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-zinc-600" />
                </div>
                {children}
            </div>
        </div>
    );
}
