'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading or wait for assets
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2s intro duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence mode='wait'>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                >
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="w-2 h-2 bg-lavender-400 rounded-full animate-pulse"></div>
                            <span className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Initializing</span>
                        </motion.div>

                        <div className="overflow-hidden h-16 md:h-24 relative">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                className="text-6xl md:text-8xl font-black text-zinc-100 tracking-tighter"
                            >
                                PORTFOLIO
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden h-16 md:h-24 relative">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black text-zinc-100 tracking-tighter"
                            >
                                2024
                            </motion.h1>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
