'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PHILOSOPHY_TEXT = "I build premium digital experiences. Not just websites, but performant, scalable architectures that blend state-of-the-art engineering with breathtaking design.";

export default function PhilosophySection() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const words = PHILOSOPHY_TEXT.split(" ");

    return (
        <section ref={containerRef} className="relative min-h-[150vh] bg-[#050507] py-32 flex items-center justify-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0 mesh-gradient opacity-40" aria-hidden />
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-10">
                <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-5 md:gap-y-4">
                    {words.map((word, i) => {
                        // Calculate start and end points for each word based on its index
                        const start = i / words.length;
                        const end = start + (1 / words.length);
                        
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
                        
                        return (
                            <motion.span
                                key={i}
                                style={{ opacity }}
                                className={`font-display text-4xl md:text-6xl lg:text-[5.25rem] font-extrabold tracking-[-0.035em] leading-[1.08] md:leading-[1.08] ${
                                  word.match(/premium|breathtaking|engineering/i) ? 'gradient-text' : 'text-white'
                                }`}
                            >
                                {word}
                            </motion.span>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
