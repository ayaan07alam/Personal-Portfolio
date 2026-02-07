'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Experience } from '@/types';
import { MapPin, Briefcase } from 'lucide-react';

function ExperienceCard({ exp, isEven }: { exp: Experience, isEven: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Timeline Dot (Center) */}
            <div className="absolute left-[20px] md:left-1/2 top-0 w-10 h-10 md:-translate-x-1/2 flex items-center justify-center z-20">
                <div className={`w-4 h-4 rounded-full border-2 relative z-10 transition-all duration-500 hover:scale-150 ${exp.is_current ? 'bg-brand-500 border-white shadow-[0_0_15px_rgba(139,92,246,0.8)]' : 'bg-zinc-900 border-zinc-500'}`} />
                {exp.is_current && <div className="absolute inset-0 bg-brand-500/30 rounded-full blur-md animate-pulse-slow" />}
            </div>

            {/* Empty Side (Spacer) */}
            <div className="hidden md:block md:w-1/2" />

            {/* Content Side */}
            <div className={`md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                <div
                    className={`relative group p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/10
                        ${exp.is_current
                            ? 'bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border-brand-500/30 backdrop-blur-xl'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                        }
                    `}
                >
                    {/* Connecting Line (Desktop) */}
                    <div className={`hidden md:block absolute top-5 w-16 h-px bg-gradient-to-r from-brand-500/50 to-transparent ${isEven ? '-right-16 rotate-180' : '-left-16'}`} />

                    <div className={`flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                        <div className="mb-4 inline-flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg
                                ${exp.is_current ? 'bg-brand-500 shadow-brand-500/20' : 'bg-zinc-800 border border-white/5'}
                             `}>
                                {exp.company.charAt(0)}
                            </div>
                            <div className={`flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                                <h3 className="text-xl font-bold text-white group-hover:text-brand-200 transition-colors">
                                    {exp.company}
                                </h3>
                                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {exp.location}
                                </span>
                            </div>
                        </div>

                        <h4 className="text-lg font-medium text-zinc-300 mb-4 flex items-center gap-2">
                            {exp.position}
                        </h4>

                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono mb-6 border
                            ${exp.is_current
                                ? 'bg-brand-500/10 text-brand-300 border-brand-500/20'
                                : 'bg-white/5 text-zinc-400 border-white/5'}
                        `}>
                            {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </span>

                        <div className={`relative overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[1000px]' : 'max-h-[100px]'}`}>
                            <div
                                className="text-zinc-400 leading-relaxed text-sm rich-text-display prose prose-invert prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: exp.description }}
                            />
                            {!isExpanded && (
                                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${exp.is_current ? 'from-zinc-900' : 'from-zinc-900/40'} to-transparent`} />
                            )}
                        </div>

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-4 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
                        >
                            {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ExperienceSection() {
    const [experience, setExperience] = useState<Experience[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

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
            position: 'Technical Research Analyst',
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
            position: 'Member of Technical Staff (MTS)',
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
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-900/10 blur-[60px] rounded-full -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-900/5 blur-[80px] rounded-full pointer-events-none" />

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

                    <div className="space-y-12">
                        {experience.map((exp, index) => (
                            <ExperienceCard key={exp.id} exp={exp} isEven={index % 2 === 0} />
                        ))}
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
