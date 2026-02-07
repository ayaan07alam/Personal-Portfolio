'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import type { AboutSection as AboutType } from '@/types';

export default function AboutSection() {
    const [data, setData] = useState<AboutType | null>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-65%"]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: aboutData } = await supabase.from('about_section').select('*').single();
                if (aboutData) setData(aboutData);
            } catch (error) { console.error(error); }
        }
        fetchData();
    }, []);

    const content = data || {
        title: "AYAAN ALAM",
        content: "Software Development Engineer with hands-on experience in designing, developing, and deploying scalable backend and full-stack web applications. Strong expertise in Java, Spring Boot, RESTful APIs, databases, authentication systems, and modern frontend frameworks. Experienced in building production-ready learning platforms, job portals, CRM systems, and content-driven web applications.",
        resume_url: "/resume",
        image: null
    };

    const hasImage = content.image && content.image.trim() !== '';

    return (
        <section id="about" ref={targetRef} className="relative h-[300vh] bg-background">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                {/* Horizontal Scroll Progress Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="text-xs text-zinc-500 font-mono">SCROLL  →</div>
                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
                        />
                    </div>
                </motion.div>

                <motion.div style={{ x }} className="flex gap-20 pl-20 pr-20 items-center">

                    {/* 1. Title Card */}
                    <div className="relative h-[70vh] w-[80vw] md:w-[40vw] flex-shrink-0 flex flex-col justify-end p-10 bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5 hover:border-brand-500/20 transition-colors duration-500 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                        <span className="text-brand-400 font-mono text-sm tracking-[0.2em] mb-4 relative z-10 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-brand-400"></span>
                            01. PROFILE
                        </span>
                        <h2 className="text-6xl md:text-8xl font-black text-white leading-none mb-6 relative z-10 drop-shadow-xl">
                            {content.title.split(' ')[0]}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
                                {content.title.split(' ').slice(1).join(' ')}
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-md relative z-10 border-l-2 border-brand-500/30 pl-4">
                            A digital craftsman focussed on scalable systems & engineering.
                        </p>
                    </div>

                    {/* 2. Optional Photo Card - Only appears if image exists */}
                    {hasImage && (
                        <div className="relative h-[70vh] w-[80vw] md:w-[35vw] flex-shrink-0 rounded-3xl overflow-hidden border border-white/10 group">
                            <Image
                                src={content.image!}
                                alt="Ayaan Alam - Software Engineer Profile"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-8 left-8">
                                <p className="text-white font-mono text-sm tracking-widest bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">PORTRAIT</p>
                            </div>
                        </div>
                    )}

                    {/* 3. Bio Card */}
                    <div className="relative h-[70vh] w-[90vw] md:w-[50vw] flex-shrink-0 bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/5 flex flex-col justify-between overflow-y-auto hover:border-white/10 transition-colors duration-300">
                        <div className="flex-1 flex flex-col justify-center relative z-10">
                            <p className="text-xl md:text-3xl text-zinc-200 font-light leading-relaxed">
                                {content.content}
                            </p>
                        </div>
                        <div className="mt-6 flex gap-12 border-t border-white/5 pt-8 relative z-10">
                            <div>
                                <h4 className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Experience</h4>
                                <p className="text-3xl md:text-4xl font-bold text-white flex items-baseline gap-1">
                                    2+ <span className="text-base font-normal text-brand-400">Years</span>
                                </p>
                            </div>
                            <div>
                                <h4 className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Projects</h4>
                                <p className="text-3xl md:text-4xl font-bold text-white flex items-baseline gap-1">
                                    Production <span className="text-base font-normal text-teal-400">Ready</span>
                                </p>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    </div>

                    {/* 4. Philosophy Card */}
                    <div className="relative h-[70vh] w-[80vw] md:w-[40vw] flex-shrink-0 bg-gradient-to-br from-brand-900/20 to-zinc-900/80 rounded-3xl p-10 border border-brand-500/20 flex flex-col justify-between backdrop-blur-sm group hover:bg-brand-900/30 transition-colors duration-500">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono mb-6">
                                PHILOSOPHY
                            </span>
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">Core Focus</h3>
                            <ul className="space-y-6">
                                {[
                                    "Scalable Backend Systems",
                                    "API Design & Security",
                                    "System Optimization"
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + (i * 0.2) }}
                                        className="flex items-center gap-4 text-xl text-zinc-300 group-hover:text-white transition-colors"
                                    >
                                        <span className="w-10 h-[1px] bg-brand-500/50 group-hover:w-16 transition-all duration-300"></span>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href={content.resume_url || '/resume'}
                            className="self-start px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-brand-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 group/btn"
                        >
                            View Full Resume
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </motion.a>
                    </div>

                    <div className="w-[10vw]"></div>
                </motion.div>
            </div>
        </section>
    );
}
