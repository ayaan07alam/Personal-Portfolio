'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Skill } from '@/types';
import { Code2, Database, Layout, Server, Settings, Terminal } from 'lucide-react';

export default function SkillsSection() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
        { id: '1', name: 'Java', category: 'Languages', proficiency: 95, order_index: 0, created_at: '', icon: '' },
        { id: '2', name: 'JavaScript', category: 'Languages', proficiency: 90, order_index: 1, created_at: '', icon: '' },
        { id: '3', name: 'Python', category: 'Languages', proficiency: 85, order_index: 2, created_at: '', icon: '' },
        { id: '4', name: 'C++', category: 'Languages', proficiency: 80, order_index: 3, created_at: '', icon: '' },
        { id: '5', name: 'PHP', category: 'Languages', proficiency: 75, order_index: 4, created_at: '', icon: '' },

        { id: '6', name: 'Spring Boot', category: 'Backend', proficiency: 95, order_index: 5, created_at: '', icon: '' },
        { id: '7', name: 'Spring Security', category: 'Backend', proficiency: 90, order_index: 6, created_at: '', icon: '' },
        { id: '8', name: 'RESTful APIs', category: 'Backend', proficiency: 95, order_index: 7, created_at: '', icon: '' },
        { id: '9', name: 'Hibernate/JPA', category: 'Backend', proficiency: 85, order_index: 8, created_at: '', icon: '' },
        { id: '10', name: 'JWT & OAuth', category: 'Backend', proficiency: 85, order_index: 9, created_at: '', icon: '' },

        { id: '11', name: 'React.js', category: 'Frontend', proficiency: 90, order_index: 10, created_at: '', icon: '' },
        { id: '12', name: 'Next.js', category: 'Frontend', proficiency: 85, order_index: 11, created_at: '', icon: '' },
        { id: '13', name: 'HTML5 & CSS3', category: 'Frontend', proficiency: 95, order_index: 12, created_at: '', icon: '' },
        { id: '14', name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, order_index: 13, created_at: '', icon: '' },

        { id: '15', name: 'PostgreSQL', category: 'Database', proficiency: 90, order_index: 14, created_at: '', icon: '' },
        { id: '16', name: 'MySQL', category: 'Database', proficiency: 90, order_index: 15, created_at: '', icon: '' },
        { id: '17', name: 'MongoDB', category: 'Database', proficiency: 80, order_index: 16, created_at: '', icon: '' },
        { id: '18', name: 'SQLite', category: 'Database', proficiency: 80, order_index: 17, created_at: '', icon: '' },

        { id: '19', name: 'Git & GitHub', category: 'Tools', proficiency: 95, order_index: 18, created_at: '', icon: '' },
        { id: '20', name: 'Docker', category: 'Tools', proficiency: 85, order_index: 19, created_at: '', icon: '' },
        { id: '21', name: 'Maven', category: 'Tools', proficiency: 90, order_index: 20, created_at: '', icon: '' },
        { id: '22', name: 'Postman', category: 'Tools', proficiency: 95, order_index: 21, created_at: '', icon: '' },
        { id: '23', name: 'Jira', category: 'Tools', proficiency: 85, order_index: 22, created_at: '', icon: '' },

        { id: '24', name: 'AWS', category: 'Cloud', proficiency: 75, order_index: 23, created_at: '', icon: '' },
        { id: '25', name: 'GCP', category: 'Cloud', proficiency: 70, order_index: 24, created_at: '', icon: '' },
        { id: '26', name: 'Linux', category: 'Cloud', proficiency: 80, order_index: 25, created_at: '', icon: '' },
    ];

    const categories = Array.from(new Set(skills.map(s => s.category)));

    return (
        <section id="skills" className="py-32 bg-background relative z-10 border-t border-white/5 overflow-hidden">

            {/* Meteor Effect */}
            <div className="absolute inset-0 pointer-events-none will-change-transform">
                {[...Array(15)].map((_, i) => ( // Reduced count
                    <Meteor key={i} delay={i * 0.5} />
                ))}
            </div>

            {/* Background Glow */}
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-tech-900/10 blur-[60px] rounded-full pointer-events-none" />

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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {categories.map((category, catIndex) => {
                        const categorySkills = skills.filter(s => s.category === category);
                        return (
                            <SkillDrawer
                                key={category}
                                category={category}
                                skills={categorySkills}
                                index={catIndex}
                                isActive={activeCategory === category}
                                onHover={() => setActiveCategory(category)}
                                onLeave={() => setActiveCategory(null)}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function SkillDrawer({
    category,
    skills,
    index,
    isActive,
    onHover,
    onLeave
}: {
    category: string,
    skills: Skill[],
    index: number,
    isActive: boolean,
    onHover: () => void,
    onLeave: () => void
}) {
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
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            // Mobile Interaction: Tap to toggle
            onClick={() => isActive ? onLeave() : onHover()}
            className={`cursor-pointer group relative rounded-2xl overflow-hidden transition-all duration-500 outline-none
                ${isActive
                    ? 'bg-zinc-900/90 border-brand-500/50 shadow-2xl shadow-brand-500/10 scale-[1.02]'
                    : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-900/60 hover:border-white/10'}
                border backdrop-blur-sm
            `}
        >
            <div className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border transition-all duration-300
                        ${isActive
                            ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 shadow-inner shadow-brand-500/20'
                            : 'bg-white/5 border-white/5 text-zinc-400 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 group-hover:text-brand-300'
                        }
                    `}>
                        <Icon className="w-6 h-6" />
                    </div>

                    {/* Active Indicator */}
                    <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isActive ? 'bg-brand-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-transparent'}`} />
                </div>
                <h3 className={`text-2xl font-bold transition-colors mb-2 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                    {category}
                </h3>
                <p className="text-zinc-500 text-sm font-mono tracking-wide">{skills.length} skills</p>

                {/* Mobile Hint - Only show if NOT active */}
                {!isActive && (
                    <span className="md:hidden text-xs text-zinc-600 mt-4 flex items-center gap-1 opacity-100 transition-opacity">
                        Tap to expand
                    </span>
                )}
            </div>

            {/* Controlled Expansion */}
            <motion.div
                initial={false}
                animate={{ height: isActive ? 'auto' : 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
            >
                <div className="p-8 pt-0">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>
                    <ul className="flex flex-col gap-5">
                        {skills.map((skill, i) => (
                            <motion.li
                                key={skill.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
                                transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                                className="group/item"
                            >
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="text-zinc-300 font-medium group-hover/item:text-brand-300 transition-colors">
                                        {skill.name}
                                    </span>
                                    <span className="text-xs font-mono text-zinc-600 group-hover/item:text-brand-400/50 transition-colors">
                                        {skill.proficiency}%
                                    </span>
                                </div>
                                {/* Proficiency Bar */}
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: isActive ? `${skill.proficiency}%` : 0 }}
                                        transition={{ delay: i * 0.05 + 0.2, duration: 0.8, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full relative"
                                    >
                                        <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/50 blur-[1px]" />
                                    </motion.div>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </motion.div>
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
