'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Experience } from '@/types';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MouseGlow from '@/components/ui/MouseGlow';

export default function ExperienceSection() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('experiences').select('*').order('start_date', { ascending: false });
                if (data) {
                    setExperiences(data);
                    if (data.length > 0) setExpanded(data[0].id);
                }
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

    return (
        <SectionWrapper id="experience" label="Career" title="Professional" titleAccent="journey.">
            <MouseGlow glowColor="rgba(139, 92, 246, 0.04)" glowSize={700}>
                <div className="relative max-w-3xl mx-auto pl-6 md:pl-10">
                    {/* Timeline line with gradient */}
                    <div className="absolute left-0 md:left-4 top-0 bottom-0 w-px">
                        <div className="w-full h-full bg-gradient-to-b from-brand-500/40 via-brand-500/20 to-transparent" />
                    </div>

                    <div className="space-y-8">
                        {experiences.map((exp, i) => {
                            const isCurrent = !exp.end_date;
                            const isOpen = expanded === exp.id;

                            return (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative"
                                >
                                    {/* Timeline dot */}
                                    <div className={`absolute left-[-24px] md:left-[-32px] top-6 w-3 h-3 rounded-full border-2 transition-all duration-500 ${isCurrent ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.8)] scale-125' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] group-hover:border-indigo-500'}`} />

                                    <SpotlightCard
                                        className={`group p-5 md:p-6 cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)] ${isCurrent ? 'border-indigo-500/30 bg-indigo-500/[0.02]' : 'border-[var(--border-subtle)] hover:border-indigo-500/20'}`}
                                        spotlightColor={isCurrent ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.15)"}
                                    >
                                        <div onClick={() => setExpanded(isOpen ? null : exp.id)}>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-[var(--text-main)] ${isCurrent ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'bg-[var(--bg-hover)] border border-[var(--border-subtle)]'}`}>
                                                        {exp.company.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-display text-[var(--text-main)] font-semibold text-lg tracking-tight">{exp.company}</h3>
                                                        <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs">
                                                            <MapPin className="w-3 h-3 text-indigo-500" />
                                                            <span>{exp.location ?? 'Remote'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] mt-2" />
                                                </motion.div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-3">
                                                <span className={`px-2.5 py-1 text-[11px] font-mono rounded-lg ${isCurrent ? 'text-indigo-600 dark:text-brand-300 bg-indigo-500/10 border border-indigo-500/20' : 'text-[var(--text-muted)] bg-[var(--bg-hover)] border border-[var(--border-subtle)]'}`}>
                                                    {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                                                </span>
                                                {exp.position && <span className="text-xs text-[var(--text-muted)] font-medium">{exp.position}</span>}
                                            </div>

                                            <AnimatePresence>
                                                {isOpen && exp.description && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] text-[var(--text-muted)] text-sm leading-relaxed rich-text-display"
                                                            dangerouslySetInnerHTML={{ __html: exp.description }}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </MouseGlow>
        </SectionWrapper>
    );
}
