'use client';

import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';

export default function AchievementsSection() {
    // Static data for now as we restore it from the resume context
    const achievements = [
        {
            id: 1,
            title: "Top 3 Winner — MAITATHON 2.0",
            description: "Secured top 3 position in MAITATHON 2.0 hackathon competing against 100+ participants.",
            icon: Trophy,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20"
        },
        {
            id: 2,
            title: "Open Source Contributor",
            description: "Active contributor to open source projects during Hacktoberfest 2023.",
            icon: Star,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            border: "border-yellow-400/20"
        }
    ];

    return (
        <section className="py-32 bg-background relative z-10 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center justify-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Recognition</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Honors & Awards
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative group p-8 rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-amber-500/40 transition-all duration-300"
                        >
                            {/* Inner Glow Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.bg.replace('/10', '/0')} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />

                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.border} border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-amber-900/10`}>
                                    <item.icon className={`w-7 h-7 ${item.color}`} />
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-amber-100 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
