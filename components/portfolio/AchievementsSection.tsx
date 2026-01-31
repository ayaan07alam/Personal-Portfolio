'use client';

import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';

export default function AchievementsSection() {
    // Static data for now as we restore it from the resume context
    const achievements = [
        {
            id: 1,
            title: "Smart India Hackathon Finalist",
            description: "Selected for the Grand Finale of SIH 2023, competing among top 1% of teams nationwide.",
            icon: Trophy,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20"
        },
        {
            id: 2,
            title: "5 Star C++ Coder",
            description: "Achieved 5-star rating on HackerRank for problem solving and algorithms.",
            icon: Star,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            border: "border-yellow-400/20"
        },
        {
            id: 3,
            title: "300+ Problems Solved",
            description: "Solved over 300 data structures and algorithms problems on LeetCode and GFG.",
            icon: Award,
            color: "text-orange-400",
            bg: "bg-orange-400/10",
            border: "border-orange-400/20"
        }
    ];

    return (
        <section className="py-24 bg-black relative z-10 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center justify-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Honors</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Achievements
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-100 transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
