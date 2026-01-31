'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { HeroSection as HeroSectionType } from '@/types';

export default function HeroSection() {
    const [data, setData] = useState<HeroSectionType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHeroData();
    }, []);

    async function fetchHeroData() {
        try {
            const { data, error } = await supabase
                .from('hero_section')
                .select('*')
                .single();

            if (error) throw error;
            setData(data);
        } catch (error) {
            console.error('Error fetching hero data:', error);
            // Set default data if database is not set up yet
            setData({
                id: '1',
                title: 'Hi, I\'m Your Name',
                subtitle: 'Full Stack Developer',
                description: 'I craft beautiful and functional web experiences that make a difference.',
                cta_text: 'View My Work',
                cta_link: '#projects',
                background_image: null,
                profile_image: null,
                updated_at: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-primary-400">Loading...</div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient"></div>

            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    {/* Profile Image */}
                    {data?.profile_image && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <div className="relative w-40 h-40 rounded-full glass p-2 animate-glow">
                                <img
                                    src={data.profile_image}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Title with gradient */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold gradient-text"
                    >
                        {data?.title}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-2xl sm:text-3xl text-primary-300 font-semibold"
                    >
                        {data?.subtitle}
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        {data?.description}
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <a
                            href={data?.cta_link}
                            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-full hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50"
                        >
                            {data?.cta_text}
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <ChevronDown className="w-8 h-8 text-primary-400 animate-bounce" />
            </motion.div>
        </section>
    );
}
