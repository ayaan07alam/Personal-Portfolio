'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDateRange } from '@/lib/utils';
import type { Education } from '@/types';

export default function EducationSection() {
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEducation();
    }, []);

    async function fetchEducation() {
        try {
            const { data, error } = await supabase
                .from('education')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setEducation(data || []);
        } catch (error) {
            console.error('Error fetching education:', error);
            // Default education
            setEducation([
                {
                    id: '1',
                    institution: 'University of Technology',
                    degree: 'Bachelor of Science',
                    field_of_study: 'Computer Science',
                    start_date: '2016-09-01',
                    end_date: '2020-06-01',
                    is_current: false,
                    description: 'Focused on software engineering and web development',
                    logo: null,
                    order_index: 1,
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return null;

    return (
        <section id="education" className="section-padding bg-gray-900/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                        Education
                    </h2>
                    <p className="text-gray-400 text-lg">
                        My academic background
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {education.map((edu, idx) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="glass rounded-xl p-6 glow-card"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                {edu.logo ? (
                                    <img
                                        src={edu.logo}
                                        alt={edu.institution}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                        <GraduationCap className="w-8 h-8 text-primary-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                                    <p className="text-primary-400 font-semibold">{edu.field_of_study}</p>
                                </div>
                            </div>

                            <p className="text-lg text-white font-semibold mb-2">{edu.institution}</p>

                            <p className="text-gray-400 text-sm mb-4">
                                {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                            </p>

                            {edu.description && (
                                <p className="text-gray-300">{edu.description}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
