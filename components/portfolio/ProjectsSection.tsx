'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';
import { macSpringTransition } from '@/lib/motion-presets';

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
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

            {/* Section Header — pinned above the stack */}
            <div className="relative z-50 px-5 sm:px-8 lg:px-16 pt-24 pb-10 pointer-events-none">
                <span className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.28em] text-zinc-500 uppercase mb-3">
                    <span className="h-px w-8 bg-gradient-to-r from-brand-500/70 to-transparent" aria-hidden />
                    Selected work
                </span>
                <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold text-white tracking-[-0.035em] leading-[1.05] max-w-3xl">
                    Things I&apos;ve{' '}
                    <span className="gradient-text">built.</span>
                </h2>
            </div>

            {/* Stacking Cards Container */}
            <div className="relative w-full">
                {projects.map((project, index) => {
                    const targetScale = 1 - ((projects.length - index) * 0.04);
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
        </section>
    );
}

function ProjectCard({
    project,
    index,
    total,
    progress,
    targetScale,
}: {
    project: Project;
    index: number;
    total: number;
    progress: any;
    targetScale: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'start start'],
    });

    // Parallax zoom on the media as the card enters
    const mediaScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

    // Scale‑down + fade as the NEXT card stacks on top
    const range = [index / total, (index + 1) / total];
    const scaleDown = useTransform(progress, range, [1, targetScale]);
    const opacityDown = useTransform(progress, range, [1, 0.6]);

    const hasMedia = !!(project.video || project.image);

    return (
        /* Sticky wrapper — full viewport height */
        <div
            ref={cardRef}
            className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden px-3 py-3 sm:px-6 sm:py-6 lg:px-10 lg:py-10"
            style={{ zIndex: index + 10 }}
        >
            {/* The card itself — scales + fades when the next card arrives */}
            <motion.div
                style={{ scale: scaleDown, opacity: opacityDown }}
                className="relative w-full h-full max-w-[92rem] rounded-[2rem] overflow-hidden border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.8)] bg-[#050507] flex flex-col"
            >
                {/* ── MEDIA PANEL (TOP) ────────────────────────────── */}
                <div className="relative w-full flex-1 overflow-hidden bg-[#000000]">
                    {hasMedia ? (
                        <motion.div
                            style={{ scale: mediaScale }}
                            className="w-full h-full will-change-transform"
                        >
                            {project.video ? (
                                <video
                                    src={project.video}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={project.image!}
                                    alt={`${project.title} preview`}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </motion.div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-900/40 via-zinc-900 to-zinc-950 flex items-center justify-center">
                            <span className="font-display text-[8rem] font-black text-white/[0.04] select-none">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    )}
                    
                    {/* Subtle gradient at bottom edge to blend into the info panel */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none z-10" />
                </div>

                {/* ── INFO PANEL (BOTTOM) ──────────────────────────── */}
                <div className="relative w-full flex-none bg-[#050507] border-t border-white/[0.05] p-6 sm:p-8 lg:p-12 z-20">
                    
                    {/* Massive Index Watermark (now safely in the background of the bottom panel) */}
                    <div className="absolute bottom-4 right-8 font-display text-[6rem] sm:text-[10rem] font-black tabular-nums text-white/[0.02] pointer-events-none leading-none select-none z-0">
                        {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-16">
                        
                        {/* Left Col: Title & Meta & Buttons */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[12px] font-mono text-zinc-500">
                                        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                                    </span>
                                </div>
                                <h3 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-6">
                                    {project.title}
                                </h3>
                                
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.technologies.map((tech: string) => (
                                            <span
                                                key={tech}
                                                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-mono text-zinc-400"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {project.demo_url && (
                                    <a
                                        href={project.demo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary transition-all"
                                    >
                                        Live Demo
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-sm font-semibold text-white transition-all"
                                    >
                                        <Github className="w-4 h-4" />
                                        Source
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right Col: Description */}
                        <div className="flex-[1.2] lg:flex-[1.5]">
                            <div
                                className="rich-text-display text-sm md:text-[15px] leading-relaxed text-zinc-300 max-h-[25vh] md:max-h-[200px] overflow-y-auto pr-4 custom-scrollbar"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
