'use client';

import { Plus } from 'lucide-react';

interface AddButtonProps {
    onClick: () => void;
    label: string;
}

export default function AddButton({ onClick, label }: AddButtonProps) {
    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all active:scale-95"
        >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="font-medium">{label}</span>
        </button>
    );
}
