'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Code2, Server, Layout, Database, Wrench, Cloud, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Skill } from '@/types';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MouseGlow from '@/components/ui/MouseGlow';
import { macSpringTransition } from '@/lib/motion-presets';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Languages: <Code2 className="w-5 h-5" />,
    Backend: <Server className="w-5 h-5" />,
    Frontend: <Layout className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
    Tools: <Wrench className="w-5 h-5" />,
    DevOps: <Cloud className="w-5 h-5" />,
};

export default function SkillsSection() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('skills').select('*').order('proficiency', { ascending: false });
                if (data) setSkills(data);
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    const categories = useMemo(() => [...new Set(skills.map((s) => s.category))], [skills]);

    const tabs = useMemo(() => ['All', ...categories.sort((a, b) => a.localeCompare(b))], [categories]);

    const groupedAll = categories.map((cat) => ({
        name: cat,
        skills: skills.filter((s) => s.category === cat),
    }));

    const grouped = filter === 'All' ? groupedAll : groupedAll.filter((g) => g.name === filter);

    useEffect(() => {
        setExpanded(filter === 'All' ? null : filter);
    }, [filter]);

    return (
        <SectionWrapper id="skills" label="Expertise" title="Technical" titleAccent="arsenal.">
            <MouseGlow glowColor="rgba(99, 102, 241, 0.04)" glowSize={700}>
                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={macSpringTransition}
                    className="text-zinc-500 text-sm md:text-[15px] max-w-xl mb-8 leading-relaxed"
                >
                    Filter by domain — same pattern as layered developer portfolios (&ldquo;All / Cloud / DevOps…&rdquo;). Tap a category or open a card for depth.
                </motion.p>

                <LayoutGroup>
                    <div className="flex flex-wrap gap-2 mb-10 md:mb-11">
                        {tabs.map((tab) => {
                            const active = filter === tab;
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setFilter(tab)}
                                    className={`relative shrink-0 rounded-full px-4 py-2 text-[12px] md:text-[13px] font-medium transition-colors duration-300 ${
                                        active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="skill-filter-pill"
                                            className="absolute inset-0 rounded-full bg-white/[0.09] ring-1 ring-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                                            transition={macSpringTransition}
                                        />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            );
                        })}
                    </div>
                </LayoutGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {grouped.map((group, i) => (
                            <motion.div
                                key={group.name}
                                layout
                                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                transition={{ ...macSpringTransition, delay: i * 0.04 }}
                                className={`${filter !== 'All' ? 'md:col-span-2 lg:col-span-3 max-w-none' : ''}`}
                            >
                                <SpotlightCard
                                    className={`p-5 cursor-pointer transition-all duration-500 ${expanded === group.name ? 'border-brand-500/25' : ''}`}
                                    spotlightColor={
                                        expanded === group.name ? 'rgba(139, 92, 246, 0.22)' : 'rgba(139, 92, 246, 0.08)'
                                    }
                                >
                                    <div onClick={() => setExpanded(expanded === group.name ? null : group.name)}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-500">
                                                    {CATEGORY_ICONS[group.name] ?? <Code2 className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-display text-white font-semibold text-sm tracking-tight">{group.name}</h3>
                                                    <p className="text-[11px] text-zinc-600 font-mono">{group.skills.length} skills</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: expanded === group.name ? 180 : 0 }}
                                                transition={macSpringTransition}
                                            >
                                                <ChevronDown className="w-4 h-4 text-zinc-600" />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence>
                                            {expanded === group.name && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-5 space-y-3.5">
                                                        {group.skills.map((skill, j) => (
                                                            <motion.div
                                                                key={skill.id}
                                                                initial={{ opacity: 0, x: -8 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: j * 0.04, duration: 0.3 }}
                                                            >
                                                                <div className="flex justify-between items-center mb-1.5">
                                                                    <span className="text-zinc-300 text-sm">{skill.name}</span>
                                                                    <span className="text-[10px] text-zinc-600 font-mono">{skill.proficiency}%</span>
                                                                </div>
                                                                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${skill.proficiency}%` }}
                                                                        transition={{
                                                                            duration: 1.1,
                                                                            delay: 0.08 + j * 0.05,
                                                                            ease: [0.22, 1, 0.36, 1],
                                                                        }}
                                                                        className="h-full rounded-full relative overflow-hidden"
                                                                        style={{
                                                                            background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #38bdf8)',
                                                                            boxShadow:
                                                                                '0 0 16px rgba(139, 92, 246, 0.5), 0 0 8px rgba(99, 102, 241, 0.4)',
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/28 to-transparent animate-shimmer"
                                                                            style={{ animationDuration: '2.2s' }}
                                                                        />
                                                                    </motion.div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </MouseGlow>
        </SectionWrapper>
    );
}
