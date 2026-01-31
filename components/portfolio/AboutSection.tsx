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
        content: "Software Development Engineer with deep expertise in scalable backend systems. Experience in Java & Spring Boot. Proven track record of building production-ready EdTech platforms, job portals, and CRM applications.",
        resume_url: "/resume",
        image: null
    };

    const hasImage = content.image && content.image.trim() !== '';

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-background">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-20 pl-20 pr-20 items-center">

                    {/* 1. Title Card */}
                    <div className="relative h-[70vh] w-[80vw] md:w-[40vw] flex-shrink-0 flex flex-col justify-end p-10 bg-zinc-900 rounded-3xl border border-zinc-800">
                        <span className="text-brand-400 font-mono text-sm tracking-widest mb-4">01. PROFILE</span>
                        <h2 className="text-6xl md:text-8xl font-black text-zinc-100 leading-none mb-6">
                            {content.title.split(' ')[0]}<br />{content.title.split(' ').slice(1).join(' ')}
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-md">
                            A digital craftsman focussed on scalable systems & engineering.
                        </p>
                    </div>

                    {/* 2. Optional Photo Card - Only appears if image exists */}
                    {hasImage && (
                        <div className="relative h-[70vh] w-[80vw] md:w-[35vw] flex-shrink-0 rounded-3xl overflow-hidden border border-zinc-800 group">
                            <Image
                                src={content.image!}
                                alt="Profile"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                            <div className="absolute bottom-8 left-8">
                                <p className="text-white font-mono text-sm tracking-widest">PORTRAIT</p>
                            </div>
                        </div>
                    )}

                    {/* 3. Bio Card */}
                    <div className="relative h-[70vh] w-[90vw] md:w-[50vw] flex-shrink-0 bg-zinc-900 rounded-3xl p-10 md:p-16 border border-zinc-800 flex flex-col justify-center">
                        <p className="text-2xl md:text-4xl text-zinc-300 font-semibold leading-relaxed">
                            {content.content}
                        </p>
                        <div className="mt-12 flex gap-8">
                            <div>
                                <h4 className="text-zinc-500 text-sm tracking-widest uppercase mb-2">Experience</h4>
                                <p className="text-4xl font-bold text-brand-400">2+ Years</p>
                            </div>
                            <div>
                                <h4 className="text-zinc-500 text-sm tracking-widest uppercase mb-2">Projects</h4>
                                <p className="text-4xl font-bold text-violet-400">Production</p>
                            </div>
                        </div>
                    </div>

                    {/* 4. Philosophy Card */}
                    <div className="relative h-[70vh] w-[80vw] md:w-[40vw] flex-shrink-0 bg-brand-500/10 rounded-3xl p-10 border border-brand-500/20 flex flex-col justify-between">
                        <h3 className="text-4xl font-bold text-brand-300">Core Focus</h3>
                        <ul className="space-y-6 text-xl text-zinc-300">
                            <li className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-brand-400 rounded-full"></span>
                                Scalable Backend Systems
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-brand-400 rounded-full"></span>
                                API Design & Security
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-brand-400 rounded-full"></span>
                                System Optimization
                            </li>
                        </ul>
                        <a href={content.resume_url || '/resume'} className="self-start px-8 py-4 bg-brand-400 text-black font-bold rounded-full hover:bg-lavender-300 transition-colors">
                            View Full Resume
                        </a>
                    </div>

                    <div className="w-[10vw]"></div>
                </motion.div>
            </div>
        </section>
    );
}
