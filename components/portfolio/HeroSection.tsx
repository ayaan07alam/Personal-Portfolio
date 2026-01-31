'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Download, Terminal, Code2, Cpu, Globe, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { HeroSection as HeroData } from '@/types';

export default function HeroSection() {
    const [data, setData] = useState<HeroData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
        subtitle: "Full Stack Engineer",
        description: "Architecting digital ecosystems with precision and passion.",
        availability_status: "Available for Hire"
    };

    const content = data || defaultData;

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-[#050505] text-white perspective-1000 flex items-center justify-center"
            onMouseMove={handleMouseMove}
            style={{ perspective: '2000px' }}
        >
            {/* Background Perspective Grid */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(50,50,100,0.1)_100%)] pointer-events-none" />
            <motion.div
                style={{ rotateX: 60, scale: 2 }}
                className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none origin-bottom"
                animate={{
                    backgroundPosition: ["0px 0px", "0px 100px"]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Main 3D Container */}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
            >
                {/* Left: Typography & Actions */}
                <div className="flex flex-col items-start gap-8" style={{ transform: 'translateZ(50px)' }}>
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-mono tracking-widest text-zinc-400 uppercase">{content.availability_status}</span>
                    </div>

                    <div className="relative">
                        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-white mix-blend-difference">
                            {content.title.split(' ')[0]} <br />
                            <span className="text-zinc-600">{content.title.split(' ')[1]}</span>
                        </h1>
                        {/* Stroke Text Overlay */}
                        <h1 className="absolute top-0 left-0 text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent stroke-white/20 select-none pointer-events-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)', transform: 'translateZ(-20px)' }}>
                            {content.title.split(' ')[0]} <br />
                            <span className="text-transparent">{content.title.split(' ')[1]}</span>
                        </h1>
                    </div>

                    <p className="text-xl text-zinc-400 max-w-lg leading-relaxed border-l-2 border-indigo-500 pl-6">
                        {content.description}
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <a href="#projects" className="group px-8 py-4 bg-white text-black font-bold flex items-center gap-2 rounded-full hover:scale-105 transition-transform">
                            Explore Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="/resume.pdf" target="_blank" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium flex items-center gap-2 rounded-full hover:bg-white/10 transition-colors">
                            Resume <Download className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Right: Floating 3D Interface Card */}
                <div className="hidden lg:block relative" style={{ transform: 'translateZ(100px)' }}>
                    <GlassCard
                        title="latest_commit.tsx"
                        subtitle="Frontend Architecture"
                        icon={<Code2 className="w-6 h-6 text-blue-400" />}
                    >
                        <div className="space-y-4 font-mono text-sm text-zinc-400">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-zinc-500">Status</span>
                                <span className="text-emerald-400">Compiling...</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-indigo-400" />
                                    <span>Next.js 14 App Router</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-rose-400" />
                                    <span>Server Actions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-amber-400" />
                                    <span>TypeScript Strict</span>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500/20 block"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500/20 block"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500/20 block"></span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Floating Elements behind card */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
                    />
                </div>
            </motion.div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-10 left-6 md:left-12 flex items-center gap-8 text-xs font-mono text-zinc-600 tracking-widest uppercase z-10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    System Online
                </div>
                <div className="hidden md:block">
                    38.9072° N, 77.0369° W
                </div>
            </div>
            <div className="absolute bottom-0 right-0 p-12 opacity-10 pointer-events-none">
                <h2 className="text-[12rem] font-bold leading-none tracking-tighter text-white">2026</h2>
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
