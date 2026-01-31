'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];

export default function SectionIndicator() {
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            const sectionElements = sections.map(id => document.getElementById(id));

            sectionElements.forEach((section, index) => {
                if (section) {
                    const { offsetTop, offsetHeight } = section;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(index);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (index: number) => {
        const section = document.getElementById(sections[index]);
        section?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
            {sections.map((section, index) => (
                <button
                    key={section}
                    onClick={() => scrollToSection(index)}
                    className="group relative"
                    aria-label={`Go to ${section} section`}
                >
                    <motion.div
                        className={`w-3 h-3 rounded-full transition-all ${activeSection === index
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-4 h-4'
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                        whileHover={{ scale: 1.3 }}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </span>
                </button>
            ))}
        </div>
    );
}
