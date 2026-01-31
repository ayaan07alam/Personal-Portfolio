'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Default projects
            setProjects([
                {
                    id: '1',
                    title: 'E-Commerce Platform',
                    description: 'A full-featured online store with payment integration',
                    long_description: 'Built a complete e-commerce solution with product management, cart functionality, and secure payment processing.',
                    image: null,
                    demo_url: 'https://example.com',
                    github_url: 'https://github.com',
                    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
                    featured: true,
                    order_index: 1,
                    created_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    title: 'Task Management App',
                    description: 'Collaborative task tracking with real-time updates',
                    long_description: 'Developed a real-time task management application with team collaboration features.',
                    image: null,
                    demo_url: 'https://example.com',
                    github_url: 'https://github.com',
                    technologies: ['Next.js', 'TypeScript', 'Supabase'],
                    featured: false,
                    order_index: 2,
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return null;

    return (
        <section id="projects" className="section-padding">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                        Featured Projects
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Some of my recent work
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="glass rounded-xl overflow-hidden glow-card group"
                        >
                            {/* Project Image */}
                            <div className="relative h-48 bg-gradient-to-br from-primary-900/50 to-accent-900/50 overflow-hidden">
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">No preview</p>
                                    </div>
                                )}
                                {project.featured && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-accent-500 text-white rounded-full text-xs font-bold">
                                        Featured
                                    </div>
                                )}
                            </div>

                            {/* Project Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-gray-400 mb-4">{project.description}</p>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-4">
                                    {project.demo_url && (
                                        <a
                                            href={project.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-accent-400 hover:text-accent-300 transition-colors text-sm font-semibold"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Live Demo
                                        </a>
                                    )}
                                    {project.github_url && (
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors text-sm font-semibold"
                                        >
                                            <Github className="w-4 h-4" />
                                            Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
