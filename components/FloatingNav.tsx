'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Home, User, Layers, Mail, ArrowUp } from 'lucide-react';

export default function FloatingNav() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const links = [
        { name: 'Home', icon: Home, href: '#hero' },
        { name: 'About', icon: User, href: '#about' },
        { name: 'Work', icon: Layers, href: '#projects' },
        { name: 'Contact', icon: Mail, href: '#contact' },
    ];

    return (
        <motion.div
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: 100, opacity: 0 }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed bottom-10 inset-x-0 mx-auto w-fit z-[100] hidden md:block"
        >
            <div className="flex items-center gap-2 px-3 py-3 glass-panel rounded-full relative">
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="relative cursor-pointer cursor-trigger p-3 rounded-full hover:bg-white/10 transition-colors group"
                    >
                        <link.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {link.name}
                        </span>
                    </a>
                ))}

                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="p-3 rounded-full bg-lavender-400 hover:bg-lavender-300 transition-colors cursor-trigger"
                >
                    <ArrowUp className="w-5 h-5 text-black" />
                </button>
            </div>
        </motion.div>
    );
}
