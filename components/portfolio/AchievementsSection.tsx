'use client';

import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Star } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';

const ACHIEVEMENTS = [
    {
        icon: <Trophy className="w-6 h-6" />,
        title: 'Smart India Hackathon 2024',
        description: 'Qualified for the Grand Finale of Smart India Hackathon, demonstrating innovative problem-solving and technical expertise.',
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: 'GeeksforGeeks Campus Ambassador',
        description: 'Selected as GFG Campus Ambassador, building coding culture and community at university level.',
    },
    {
        icon: <Medal className="w-6 h-6" />,
        title: '300+ DSA Problems',
        description: 'Solved 300+ algorithmic challenges across LeetCode, GeeksforGeeks, and CodeChef platforms.',
    },
    {
        icon: <Star className="w-6 h-6" />,
        title: 'Freelance Projects',
        description: 'Successfully delivered multiple freelance web development projects, building production-grade applications for real clients.',
    },
];

export default function AchievementsSection() {
    return (
        <SectionWrapper id="achievements" label="Recognition" title="Notable" titleAccent="achievements.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {ACHIEVEMENTS.map((ach, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <SpotlightCard
                            className="p-6 h-full group"
                            spotlightColor="rgba(245, 158, 11, 0.12)"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 relative overflow-hidden">
                                    {ach.icon}
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1.5">{ach.title}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">{ach.description}</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
