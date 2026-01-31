'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Skill } from '@/types';
import { Code2, Database, Layout, Server, Settings, Terminal } from 'lucide-react';

export default function SkillsSection() {
    const [skills, setSkills] = useState<Skill[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
                if (data && data.length > 0) setSkills(data);
                else setSkills(defaultSkills);
            } catch { setSkills(defaultSkills); }
        }
        fetchData();
    }, []);

    const defaultSkills: Skill[] = [
        { id: '1', name: 'Java', category: 'Backend', proficiency: 95, order_index: 0, created_at: '', icon: '' },
        { id: '2', name: 'Spring Boot', category: 'Backend', proficiency: 90, order_index: 1, created_at: '', icon: '' },
        { id: '3', name: 'React.js', category: 'Frontend', proficiency: 88, order_index: 2, created_at: '', icon: '' },
        { id: '4', name: 'Next.js', category: 'Frontend', proficiency: 85, order_index: 3, created_at: '', icon: '' },
        { id: '5', name: 'PostgreSQL', category: 'Database', proficiency: 85, order_index: 4, created_at: '', icon: '' },
        { id: '6', name: 'Docker', category: 'DevOps', proficiency: 80, order_index: 5, created_at: '', icon: '' },
        { id: '7', name: 'AWS', category: 'Cloud', proficiency: 75, order_index: 6, created_at: '', icon: '' },
    ];

    const categories = Array.from(new Set(skills.map(s => s.category)));

    return (
        <section className="py-32 bg-background relative z-10 border-t border-white/5 overflow-hidden">

            {/* Meteor Effect */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <Meteor key={i} delay={i * 0.5} />
                ))}
            </div>

            {/* Background Glow */}
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-tech-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center justify-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-tech-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Expertise</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Technical Arsenal
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, catIndex) => {
                        const categorySkills = skills.filter(s => s.category === category);
                        return (
                            <SkillDrawer
                                key={category}
                                category={category}
                                skills={categorySkills}
                                index={catIndex}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function SkillDrawer({ category, skills, index }: { category: string, skills: Skill[], index: number }) {
    // Determine icon based on category name
    const getIcon = (cat: string) => {
        const lower = cat.toLowerCase();
        if (lower.includes('front')) return Layout;
        if (lower.includes('back')) return Server;
        if (lower.includes('data')) return Database;
        if (lower.includes('devops')) return Terminal;
        if (lower.includes('cloud')) return Settings;
        return Code2;
    };

    const Icon = getIcon(category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden hover:bg-zinc-900/80 transition-colors duration-500"
        >
            <div className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-tech-400 group-hover:bg-tech-500/10 group-hover:text-tech-300 transition-colors">
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-tech-100 transition-colors mb-2">{category}</h3>
                <p className="text-zinc-500 text-sm">{skills.length} skills</p>
            </div>

            {/* Expands on Hover (Drawer Effect) */}
            <div className="max-h-0 group-hover:max-h-96 transition-[max-height] duration-500 ease-in-out overflow-hidden">
                <div className="p-8 pt-0">
                    <div className="h-px w-full bg-white/5 mb-6"></div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 hover:border-tech-500/30 transition-colors cursor-default"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visual Indicator arrow/chevron could go here but minimal is usually better for 'amaze' */}
        </motion.div>
    );
}

function Meteor({ delay }: { delay: number }) {
    const style = {
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        animationDelay: delay + 's',
        animationDuration: Math.random() * 2 + 2 + 's',
    };

    return (
        <span
            className="pointer-events-none absolute w-[2px] h-[2px] bg-slate-500 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.1)] rotate-[215deg] animate-meteor"
            style={style}
        >
            <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-[50px] h-[1px] bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
    );
}
