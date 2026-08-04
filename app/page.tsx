'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import dynamic from 'next/dynamic';

// Critical LCP components
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';

// Below-the-fold (dynamic)
const ProjectsSection = dynamic(() => import('@/components/portfolio/ProjectsSection'), { ssr: false });
const SkillsSection = dynamic(() => import('@/components/portfolio/SkillsSection'), { ssr: false });
const ExperienceSection = dynamic(() => import('@/components/portfolio/ExperienceSection'), { ssr: false });
const EducationSection = dynamic(() => import('@/components/portfolio/EducationSection'), { ssr: false });
const AchievementsSection = dynamic(() => import('@/components/portfolio/AchievementsSection'), { ssr: false });
const ReviewsSection = dynamic(() => import('@/components/portfolio/ReviewsSection'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/portfolio/ContactSection'), { ssr: false });
const PhilosophySection = dynamic(() => import('@/components/portfolio/PhilosophySection'), { ssr: false });

const CodingStreakSection = dynamic(() => import('@/components/portfolio/CodingStreakSection'), { ssr: false });

import Preloader from '@/components/Preloader';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-indigo-500/30 pb-16 lg:pb-0 transition-colors duration-200">
      <Preloader />
      {/* Scroll Progress */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <CodingStreakSection />
      <ProjectsSection />
      <PhilosophySection />
      <ExperienceSection />
      <AchievementsSection />
      <ReviewsSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
}
