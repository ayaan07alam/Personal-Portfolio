'use client';

import Link from 'next/link';

export default function BrandLogo() {
    return (
        <div className="fixed top-6 left-6 md:top-8 md:left-12 z-50 mix-blend-difference">
            <Link href="/" className="group cursor-none">
                <span className="font-sans font-bold text-xl tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                    Ayaan<span className="font-light text-zinc-500 group-hover:text-zinc-400">Alam</span>
                    <span className="text-brand-500 inline-block animate-pulse">.</span>
                </span>
            </Link>
        </div>
    );
}
