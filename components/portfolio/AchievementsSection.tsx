'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Star, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';

const ICON_MAP: Record<string, React.ReactNode> = {
    Trophy: <Trophy className="w-6 h-6" />,
    Award: <Award className="w-6 h-6" />,
    Medal: <Medal className="w-6 h-6" />,
    Star: <Star className="w-6 h-6" />,
    Crown: <Crown className="w-6 h-6" />,
};

export default function AchievementsSection() {
    const [achievements, setAchievements] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await supabase.from('achievements').select('*').order('order_index', { ascending: true });
                if (data) setAchievements(data);
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    if (achievements.length === 0) return null;

    return (
        <SectionWrapper id="achievements" label="Recognition" title="Notable" titleAccent="achievements.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {achievements.map((ach, i) => (
                    <motion.div
                        key={ach.id}
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
                                    {ICON_MAP[ach.icon] || <Trophy className="w-6 h-6" />}
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>
                                <div>
                                    <h3 className="font-display text-[var(--text-main)] font-semibold tracking-tight mb-1.5">{ach.title}</h3>
                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{ach.description}</p>
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
