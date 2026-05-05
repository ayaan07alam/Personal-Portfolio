'use client';

import { motion } from 'framer-motion';

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
            {/* Ambient Deep Glows */}
            <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-brand-500/10 blur-[120px]" />
            <div className="absolute top-[40%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-sky-500/10 blur-[150px]" />
            <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 blur-[100px]" />

            {/* Continuous Vertical Data Streams (Matrix effect simplified) */}
            <div className="absolute inset-0 opacity-[0.15]">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-brand-400 to-transparent"
                        style={{ left: `${(i + 1) * 8.33}%`, top: 0 }}
                        animate={{
                            y: ['-100%', '100%'],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * -10
                        }}
                    />
                ))}
            </div>

            {/* Moving Perspective Grid */}
            <motion.div 
                className="absolute inset-[-100%] origin-center opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)'
                }}
                animate={{
                    backgroundPosition: ['0px 0px', '0px 60px']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Noise / grain overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
            />
        </div>
    );
}
