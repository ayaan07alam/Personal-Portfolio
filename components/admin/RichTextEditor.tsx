'use client';

import { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, Type } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    label?: string;
    placeholder?: string;
    minHeight?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    label,
    placeholder = 'Start typing...',
    minHeight = '150px'
}: RichTextEditorProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Initialize content
    useEffect(() => {
        if (contentRef.current && value !== contentRef.current.innerHTML) {
            // Only update if content is different to avoid cursor jumping
            // This is a simple check; for production might need more robust diffing
            // But for this use case (admin editing), it's usually fine if we only set on mount 
            // or if value changes externally (not from typing)
            if (document.activeElement !== contentRef.current) {
                contentRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const handleInput = () => {
        if (contentRef.current) {
            const html = contentRef.current.innerHTML;
            onChange(html);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (contentRef.current) {
            contentRef.current.focus();
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}

            <div className={`
                glass overflow-hidden rounded-lg border transition-all duration-200
                ${isFocused ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-white/10'}
            `}>
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/5">
                    <ToolbarButton
                        icon={<Bold className="w-4 h-4" />}
                        onClick={() => execCommand('bold')}
                        title="Bold"
                    />
                    <ToolbarButton
                        icon={<Italic className="w-4 h-4" />}
                        onClick={() => execCommand('italic')}
                        title="Italic"
                    />
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <ToolbarButton
                        icon={<List className="w-4 h-4" />}
                        onClick={() => execCommand('insertUnorderedList')}
                        title="Bullet List"
                    />
                </div>

                {/* Editor Area */}
                <div
                    ref={contentRef}
                    contentEditable
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full px-4 py-3 text-white focus:outline-none min-h-[150px] max-h-[400px] overflow-y-auto rich-text-content"
                    style={{ minHeight }}
                    data-placeholder={placeholder}
                />
            </div>
            <style jsx global>{`
                .rich-text-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                }
                .rich-text-content b, .rich-text-content strong {
                    font-weight: bold;
                    color: white;
                }
                .rich-text-content i, .rich-text-content em {
                    font-style: italic;
                }
                .rich-text-content:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}

function ToolbarButton({ icon, onClick, title }: { icon: React.ReactNode, onClick: () => void, title: string }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
            {icon}
        </button>
    );
}
