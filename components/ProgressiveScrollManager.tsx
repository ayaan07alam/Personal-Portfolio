'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollSection {
    id: string;
    progressSteps: number; // How many scroll steps before moving to next section
}

const sections: ScrollSection[] = [
    { id: 'hero', progressSteps: 1 },
    { id: 'about', progressSteps: 3 }, // Title, content, stats
    { id: 'skills', progressSteps: 4 }, // Title + 3 skill categories
    { id: 'projects', progressSteps: 4 }, // Title + 3 projects
    { id: 'experience', progressSteps: 3 }, // Title + 2 experiences
    { id: 'education', progressSteps: 2 }, // Title + education card
    { id: 'contact', progressSteps: 3 }, // Title, cards, social
];

export default function ProgressiveScrollManager() {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [sectionProgress, setSectionProgress] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        let lastScrollTime = 0;
        const scrollThreshold = 500; // Minimum time between scroll steps (ms)

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const now = Date.now();
            if (now - lastScrollTime < scrollThreshold || isScrolling) return;
            lastScrollTime = now;

            const scrollingDown = e.deltaY > 0;
            const currentSection = sections[currentSectionIndex];

            if (scrollingDown) {
                // Scrolling down
                if (sectionProgress < currentSection.progressSteps) {
                    // Still revealing content in current section
                    setSectionProgress(prev => prev + 1);
                } else if (currentSectionIndex < sections.length - 1) {
                    // Move to next section
                    setIsScrolling(true);
                    setCurrentSectionIndex(prev => prev + 1);
                    setSectionProgress(0);

                    // Scroll to next section smoothly
                    const nextSection = document.getElementById(sections[currentSectionIndex + 1].id);
                    nextSection?.scrollIntoView({ behavior: 'smooth' });

                    setTimeout(() => setIsScrolling(false), 1000);
                }
            } else {
                // Scrolling up
                if (sectionProgress > 0) {
                    // Hide content in current section
                    setSectionProgress(prev => prev - 1);
                } else if (currentSectionIndex > 0) {
                    // Move to previous section
                    setIsScrolling(true);
                    setCurrentSectionIndex(prev => prev - 1);
                    setSectionProgress(sections[currentSectionIndex - 1].progressSteps);

                    // Scroll to previous section
                    const prevSection = document.getElementById(sections[currentSectionIndex - 1].id);
                    prevSection?.scrollIntoView({ behavior: 'smooth' });

                    setTimeout(() => setIsScrolling(false), 1000);
                }
            }

            // Broadcast progress event for sections to listen to
            window.dispatchEvent(new CustomEvent('scrollProgress', {
                detail: {
                    sectionId: sections[currentSectionIndex].id,
                    progress: sectionProgress,
                    totalSteps: currentSection.progressSteps
                }
            }));
        };

        // Prevent default scroll behavior
        window.addEventListener('wheel', handleWheel, { passive: false });

        // Disable native scroll-snap temporarily
        document.documentElement.style.scrollSnapType = 'none';

        return () => {
            window.removeEventListener('wheel', handleWheel);
            document.documentElement.style.scrollSnapType = 'y mandatory';
        };
    }, [currentSectionIndex, sectionProgress, isScrolling]);

    return (
        <div className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-sm hidden">
            <div>Section: {sections[currentSectionIndex].id}</div>
            <div>Progress: {sectionProgress}/{sections[currentSectionIndex].progressSteps}</div>
        </div>
    );
}
