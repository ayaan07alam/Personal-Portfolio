'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Download, ArrowUpRight, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { AboutSection as AboutData } from '@/types';
import SectionWrapper from './SectionWrapper';
import SpotlightCard from '@/components/ui/SpotlightCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import MouseGlow from '@/components/ui/MouseGlow';
import AboutJsonSnippet from './AboutJsonSnippet';

export default function AboutSection() {
    const [about, setAbout] = useState<AboutData | null>(null);
    const [hero, setHero] = useState<any>(null);
    const [contact, setContact] = useState<any>(null);
    const [skillInterests, setSkillInterests] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [aboutRes, heroRes, contactRes, skillsRes] = await Promise.all([
                    supabase.from('about_section').select('*').single(),
                    supabase.from('hero_section').select('title, subtitle').single(),
                    supabase.from('contact_info').select('location').single(),
                    supabase.from('skills').select('category'),
                ]);
                
                if (aboutRes.data) setAbout(aboutRes.data);
                if (heroRes.data) setHero(heroRes.data);
                if (contactRes.data) setContact(contactRes.data);
                if (skillsRes.data?.length) {
                    const uniq = [...new Set(skillsRes.data.map((r: { category: string }) => r.category))];
                    setSkillInterests(uniq.slice(0, 6));
                }
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    const name = hero?.title?.replace(/^Hi,? I'm\s+/i, '').trim() ?? 'Ayaan Alam';
    const title = hero?.subtitle ?? 'Software Development Engineer';
    const bio = about?.content ?? 'I build scalable and performant backend systems and full-stack applications.';
    const location = contact?.location ?? 'Bengaluru, India';
    const yearsExperience = '2+'; // Hardcoded or calculated
    const resumeUrl = about?.resume_url ?? '/resume.pdf';
    const profileImage = about?.image ?? null;

    const delay = (i: number) => ({ delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const });

    const interestsFallback = ['Backend engineering', 'Distributed systems', 'API design', 'Cloud-native apps', 'DX & tooling', 'Performance'];

    return (
        <SectionWrapper id="about" label="About Me" title="Get to know" titleAccent="me.">
            <MouseGlow glowColor="rgba(139, 92, 246, 0.04)" glowSize={700}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 auto-rows-min">
                    {/* Large bio card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={delay(0)}
                        className="md:col-span-4 lg:col-span-2 lg:row-span-2"
                    >
                        <SpotlightCard className="p-6 md:p-10 h-full group flex flex-col justify-between hover:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                    <Sparkles className="w-5 h-5 text-brand-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{name}</h3>
                                    <p className="text-xs text-zinc-500 font-mono">{title}</p>
                                </div>
                            </div>
                            <div className="text-zinc-400 leading-relaxed text-[15px] rich-text-display" dangerouslySetInnerHTML={{ __html: bio }} />
                            <div className="mt-8 flex items-center gap-2 text-xs text-zinc-600 bg-white/[0.02] border border-white/[0.05] w-fit px-3 py-1.5 rounded-full">
                                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                                <span className="font-mono">{location}</span>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    {/* Photo card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={delay(1)}
                        className="md:col-span-2 lg:col-span-1 lg:row-span-2"
                    >
                        <SpotlightCard className="overflow-hidden h-[250px] lg:h-full p-0 hover:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-500">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#050505] to-[#0a0a0a] relative overflow-hidden group">
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/40 via-transparent to-transparent group-hover:opacity-40 transition-opacity duration-500" />
                                    <span className="text-8xl font-black text-white/5 relative z-10 group-hover:text-brand-500/20 transition-colors duration-500">{name.charAt(0)}</span>
                                    {/* Decorative ring */}
                                    <div className="absolute inset-8 border border-white/[0.04] rounded-full animate-spin-slow" />
                                    <div className="absolute inset-4 border border-brand-500/[0.05] rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
                                </div>
                            )}
                        </SpotlightCard>
                    </motion.div>

                    {/* Stat card — Experience */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={delay(2)}
                        className="md:col-span-1 lg:col-span-1"
                    >
                        <SpotlightCard className="p-6 h-full flex flex-col justify-center items-center text-center group min-h-[160px] hover:-translate-y-1 transition-all duration-300">
                            <AnimatedCounter target={parseInt(yearsExperience) || 2} suffix="+" className="text-5xl font-black text-[var(--text-main)] transition-colors" />
                            <p className="text-[10px] text-[var(--text-muted)] font-mono tracking-[0.2em] mt-3 uppercase">Years Experience</p>
                        </SpotlightCard>
                    </motion.div>

                    {/* Stat card — Projects */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={delay(3)}
                        className="md:col-span-1 lg:col-span-1"
                    >
                        <SpotlightCard className="p-6 h-full flex flex-col justify-center items-center text-center group min-h-[160px] hover:-translate-y-1 transition-all duration-300">
                            <AnimatedCounter target={10} suffix="+" className="text-5xl font-black text-[var(--text-main)] transition-colors" />
                            <p className="text-[10px] text-[var(--text-muted)] font-mono tracking-[0.2em] mt-3 uppercase">Projects Built</p>
                        </SpotlightCard>
                    </motion.div>

                    {/* about.json — nod to modern dev portfolios */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={delay(4)}
                        className="md:col-span-4 lg:col-span-2 lg:row-span-1"
                    >
                        <AboutJsonSnippet
                            name={name}
                            role={title}
                            location={location}
                            interests={skillInterests.length ? skillInterests : interestsFallback}
                            currentlyLearning="Sharpening platform & reliability patterns"
                            funFact="I'll happily trade sleep for a cleaner architecture."
                        />
                    </motion.div>

                    {/* Resume CTA card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={delay(5)}
                        className="md:col-span-4 lg:col-span-2"
                    >
                        <SpotlightCard
                            className="p-6 h-full cursor-pointer group relative overflow-hidden"
                            spotlightColor="rgba(56, 189, 248, 0.15)"
                        >
                            <div onClick={() => window.open(resumeUrl, '_blank')} className="flex flex-col md:flex-row justify-between items-center h-full relative z-10 gap-4" data-cursor="view">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                                        <Download className="w-5 h-5 text-sky-400 group-hover:-translate-y-1 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                                            Download Resume
                                        </p>
                                        <p className="text-[11px] text-zinc-500 font-mono tracking-wider mt-1">Full detailed PDF • Updated 2026</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors group-hover:rotate-45">
                                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            {/* Abstract glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm z-0" />
                        </SpotlightCard>
                    </motion.div>
                </div>
            </MouseGlow>
        </SectionWrapper>
    );
}
