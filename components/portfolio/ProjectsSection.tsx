'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
                if (data && data.length > 0) setProjects(data);
                else setProjects(defaultProjects);
            } catch { setProjects(defaultProjects); }
        }
        fetchData();
    }, []);

    const defaultProjects = [
        {
            id: '1',
            title: 'Developer Learning Platform',
            description: 'Full-stack platform with tutorials, blogs, and job portal.',
            image: '',
            order_index: 0,
            technologies: ['Spring Boot', 'Next.js', 'PostgreSQL', 'Docker'],
            demo_url: 'https://runtimeriver.com'
        },
        {
            id: '2',
            title: 'CRM Application',
            description: 'Secure backend system with role-based auth and scalable REST APIs.',
            image: '',
            order_index: 1,
            technologies: ['Spring Boot', 'REST API', 'Security']
        },
        {
            id: '3',
            title: 'E-Commerce Analytics',
            description: 'Real-time dashboard for tracking sales, inventory, and user metrics.',
            image: '',
            order_index: 2,
            technologies: ['React', 'Node.js', 'MongoDB']
        },
    ];

    return (
        <section ref={containerRef} id="projects" className="py-32 bg-black relative z-20">
            {/* Ambient Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-violet-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-12 mb-20 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                            <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Portfolio</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
                        >
                            Selected Works
                        </motion.h2>
                    </div>
                </div>

                <div className="flex flex-col gap-20">
                    {projects.map((project, index) => (
                        <StickyProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StickyProjectCard({ project, index }: { project: any, index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const hasImage = project.image && project.image.trim() !== '';
    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={cardRef}
            className="sticky top-28"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{
                zIndex: index + 1,
                marginBottom: '50vh'
            }}
            onMouseMove={handleMouseMove}
        >
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl">
                {/* Spotlight Overlay */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                800px circle at ${mouseX}px ${mouseY}px,
                                rgba(139, 92, 246, 0.15),
                                transparent 80%
                            )
                        `,
                    }}
                />

                <div className="grid lg:grid-cols-2 gap-0">
                    {/* Visual Side (Swaps order based on index) */}
                    <div className={`relative aspect-video lg:aspect-auto lg:h-[600px] border-b lg:border-b-0 border-white/10 overflow-hidden bg-black/50 group ${isEven ? 'lg:order-first lg:border-r' : 'lg:order-last lg:border-l'}`}>
                        {hasImage ? (
                            <div className="w-full h-full relative">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black p-8 flex items-center justify-center">
                                <div className="text-zinc-800 font-mono text-[12rem] font-bold opacity-30 select-none transform translate-y-8">
                                    0{index + 1}
                                </div>
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                            </div>
                        )}
                    </div>

                    {/* Content Side */}
                    <div className={`p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-zinc-900/50 backdrop-blur-sm ${isEven ? 'text-left' : 'lg:text-right'}`}>
                        <div>
                            <div className={`flex items-start mb-8 ${isEven ? 'justify-between' : 'justify-between lg:flex-row-reverse'}`}>
                                <span className="text-violet-400 font-mono text-sm tracking-widest uppercase">
                                    Project 0{index + 1}
                                </span>
                                <a
                                    href="#"
                                    className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                            </div>

                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                {project.title}
                            </h3>

                            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                                {project.description}
                            </p>

                            {project.technologies && (
                                <div className={`flex flex-wrap gap-2 ${isEven ? 'justify-start' : 'lg:justify-end'}`}>
                                    {project.technologies.map((tech: string) => (
                                        <span key={tech} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={`mt-12 flex ${isEven ? 'justify-start' : 'lg:justify-end'}`}>
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn w-full md:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98]"
                                >
                                    View Live Project
                                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
