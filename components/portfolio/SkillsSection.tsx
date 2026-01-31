'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Skill } from '@/types';

export default function SkillsSection() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, []);

    async function fetchSkills() {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setSkills(data || []);
        } catch (error) {
            console.error('Error fetching skills:', error);
            // Default skills
            setSkills([
                { id: '1', name: 'React', category: 'Frontend', proficiency: 90, icon: null, order_index: 1, created_at: new Date().toISOString() },
                { id: '2', name: 'Next.js', category: 'Frontend', proficiency: 85, icon: null, order_index: 2, created_at: new Date().toISOString() },
                { id: '3', name: 'TypeScript', category: 'Frontend', proficiency: 80, icon: null, order_index: 3, created_at: new Date().toISOString() },
                { id: '4', name: 'Node.js', category: 'Backend', proficiency: 75, icon: null, order_index: 4, created_at: new Date().toISOString() },
                { id: '5', name: 'PostgreSQL', category: 'Backend', proficiency: 70, icon: null, order_index: 5, created_at: new Date().toISOString() },
                { id: '6', name: 'Git', category: 'Tools', proficiency: 85, icon: null, order_index: 6, created_at: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    }

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    if (loading) return null;

    return (
        <section id="skills" className="section-padding">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
                        Skills & Expertise
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Technologies and tools I work with
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {Object.entries(groupedSkills).map(([category, categorySkills], idx) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-semibold text-primary-400 mb-6">{category}</h3>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {categorySkills.map((skill, skillIdx) => (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: skillIdx * 0.05 }}
                                        viewport={{ once: true }}
                                        className="glass rounded-xl p-6 glow-card"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                                            <span className="text-accent-400 font-bold">{skill.proficiency}%</span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.proficiency}%` }}
                                                transition={{ duration: 1, delay: 0.3 + skillIdx * 0.05 }}
                                                viewport={{ once: true }}
                                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
