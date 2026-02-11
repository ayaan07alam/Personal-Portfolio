'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import dynamic from 'next/dynamic';

// Critical LCP components (Static Import)
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';

// Below-the-fold components (Dynamic Import)
const SkillsSection = dynamic(() => import('@/components/portfolio/SkillsSection'), { ssr: false });
const ExperienceSection = dynamic(() => import('@/components/portfolio/ExperienceSection'), { ssr: false });
const ProjectsSection = dynamic(() => import('@/components/portfolio/ProjectsSection'), { ssr: false });
const EducationSection = dynamic(() => import('@/components/portfolio/EducationSection'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/portfolio/ContactSection'), { ssr: false });
const AchievementsSection = dynamic(() => import('@/components/portfolio/AchievementsSection'), { ssr: false });

import SmoothCursor from '@/components/SmoothCursor';
import Preloader from '@/components/Preloader';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="min-h-screen bg-black selection:bg-indigo-500/30 selection:text-white relative">
      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />

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
