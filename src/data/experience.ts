import type { ExperienceItem, CertificationItem } from '../types/portfolio';

export const experienceData: ExperienceItem[] = [
  {
    type: 'internship',
    role: 'Data Analytics Intern',
    organization: 'UptoSkill',
    period: '13 Dec 2025 – 13 Mar 2026',
    highlights: [
      'Cleaned, transformed, and performed exploratory data analysis (EDA) on structured datasets using Python, Pandas, and NumPy to identify critical business patterns.',
      'Engineered robust preprocessing pipelines for missing-value handling, categorical encoding, and feature transformation to improve data quality for downstream modeling.',
      'Designed interactive executive dashboards and reports using Power BI and Microsoft Excel to communicate operational trends and data-driven insights to stakeholders.'
    ],
    skillsUsed: ['Python', 'Pandas', 'NumPy', 'EDA', 'Feature Engineering', 'Power BI', 'Microsoft Excel', 'SQL'],
    isEmployment: true
  },
  {
    type: 'virtual_experience',
    role: 'Data Science Virtual Experience Program',
    organization: 'Boston Consulting Group (BCG) — Forage',
    period: 'Completed Tasks Before Deadline',
    highlights: [
      'Conducted business case simulation analyzing real-world customer churn and financial indicators.',
      'Performed exploratory data analysis (EDA), customer feature engineering, and model evaluation in Python.',
      'Formulated actionable commercial recommendations and synthesized data-driven business presentations.',
      'Completed project tasks through Forage virtual experience (distinguished from full-time employment).'
    ],
    skillsUsed: ['Python', 'Exploratory Data Analysis', 'Customer Analytics', 'Business Intelligence', 'Feature Engineering'],
    isEmployment: false
  },
  {
    type: 'mentorship',
    role: 'Data Science Mentor',
    organization: 'Internship Catalyst',
    period: 'Currently Active',
    highlights: [
      'Guiding learners through core data science concepts, mathematical intuition, and practical Python implementations.',
      'Mentoring students in analytical thinking, exploratory data analysis, problem solving, and project-based machine learning.',
      'Reviewing code repositories, providing architectural feedback, and assisting in debugging model workflows.'
    ],
    skillsUsed: ['Data Science Pedagogy', 'Machine Learning', 'Code Review', 'Python', 'Analytical Thinking'],
    isEmployment: false
  },
  {
    type: 'academic',
    role: 'B.Tech in Computer Science and Engineering',
    organization: 'Sam Global University, Bhopal, Madhya Pradesh, India',
    period: '2023 – 2027 (CGPA: 7.85 / 10)',
    highlights: [
      'Final-year Computer Science Engineering student specializing in Machine Learning, Deep Learning, Natural Language Processing, and Artificial Intelligence.',
      'Coursework in Data Structures, Algorithms, Discrete Mathematics, Database Management Systems (DBMS), and Operating Systems.',
      'Hands-on empirical research in acoustic feature extraction, grounded RAG architectures, and explainable medical computer vision.'
    ],
    skillsUsed: ['C / C++', 'Python', 'Data Structures', 'Algorithms', 'DBMS', 'Mathematics for Machine Learning'],
    isEmployment: false
  },
  {
    type: 'academic',
    role: 'Higher Secondary School Education',
    organization: 'Government Higher Secondary School, Kannoudhi, Shahdol, Madhya Pradesh',
    period: 'Completed',
    highlights: [
      'Strong foundational focus in physical sciences, mathematics, and analytical problem-solving.',
      'Developed early passion for computer engineering and algorithms.'
    ],
    skillsUsed: ['Mathematics', 'Science', 'Analytical Thinking', 'Computer Foundations'],
    isEmployment: false
  }
];

export const certificationsData: CertificationItem[] = [
  {
    title: 'AI/ML Specialization',
    issuer: 'L&T EduTech',
    status: 'Verified Certification',
    description: 'Comprehensive program covering classical machine learning, neural network architectures, and practical model development.'
  },
  {
    title: 'SQL & NoSQL Database Engineering',
    issuer: 'L&T EduTech',
    status: 'Verified Certification',
    description: 'Relational query design, indexing, transactions, and distributed NoSQL storage patterns.'
  },
  {
    title: 'Data Analysis with Python',
    issuer: 'IBM SkillsBuild',
    status: 'Verified Certification',
    description: 'End-to-end data wrangling, exploratory data analysis, statistical plotting, and scikit-learn modeling.'
  }
];
