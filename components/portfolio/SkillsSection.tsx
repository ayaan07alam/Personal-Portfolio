'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Server, Layout, Database, Wrench, Cloud, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Skill } from '@/types';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MouseGlow from '@/components/ui/MouseGlow';

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

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('skills').select('*').order('proficiency', { ascending: false });
                if (data) setSkills(data);
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    const categories = [...new Set(skills.map(s => s.category))];
    const grouped = categories.map(cat => ({
        name: cat,
        skills: skills.filter(s => s.category === cat),
    }));

    return (
        <SectionWrapper id="skills" label="Expertise" title="Technical" titleAccent="arsenal.">
            <MouseGlow glowColor="rgba(99, 102, 241, 0.04)" glowSize={700}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {grouped.map((group, i) => (
                        <motion.div
                            key={group.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <SpotlightCard
                                className={`p-5 cursor-pointer transition-all duration-500 ${expanded === group.name ? 'border-brand-500/20' : ''}`}
                                spotlightColor={expanded === group.name ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)"}
                            >
                                <div onClick={() => setExpanded(expanded === group.name ? null : group.name)}>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-500">
                                                {CATEGORY_ICONS[group.name] ?? <Code2 className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-display text-white font-semibold text-sm tracking-tight">{group.name}</h3>
                                                <p className="text-[11px] text-zinc-600 font-mono">{group.skills.length} skills</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ rotate: expanded === group.name ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                            <ChevronDown className="w-4 h-4 text-zinc-600" />
                                        </motion.div>
                                    </div>

                                    {/* Expanded skill list */}
                                    <AnimatePresence>
                                        {expanded === group.name && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                                                                    transition={{ duration: 1.2, delay: 0.1 + j * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                                                    className="h-full rounded-full relative overflow-hidden"
                                                                    style={{
                                                                        background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #38bdf8)',
                                                                        boxShadow: '0 0 12px rgba(139, 92, 246, 0.4), 0 0 4px rgba(99, 102, 241, 0.3)',
                                                                    }}
                                                                >
                                                                    {/* Glowing trail */}
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ animationDuration: '2s' }} />
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
                </div>
            </MouseGlow>
        </SectionWrapper>
    );
}
