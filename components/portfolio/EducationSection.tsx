'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Education } from '@/types';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';

export default function EducationSection() {
    const [education, setEducation] = useState<Education[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('education').select('*').order('start_date', { ascending: false });
                if (data) setEducation(data);
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    return (
        <SectionWrapper id="education" label="Education" title="Academic" titleAccent="background.">
            <div className="max-w-3xl mx-auto space-y-5">
                {education.map((edu, i) => (
                    <motion.div
                        key={edu.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <SpotlightCard className="p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display text-lg font-bold text-[var(--text-main)] tracking-tight">{edu.institution}</h3>
                                    <p className="text-sm text-[var(--text-muted)] mt-0.5">{edu.degree}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-lg">
                                            <Calendar className="w-3 h-3" />
                                            {edu.start_date?.split('-')[0]} — {edu.end_date ? edu.end_date.split('-')[0] : 'Present'}
                                        </span>
                                    </div>

                                    {edu.description && (
                                        <div className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed rich-text-display" dangerouslySetInnerHTML={{ __html: edu.description }} />
                                    )}
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
