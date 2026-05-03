'use client';

import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, User, Layers, Mail, ArrowUp, FileText, Code2, Briefcase, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useScrollSpy } from '@/hooks/use-scroll-spy';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            const { data } = await supabase.from('hero_section').select('resume_url').single();
            if (data?.resume_url) setResumeUrl(data.resume_url);
        };
        fetchResume();
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 100);
    });

    const navItems = [
        { name: 'Home', href: '#home', id: 'home', icon: Home },
        { name: 'About', href: '#about', id: 'about', icon: User },
        { name: 'Projects', href: '#projects', id: 'projects', icon: Layers },
        { name: 'Skills', href: '#skills', id: 'skills', icon: Code2 },
        { name: 'Experience', href: '#experience', id: 'experience', icon: Briefcase },
        { name: 'Reviews', href: '#reviews', id: 'reviews', icon: MessageSquareQuote },
        { name: 'Contact', href: '#contact', id: 'contact', icon: Mail },
    ];

    const activeId = useScrollSpy(navItems.map(item => item.id), 50);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 pointer-events-none">

            {/* Scroll to Top */}
            <AnimatePresence>
                {scrolled && (
                    <motion.button
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="p-2.5 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-colors pointer-events-auto"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Floating Icon Pill */}
            <motion.nav
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 22 }}
                className="pointer-events-auto bg-white/[0.05] backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.1] rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.05] flex items-center gap-0.5"
            >
                {navItems.map((item) => {
                    const isActive = activeId === item.id;
                    const isHovered = hoveredItem === item.id;
                    return (
                        <div key={item.id} className="relative">
                            <Link
                                href={item.href}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`relative p-3 rounded-xl transition-all duration-200 flex items-center justify-center outline-none
                                    ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                                `}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-white/[0.08] rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    />
                                )}

                                {/* Active dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-dot"
                                        className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-400"
                                        style={{ boxShadow: '0 0 6px rgba(139,92,246,0.8)' }}
                                    />
                                )}

                                <item.icon className="relative z-10 w-[18px] h-[18px]" />
                            </Link>

                            {/* Tooltip */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.08] text-[10px] text-zinc-300 font-medium whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}

                <div className="w-px h-5 bg-white/[0.06] mx-0.5" />

                <div className="relative">
                    <a
                        href={resumeUrl}
                        target="_blank"
                        onMouseEnter={() => setHoveredItem('resume')}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative p-3 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center"
                    >
                        <FileText className="w-[18px] h-[18px]" />
                    </a>
                    <AnimatePresence>
                        {hoveredItem === 'resume' && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.08] text-[10px] text-zinc-300 font-medium whitespace-nowrap"
                            >
                                Resume
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>
        </div>
    );
}
