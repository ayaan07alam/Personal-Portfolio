'use client';

import { useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { motion, useScroll, useTransform } from 'framer-motion';

const PHILOSOPHY_TEXT =
    'I build premium digital experiences. Not just websites, but performant, scalable architectures that blend state-of-the-art engineering with breathtaking design.';

/** Opacity scroll effect had floor 0.15 — unreadable on dark bg. Raised + widened illuminate band. */
function PhilosophyWord({
    word,
    index,
    total,
    scrollYProgress,
}: {
    word: string;
    index: number;
    total: number;
    scrollYProgress: MotionValue<number>;
}) {
    const start = index / total;
    const end = Math.min(start + 1 / total, 1);
    const fade = Math.max(0.05, (1 / total) * 0.45);

    const opacity = useTransform(
        scrollYProgress,
        [
            Math.max(0, start - fade),
            start,
            (start + end) / 2,
            end,
            Math.min(1, end + fade),
        ],
        [0.62, 0.95, 1, 0.95, 0.62],
    );

    const stripped = word.replace(/[^\p{L}-]/gu, '');
    const isAccent = /^(premium|breathtaking|engineering|design|experiences)$/iu.test(stripped);

    return (
        <motion.span
            style={{
                opacity,
                textShadow: isAccent ? undefined : '0 1px 40px rgba(0,0,0,0.75)',
            }}
            className={`font-display inline-block pb-1 align-baseline text-4xl font-extrabold leading-[1.12] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-[clamp(3rem,5.5vw,4.85rem)] ${
                isAccent
                    ? 'gradient-text brightness-110 saturate-125 drop-shadow-[0_0_32px_rgba(139,92,246,0.25)]'
                    : 'text-zinc-100'
            }`}
        >
            {word}
        </motion.span>
    );
}

export default function PhilosophySection() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 82%', 'end 18%'],
    });

    const words = PHILOSOPHY_TEXT.split(' ');
    const total = words.length;

    return (
        <section ref={containerRef} id="philosophy" className="relative min-h-[120vh] overflow-hidden bg-[#000000] py-28 md:py-36">
            <div aria-hidden className="pointer-events-none absolute inset-0 mesh-gradient opacity-50" />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.07)_0%,transparent_62%)]"
            />

            <div className="sticky top-0 flex min-h-[100svh] items-center px-6 py-[max(4rem,calc(env(safe-area-inset-bottom)+5rem))] md:px-10">
                <div className="relative z-10 mx-auto flex max-w-[min(1120px,100%)] flex-wrap justify-center gap-x-[0.4em] gap-y-[0.35em] text-center md:justify-center md:gap-x-[0.5em] md:gap-y-[0.4em]">
                    {words.map((word, i) => (
                        <PhilosophyWord
                            key={`${word}-${i}`}
                            word={word}
                            index={i}
                            total={total}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>

                {/* Static fallback readability if motion values lag on some GPUs */}
                <p className="sr-only">{PHILOSOPHY_TEXT}</p>
            </div>
        </section>
    );
}
