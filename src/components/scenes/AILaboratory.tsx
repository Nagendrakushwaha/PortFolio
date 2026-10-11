import React from 'react';
import { HeroSection } from '../portfolio/HeroSection';
import { AboutSection } from '../portfolio/AboutSection';
import { SkillsSection } from '../portfolio/SkillsSection';
import { ProjectsGalaxy } from '../portfolio/ProjectsGalaxy';
import { InteractiveMLLab } from '../portfolio/InteractiveMLLab';
import { ExperienceEducation } from '../portfolio/ExperienceEducation';
import { ContactCosmic } from '../portfolio/ContactCosmic';

interface AILaboratoryProps {
  onReturnToTop: () => void;
  onExploreProjects: () => void;
  onExploreLab: () => void;
  onContact: () => void;
}

export const AILaboratory: React.FC<AILaboratoryProps> = ({
  onReturnToTop,
  onExploreProjects,
  onExploreLab,
  onContact,
}) => {
  const handleOpenDemo = (_projectSlug: string) => {
    const el = document.getElementById('mllab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full z-20 pointer-events-auto">
      {/* Subtle Holographic Grid Background Overlay */}
      <div className="fixed inset-0 holo-grid pointer-events-none opacity-40 z-0" />

      {/* Main Content Flow */}
      <main className="relative z-10 pt-16">
        <HeroSection
          onExploreProjects={onExploreProjects}
          onExploreLab={onExploreLab}
          onContact={onContact}
        />

        <AboutSection />

        <SkillsSection />

        <ProjectsGalaxy onOpenDemo={handleOpenDemo} />

        <InteractiveMLLab />

        <ExperienceEducation />

        <ContactCosmic onReturnToTop={onReturnToTop} />
      </main>
    </div>
  );
};
