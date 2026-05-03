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
    const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", scrollRange]);
    const springXTransform = useSpring(xTransform, { stiffness: 100, damping: 25 });

    if (projects.length === 0) return null;

    return (
        <section ref={targetRef} id="projects" className="relative h-[400vh] bg-[#050507]">
            <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
                
                {/* Header that stays fixed while horizontal scrolling */}
                <div className="absolute top-20 md:top-32 left-6 md:left-10 z-50 mix-blend-difference pointer-events-none">
                    <span className="inline-block text-[11px] font-mono tracking-[0.25em] text-white/70 uppercase mb-4">
                        Selected Work
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        Things I've <span className="gradient-text ml-2">built.</span>
                    </h2>
                </div>

                {/* Horizontal Scrolling Container */}
                <motion.div style={{ x: springXTransform }} className="flex h-full items-center pl-6 md:pl-10 pr-[30vw] pt-20 md:pt-0">
                    <div className="flex gap-16 md:gap-32 mt-20 md:mt-0">
                        {projects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                </motion.div>
                
                {/* Scroll Progress Indicator */}
                <div className="absolute bottom-12 left-6 md:left-10 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-white"
                        style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
                    />
                </div>
            </div>
        </section>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <div className="w-[85vw] md:w-[60vw] lg:w-[900px] flex-shrink-0 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center group relative">
            {/* Number */}
            <div className="absolute -top-16 -left-8 md:-left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.03] pointer-events-none z-0 transition-transform duration-700 group-hover:scale-110">
                {String(index + 1).padStart(2, '0')}
            </div>

            {/* Media */}
            <div className="w-full lg:w-[55%] relative z-10" data-cursor="view" onClick={() => project.demo_url && window.open(project.demo_url, '_blank')}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#0a0a0a] shadow-2xl shadow-black cursor-pointer">
                    {project.video ? (
                        <video src={project.video} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" autoPlay muted loop playsInline />
                    ) : project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900"><span className="text-6xl font-black text-zinc-800">{project.title.charAt(0)}</span></div>
                    )}
                    {/* Hardware inset border */}
                    <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] rounded-[2rem] md:rounded-[2.5rem] pointer-events-none" />
                </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-[45%] relative z-10 flex flex-col justify-center">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">{project.title}</h3>
                <div className="text-zinc-400 text-sm md:text-[15px] leading-relaxed mb-8 rich-text-display" dangerouslySetInnerHTML={{ __html: project.description }} />
                {/* Tech stack */}
                {project.technologies && (
                    <div className="flex flex-wrap gap-2 mb-10">
                        {project.technologies.map((tech: string) => (
                            <span key={tech} className="px-3.5 py-1.5 text-[11px] font-mono text-zinc-300 bg-white/[0.03] border border-white/[0.05] rounded-full backdrop-blur-sm">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
                {/* Links */}
                <div className="flex items-center gap-6">
                    {project.demo_url && (
                        <a href={project.demo_url} target="_blank" className="flex items-center gap-3 text-sm font-semibold text-white group/btn">
                            <span>Live Demo</span>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-colors duration-300">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                        </a>
                    )}
                    {project.github_url && (
                        <a href={project.github_url} target="_blank" className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-white transition-colors duration-300">
                            <Github className="w-4 h-4" />
                            <span>Source</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
