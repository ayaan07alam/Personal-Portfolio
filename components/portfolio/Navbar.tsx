'use client';

import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Layers, Mail, ArrowUp, Code2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { useScroll, useMotionValueEvent } from 'framer-motion';

// Only 5 core nav items for mobile — clean and uncluttered
const MOBILE_NAV = [
    { name: 'Home',       href: '#home',       id: 'home',       icon: Home },
    { name: 'About',      href: '#about',      id: 'about',      icon: User },
    { name: 'Skills',     href: '#skills',     id: 'skills',     icon: Code2 },
    { name: 'Projects',   href: '#projects',   id: 'projects',   icon: Layers },
    { name: 'Experience', href: '#experience', id: 'experience', icon: Briefcase },
    { name: 'Contact',    href: '#contact',    id: 'contact',    icon: Mail },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 120);
    });

    const activeId = useScrollSpy(MOBILE_NAV.map((i) => i.id), 80);

    const go = (href: string) => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        /* Only shown on mobile (< lg) */
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">

            {/* Scroll-to-top FAB — appears after scrolling */}
            <AnimatePresence>
                {scrolled && (
                    <motion.button
                        key="fab"
                        initial={{ opacity: 0, scale: 0.7, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="pointer-events-auto absolute -top-14 right-4 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] active:scale-95 transition-transform"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Bottom navigation bar */}
            <nav
                aria-label="Mobile navigation"
                className="pointer-events-auto w-full bg-black/80 backdrop-blur-xl border-t border-white/[0.08] pb-[env(safe-area-inset-bottom)]"
            >
                <div className="flex items-center justify-around px-2 h-16">
                    {MOBILE_NAV.map((item) => {
                        const isActive = activeId === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => go(item.href)}
                                className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full outline-none active:scale-95 transition-transform"
                                aria-label={item.name}
                            >
                                {/* Active glow pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-pill"
                                        className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-brand-500/15"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <Icon
                                    className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
                                        isActive ? 'text-brand-400' : 'text-zinc-500'
                                    }`}
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                />
                                <span
                                    className={`relative z-10 text-[10px] font-medium transition-colors duration-200 ${
                                        isActive ? 'text-brand-400' : 'text-zinc-600'
                                    }`}
                                >
                                    {item.name}
                                </span>
                                {/* Active indicator dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-dot"
                                        className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-400"
                                        style={{ boxShadow: '0 0 6px rgba(167,139,250,0.8)' }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
