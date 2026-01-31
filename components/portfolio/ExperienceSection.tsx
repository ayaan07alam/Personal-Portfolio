'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDateRange } from '@/lib/utils';
import type { Experience } from '@/types';

export default function ExperienceSection() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExperiences();
    }, []);

    async function fetchExperiences() {
        try {
            const { data, error } = await supabase
                .from('experiences')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setExperiences(data || []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            // Default experiences
            setExperiences([
                {
                    id: '1',
                    company: 'Tech Company Inc.',
                    position: 'Senior Developer',
                    description: 'Led development of key features and mentored junior developers.',
                    start_date: '2022-01-01',
                    end_date: null,
                    is_current: true,
                    location: 'San Francisco, CA',
                    company_logo: null,
                    order_index: 1,
                    created_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    company: 'Startup XYZ',
                    position: 'Full Stack Developer',
                    description: 'Built scalable web applications using modern technologies.',
                    start_date: '2020-06-01',
                    end_date: '2021-12-31',
                    is_current: false,
                    location: 'Remote',
                    company_logo: null,
                    order_index: 2,
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return null;

    return (
        <section id="experience" className="section-padding bg-gray-900/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                        Work Experience
                    </h2>
                    <p className="text-gray-400 text-lg">
                        My professional journey
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-secondary-500"></div>

                    <div className="space-y-12">
                        {experiences.map((exp, idx) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative md:grid md:grid-cols-2 md:gap-8 ${idx % 2 === 0 ? '' : 'md:grid-flow-dense'
                                    }`}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-gray-900 transform -translate-x-2 md:-translate-x-2"></div>

                                {/* Content */}
                                <div className={`ml-20 md:ml-0 ${idx % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}>
                                    <div className="glass rounded-xl p-6 glow-card">
                                        <div className="flex items-start gap-4 mb-4">
                                            {exp.company_logo && (
                                                <img
                                                    src={exp.company_logo}
                                                    alt={exp.company}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-1">{exp.position}</h3>
                                                <p className="text-primary-400 font-semibold">{exp.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {exp.location}
                                            </span>
                                            {exp.is_current && (
                                                <span className="px-2 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-semibold">
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
