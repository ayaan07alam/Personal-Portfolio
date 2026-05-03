'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const targetRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('featured', true)
                    .order('order_index', { ascending: true });
                if (data) setProjects(data);
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    const scrollRange = `calc(-100% + 100vw)`;
    const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', scrollRange]);
    const springXTransform = useSpring(xTransform, { stiffness: 100, damping: 28 });

    if (projects.length === 0) return null;

    return (
        <section ref={targetRef} id="projects" className="relative h-[400vh] bg-[#050507]">
            <div className="sticky top-0 h-[100svh] flex flex-col overflow-hidden">
                {/* Background — behind everything */}
                <div className="pointer-events-none absolute inset-0 z-0 mesh-gradient opacity-45" aria-hidden />
                <div className="pointer-events-none absolute inset-0 z-0 grid-fine opacity-[0.18]" aria-hidden />

                {/* Top band: title NEVER overlaps carousel (was absolute — caused collision). */}
                <header className="relative z-30 shrink-0 px-5 sm:px-6 lg:px-10 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 md:pb-6 lg:pb-8 border-b border-white/[0.05] bg-gradient-to-b from-[#050507] via-[#050507]/92 to-transparent">
                    <span className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.28em] text-zinc-500 uppercase mb-3 md:mb-4">
                        <span className="h-px w-8 bg-gradient-to-r from-brand-500/70 to-transparent" aria-hidden />
                        Selected work
                    </span>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8 max-w-[92rem]">
                        <h2 className="font-display text-[clamp(2rem,6vw,4.25rem)] md:text-[clamp(2.35rem,5.5vw,4.75rem)] font-bold text-white tracking-[-0.035em] text-balance leading-[1.05] max-w-3xl">
                            Things I&apos;ve <span className="gradient-text">built.</span>
                        </h2>
                        <p className="text-sm md:text-[15px] text-zinc-400 max-w-md leading-relaxed shrink-0">
                            Highlights with context and stack. Scroll sideways (or swipe) to browse each piece.
                        </p>
                    </div>
                </header>

                {/* Carousel — only occupies space below header */}
                <div className="relative z-20 flex min-h-0 flex-1 items-center overflow-hidden bg-[#050507]/80">
                    <motion.div style={{ x: springXTransform }} className="flex w-max items-center pl-5 sm:pl-6 lg:pl-10 pr-[max(28vw,6rem)]">
                        <div className="flex items-center gap-12 md:gap-20 xl:gap-28">
                            {projects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} index={index} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="pointer-events-none absolute bottom-10 left-5 sm:left-6 lg:left-10 z-30 flex w-[min(12rem,calc(100%-2rem))] flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600">Explore</span>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 via-white to-brand-400"
                            style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <article className="group relative flex w-[min(92vw,52rem)] flex-shrink-0 flex-col gap-10 lg:flex-row lg:gap-14 xl:w-[960px]">
            <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 font-display text-[8rem] font-black tabular-nums text-white/[0.04] sm:left-12 sm:translate-x-0 md:text-[10rem] lg:-top-8 lg:text-[11rem]">
                {String(index + 1).padStart(2, '0')}
            </div>

            <div
                className="relative z-10 w-full lg:w-[53%]"
                data-cursor="view"
                onClick={() => project.demo_url && window.open(project.demo_url, '_blank')}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && project.demo_url) window.open(project.demo_url, '_blank');
                }}
                role={project.demo_url ? 'button' : undefined}
                aria-label={project.demo_url ? `Open live demo — ${project.title}` : undefined}
                tabIndex={project.demo_url ? 0 : undefined}
            >
                <div className="relative cursor-pointer overflow-hidden rounded-[1.375rem] border border-white/[0.06] bg-[var(--surface-card)] shadow-[0_28px_90px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04] transition-[transform,box-shadow] duration-500 group-hover:-translate-y-1 group-hover:border-brand-500/20 group-hover:shadow-[0_36px_100px_-16px_rgba(99,102,241,0.35)] md:rounded-2xl">
                    {project.video ? (
                        <video
                            src={project.video}
                            className="aspect-[16/11] w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100 sm:aspect-[4/3]"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : project.image ? (
                        <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            className="aspect-[16/11] w-full object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-[1.02] sm:aspect-[4/3]"
                        />
                    ) : (
                        <div className="flex aspect-[16/11] items-center justify-center bg-zinc-900 sm:aspect-[4/3]">
                            <span className="font-display text-6xl font-black text-zinc-800">{project.title.charAt(0)}</span>
                        </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
                </div>
            </div>

            <div className="relative z-10 flex w-full flex-col justify-center lg:w-[47%]">
                <h3 className="font-display mb-5 text-[clamp(1.5rem,4vw,2.75rem)] font-bold tracking-[-0.03em] text-white leading-[1.1]">
                    {project.title}
                </h3>
                <div className="rich-text-display mb-8 text-[15px] leading-relaxed text-zinc-400" dangerouslySetInnerHTML={{ __html: project.description }} />
                {project.technologies && (
                    <div className="mb-10 flex flex-wrap gap-2">
                        {project.technologies.map((tech: string) => (
                            <span
                                key={tech}
                                className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[11px] font-mono text-zinc-200"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap items-center gap-6">
                    {project.demo_url && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn flex items-center gap-3 text-sm font-semibold text-white"
                        >
                            <span>Live Demo</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors group-hover/btn:bg-white group-hover/btn:text-black">
                                <ExternalLink className="h-4 w-4" />
                            </span>
                        </a>
                    )}
                    {project.github_url && (
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-white"
                        >
                            <Github className="h-4 w-4" />
                            Source
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
