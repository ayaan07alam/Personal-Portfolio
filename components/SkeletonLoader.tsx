'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`glass-card rounded-xl p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg shimmer" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4 shimmer" />
                        <div className="h-3 bg-white/10 rounded w-1/2 shimmer" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded shimmer" />
                    <div className="h-3 bg-white/10 rounded w-5/6 shimmer" />
                    <div className="h-3 bg-white/10 rounded w-4/6 shimmer" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonText({ className = '', lines = 3 }: SkeletonProps & { lines?: number }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-3 bg-white/10 rounded shimmer"
                    style={{ width: i === lines - 1 ? '66%' : '100%' }}
                />
            ))}
        </div>
    );
}

export function SkeletonImage({ className = '' }: SkeletonProps) {
    return (
        <div className={`relative bg-white/5 rounded-lg overflow-hidden ${className}`}>
            <div className="absolute inset-0 shimmer" />
        </div>
    );
}

export function SkeletonGrid({
    columns = 3,
    rows = 2,
    className = ''
}: {
    columns?: number;
    rows?: number;
    className?: string;
}) {
    return (
        <div className={`grid gap-6 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns * rows }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 glass-card rounded-lg">
                    <div className="h-8 w-8 bg-white/10 rounded shimmer" />
                    <div className="flex-1 h-4 bg-white/10 rounded shimmer" />
                    <div className="h-4 w-24 bg-white/10 rounded shimmer" />
                    <div className="h-4 w-16 bg-white/10 rounded shimmer" />
                </div>
            ))}
        </div>
    );
}

// Stat card skeleton for admin dashboard
export function SkeletonStatCard() {
    return (
        <div className="glass-card rounded-xl p-6">
            <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-white/10 rounded w-1/3 shimmer" />
                    <div className="w-10 h-10 bg-white/10 rounded-lg shimmer" />
                </div>
                <div className="h-8 bg-white/10 rounded w-1/2 shimmer" />
                <div className="h-3 bg-white/10 rounded w-2/3 shimmer" />
            </div>
        </div>
    );
}

// Project card skeleton
export function SkeletonProjectCard() {
    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            <SkeletonImage className="h-64 w-full" />
            <div className="p-6 space-y-4">
                <div className="h-6 bg-white/10 rounded w-3/4 shimmer" />
                <SkeletonText lines={3} />
                <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 w-20 bg-white/10 rounded-full shimmer" />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Experience timeline skeleton
export function SkeletonTimeline({ items = 3 }: { items?: number }) {
    return (
        <div className="space-y-8">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-4 h-4 bg-brand-500/30 rounded-full shimmer" />
                        {i < items - 1 && <div className="w-px h-full bg-white/10" />}
                    </div>
                    <div className="flex-1 pb-8">
                        <SkeletonCard />
                    </div>
                </div>
            ))}
        </div>
    );
}
