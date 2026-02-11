'use client';

import { useState, useEffect } from 'react';

// Robust "Last Section Passed" Scroll Spy
export function useScrollSpy(ids: string[], offset: number = 0) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const listener = () => {
            const scroll = window.scrollY;
            const centerLine = scroll + window.innerHeight / 3; // Focus on top-third for natural reading flow

            let current = ids[0]; // Default to first

            for (const id of ids) {
                const element = document.getElementById(id);
                if (!element) continue;

                // Get absolute position on the page, regardless of nesting
                const rect = element.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;

                // Check if the top of the section is above the center line
                if (absoluteTop - offset <= centerLine) {
                    current = id;
                }
            }

            setActiveId(current);
        };

        listener();
        window.addEventListener('scroll', listener, { passive: true });
        window.addEventListener('resize', listener, { passive: true }); // Re-calculate on resize
        return () => {
            window.removeEventListener('scroll', listener);
            window.removeEventListener('resize', listener);
        };
    }, [ids, offset]);

    return activeId;
}
