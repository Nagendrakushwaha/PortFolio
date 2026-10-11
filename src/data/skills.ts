import type { SkillCategory } from '../types/portfolio';

export const skillsData: SkillCategory[] = [
  {
    categoryName: 'Machine Learning & Predictive Modeling',
    description: 'Statistical algorithms, gradient boosting, feature engineering, and rigorous validation workflows.',
    skills: [
      { name: 'Supervised Learning', tag: 'Core ML', levelDescription: 'Regression, Classification, Decision Trees, Random Forests', associatedProjects: ['Retail Sales Forecasting', 'Credit Card Fraud Detection'] },
      { name: 'Gradient Boosting Ensembles', tag: 'High Performance', levelDescription: 'XGBoost, LightGBM, CatBoost for structured data', associatedProjects: ['Retail Sales Forecasting', 'Network Intrusion Detection'] },
      { name: 'Feature Engineering & EDA', tag: 'Data Prep', levelDescription: 'Missing-value imputation, categorical encoding, lag features, rolling windows', associatedProjects: ['UptoSkill Internship', 'Retail Sales Forecasting'] },
      { name: 'Model Evaluation & Validation', tag: 'Rigorous Metrics', levelDescription: 'ROC-AUC, PR-AUC, Confusion Matrix, Cross-Validation, Class Imbalance Handling (SMOTE)', associatedProjects: ['Network Intrusion Detection', 'Credit Card Fraud Detection'] }
    ]
  },
  {
    categoryName: 'Deep Learning & Computer Vision',
    description: 'Neural network design, transfer learning, medical imaging, acoustic signal processing, and visual explainability.',
    skills: [
      { name: 'Deep Convolutional Networks (CNN)', tag: 'Vision & Audio', levelDescription: 'ResNet-18, EfficientNet-B0, MobileNetV3-Small, custom 2D-CNNs', associatedProjects: ['SiperVision MedicalVision', 'Speech Emotion Detection'] },
      { name: 'Model Interpretability & Grad-CAM', tag: 'Explainability', levelDescription: 'Grad-CAM saliency mapping and ground-truth bounding box validation', associatedProjects: ['SiperVision MedicalVision', 'Cognivision AI'] },
      { name: 'Acoustic Signal Processing', tag: 'Speech AI', levelDescription: '64-band Log-Mel Spectrograms, MFCCs, RMS, ZCR with Librosa & PyTorch', associatedProjects: ['Speech Emotion Detection'] },
      { name: 'Deep Learning Frameworks', tag: 'Frameworks', levelDescription: 'PyTorch, TensorFlow, Keras, GPU/CPU latency optimization', associatedProjects: ['SiperVision MedicalVision', 'Speech Emotion Detection'] }
    ]
  },
  {
    categoryName: 'NLP & Conversational AI (RAG / LLMs)',
    description: 'Text representation, intent understanding, vector retrieval, and safety guardrails.',
    skills: [
      { name: 'Grounded RAG Architecture', tag: 'Enterprise AI', levelDescription: 'Vector search, cosine similarity over multi-document chunks, PyMuPDF', associatedProjects: ['Customer Support AI (ShopEase)'] },
      { name: 'Fine-Grained Intent Classification', tag: 'NLP Core', levelDescription: 'Multiclass intent recognition across 77 classes (Banking77 benchmark)', associatedProjects: ['Customer Support AI (ShopEase)'] },
      { name: 'Safety Guardrails & Protection', tag: 'Security', levelDescription: 'Prompt-injection filtering, PII/credential masking, human escalation routing', associatedProjects: ['Customer Support AI (ShopEase)'] },
      { name: 'Text Classification & Normalization', tag: 'NLP Core', levelDescription: 'TF-IDF, Bag-of-Words, Devanagari Unicode processing, Scikit-learn', associatedProjects: ['SMS Spam Detection', 'English-Hindi Translation'] }
    ]
  },
  {
    categoryName: 'Programming, Data & Core Engineering',
    description: 'Core software engineering, database querying, business intelligence, and scientific tools.',
    skills: [
      { name: 'Python', tag: 'Primary Language', levelDescription: 'Core language for all machine learning pipelines, APIs, and data analysis', associatedProjects: ['All Projects'] },
      { name: 'SQL & Database Engineering', tag: 'Databases', levelDescription: 'Relational data querying, joins, indexing, PostgreSQL, MySQL', associatedProjects: ['UptoSkill Internship', 'L&T Certification'] },
      { name: 'C++ & Algorithms', tag: 'Computer Science', levelDescription: 'Data Structures, Algorithms, Object-Oriented Programming (OOP)', associatedProjects: ['Sam Global University'] },
      { name: 'Business Intelligence & Reporting', tag: 'Analytics', levelDescription: 'Power BI executive dashboards, Microsoft Excel data modeling, Pandas, NumPy', associatedProjects: ['UptoSkill Internship'] }
    ]
  },
  {
    categoryName: 'API Serving, Deployment & Developer Tools',
    description: 'Microservice APIs, interactive dashboards, version control, and cloud hosting.',
    skills: [
      { name: 'FastAPI & Flask', tag: 'Backend Microservices', levelDescription: 'Asynchronous model inference endpoints, REST APIs, JSON schemas', associatedProjects: ['Customer Support AI', 'SiperVision MedicalVision'] },
      { name: 'Interactive Dashboards & Web', tag: 'UI & Demos', levelDescription: 'Streamlit, React, Three.js 3D WebGL visualization, Plotly.js', associatedProjects: ['Network Intrusion Detection', 'Movie Recommendation'] },
      { name: 'Developer Tooling & Cloud', tag: 'DevOps & Git', levelDescription: 'Git, GitHub, VS Code, Jupyter, Google Colab, Docker, Vercel, Render', associatedProjects: ['Customer Support AI', 'All Repositories'] }
    ]
  }
];
