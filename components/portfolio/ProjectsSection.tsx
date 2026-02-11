'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';

const defaultProjects: Project[] = [
    {
        id: '1',
        title: 'Developer Learning Platform',
        description: 'Built a production-ready full-stack developer learning and job platform combining tutorials, blogs, job listings, and developer tools. Implemented role-based authentication and job portal modules.',
        long_description: '',
        image: '',
        order_index: 0,
        technologies: ['Spring Boot', 'Next.js', 'PostgreSQL', 'Docker', 'Spring Security'],
        demo_url: 'https://runtimeriver.com',
        github_url: 'https://github.com/ayaan07alam/Developer-Learning-Platform',
        featured: true,
        created_at: new Date().toISOString(),
        video: null
    },
    {
        id: '2',
        title: 'CRM Application – REST Based System',
        description: 'Developed a secure CRM backend system for managing customers and leads with role-based authentication and secure data handling.',
        long_description: '',
        image: '',
        order_index: 1,
        technologies: ['Java', 'Spring Boot', 'Spring Security', 'MySQL', 'REST APIs'],
        demo_url: '',
        github_url: 'https://github.com/ayaan07alam/CRM-App-REST',
        featured: false,
        created_at: new Date().toISOString(),
        video: null
    },
    {
        id: '3',
        title: 'BookStore Application',
        description: 'Built a Spring Boot-based bookstore application following MVC architecture with CRUD operations and database persistence.',
        long_description: '',
        image: '',
        order_index: 2,
        technologies: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf', 'JPA'],
        demo_url: '',
        github_url: 'https://github.com/ayaan07alam/SpringBoot-Bookstore-App',
        featured: false,
        created_at: new Date().toISOString(),
        video: null
    },
    {
        id: '4',
        title: 'Blog Website',
        description: 'Developed a content publishing platform with user authentication, post management, and secure access control.',
        long_description: '',
        image: '',
        order_index: 3,
        technologies: ['Django', 'Python', 'HTML', 'CSS', 'SQLite'],
        demo_url: '',
        github_url: 'https://github.com/ayaan07alam/BlogWebsite-Django',
        featured: false,
        created_at: new Date().toISOString(),
        video: null
    },
];

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
                if (data && data.length > 0) {
                    const sanitizedProjects = data.map(p => ({
                        ...p,
                        technologies: Array.isArray(p.technologies) ? p.technologies : [],
                        description: p.description || '',
                        video: p.video || null
                    }));
                    setProjects(sanitizedProjects);
                } else {
                    setProjects(defaultProjects);
                }
            } catch { setProjects(defaultProjects); }
            finally { setLoading(false); }
        }
        fetchData();
    }, []);

    return (
        <section id="projects" ref={containerRef} className="py-32 bg-background relative z-10">
            {/* Ambient Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-brand-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-0 w-[500px] h-[500px] bg-brand-900/10 blur-[120px] rounded-full" />
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
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
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
                    {loading ? (
                        // Skeleton Loader simulating the sticky cards
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="sticky top-28 mb-[40vh] w-full bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden h-[600px] grid lg:grid-cols-2 animate-pulse">
                                <div className={`bg-white/5 ${i % 2 === 0 ? 'lg:order-first' : 'lg:order-last'}`} />
                                <div className="p-12 space-y-6">
                                    <div className="h-8 bg-white/5 rounded w-1/3" />
                                    <div className="h-12 bg-white/5 rounded w-3/4" />
                                    <div className="h-32 bg-white/5 rounded w-full" />
                                </div>
                            </div>
                        ))
                    ) : (
                        projects.map((project, index) => (
                            <StickyProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

function StickyProjectCard({ project, index }: { project: Project, index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Magnetic effect state
    const imageX = useMotionValue(0);
    const imageY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        mouseX.set(x);
        mouseY.set(y);

        // Magnetic pull for image
        const centerX = width / 2;
        const centerY = height / 2;
        imageX.set((x - centerX) / 20); // Gentle movement
        imageY.set((y - centerY) / 20);
    }

    function handleMouseLeave() {
        imageX.set(0);
        imageY.set(0);
    }

    const hasImage = project.image && project.image.trim() !== '';
    const hasVideo = project.video && project.video.trim() !== '';
    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={cardRef}
            className="relative md:sticky md:top-28 will-change-transform"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{
                zIndex: index + 1,
            }}
        // Framer Motion style prop for responsive values is tricky, so we use className for sticky
        // and we can't easily do responsive marginBottom in 'style' prop without window listener/hooks
        // So let's use tailwind class for spacing if possible, OR just accept a smaller gap on mobile via class
        >

            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl group mb-24 last:mb-0">
                {/* Spotlight Overlay */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                800px circle at ${mouseX}px ${mouseY}px,
                                rgba(139, 92, 246, 0.1),
                                transparent 80%
                            )
                        `,
                    }}
                />

                <div className="flex flex-col">
                    {/* Media Side - Top - 16:9 Aspect Ratio */}
                    <div className="relative w-full aspect-video overflow-hidden bg-black/50 border-b border-white/5 group-hover:border-white/10 transition-colors">
                        <motion.div
                            style={{ x: imageX, y: imageY }}
                            className="w-full h-full relative"
                        >
                            {hasVideo ? (
                                <div className="w-full h-full relative">
                                    <video
                                        src={project.video || ''}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </div>
                            ) : hasImage ? (
                                <motion.div
                                    className="w-full h-full relative"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                >
                                    <Image
                                        src={project.image || ''}
                                        alt={project.title}
                                        fill
                                        className="object-cover scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </motion.div>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black p-8 flex items-center justify-center">
                                    <div className="text-zinc-800 font-mono text-[12rem] font-bold opacity-30 select-none transform translate-y-8">
                                        0{index + 1}
                                    </div>
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                                </div>
                            )}
                        </motion.div>

                        {project.featured && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-brand-500/90 backdrop-blur-md text-white rounded-lg text-xs font-bold shadow-lg z-20">
                                Featured
                            </div>
                        )}
                    </div>

                    {/* Content Side - Bottom */}
                    <div className="p-8 md:p-10 flex flex-col justify-center bg-zinc-900/50 backdrop-blur-sm relative z-20">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-brand-400 font-mono text-sm tracking-widest uppercase">
                                    Project 0{index + 1}
                                </span>
                                <div className="flex gap-2">
                                    {project.github_url && (
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-brand-500/50 transition-all duration-300"
                                            aria-label="View Source Code"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <motion.h3
                                className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300"
                            >
                                {project.title}
                            </motion.h3>

                            <div
                                className="text-base text-zinc-400 leading-relaxed mb-8 rich-text-display line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />

                            {project.technologies && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.technologies.slice(0, 5).map((tech: string) => (
                                        <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:bg-brand-500/10 hover:border-brand-500/30 hover:text-brand-300 transition-colors cursor-default">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 5 && (
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-500">
                                            +{project.technologies.length - 5} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn relative overflow-hidden w-full md:w-auto px-6 py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-brand-500/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-sm">
                                        View Live Project
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-200 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
