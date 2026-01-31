'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import {
    Home,
    User,
    Award,
    Briefcase,
    FolderKanban,
    GraduationCap,
    Mail,
    Eye,
    Database
} from 'lucide-react';

export default function AdminDashboard() {
    const [seeding, setSeeding] = useState(false);

    const sections = [
        { name: 'Hero Section', href: '/admin/hero', icon: Home, description: 'Main landing section with title and CTA' },
        { name: 'About', href: '/admin/about', icon: User, description: 'About me section with bio and image' },
        { name: 'Skills', href: '/admin/skills', icon: Award, description: 'Skills and expertise' },
        { name: 'Experience', href: '/admin/experience', icon: Briefcase, description: 'Work history and experience' },
        { name: 'Projects', href: '/admin/projects', icon: FolderKanban, description: 'Portfolio projects' },
        { name: 'Education', href: '/admin/education', icon: GraduationCap, description: 'Educational background' },
        { name: 'Contact', href: '/admin/contact', icon: Mail, description: 'Contact information and social links' },
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

            alert('Database seeded successfully! Refresh the page to see changes.');
        } catch (error) {
            console.error('Error seeding:', error);
            alert('Error seeding database.');
        } finally {
            setSeeding(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
                    <p className="text-gray-400">Manage your portfolio content</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSeedDatabase}
                        disabled={seeding}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 text-primary-400 transition-colors disabled:opacity-50"
                    >
                        <Database className="w-5 h-5" />
                        {seeding ? 'Seeding...' : 'Populate Demo Data'}
                    </button>
                    <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-primary-500/20 transition-colors text-white"
                    >
                        <Eye className="w-5 h-5" />
                        View Public Portfolio
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.name}
                            href={section.href}
                            className="glass rounded-xl p-6 glow-card group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                                    <Icon className="w-6 h-6 text-primary-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">{section.name}</h2>
                            </div>
                            <p className="text-gray-400 text-sm">{section.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
