'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import StarfieldBackground from '@/components/StarfieldBackground';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import EducationSection from '@/components/portfolio/EducationSection';
import ContactSection from '@/components/portfolio/ContactSection';
import SmoothCursor from '@/components/SmoothCursor';
import Preloader from '@/components/Preloader';
import FloatingNav from '@/components/FloatingNav';

import AchievementsSection from '@/components/portfolio/AchievementsSection';

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-black selection:bg-indigo-500/30 selection:text-white relative">
      {/* Animated Starfield Background */}
      <StarfieldBackground />

      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        initial={{ scale: 0 }}
        animate={{ scale: showBackToTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <HeroSection />

      {/* Section Separator */}
      <div className="section-separator container mx-auto" />

      <div className="relative z-10">
        <AboutSection />
      </div>

      {/* Section Separator */}
      <div className="section-separator container mx-auto" />

      <div className="relative z-20">
        <ProjectsSection />
      </div>

      {/* Section Separator */}
      <div className="section-separator container mx-auto" />

      <div className="relative z-30">
        <SkillsSection />

        {/* Section Separator */}
        <div className="section-separator container mx-auto" />

        <ExperienceSection />

        {/* Section Separator */}
        <div className="section-separator container mx-auto" />

        <AchievementsSection />

        {/* Section Separator */}
        <div className="section-separator container mx-auto" />

        <EducationSection />

        {/* Section Separator */}
        <div className="section-separator container mx-auto" />

        <ContactSection />
      </div>
    </main>
  );
}
