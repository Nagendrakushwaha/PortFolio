import type { ProfileData } from '../types/portfolio';

/**
 * 100% Verified Profile Data for Nagendra Kushwaha
 * Extracted directly from official resume & verified academic records:
 * - Sam Global University, Bhopal, MP (B.Tech CSE, 2023–2027, CGPA: 7.85/10)
 * - Real photograph: /profile.png
 * - Resumes: /AI_ML resume.pdf and /Data_science resume.pdf
 * - Verified Email: shibbuk707@gmail.com
 * - Verified LinkedIn: https://linkedin.com/in/nagendra-kushwaha-165ba2296
 * - Verified GitHub: https://github.com/Nagendrakushwaha
 */
export const profileData: ProfileData = {
  name: "Nagendra Kushwaha",
  shortName: "NK",
  title: "AI & DATA SCIENCE PORTFOLIO",
  role: "AI/ML Engineer & Data Scientist",
  direction: "Generative AI / LLM Developer",
  positioning: "AI/ML Engineer • Data Scientist • Generative AI & Deep Learning Specialist",
  avatarUrl: "/profile.png",
  resumes: [
    { label: "AI/ML Resume", url: "/AI_ML%20resume.pdf", filename: "Nagendra_Kushwaha_AI_ML_Resume.pdf" },
    { label: "Data Science Resume", url: "/Data_science%20resume.pdf", filename: "Nagendra_Kushwaha_Data_Science_Resume.pdf" },
  ],
  education: {
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Science and Engineering",
    institution: "Sam Global University",
    location: "Bhopal, Madhya Pradesh, India",
    period: "2023 – 2027",
    cgpa: "7.85 / 10",
    schoolName: "Government Higher Secondary School",
    schoolLocation: "Kannoudhi, Shahdol, Madhya Pradesh, India",
  },
  careerInterests: [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing (NLP)",
    "Retrieval-Augmented Generation (RAG)",
    "Computer Vision & Medical AI",
    "Speech Acoustic Modeling",
    "Data Science & Predictive Analytics"
  ],
  objective: "Final-year Computer Science Engineering student specializing in Machine Learning, Deep Learning, and NLP with hands-on experience building end-to-end AI/ML systems in Python. Proven track record across speech acoustic classification, grounded RAG conversational systems, explainable medical computer vision, and time-series forecasting using PyTorch, Scikit-learn, and FastAPI/Streamlit with rigorous model evaluation and deployment.",
  bioSummary: "Specializing in Machine Learning, Deep Learning, and NLP at Sam Global University (2023–2027, CGPA: 7.85/10). Passionate about turning complex high-dimensional datasets into robust, deployable intelligence — from sub-60ms CPU medical image inference to grounded RAG conversational assistants and multi-million flow cybersecurity anomaly detection.",
  contact: {
    email: "shibbuk707@gmail.com",
    phone: "+91 8817036391",
    github: "https://github.com/Nagendrakushwaha",
    linkedin: "https://linkedin.com/in/nagendra-kushwaha-165ba2296",
    location: "Bhopal, Madhya Pradesh, India"
  }
};
