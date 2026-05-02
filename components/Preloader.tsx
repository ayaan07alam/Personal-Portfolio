'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';

        const duration = 2000; // 2 seconds loading
        const interval = 20; // update every 20ms
        const steps = duration / interval;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const newProgress = Math.min(Math.round((step / steps) * 100), 100);
            
            // Custom easing function for the counter (starts fast, slows down at end)
            const easeOutQuart = 1 - Math.pow(1 - (step / steps), 4);
            const easedProgress = Math.min(Math.round(easeOutQuart * 100), 100);
            
            setProgress(easedProgress);

            if (step >= steps) {
                clearInterval(timer);
                setTimeout(() => {
                    setIsLoading(false);
                    document.body.style.overflow = '';
                }, 500); // Wait a bit at 100% before disappearing
            }
        }, interval);

        return () => {
            clearInterval(timer);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: '-100%' }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050507]"
                >
                    <div className="absolute inset-0 z-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
                    
                    {/* Minimalist Counter */}
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-[15vw] md:text-[8rem] font-black leading-none text-white tracking-tighter"
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {progress}
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="h-[2px] bg-white mt-4 origin-left"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute bottom-10 left-10 md:bottom-12 md:left-12 flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">System Initialization</span>
                        <span className="text-[10px] font-mono text-brand-400 uppercase tracking-[0.2em]">Loading Assets...</span>
                    </div>
                    
                    <div className="absolute bottom-10 right-10 md:bottom-12 md:right-12">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Ayaan Alam © 2026</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
