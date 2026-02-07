'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Home, User, Layers, Mail, ArrowUp, FileText, Code2, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function FloatingDock() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 100);
    });

    useEffect(() => {
        const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.2, rootMargin: "-20% 0px -35% 0px" }
        );

        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navItems = [
        { name: 'Home', href: '#home', id: 'home', icon: Home },
        { name: 'About', href: '#about', id: 'about', icon: User },
        { name: 'Experience', href: '#experience', id: 'experience', icon: Briefcase },
        { name: 'Projects', href: '#projects', id: 'projects', icon: Layers },
        { name: 'Skills', href: '#skills', id: 'skills', icon: Code2 },
        { name: 'Contact', href: '#contact', id: 'contact', icon: Mail },
    ];

    let mouseX = useMotionValue(Infinity);

    return (
        <div
            className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >

            {/* Scroll to Top - Only appears when scrolled */}
            <AnimatePresence>
                {scrolled && (
                    <motion.button
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="p-3 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-colors mb-2 backdrop-blur-md"
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
                className="flex items-end gap-2 px-4 py-3 rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5"
            >
                {navItems.map((item) => (
                    <DockIcon
                        key={item.name}
                        mouseX={mouseX}
                        item={item}
                        isActive={activeSection === item.id}
                    />
                ))}

                <div className="w-px h-8 bg-white/10 mx-1 self-center" />

                <a
                    href="/resume.pdf"
                    target="_blank"
                    className="relative group p-3 rounded-xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center"
                >
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none mb-1">
                        Resume
                    </span>
                    <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                </a>

            </motion.nav>
        </div>
    );
}

function DockIcon({ mouseX, item, isActive }: { mouseX: any, item: any, isActive: boolean }) {
    let ref = useRef<HTMLAnchorElement>(null);

    let distance = useTransform(mouseX, (val: number) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    let widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <Link href={item.href} legacyBehavior>
            <motion.a
                ref={ref}
                style={{ width, height: width }}
                className={`relative group rounded-xl flex items-center justify-center transition-colors duration-300
                    ${isActive ? 'bg-brand-500/20 border border-brand-500/50' : 'hover:bg-white/10 border border-transparent'}
                `}
            >
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none mb-1">
                    {item.name}
                </span>

                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-400' : 'text-zinc-400 group-hover:text-white'}`} />

                {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-500 shadow-[0_0_10px_2px_rgba(139,92,246,0.5)]" />
                )}
            </motion.a>
        </Link>
    );
}
