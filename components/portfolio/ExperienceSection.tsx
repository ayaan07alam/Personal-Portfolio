'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Experience } from '@/types';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

export default function ExperienceSection() {
    const [experience, setExperience] = useState<Experience[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Create a smooth physics-based spring for the glow travel
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('experiences').select('*').order('order_index', { ascending: true });
                if (data && data.length > 0) {
                    setExperience(data);
                } else {
                    setExperience(defaultExperience);
                }
            } catch { setExperience(defaultExperience); }
        }
        fetchData();
    }, []);

    const defaultExperience = [
        {
            id: '1',
            company: 'Intellipaat Software Solutions',
            position: 'Technical Research Analyst (Software Development Engineer – Platform)',
            start_date: '2025-01-01',
            end_date: 'Present',
            description: 'Developed and maintained backend services for EdTech learning management platforms using Java and Spring Boot. Designed and implemented RESTful APIs for course management, enrollments, dashboards, and platform workflows. Built and optimized database-driven features using MySQL and PostgreSQL. Improved SEO performance and Core Web Vitals.',
            order_index: 0,
            location: 'Bengaluru, India',
            is_current: true,
            company_logo: '',
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            company: 'GeeksforGeeks',
            position: 'Member of Technical Staff (MTS) – Web & Learning Platforms',
            start_date: '2023-11-01',
            end_date: '2024-10-01',
            description: 'Contributed to the development, optimization, and scaling of learning and courses platforms serving millions. Developed interactive frontend components and integrated RESTful APIs. Improved frontend performance reducing page load time by ~30% and optimized state management for ~25% faster checkout.',
            order_index: 1,
            location: 'Noida, India',
            is_current: false,
            company_logo: '',
            created_at: new Date().toISOString()
        },
    ];

    return (
        <section ref={containerRef} className="py-32 bg-background relative z-10 border-t border-white/5 overflow-hidden">

            {/* 1. Background Ambience */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-900/10 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-900/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-20 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Career Path</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tight"
                    >
                        Professional Journey
                    </motion.h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* 2. The Tracing Beam (Central Line) */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 h-full">
                        {/* The Glowing Head */}
                        <motion.div
                            style={{ scaleY, transformOrigin: "top" }}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-500 via-brand-400 to-transparent opacity-50 shadow-[0_0_20px_2px_rgba(99,102,241,0.3)]"
                        />
                    </div>

                    <div className="space-y-24">
                        {experience.map((exp, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, delay: index * 0.1 }}
                                    className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Timeline Dot (Center) */}
                                    <div className="absolute left-[20px] md:left-1/2 top-0 w-10 h-10 md:-translate-x-1/2 flex items-center justify-center z-20">
                                        <div className="w-4 h-4 rounded-full bg-background border-2 border-brand-500 shadow-[0_0_0_4px_rgba(0,0,0,1)] relative z-10 transition-transform duration-500 hover:scale-150" />
                                        <div className="absolute inset-0 bg-brand-500/30 rounded-full blur-md animate-pulse-slow" />
                                    </div>

                                    {/* Empty Side (Spacer) */}
                                    <div className="hidden md:block md:w-1/2" />

                                    {/* Content Side */}
                                    <div className={`md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                                        <div className="relative group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                                            {/* Company Logo Placeholder - Generative */}
                                            <div className={`absolute top-6 ${isEven ? 'right-6 md:left-6 md:right-auto' : 'right-6'} w-12 h-12 rounded-xl bg-brand-500 border border-white/5 flex items-center justify-center text-white font-bold text-xl`}>
                                                {exp.company.charAt(0)}
                                            </div>

                                            <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-mono mb-4 border border-brand-500/20">
                                                {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </span>

                                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-brand-200 transition-colors pr-14">
                                                {exp.position}
                                            </h3>

                                            <div className="flex items-center gap-2 text-zinc-400 mb-6 text-sm font-medium pr-14 justify-start md:justify-start">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{exp.company}</span>
                                                {exp.location && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                                        <span>{exp.location}</span>
                                                    </>
                                                )}
                                            </div>

                                            <p className="text-zinc-400 leading-relaxed text-sm">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function formatDate(dateString: string | null) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}
