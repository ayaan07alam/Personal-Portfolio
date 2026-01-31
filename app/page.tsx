'use client';

import { useEffect } from 'react';
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
  return (
    <main className="min-h-screen bg-black selection:bg-indigo-500/30 selection:text-white">
      {/* Preloader & Nav would be here if implemented, keeping simple for now */}

      <HeroSection />

      <div className="relative z-10">
        <AboutSection />
      </div>

      <div className="relative z-20">
        <ProjectsSection />
      </div>

      <div className="relative z-30 bg-black">
        <SkillsSection />
        <ExperienceSection />
        <AchievementsSection />
        <EducationSection />
        <ContactSection />
      </div>
    </main>
  );
}
