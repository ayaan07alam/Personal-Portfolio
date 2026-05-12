'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';
import { macSpringTransition } from '@/lib/motion-presets';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Removed .eq('featured', true) to fetch all projects
                const { data } = await supabase
                    .from('projects')
                    .select('*')
                    .order('order_index', { ascending: true });
                if (data) setProjects(data);
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    if (projects.length === 0) return null;

    return (
        <section ref={containerRef} id="projects" className="relative w-full bg-[#000000]">
            
            {/* Global Section Header */}
            <header className="absolute top-0 left-0 right-0 z-30 shrink-0 px-5 sm:px-6 lg:px-10 pt-24 pb-8 pointer-events-none">
                <span className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.28em] text-zinc-500 uppercase mb-3 md:mb-4">
                    <span className="h-px w-8 bg-gradient-to-r from-brand-500/70 to-transparent" aria-hidden />
                    Selected work
                </span>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8 max-w-[92rem]">
                    <h2 className="font-display text-[clamp(2rem,6vw,4.25rem)] md:text-[clamp(2.35rem,5.5vw,4.75rem)] font-bold text-white tracking-[-0.035em] text-balance leading-[1.05] max-w-3xl">
                        Things I&apos;ve <span className="gradient-text">built.</span>
                    </h2>
                </div>
            </header>

            {/* Stacking Cards Container */}
            <div className="relative w-full pt-48 pb-32">
                {projects.map((project, index) => {
                    const targetScale = 1 - ((projects.length - index) * 0.05);
                    return (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            index={index} 
                            total={projects.length}
                            progress={scrollYProgress}
                            targetScale={targetScale}
                        />
                    );
                })}
            </div>
            
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute inset-0 z-0 mesh-gradient opacity-20" aria-hidden />
            <div className="pointer-events-none absolute inset-0 z-0 grid-fine opacity-[0.1]" aria-hidden />
        </section>
    );
}

function ProjectCard({ 
    project, 
    index, 
    total, 
    progress, 
    targetScale 
}: { 
    project: Project; 
    index: number;
    total: number;
    progress: any;
    targetScale: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
    
    // Calculate the range for this specific card to scale down when the next card overlaps it
    const range = [index / total, (index + 1) / total];
    const scaleDown = useTransform(progress, range, [1, targetScale]);
    const opacityDown = useTransform(progress, range, [1, 0.4]);

    return (
        <div 
            ref={cardRef} 
            className="sticky top-0 h-[100svh] w-full flex items-center justify-center p-4 pt-20 pb-24 md:p-8 lg:p-12 overflow-hidden"
            style={{ zIndex: index + 10 }} // Ensure proper stacking
        >
            <motion.div 
                style={{ scale: scaleDown, opacity: opacityDown }}
                className="relative w-full h-full max-h-[85vh] max-w-[92rem] rounded-[2rem] overflow-hidden border border-white/[0.08] shadow-[0_-20px_80px_rgba(0,0,0,0.8)]"
            >
                {/* Huge Background Media */}
                <div className="absolute inset-0 w-full h-full bg-[#050505]">
                    <motion.div style={isMobile ? {} : { scale: imageScale }} className="w-full h-full will-change-transform">
                        {project.video ? (
                            <video
                                src={project.video}
                                className="w-full h-full object-cover opacity-100"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        ) : project.image ? (
                            <img
                                src={project.image}
                                alt={`${project.title} preview`}
                                className="w-full h-full object-cover opacity-100"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-900" />
                        )}
                    </motion.div>
                </div>

                {/* Subtle Vignette Overlay - purely for edge blending, not obscuring the video */}
                <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                {/* Massive Index Number */}
                <div className="absolute -top-10 -right-10 font-display text-[10rem] md:text-[20rem] font-black tabular-nums text-white/[0.04] pointer-events-none leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12 lg:p-16 z-10 pointer-events-none">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={macSpringTransition}
                        className="glass-card-v3 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.15] backdrop-blur-3xl bg-[#050505]/80 pointer-events-auto max-w-xl max-h-[55vh] sm:max-h-none overflow-y-auto shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                    >
                        <h3 className="font-display mb-4 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-white leading-[1.1]">
                            {project.title}
                        </h3>
                        <div 
                            className="rich-text-display mb-8 text-sm md:text-[16px] leading-relaxed text-zinc-100" 
                            dangerouslySetInnerHTML={{ __html: project.description }} 
                        />
                        
                        {project.technologies && (
                            <div className="mb-8 flex flex-wrap gap-2">
                                {project.technologies.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-[11px] font-mono text-brand-200"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4">
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary flex items-center gap-2.5 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all"
                                >
                                    <span>Live Demo</span>
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-sm font-semibold text-white transition-all"
                                >
                                    <Github className="h-4 w-4" />
                                    Source
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
