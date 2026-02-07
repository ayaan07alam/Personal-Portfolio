'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
            {/* Animated icon container */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="relative mb-6"
            >
                {/* Pulsing background */}
                <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-2xl animate-pulse" />

                {/* Icon container */}
                <div className="relative w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-brand-400" />
                </div>
            </motion.div>

            {/* Content */}
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white mb-2"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-400 max-w-md mb-6"
            >
                {description}
            </motion.p>

            {/* Action button */}
            {action && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={action.onClick}
                    className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    );
}
