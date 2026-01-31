'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, User, Layers, Mail, ArrowUp, FileText, Code2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility, or I will inline it

export default function FloatingDock() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 100);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navItems = [
        { name: 'Home', href: '#', icon: Home },
        { name: 'About', href: '#about', icon: User },
        { name: 'Projects', href: '#projects', icon: Layers },
        { name: 'Skills', href: '#skills', icon: Code2 },
        { name: 'Contact', href: '#contact', icon: Mail },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">

            {/* Scroll to Top - Only appears when scrolled */}
            <AnimatePresence>
                {scrolled && (
                    <motion.button
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="p-3 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-colors mb-2"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* The Dock */}
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center gap-2 p-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5"
            >
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="relative group p-3 rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.name}
                        </span>

                        <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />

                        {/* Active Dot (Optional logic could go here) */}
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                ))}

                <div className="w-px h-6 bg-white/10 mx-1" />

                <a
                    href="/resume.pdf"
                    target="_blank"
                    className="relative group p-3 rounded-full hover:bg-white/10 transition-all duration-300"
                >
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Resume
                    </span>
                    <FileText className="w-5 h-5 text-zinc-400 group-hover:text-tech-400 transition-colors" />
                </a>

            </motion.nav>
        </div>
    );
}
