import React from 'react';
import { HeroSection } from '../portfolio/HeroSection';
import { AboutSection } from '../portfolio/AboutSection';
import { SkillsSection } from '../portfolio/SkillsSection';
import { ProfessionalExperience } from '../portfolio/ProfessionalExperience';
import { EducationSection } from '../portfolio/EducationSection';
import { ProjectsGalaxy } from '../portfolio/ProjectsGalaxy';
import { InteractiveMLLab } from '../portfolio/InteractiveMLLab';
import { CertificationsSection } from '../portfolio/CertificationsSection';
import { ContactCosmic } from '../portfolio/ContactCosmic';

interface AILaboratoryProps {
  onReturnToTop: () => void;
  onExploreProjects: () => void;
  onExploreLab: () => void;
  onContact: () => void;
  onAboutMe?: () => void;
}

export const AILaboratory: React.FC<AILaboratoryProps> = ({
  onReturnToTop,
  onExploreProjects,
  onExploreLab,
  onContact,
  onAboutMe,
}) => {
  const handleOpenDemo = (_projectSlug: string) => {
    const el = document.getElementById('mllab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full z-20 pointer-events-auto bg-[#f8fafc] text-slate-900 transition-colors duration-500">
      {/* Modern Ambient Mesh Light Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-2/3 -left-40 w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 light-holo-grid opacity-75" />
      </div>

      {/* Main Content Flow in requested order */}
      <main className="relative z-10 pt-16">
        {/* 1. Hero / Introduction */}
        <HeroSection
          onAboutMe={onAboutMe}
          onExploreProjects={onExploreProjects}
          onExploreLab={onExploreLab}
          onContact={onContact}
        />

        {/* 2. About Me */}
        <AboutSection />

        {/* 3. Technical Skills & Expertise */}
        <SkillsSection />

        {/* 4. Professional Experience */}
        <ProfessionalExperience />

        {/* 5. Education */}
        <EducationSection />

        {/* 6. Projects & AI Solutions */}
        <ProjectsGalaxy onOpenDemo={handleOpenDemo} />

        {/* 7. Interactive AI/ML Demonstrations */}
        <InteractiveMLLab />

        {/* 8. Certifications & Achievements */}
        <CertificationsSection />

        {/* 9. Contact */}
        <ContactCosmic onReturnToTop={onReturnToTop} />
      </main>
    </div>
  );
};
