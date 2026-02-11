'use client';

import { supabase } from '@/lib/supabase/client';

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, User, Layers, Mail, ArrowUp, FileText, Code2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useScrollSpy } from '@/hooks/use-scroll-spy';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const [resumeUrl, setResumeUrl] = useState('/resume.pdf');

    useEffect(() => {
        const fetchResume = async () => {
            const { data } = await supabase.from('hero_section').select('resume_url').single();
            if (data?.resume_url) {
                setResumeUrl(data.resume_url);
            }
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
        { name: 'Contact', href: '#contact', id: 'contact', icon: Mail },
    ];

    const activeId = useScrollSpy(navItems.map(item => item.id), 50); // 50px offset

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4 w-full pointer-events-none">

            {/* Scroll to Top - Only appears when scrolled */}
            <AnimatePresence>
                {scrolled && (
                    <motion.button
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="p-3 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-colors mb-2 backdrop-blur-md pointer-events-auto"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Cloud/Floating Dock */}
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                className="pointer-events-auto bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-1 overflow-x-auto max-w-[90vw] md:max-w-none scrollbar-hide"
            >
                {navItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`relative px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 group outline-none
                                ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}
                            `}
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            {/* Animated Background Pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="navbar-active-pill"
                                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <span className="relative z-10 flex items-center justify-center">
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            </span>

                            {/* Label - Visible on Desktop, condensed on Mobile */}
                            <span className="relative z-10 text-sm font-medium hidden md:block">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

                <div className="w-px h-6 bg-white/10 mx-2" />

                <a
                    href={resumeUrl}
                    target="_blank"
                    className="relative px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 group"
                >
                    <FileText className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-sm font-medium hidden md:block">Resume</span>
                </a>

            </motion.nav>
        </div>
    );
}
