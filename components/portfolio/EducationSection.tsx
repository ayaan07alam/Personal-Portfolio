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
                                    <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                                    <p className="text-sm text-zinc-400 mt-0.5">{edu.degree}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                                            <Calendar className="w-3 h-3" />
                                            {edu.start_date?.split('-')[0]} — {edu.end_date ? edu.end_date.split('-')[0] : 'Present'}
                                        </span>
                                        {edu.cgpa && (
                                            <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                                                CGPA: {edu.cgpa}
                                            </span>
                                        )}
                                    </div>

                                    {edu.coursework && edu.coursework.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                            {edu.coursework.map((c: string) => (
                                                <span key={c} className="px-2.5 py-1 text-[10px] font-mono text-zinc-500 bg-white/[0.02] border border-white/[0.04] rounded-md hover:border-indigo-500/25 hover:text-zinc-300 transition-all">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
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
