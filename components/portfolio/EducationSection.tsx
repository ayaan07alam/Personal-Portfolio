'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Education } from '@/types';
import { GraduationCap, BookOpen, Calendar, Award } from 'lucide-react';

export default function EducationSection() {
    const [education, setEducation] = useState<Education[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('education').select('*').order('start_date', { ascending: false });
                if (data && data.length > 0) setEducation(data);
                else setEducation(defaultEducation);
            } catch { setEducation(defaultEducation); }
        }
        fetchData();
    }, []);

    const defaultEducation = [
        {
            id: '1',
            institution: 'Guru Gobind Singh Indraprastha University',
            degree: 'Bachelor of Technology (B.Tech) – Information Technology',
            start_date: '2020-08-01',
            end_date: '2024-06-01',
            description: 'CGPA: 9.1. Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, Software Engineering, Object-Oriented Programming.',
            order_index: 0,
            field_of_study: 'Information Technology',
            is_current: false,
            logo: '',
            created_at: new Date().toISOString()
        },
    ];

    return (
        <section className="py-32 bg-background relative z-10 border-t border-white/5 overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tech-900/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center justify-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-tech-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Academic Background</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tight text-center"
                    >
                        Education
                    </motion.h2>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {education.map((edu, index) => (
                        <EducationCard key={edu.id} edu={edu} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function EducationCard({ edu, index }: { edu: any, index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // Extract coursework from description if possible, or use a default list
    const coursework = edu.description.includes('Coursework:')
        ? edu.description.split('Coursework:')[1].split(',').map((s: string) => s.trim().replace('.', ''))
        : ['Data Structures', 'Algorithms', 'DBMS', 'OS', 'Networks'];

    // Extract CGPA
    const cgpa = edu.description.match(/CGPA:\s*([\d.]+)/)?.[1] || '9.1';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className="group relative rounded-[2.5rem] bg-zinc-900/30 border border-white/10 overflow-hidden hover:bg-zinc-900/50 transition-colors duration-500"
        >
            {/* Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(45, 212, 191, 0.10),
                            transparent 80%
                        )
                    `,
                }}
            />

            <div className="relative z-20 p-8 md:p-12 lg:p-16 grid md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-center">

                {/* Left: Info */}
                <div className="flex flex-col gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-tech-500/10 border border-tech-500/20 flex items-center justify-center mb-2">
                        <GraduationCap className="w-8 h-8 text-tech-400" />
                    </div>

                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-brand-300 group-hover:to-tech-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 mb-2 pr-24">
                            {edu.institution}
                        </h3>
                        <p className="text-xl text-tech-400 font-medium">
                            {edu.degree}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400 font-mono">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(edu.start_date).getFullYear()} — {edu.is_current ? 'Present' : new Date(edu.end_date).getFullYear()}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-tech-300 bg-tech-500/10 border border-tech-500/20">
                            <Award className="w-4 h-4" />
                            <span>CGPA: {cgpa}</span>
                        </div>
                    </div>

                    {/* Coursework Pills */}
                    <div className="border-t border-white/5 pt-8 mt-2">
                        <div className="flex items-center gap-2 mb-4 text-zinc-500 text-sm uppercase tracking-wider font-semibold">
                            <BookOpen className="w-4 h-4" />
                            <span>Key Coursework</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {coursework.map((course: string, i: number) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-zinc-300 text-sm hover:bg-white/10 hover:border-tech-500/30 transition-colors cursor-default"
                                >
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Decorative Visual (Large Watermark) */}
                <div className="hidden md:block opacity-10 rotate-12 scale-150 pointer-events-none select-none">
                    <GraduationCap className="w-64 h-64 text-tech-500" />
                </div>
            </div>
        </motion.div>
    );
}
