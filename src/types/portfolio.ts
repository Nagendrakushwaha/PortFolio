export type SceneType = 'awakening' | 'wormhole' | 'multiverse' | 'laboratory';

export type MultiverseWorldId = 'ai' | 'datascience' | 'deeplearning' | 'software';

export interface MultiverseWorld {
  id: MultiverseWorldId;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  glowColor: string;
  position: [number, number, number];
  radius: number;
  rotationSpeed: number;
  features: string[];
}

export interface ResumeItem {
  label: string;
  url: string;
  filename: string;
}

export interface ProfileData {
  name: string;
  shortName?: string;
  title: string;
  role?: string;
  direction?: string;
  positioning: string;
  avatarUrl?: string;
  resumes?: ResumeItem[];
  education: {
    degree: string;
    field: string;
    institution: string;
    period: string;
    location?: string;
    cgpa?: string;
  };
  careerInterests: string[];
  objective: string;
  bioSummary: string;
  contact: {
    email: string;
    phone?: string;
    github: string;
    linkedin?: string;
    location: string;
  };
}

export type ProjectDomain = 'Artificial Intelligence' | 'Machine Learning' | 'Data Science' | 'Deep Learning' | 'Cybersecurity' | 'Computer Vision' | 'NLP';

export interface ProjectData {
  id: string;
  title: string;
  shortTitle?: string;
  slug: string;
  domain: ProjectDomain;
  tag?: string;
  image?: string;
  shortDescription: string;
  problemStatement: string;
  objective: string;
  technologies: string[];
  datasetInfo?: {
    name: string;
    description: string;
    sourceOrType?: string;
    samples?: string;
  };
  methodology: string[];
  architectureOverview: string;
  metrics?: {
    label: string;
    value: string;
    status: 'verified' | 'reported_historical' | 'demonstration';
    note?: string;
  }[];
  dataIntegrityNote?: string;
  challengesAndLimitations: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  demoAvailable: boolean;
  demoType?: 'interactive_lab' | 'external_app' | 'none';
  featured: boolean;
}

export type SkillLevel = 'Core' | 'Working Knowledge' | 'Exploring';

export interface SkillItem {
  name: string;
  level: SkillLevel | string;
  category: string;
  description: string;
}

export interface SkillCategory {
  categoryName: string;
  description: string;
  skills: {
    name: string;
    tag: string;
    levelDescription: string;
    associatedProjects?: string[];
  }[];
}

export interface ExperienceItem {
  type: 'academic' | 'internship' | 'virtual_experience' | 'mentorship' | 'project_research';
  role: string;
  organization: string;
  period: string;
  highlights: string[];
  skillsUsed: string[];
  isEmployment: boolean;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  status: string;
  description: string;
}
