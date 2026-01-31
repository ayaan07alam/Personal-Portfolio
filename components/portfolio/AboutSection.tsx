'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { AboutSection as AboutSectionType } from '@/types';

export default function AboutSection() {
    const [data, setData] = useState<AboutSectionType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAboutData();
    }, []);

    async function fetchAboutData() {
        try {
            const { data, error } = await supabase
                .from('about_section')
                .select('*')
                .single();

            if (error) throw error;
            setData(data);
        } catch (error) {
            console.error('Error fetching about data:', error);
            setData({
                id: '1',
                title: 'About Me',
                content: 'I am a passionate developer with experience in building modern web applications. I love creating beautiful, functional, and user-friendly experiences that solve real-world problems.',
                image: null,
                resume_url: null,
                updated_at: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    }

    if (loading) return null;

    return (
        <section id="about" className="section-padding bg-gray-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {data?.image ? (
                            <div className="relative glass rounded-2xl overflow-hidden p-4">
                                <img
                                    src={data.image}
                                    alt="About"
                                    className="w-full rounded-xl object-cover"
                                />
                            </div>
                        ) : (
                            <div className="glass rounded-2xl p-8 h-96 flex items-center justify-center">
                                <p className="text-gray-400">No image set</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold gradient-text">
                            {data?.title}
                        </h2>

                        <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {data?.content}
                        </p>

                        {data?.resume_url && (
                            <a
                                href={data.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-primary-500/20 transition-all duration-300 hover:scale-105"
                            >
                                <Download className="w-5 h-5" />
                                <span className="font-semibold">Download Resume</span>
                            </a>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
