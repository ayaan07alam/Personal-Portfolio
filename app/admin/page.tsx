'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import {
    Home,
    User,
    Award,
    Briefcase,
    FolderKanban,
    GraduationCap,
    Mail,
    Eye,
    Database,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const { showToast } = useToast();
    const [seeding, setSeeding] = useState(false);
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experiences: 0,
        loading: true
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projectsRes, skillsRes, experiencesRes] = await Promise.all([
                    supabase.from('projects').select('*', { count: 'exact', head: true }),
                    supabase.from('skills').select('*', { count: 'exact', head: true }),
                    supabase.from('experiences').select('*', { count: 'exact', head: true })
                ]);

                setStats({
                    projects: projectsRes.count || 0,
                    skills: skillsRes.count || 0,
                    experiences: experiencesRes.count || 0,
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStats(prev => ({ ...prev, loading: false }));
                showToast('error', 'Failed to load dashboard stats');
            }
        }
        fetchStats();
    }, []);

    const sections = [
        { name: 'Hero Section', href: '/admin/hero', icon: Home, description: 'Main landing section with title and CTA', color: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400' },
        { name: 'About', href: '/admin/about', icon: User, description: 'About me section with bio and image', color: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400' },
        { name: 'Skills', href: '/admin/skills', icon: Award, description: 'Skills and expertise', color: 'from-orange-500/20 to-amber-500/20', text: 'text-orange-400' },
        { name: 'Experience', href: '/admin/experience', icon: Briefcase, description: 'Work history and experience', color: 'from-violet-500/20 to-purple-500/20', text: 'text-violet-400' },
        { name: 'Projects', href: '/admin/projects', icon: FolderKanban, description: 'Portfolio projects', color: 'from-pink-500/20 to-rose-500/20', text: 'text-pink-400' },
        { name: 'Education', href: '/admin/education', icon: GraduationCap, description: 'Educational background', color: 'from-cyan-500/20 to-sky-500/20', text: 'text-cyan-400' },
        { name: 'Contact', href: '/admin/contact', icon: Mail, description: 'Contact information and social links', color: 'from-indigo-500/20 to-blue-500/20', text: 'text-indigo-400' },
    ];

    async function handleSeedDatabase() {
        if (!confirm('This will populate empty sections with default demo data. Continue?')) return;
        setSeeding(true);

        try {
            // 1. Projects
            const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
            if (projectCount === 0) {
                await supabase.from('projects').insert([
                    {
                        title: 'Developer Learning Platform',
                        description: 'Full-stack platform with tutorials, blogs, and job portal.',
                        image: '',
                        order_index: 0,
                        technologies: ['Spring Boot', 'Next.js', 'PostgreSQL', 'Docker'],
                        demo_url: 'https://runtimeriver.com'
                    },
                    {
                        title: 'CRM Application',
                        description: 'Secure backend system with role-based auth and scalable REST APIs.',
                        image: '',
                        order_index: 1,
                        technologies: ['Spring Boot', 'REST API', 'Security']
                    }
                ]);
            }

            // 2. Skills
            const { count: skillCount } = await supabase.from('skills').select('*', { count: 'exact', head: true });
            if (skillCount === 0) {
                await supabase.from('skills').insert([
                    { name: 'Java', category: 'Backend', proficiency: 95, order_index: 0 },
                    { name: 'Spring Boot', category: 'Backend', proficiency: 90, order_index: 1 },
                    { name: 'React.js', category: 'Frontend', proficiency: 88, order_index: 2 },
                    { name: 'Next.js', category: 'Frontend', proficiency: 85, order_index: 3 },
                    { name: 'PostgreSQL', category: 'Database', proficiency: 85, order_index: 4 },
                    { name: 'Docker', category: 'DevOps', proficiency: 80, order_index: 5 },
                    { name: 'AWS', category: 'Cloud', proficiency: 75, order_index: 6 },
                ]);
            }

            // 3. Experience
            const { count: expCount } = await supabase.from('experiences').select('*', { count: 'exact', head: true });
            if (expCount === 0) {
                await supabase.from('experiences').insert([
                    {
                        company: 'Intellipaat Software Solutions',
                        position: 'Technical Research Analyst (SDE – Platform)',
                        start_date: '2025-01-01',
                        is_current: true,
                        description: 'Developing backend services and RESTful APIs using Java and Spring Boot for EdTech platforms. Designed scalable API architecture and optimized database features with PostgreSQL/MySQL. Improved SEO and Core Web Vitals.',
                        order_index: 0
                    },
                    {
                        company: 'GeeksforGeeks',
                        position: 'Member of Technical Staff (MTS)',
                        start_date: '2023-11-01',
                        end_date: '2024-10-01',
                        is_current: false,
                        description: 'Contributed to high-traffic learning platforms serving millions. Built React-based UI components, integrated REST APIs, and reduced frontend load time by 30%. Handled courses platform transactions and payment workflows.',
                        order_index: 1
                    }
                ]);
            }

            // 4. Education
            const { count: eduCount } = await supabase.from('education').select('*', { count: 'exact', head: true });
            if (eduCount === 0) {
                await supabase.from('education').insert([
                    {
                        institution: 'Guru Gobind Singh Indraprastha University',
                        degree: 'B.Tech - Information Technology',
                        field_of_study: 'Information Technology',
                        start_date: '2020-08-01',
                        end_date: '2024-05-01',
                        description: 'CGPA: 9.1. Coursework: Data Structures & Algorithms, OS, DBMS, Computer Networks.',
                        order_index: 0
                    }
                ]);
            }

            showToast('success', 'Database seeded successfully! Refresh the page to see changes.');
        } catch (error) {
            console.error('Error seeding:', error);
            showToast('error', 'Error seeding database');
        } finally {
            setSeeding(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-2">Dashboard</h1>
                    <p className="text-zinc-400">Welcome back. Manage your portfolio content.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSeedDatabase}
                        disabled={seeding}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-brand-500/30 rounded-xl hover:bg-brand-500/10 text-brand-400 transition-colors disabled:opacity-50"
                    >
                        <Database className="w-5 h-5" />
                        {seeding ? 'Seeding...' : 'Populate Demo Data'}
                    </button>
                    <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors text-white border border-white/5"
                    >
                        <Eye className="w-5 h-5" />
                        View Public Site
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h3 className="text-sm font-medium text-zinc-400">Total Projects</h3>
                        <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
                            <FolderKanban className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10">
                        {stats.loading ? <span className="animate-pulse">...</span> : stats.projects}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2 relative z-10">Portfolio projects listed</p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-tech-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h3 className="text-sm font-medium text-zinc-400">Skills Listed</h3>
                        <div className="p-2 bg-tech-500/10 rounded-lg text-tech-400">
                            <Award className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10">
                        {stats.loading ? <span className="animate-pulse">...</span> : stats.skills}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2 relative z-10">Technical skills showcased</p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h3 className="text-sm font-medium text-zinc-400">Work Experience</h3>
                        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                            <Briefcase className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10">
                        {stats.loading ? <span className="animate-pulse">...</span> : stats.experiences}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2 relative z-10">Professional roles added</p>
                </motion.div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.name}
                            href={section.href}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="h-full glass-card rounded-2xl p-6 hover:bg-white/5 transition-all group border border-white/5 hover:border-white/10"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                                        <Icon className={`w-6 h-6 ${section.text}`} />
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                                        <ArrowRight className="w-5 h-5 text-zinc-500" />
                                    </div>
                                </div>
                                <h2 className="text-lg font-bold text-white mb-2">{section.name}</h2>
                                <p className="text-zinc-400 text-sm leading-relaxed">{section.description}</p>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
