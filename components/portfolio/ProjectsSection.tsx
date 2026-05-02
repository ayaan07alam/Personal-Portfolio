'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MouseGlow from '@/components/ui/MouseGlow';

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('is_featured', true)
                    .order('display_order', { ascending: true });
                if (data) setProjects(data);
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    return (
        <SectionWrapper id="projects" label="Selected Work" title="Things I've" titleAccent="built.">
            <MouseGlow glowColor="rgba(99, 102, 241, 0.04)" glowSize={800}>
                <div className="space-y-24 md:space-y-32">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                    {projects.length === 0 && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                                <p className="text-zinc-500 text-sm font-mono">Loading projects...</p>
                            </div>
                        </div>
                    )}
                </div>
            </MouseGlow>
        </SectionWrapper>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [3, 0, -3]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center group`}
        >
            {/* Project number watermark */}
            <div className={`absolute top-[-40px] ${isEven ? 'left-[-20px]' : 'right-[-20px]'} text-[10rem] md:text-[16rem] font-black text-white/[0.02] leading-none select-none pointer-events-none z-0 transition-transform duration-700 group-hover:scale-110 group-hover:text-white/[0.04]`}>
                {String(index + 1).padStart(2, '0')}
            </div>

            {/* Media */}
            <motion.div style={{ y, rotateZ: rotate, scale }} className="w-full lg:w-[58%] relative z-10" data-cursor="view" onClick={() => project.live_url && window.open(project.live_url, '_blank')}>
                <SpotlightCard className="overflow-hidden cursor-pointer" spotlightColor="rgba(99, 102, 241, 0.15)">
                    <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-xl bg-[#0a0a0a]">
                        {project.video_url ? (
                            <video
                                src={project.video_url}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                                autoPlay muted loop playsInline
                            />
                        ) : project.image_url ? (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500/10 to-sky-500/10">
                                <span className="text-6xl font-black gradient-text">{project.title.charAt(0)}</span>
                            </div>
                        )}
                        {project.is_featured && (
                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-brand-500/90 text-[10px] font-mono text-white tracking-widest uppercase backdrop-blur-md shadow-lg shadow-brand-500/20">
                                Featured
                            </div>
                        )}
                        {/* Overlay inner shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
                    </div>
                </SpotlightCard>
            </motion.div>

            {/* Content */}
            <div className={`w-full lg:w-[42%] relative z-10 ${isEven ? '' : 'lg:text-right'}`}>
                <motion.span
                    initial={{ opacity: 0, x: isEven ? -10 : 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-[11px] font-mono text-brand-400/60 tracking-[0.2em] uppercase mb-3 block"
                >
                    Project {String(index + 1).padStart(2, '0')}
                </motion.span>

                <motion.h3
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight"
                >
                    {project.title}
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-zinc-500 text-sm leading-relaxed mb-6"
                >
                    {project.description}
                </motion.p>

                {project.tech_stack && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className={`flex flex-wrap gap-2 mb-8 ${isEven ? '' : 'lg:justify-end'}`}
                    >
                        {project.tech_stack.map((tech: string) => (
                            <span key={tech} className="px-3 py-1 text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:border-brand-500/30 hover:text-white transition-all cursor-default">
                                {tech}
                            </span>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                    className={`flex items-center gap-5 ${isEven ? '' : 'lg:justify-end'}`}
                >
                    {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
                            <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                            <span>Live Demo</span>
                        </a>
                    )}
                    {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
                            <Github className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            <span>Source</span>
                        </a>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
