import { profileData } from '../data/profile';
import { projectsData } from '../data/projects';

export interface ChatAction {
  type: 'scroll' | 'project_modal' | 'external_link' | 'lab_tab';
  label: string;
  payload: string;
}

export interface AssistantResponse {
  text: string;
  actions?: ChatAction[];
  confidence: number;
  sources?: string[];
  isFallback?: boolean;
}

/**
 * Mr. Kennedy Knowledge Engine
 * 100% grounded in verified data from Nagendra Kushwaha's portfolio:
 * - Profile & Academic foundations (Sam Global University, B.Tech CSE 2023-2027, CGPA 7.85/10)
 * - School education (Govt Higher Secondary School, Kannoudhi, Shahdol, MP)
 * - Internships & Experience (UptoSkill, BCG Forage, Internship Catalyst)
 * - 12 Verified AI/ML/Data Science Projects
 * - Rigorous methodology (Precision@10, Fraud recall trade-offs, RAG architectures, Mel-spectrograms)
 * - Truthfulness rule: Admits unverified claims honestly without fabricating metrics.
 * - Privacy protection: Strictly provides public professional contact info only.
 */

// Helper to sanitize and normalize text
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Check if query contains any of the keywords
function containsAny(query: string, keywords: string[]): boolean {
  return keywords.some((kw) => query.includes(kw));
}

export class KennedyKnowledgeEngine {
  private static instance: KennedyKnowledgeEngine;

  public static getInstance(): KennedyKnowledgeEngine {
    if (!KennedyKnowledgeEngine.instance) {
      KennedyKnowledgeEngine.instance = new KennedyKnowledgeEngine();
    }
    return KennedyKnowledgeEngine.instance;
  }

  /**
   * Main query processor
   */
  public async query(userMessage: string, conversationHistory: Array<{ sender: string; text: string }> = []): Promise<AssistantResponse> {
    const raw = userMessage.trim();
    const query = normalizeText(raw);

    if (!query) {
      return {
        text: "I didn't quite catch that. Feel free to ask me anything about Nagendra's AI systems, machine learning research, technical skills, or educational background!",
        confidence: 0.1,
      };
    }

    // Contextual handling for follow-up questions
    const lastUserQuery = conversationHistory.length >= 2 ? normalizeText(conversationHistory[conversationHistory.length - 2].text) : '';
    const isAskingAboutAccuracy = containsAny(query, ['what is his accuracy', 'what is the accuracy', 'accuracy', 'how accurate', 'performance', 'f1 score']);

    // 1. Education & Academic Background
    if (
      containsAny(query, ['education', 'academic', 'college', 'university', 'degree', 'cgpa', 'grades', 'school', 'kannoudhi', 'shahdol', 'btech', 'studies'])
    ) {
      return {
        text: `Here are Nagendra Kushwaha's verified academic credentials:

🎓 **Bachelor of Technology (B.Tech) in Computer Science & Engineering**
• **Institution**: Sam Global University, Bhopal, Madhya Pradesh, India
• **Period**: 2023 – 2027 (Final-Year Student & AI/ML Project Builder)
• **Academic Standing**: Verified **CGPA of 7.85 / 10**
• **Specialized Coursework**: Data Structures & Algorithms, Machine Learning, Deep Learning, Natural Language Processing, Operating Systems, Database Management Systems (DBMS), and Discrete Mathematics.

🏫 **School Education**:
• **School**: Government Higher Secondary School, Kannoudhi, Shahdol, Madhya Pradesh, India
• **Foundations**: Physical sciences, mathematics, and analytical problem-solving.`,
        actions: [
          { type: 'scroll', label: 'View Academic Timeline', payload: 'experience' },
          { type: 'scroll', label: 'Explore Skills Matrix', payload: 'skills' },
        ],
        confidence: 0.98,
        sources: ['profile.ts', 'experience.ts'],
      };
    }

    // 2. Identity & Professional Overview
    if (
      containsAny(query, ['who is nagendra', 'who are you', 'tell me about nagendra', 'about nagendra', 'introduce nagendra', 'bio', 'overview', 'profile', 'who is he'])
    ) {
      return {
        text: `**Nagendra Kushwaha** is an **AI/ML Engineer and Data Scientist** based in Bhopal, Madhya Pradesh, India.

He is a final-year Computer Science and Engineering student at **Sam Global University** (2023–2027) with a verified **CGPA of 7.85/10**. 

Nagendra focuses on building robust, end-to-end intelligent systems:
• **Machine Learning & Deep Learning**: Supervised and unsupervised learning, custom PyTorch 2D-CNNs, ensemble tree architectures, and time-series forecasting.
• **Natural Language Processing & Generative AI**: Retrieval-Augmented Generation (RAG), intent classification across 77 banking classes, prompt-injection defense, and transformer architectures.
• **Computer Vision & Speech AI**: Explainable medical radiograph classification (Grad-CAM), OCR document intelligence, and acoustic speech emotion classification.
• **Data Science & Analytics**: Pipeline engineering, exploratory data analysis, interactive Power BI dashboards, and Plotly visual telemetry.

He has completed a Data Analytics Internship at **UptoSkill**, completed the **BCG Data Science Virtual Experience Program** via Forage, and serves as an active Data Science Mentor at **Internship Catalyst**.`,
        actions: [
          { type: 'scroll', label: 'View Academic Foundation', payload: 'about' },
          { type: 'scroll', label: 'Explore Verified Projects', payload: 'projects' },
          { type: 'scroll', label: 'Contact Nagendra', payload: 'contact' },
        ],
        confidence: 0.98,
        sources: ['profile.ts', 'experience.ts'],
      };
    }

    // 2.5 Technology Experience & Tool Verification (distinguishing project usage, exploring, and unverified)
    const isTechInquiry =
      containsAny(query, [
        'experience with',
        'experience in',
        'does he know',
        'has he used',
        'worked with',
        'familiar with',
        'proficiency in',
        'technology x',
      ]) ||
      (containsAny(query, [
        'pytorch',
        'tensorflow',
        'keras',
        'fastapi',
        'flask',
        'streamlit',
        'gradio',
        'docker',
        'kubernetes',
        'xgboost',
        'lightgbm',
        'catboost',
        'scikit-learn',
        'sklearn',
        'pandas',
        'numpy',
        'power bi',
        'powerbi',
        'postgresql',
        'postgres',
        'bigquery',
      ]) &&
        !containsAny(query, [
          'uptoskill',
          'internship',
          'bcg',
          'forage',
          'catalyst',
          'work history',
          'job history',
          'what is his experience',
          'tell me his experience',
          'tell me about his experience',
        ]));

    if (isTechInquiry) {
      if (containsAny(query, ['pytorch'])) {
        return {
          text: `**Yes, Nagendra has verified hands-on experience with PyTorch**:

• **Verified Project Usage**: Implemented custom 2D-Convolutional Neural Networks (2D-CNN) in PyTorch for the **Speech English Emotion Detection** system on the CREMA-D acoustic benchmark (achieving **0.80 Macro AUC** on held-out speaker splits), as well as convolutional backbones for **SmartMed Vision**.
• **Proficiency Level**: Categorized as **Working Knowledge** in his technical skills matrix — applied to deep learning model development, tensor operations, feature pipelines, and GPU/CPU inference.
• **Grounded Reality**: He uses PyTorch for applied neural network engineering and acoustic/vision pipelines, rather than claiming to be a framework internals author.`,
          actions: [
            { type: 'project_modal', label: 'View Speech Emotion Project', payload: 'speech-emotion-detection' },
            { type: 'scroll', label: 'Explore Skills Matrix', payload: 'skills' },
          ],
          confidence: 0.98,
          sources: ['skills.ts', 'projects.ts'],
        };
      }

      if (containsAny(query, ['fastapi'])) {
        return {
          text: `**Yes, Nagendra has practical microservice experience with FastAPI**:

• **Verified Project Usage**: Developed asynchronous REST API endpoints for **Customer Support Conversational AI (ShopEase)** deployed on Render, and backend intelligence routing for **Cognivision AI**.
• **Implementation Details**: Implements Pydantic schema validation, CORS security headers, error middleware, and sub-150ms inference endpoints.
• **Proficiency Level**: **Working Knowledge** in his verified skills matrix.`,
          actions: [
            { type: 'project_modal', label: 'View ShopEase AI', payload: 'customer-support-ai' },
            { type: 'scroll', label: 'View Skills', payload: 'skills' },
          ],
          confidence: 0.98,
          sources: ['skills.ts', 'projects.ts'],
        };
      }

      if (containsAny(query, ['scikit-learn', 'sklearn', 'pandas', 'numpy', 'python'])) {
        return {
          text: `**Yes, Python, Scikit-learn, Pandas, and NumPy are Nagendra's Core technical foundations**:

• **Verified Project Usage**: Extensive application across **Credit Card Fraud Detection** (SMOTE, precision-recall optimization), **Network Intrusion Detection** (Random Forest on 2.26M rows), **SMS Spam Classifier**, **Heart Disease Risk Estimator**, and **Retail Sales Forecasting**.
• **Industry Experience**: Utilized Pandas and NumPy daily during his **UptoSkill Data Analytics Internship** for enterprise ETL, outlier treatment, and feature transformations.
• **Proficiency Level**: **Core Competency** with rigorous focus on cross-validation and evaluation metrics.`,
          actions: [
            { type: 'scroll', label: 'Explore Skills Matrix', payload: 'skills' },
            { type: 'scroll', label: 'Open Interactive ML Lab', payload: 'mllab' },
          ],
          confidence: 0.98,
          sources: ['skills.ts', 'experience.ts'],
        };
      }

      if (containsAny(query, ['docker', 'bigquery', 'tensorflow', 'keras'])) {
        return {
          text: `**Nagendra is actively exploring and learning this technology**:

• **Skills Matrix Classification**: Listed under **Exploring / Working Knowledge** in his technical taxonomy.
• **Current Boundary**: While he understands containerization principles (Docker), cloud data warehousing (BigQuery), and Keras/TensorFlow pipelines, his deployed projects currently focus primarily on **Python, PyTorch, Scikit-learn, FastAPI, Streamlit, and Render/Vercel** runtimes.
• **Honest Verification**: As Mr. Kennedy, I highlight verified project code rather than overstating experience.`,
          actions: [
            { type: 'scroll', label: 'View Full Skills Matrix', payload: 'skills' },
            { type: 'scroll', label: 'Explore Verified Projects', payload: 'projects' },
          ],
          confidence: 0.96,
          sources: ['skills.ts'],
        };
      }

      if (containsAny(query, ['kubernetes', 'aws', 'azure', 'technology x', 'unverified', 'java', 'c#', 'rust', 'golang', 'unknown'])) {
        return {
          text: `**Regarding this technology**:

• **Public Profile Evidence**: This technology is **not listed as a verified skill** in Nagendra's public portfolio or public GitHub repositories.
• **Grounding Policy**: As Mr. Kennedy, I do not fabricate or speculate on unverified credentials. Nagendra's proven competencies center on **Python, PyTorch, Scikit-learn, SQL, FastAPI, Data Analytics (Power BI, Excel), and modern Generative AI / RAG pipelines**.
• If your organization requires this specific technology, feel free to reach out to Nagendra directly to discuss his learning curve and adjacent systems experience!`,
          actions: [
            { type: 'scroll', label: 'Contact Nagendra', payload: 'contact' },
            { type: 'scroll', label: 'View Verified Skills', payload: 'skills' },
          ],
          confidence: 0.95,
          sources: ['skills.ts'],
        };
      }
    }

    // 3. Work Experience, Internships, Mentorship
    if (
      (containsAny(query, ['experience', 'internship', 'uptoskill', 'work history', 'job', 'forage', 'bcg', 'internship catalyst', 'mentor', 'mentoring', 'career']) &&
        !containsAny(query, ['experience with', 'experience in', 'with pytorch', 'with fastapi', 'with docker', 'with technology', 'technology x'])) ||
      containsAny(query, ['what is his experience', 'work experience', 'his background in work', 'where has he worked'])
    ) {
      return {
        text: `Nagendra's verified professional and mentoring background includes:

💼 **Data Analytics Intern — UptoSkill** (Remote)
• **Duration**: 13 December 2025 – 13 March 2026
• Cleaned, standardized, and conducted exploratory data analysis (EDA) on structured enterprise datasets using Python (Pandas, NumPy).
• Engineered automated data preprocessing workflows for missing values, categorical encoding, and feature transformation.
• Built interactive business intelligence dashboards and operational reports using **Power BI** and **Microsoft Excel**.

🏢 **Data Science Virtual Experience Program — Boston Consulting Group (BCG) via Forage**
• Completed all simulation tasks before the deadline.
• Analyzed real-world customer churn, engineered customer behavioral indicators, and synthesized commercial recommendations. *(Note: This was a simulated project experience through Forage, not full-time employment at BCG).*

🧑‍🏫 **Data Science Mentor — Internship Catalyst** (Currently Active)
• Mentors aspiring learners through core data science concepts, mathematical intuition, and practical Python implementations.
• Conducts code reviews, explains model evaluation metrics, and assists students in debugging machine learning pipelines.`,
        actions: [
          { type: 'scroll', label: 'View Experience Section', payload: 'experience' },
          { type: 'scroll', label: 'Explore Interactive Lab', payload: 'mllab' },
        ],
        confidence: 0.97,
        sources: ['experience.ts'],
      };
    }

    // 4. Hiring / Project collaboration inquiries
    if (
      containsAny(query, ['hire', 'hire him', 'freelance', 'contract', 'job offer', 'recruit', 'recruiter', 'opportunity', 'collaborate'])
    ) {
      return {
        text: `Nagendra is actively open to **AI/ML Engineering, Data Science, and Generative AI roles**, as well as impactful research and engineering collaborations!

**Key Strengths for Your Team**:
• Demonstrated hands-on track record building end-to-end AI/ML systems in Python, PyTorch, and Scikit-learn.
• Practical deployment experience with FastAPI microservices, Streamlit/Gradio apps, and React/Vite frontends.
• Rigorous evaluation mindset: focuses on recall, PR-AUC, and precision rather than superficial accuracy metrics.
• Solid Computer Science fundamentals (Algorithms, DBMS, OOP) with a 7.85/10 CGPA.

You can download his specialized resumes or contact him directly:
• **Email**: [${profileData.contact.email}](mailto:${profileData.contact.email})
• **LinkedIn**: [linkedin.com/in/nagendra-kushwaha-165ba2296](https://linkedin.com/in/nagendra-kushwaha-165ba2296)
• **GitHub**: [github.com/Nagendrakushwaha](https://github.com/Nagendrakushwaha)`,
        actions: [
          { type: 'scroll', label: 'Go to Contact Coordinates', payload: 'contact' },
          { type: 'external_link', label: 'Download AI/ML Resume', payload: '/AI_ML%20resume.pdf' },
          { type: 'external_link', label: 'Open LinkedIn Profile', payload: 'https://linkedin.com/in/nagendra-kushwaha-165ba2296' },
        ],
        confidence: 0.98,
        sources: ['profile.ts'],
      };
    }

    // 5. Specific Projects: ShopEase Customer Support AI
    if (
      containsAny(query, ['customer support', 'shopease', 'banking77', 'rag', 'pdf', 'prompt injection', 'pii', 'support ai'])
    ) {
      return {
        text: `**Customer Support Conversational AI (ShopEase)** is one of Nagendra's flagship production-oriented systems:

🎯 **Problem & Objective**:
Standard customer support bots often hallucinate policy details, leak sensitive PII, or fall prey to prompt injection attacks. Nagendra engineered a grounded, secure customer support platform.

⚙️ **Key Architecture & Methodology**:
1. **Multi-Class Intent Classifier**: Fine-grained classification across **77 banking & service classes** on the Banking77 benchmark, achieving **88.72% test accuracy** and **88.76% Macro F1**.
2. **Grounded RAG Pipeline**: Ingested and chunked 14 enterprise policy PDFs into **102 dense vector embeddings** using PyMuPDF and sentence transformers.
3. **Security Guardrails**: Multi-tier input filters for prompt-injection pattern blocking and regex/embedding-based PII masking.
4. **Calibrated Escalation**: Queries falling below confidence thresholds are seamlessly routed to human support agents.
5. **Backend Deployment**: High-throughput asynchronous **FastAPI** microservice deployed on Render with a responsive React frontend.

🔗 **Verified Links**:
• GitHub: [github.com/Nagendrakushwaha/customer_support_AI](https://github.com/Nagendrakushwaha/customer_support_AI)
• Live Demo: [customer-support-ai-6.onrender.com](https://customer-support-ai-6.onrender.com/)`,
        actions: [
          { type: 'project_modal', label: 'Open ShopEase Case Study', payload: 'customer-support-ai' },
          { type: 'external_link', label: 'Open Live Demo (Render)', payload: 'https://customer-support-ai-6.onrender.com/' },
          { type: 'external_link', label: 'View GitHub Repo', payload: 'https://github.com/Nagendrakushwaha/customer_support_AI' },
        ],
        confidence: 0.99,
        sources: ['projects.ts'],
      };
    }

    // 6. Specific Projects: Speech English Emotion Detection
    if (
      containsAny(query, ['speech', 'emotion', 'crema', 'audio', 'acoustic', 'spectrogram', 'mel', 'speech intelligence'])
    ) {
      return {
        text: `**Speech English Emotion Detection** is Nagendra's acoustic deep learning project:

🎯 **Problem & Objective**:
Speech emotion recognition models frequently overfit to individual speaker vocal tract geometries. Nagendra designed a system with strict **speaker-independent cross-validation** to classify 6 vocal emotions: Neutral, Happy, Sad, Angry, Fearful, and Disgust.

⚙️ **Acoustic Engineering & Architecture**:
• **Feature Extraction**: Extracted **64-band Log-Mel Spectrograms** and 40 acoustic features (MFCCs, Root-Mean-Square Energy, Zero-Crossing Rate) using Librosa.
• **Neural Network**: Custom **PyTorch 2D-Convolutional Neural Network (2D-CNN)** with batch normalization, residual connections, and dropout regularization.
• **Dataset**: Evaluated on **7,442 audio clips** from the CREMA-D benchmark with held-out speaker splits.
• **Verified Result**: Achieved **0.80 Macro AUC** on unseen speaker identities, demonstrating genuine emotional acoustic generalization rather than speaker memorization.
• **Integration**: Paired with the SenseVoiceSmall foundation model for live ASR transcription alongside low-latency FastAPI inference.

🔗 **GitHub Repository**:
• [github.com/Nagendrakushwaha/speech_english_emotion_detection](https://github.com/Nagendrakushwaha/speech_english_emotion_detection)`,
        actions: [
          { type: 'project_modal', label: 'View Speech Emotion Case Study', payload: 'speech-emotion-detection' },
          { type: 'external_link', label: 'View GitHub Repo', payload: 'https://github.com/Nagendrakushwaha/speech_english_emotion_detection' },
        ],
        confidence: 0.99,
        sources: ['projects.ts'],
      };
    }

    // 7. Specific Projects: SiperVision / SmartMed Vision (Medical AI)
    if (
      containsAny(query, ['smartmed', 'sipervision', 'medical', 'pneumonia', 'xray', 'radiograph', 'rsna', 'grad cam'])
    ) {
      return {
        text: `**SiperVision / SmartMed Vision — Explainable Pneumonia Detection**:

🎯 **Problem & Objective**:
Deep neural networks in radiology often function as opaque black boxes. This research project evaluated backbones for chest radiograph classification combined with spatial visual explainability.

⚙️ **Architecture & Verified Results**:
• **Dataset**: **26,684 chest radiographs** from the RSNA Pneumonia Detection Challenge with leak-free patient-level splits.
• **Preprocessing**: CLAHE (Contrast Limited Adaptive Histogram Equalization) and Albumentations augmentations.
• **Models Evaluated**: Compared ResNet-18, MobileNetV3-Small, and fine-tuned **EfficientNet-B0**.
• **Verified Metrics**: Fine-tuned EfficientNet-B0 achieved **93.60% test accuracy** and **0.9562 ROC-AUC**.
• **Visual Explainability**: **Grad-CAM attention heatmaps** overlaid on radiographs to verify that the model attends to true pulmonary infiltrates rather than scanner artifacts.
• **Latency**: Optimized for sub-60ms inference on standard clinical workstation CPUs.

⚠️ **Ethical & Safety Boundary**:
SmartMed Vision is built strictly for **educational and scientific research purposes**; it is not approved for unassisted clinical diagnosis or patient treatment.`,
        actions: [
          { type: 'project_modal', label: 'Open SmartMed Vision Case Study', payload: 'sipervision-medical-vision' },
          { type: 'external_link', label: 'View GitHub Repo', payload: 'https://github.com/Nagendrakushwaha/SiperVision_medicalVision' },
        ],
        confidence: 0.99,
        sources: ['projects.ts'],
      };
    }

    // 8. Specific Projects: Cognivision AI (Document Intelligence)
    if (
      containsAny(query, ['cognivision', 'document', 'receipt', 'invoice', 'icdar', 'sroie', 'ocr'])
    ) {
      return {
        text: `**Cognivision AI — Multimodal Document Intelligence**:

🎯 **Problem & Objective**:
Real-world receipts and tax invoices feature crumpled thermal paper, non-standard layouts, and noisy scans. Cognivision AI combines OCR token coordinates with visual feature backbones for field extraction.

⚙️ **Architecture & Benchmarks**:
• **Dataset**: Evaluated on the **ICDAR SROIE benchmark** of scanned receipts.
• **Pipeline**: OCR 2D spatial bounding-box extraction combined with custom **CogniNet-CNN** and lightweight **MobileNetV3-Small**.
• **Explainability**: Integrated Grad-CAM spatial heatmaps to visualize where the neural backbone focuses during key information extraction (Company, Date, Total).
• **Optimization**: Edge inference benchmarked on AMD Ryzen 5 5500U CPU for low-power edge deployment.

🔗 **GitHub Repository**:
• [github.com/Nagendrakushwaha/Cognivision-AI](https://github.com/Nagendrakushwaha/Cognivision-AI)`,
        actions: [
          { type: 'project_modal', label: 'Open Cognivision Case Study', payload: 'cognivision-ai' },
          { type: 'external_link', label: 'View GitHub Repo', payload: 'https://github.com/Nagendrakushwaha/Cognivision-AI' },
        ],
        confidence: 0.98,
        sources: ['projects.ts'],
      };
    }

    // 9. Specific Projects: Network Intrusion Detection (CIC-IDS2017)
    if (
      containsAny(query, ['network intrusion', 'nids', 'cic ids', 'cicids', 'cybersecurity', 'ddos', 'firewall', 'attack'])
    ) {
      return {
        text: `**AI-Powered Network Intrusion Detection System (CIC-IDS2017)**:

🎯 **Problem & Objective**:
Modern high-throughput switching fabrics face sophisticated cyber intrusions, port scans, and DDoS floods that evade signature-based firewalls.

⚙️ **Data & Machine Learning Pipeline**:
• **Dataset Scale**: Processed **2,262,141 network flow records** across 79 numerical features from the Canadian Institute for Cybersecurity (CIC-IDS2017) benchmark.
• **Test Split**: Evaluated on **565,536 held-out test rows** capturing benign traffic and 14 attack profiles.
• **Models Trained**: Evaluated 7 architectures: Logistic Regression, Decision Trees, Random Forests, Extra Trees, XGBoost, LightGBM, and CatBoost.
• **Verified Metrics**: Achieved **99.64% test accuracy (0.9964)** and **0.99 ROC-AUC** across ensemble gradient-boosted trees.
• **Interface**: Deployed as an interactive flow inspection interface in Streamlit.`,
        actions: [
          { type: 'project_modal', label: 'Open NIDS Case Study', payload: 'network-intrusion-detection' },
          { type: 'lab_tab', label: 'Test NIDS Anomaly Inspector in Lab', payload: 'network' },
        ],
        confidence: 0.98,
        sources: ['projects.ts'],
      };
    }

    // 10. Specific Projects: Movie Recommendation & Precision@10
    if (
      containsAny(query, ['movie', 'recommendation', 'recommender', 'precision@10', 'precision at 10', 'cosine similarity'])
    ) {
      return {
        text: `**Movie Recommendation System & Precision@10 Metric**:

🎬 **System Overview**:
Nagendra built a content-based recommendation engine using vectorized movie metadata (genres, cast, plot keywords, and directors). It calculates pairwise **cosine similarity** matrices and returns top-K personalized suggestions.

🎯 **What does Precision@10 mean?**:
In recommendation systems, **Precision@10** measures the proportion of recommended items in the top 10 positions that are genuinely relevant to the user:
$$\\text{Precision@10} = \\frac{\\text{Number of relevant movies in top 10}}{10}$$
A verified score of **0.93** means that, on average, **9.3 out of every 10 recommended movies** matched the target viewer's profile and genre preferences.

⚙️ **Deployment**:
Interactive Streamlit application integrating the **TMDB API** for live movie poster art and metadata fetching.`,
        actions: [
          { type: 'project_modal', label: 'View Movie Recommendation Case Study', payload: 'movie-recommendation-system' },
          { type: 'scroll', label: 'View All Projects', payload: 'projects' },
        ],
        confidence: 0.99,
        sources: ['projects.ts'],
      };
    }

    // 11. Specific Projects: Credit Card Fraud & Why Accuracy is Misleading
    if (
      containsAny(query, ['fraud', 'credit card', 'imbalanced', 'smote', 'accuracy misleading', 'misleading accuracy'])
    ) {
      return {
        text: `**Credit Card Fraud Detection & Why Accuracy is Misleading**:

⚠️ **The Deceptive Accuracy Paradox**:
In the European cardholder fraud benchmark (284,807 transactions), fraudulent transactions account for only **0.172%** (about 1 in every 600 transactions).
• If a naive model simply predicts "Legitimate" for every transaction without looking at features, it achieves an astonishing **99.83% accuracy**!
• Yet, it catches **0% of frauds** (Recall = 0.0), allowing millions in financial theft to slip past unnoticed.
• Nagendra's initial unweighted Logistic Regression baseline scored **99.37% (0.9937) accuracy**, but demonstrated poor fraud recall due to this extreme skew.

🛠️ **How Nagendra Solved This**:
1. Applied **SMOTE (Synthetic Minority Over-sampling Technique)** to balance decision boundaries.
2. Re-framed evaluation around **Recall (86%)**, **Precision (85%)**, and **F1-Score (0.83)**.
3. Implemented calibrated decision threshold tuning to prioritize fraudulent transaction capture while controlling false-alarm merchant fees.`,
        actions: [
          { type: 'project_modal', label: 'Open Fraud Detection Case Study', payload: 'fraud-detection' },
          { type: 'lab_tab', label: 'Explore Plotly Threshold Tuner in Lab', payload: 'metrics' },
        ],
        confidence: 0.99,
        sources: ['projects.ts'],
      };
    }

    // 12. Specific Projects: SMS Spam Detection
    if (
      containsAny(query, ['sms', 'spam', 'sms spam', 'naive bayes', 'ham'])
    ) {
      return {
        text: `**SMS Spam NLP Detection Pipeline**:

📱 **Overview**:
An NLP classification system transforming unstructured English SMS text into discriminatory numerical vectors to filter phishing, lottery scams, and unsolicited ads.

⚙️ **Methodology & Verified Metrics**:
• **Text Preprocessing**: Lowercasing, punctuation stripping, stopword elimination, and TF-IDF n-gram vectorization.
• **Models**: Multinomial Naive Bayes and Linear Support Vector Machines (SVM).
• **Verified Test Performance**: **98% accuracy**, **98% precision**, and **0.95 F1-score**.
• **Precision Priority**: Engineered with a strict threshold to avoid false positives (never discarding legitimate personal or urgent bank SMS messages).

🧪 **Try it live**: You can test custom SMS text in Nagendra's Interactive ML Lab on this portfolio!`,
        actions: [
          { type: 'project_modal', label: 'View SMS Spam Case Study', payload: 'sms-spam-detection' },
          { type: 'lab_tab', label: 'Try SMS Spam Demo in Lab', payload: 'spam' },
        ],
        confidence: 0.98,
        sources: ['projects.ts'],
      };
    }

    // 13. Specific Projects: Heart Disease Prediction
    if (
      containsAny(query, ['heart', 'heart disease', 'cardiovascular', 'gradio', '919', 'biomarker'])
    ) {
      return {
        text: `**Heart Disease Predictive Modeling & Risk Estimator**:

❤️ **Project Overview**:
An educational supervised classification model trained on a clinical dataset of **919 patient records across 16 diagnostic variables** (resting blood pressure, serum cholesterol, ST-depression oldpeak, maximum heart rate).

⚙️ **Implementation**:
• Models: Evaluated Logistic Regression, Support Vector Classifiers, and Random Forests.
• Web Interface: Built with **Gradio** for interactive parameter tuning and risk probability estimation.
• Lab Integration: Also available right here in the **Interactive ML Lab** on the portfolio.

⚠️ **Important Disclosure**:
This project was developed strictly as an educational machine learning demonstration, and must not be used as a clinically validated diagnostic tool.`,
        actions: [
          { type: 'project_modal', label: 'View Heart Disease Case Study', payload: 'heart-disease-prediction' },
          { type: 'lab_tab', label: 'Test Heart Disease Risk Calculator', payload: 'heart' },
        ],
        confidence: 0.98,
        sources: ['projects.ts'],
      };
    }

    // 14. Specific Projects: Retail Sales Forecasting
    if (
      containsAny(query, ['retail sales', 'forecasting', 'xgboost', 'time series', 'rmse', 'mae', 'sales prediction'])
    ) {
      return {
        text: `**Retail Sales Forecasting**:

📈 **Project Summary**:
A time-series forecasting regression pipeline built to predict multi-horizon store department sales, preventing costly stockouts and over-inventory conditions.

⚙️ **Feature Engineering & Models**:
• Engineered rolling window moving averages (7, 14, 30 days), seasonal lag indicators, and promotional markdown flags.
• Trained **XGBoost Regressor**, Random Forests, and baseline linear models.
• Verified Test Performance: Achieved **RMSE of 4931.76** and **MAE of 4374.29**, outperforming standard baseline methods.
• Deployed with a lightweight Flask web service.`,
        actions: [
          { type: 'project_modal', label: 'View Sales Forecasting Case Study', payload: 'retail-sales-forecasting' },
          { type: 'external_link', label: 'View GitHub Repo', payload: 'https://github.com/Nagendrakushwa/Retail_Sales_prediction' },
        ],
        confidence: 0.98,
        sources: ['projects.ts'],
      };
    }

    // 15. Specific Projects: Instacart Market Basket Intelligence
    if (
      containsAny(query, ['instacart', 'market basket', 'e commerce', 'ecommerce', 'reorder', '100 epoch'])
    ) {
      return {
        text: `**Instacart E-Commerce Decision Intelligence Platform**:

🛒 **Overview**:
An e-commerce analytics and sequential modeling platform analyzing repetitive basket replenishment across customer order streams.

⚙️ **Key Details**:
• Analyzed order sequencing, user reorder ratios, and product transition probabilities across 3M+ customer orders.
• Sequential decision models trained with up to a **100-epoch schedule**.
• Enriched with interactive **Plotly** data visual telemetry for aisle navigation, department baskets, and reorder cycles.`,
        actions: [
          { type: 'project_modal', label: 'View Instacart Case Study', payload: 'instacart-ecommerce-intelligence' },
          { type: 'scroll', label: 'Explore All Projects', payload: 'projects' },
        ],
        confidence: 0.97,
        sources: ['projects.ts'],
      };
    }

    // 16. Accuracy questions (with conversational context awareness)
    if (isAskingAboutAccuracy && !containsAny(query, ['shopease', 'speech', 'pneumonia', 'fraud', 'spam', 'nids', 'sales', 'heart'])) {
      // Check if last user query was about a specific project
      if (lastUserQuery && containsAny(lastUserQuery, ['customer support', 'shopease', 'banking77', 'rag'])) {
        return {
          text: `**Customer Support AI (ShopEase) Accuracy & Performance**:
• **Benchmark**: Banking77 dataset (13,080 customer queries across 77 fine-grained banking classes).
• **Test Accuracy**: **88.72%** on held-out test split.
• **Macro F1-Score**: **88.76%**, confirming balanced classification across rare intent classes.
• **Retrieval Latency**: Under 150ms for end-to-end vector retrieval across 102 policy embeddings.`,
          actions: [
            { type: 'project_modal', label: 'Open ShopEase Case Study', payload: 'customer-support-ai' },
            { type: 'external_link', label: 'View GitHub Repo', payload: 'https://github.com/Nagendrakushwaha/customer_support_AI' },
          ],
          confidence: 0.98,
          sources: ['projects.ts'],
        };
      }

      if (lastUserQuery && containsAny(lastUserQuery, ['speech', 'emotion', 'crema', 'audio'])) {
        return {
          text: `**Speech Emotion Detection Performance**:
• **Benchmark**: CREMA-D audio dataset (7,442 clips across 6 emotions).
• **Validation Split**: Strict speaker-independent split (testing only on voices never heard during training).
• **Performance Metric**: **0.80 Macro AUC** on unseen speaker identities, demonstrating acoustic generalization rather than speaker memorization.`,
          actions: [
            { type: 'project_modal', label: 'View Speech Emotion Project', payload: 'speech-emotion-detection' },
          ],
          confidence: 0.98,
          sources: ['projects.ts'],
        };
      }

      if (lastUserQuery && containsAny(lastUserQuery, ['fraud', 'credit card'])) {
        return {
          text: `**Credit Card Fraud Detection Accuracy Context**:
• Baseline Logistic Regression achieved **99.37% (0.9937) accuracy**, but accuracy is deceptive because 99.83% of transactions are non-fraudulent.
• Using SMOTE balancing, the calibrated Random Forest achieved **86% fraud recall**, catching fraudulent charges that high-accuracy baselines missed.`,
          actions: [
            { type: 'project_modal', label: 'Open Fraud Case Study', payload: 'fraud-detection' },
            { type: 'lab_tab', label: 'Open Fraud Tuner in Lab', payload: 'metrics' },
          ],
          confidence: 0.98,
          sources: ['projects.ts'],
        };
      }

      return {
        text: `Nagendra's model performance depends specifically on the project and evaluation task:

• **Customer Support AI (ShopEase)**: **88.72% test accuracy** and **88.76% Macro F1** across 77 fine-grained intent classes (Banking77).
• **Speech Emotion Detection**: **0.80 Macro AUC** on held-out test speakers (CREMA-D benchmark).
• **Network Intrusion Detection**: **99.64% test accuracy (0.9964)** and **0.99 ROC-AUC** across 565k test rows (CIC-IDS2017).
• **SiperVision Medical AI**: **93.60% accuracy** and **0.9562 ROC-AUC** on RSNA chest radiographs *(research only)*.
• **SMS Spam Classifier**: **98% test accuracy** and **98% precision** with TF-IDF and Naive Bayes.
• **Credit Card Fraud Detection**: Baseline Logistic Regression achieved **99.37% (0.9937) accuracy**, but SMOTE balancing achieved **86% recall** to prioritize catching fraudulent transactions.
• **Movie Recommendation**: **Precision@10 = 0.93** (9.3 out of 10 recommendations relevant).

Which of these projects would you like to explore in technical detail?`,
        actions: [
          { type: 'project_modal', label: 'Explore ShopEase AI', payload: 'customer-support-ai' },
          { type: 'project_modal', label: 'Explore Fraud Detection', payload: 'fraud-detection' },
          { type: 'lab_tab', label: 'Open Interactive ML Lab', payload: 'metrics' },
        ],
        confidence: 0.95,
        sources: ['projects.ts'],
      };
    }

    // 17. All Projects Overview
    if (
      containsAny(query, ['projects', 'what projects', 'show me projects', 'all projects', 'portfolio projects', 'work sample', 'what has he built', 'what did he build', 'developed'])
    ) {
      return {
        text: `Nagendra has developed **${projectsData.length} verified projects** spanning AI, Deep Learning, Computer Vision, and Data Science:

1. **Customer Support Conversational AI (ShopEase)**: 77-class intent classifier (88.72% acc) + 102 vector chunks RAG + PII masking (FastAPI/Render).
2. **Speech English Emotion Detection**: 64-band Log-Mel 2D-CNN on CREMA-D (0.80 Macro AUC on unseen speakers).
3. **SiperVision / SmartMed Vision**: Explainable pneumonia detection on 26,684 RSNA radiographs (93.60% acc, 0.9562 ROC-AUC, Grad-CAM).
4. **Cognivision AI**: Multimodal document intelligence on ICDAR SROIE scanned receipts (AMD Ryzen 5 CPU optimized).
5. **Network Intrusion Detection System**: Scaled 2.26M rows on CIC-IDS2017 (99.64% test accuracy, 0.99 ROC-AUC).
6. **Movie Recommendation System**: Cosine similarity metadata matrix (Precision@10 = 0.93, Streamlit + TMDB).
7. **Retail Sales Forecasting**: Lag & rolling statistics XGBoost regressor (RMSE: 4931.76, MAE: 4374.29).
8. **SMS Spam Detection**: Text NLP classifier (98% accuracy, 98% precision, 0.95 F1).
9. **Credit Card Fraud Detection**: Imbalanced learning study (SMOTE 86% recall vs 0.9937 deceptive baseline).
10. **Heart Disease Risk Estimator**: 919 patient records with Gradio UI (Educational predictive tool).
11. **Instacart Decision Intelligence**: Basket sequence modeling (100 epochs, Plotly analytics).
12. **English-Hindi Neural Translation**: Devanagari Unicode normalization and sequence-to-sequence exploration.

Would you like a technical deep-dive into any of these architectures?`,
        actions: [
          { type: 'scroll', label: 'Explore Projects Galaxy', payload: 'projects' },
          { type: 'scroll', label: 'Open Interactive ML Lab', payload: 'mllab' },
        ],
        confidence: 0.98,
        sources: ['projects.ts'],
      };
    }

    // 18. Technical Skills & Technologies
    if (
      containsAny(query, ['skills', 'tech stack', 'technologies', 'what tech', 'python', 'tools', 'languages', 'programming', 'strongest skills', 'what does he use'])
    ) {
      return {
        text: `Nagendra's verified technical skills are categorized based on real repository implementation evidence:

💻 **Programming & Core Languages**:
• **Python**: Core language for ML models, data pipelines, and APIs (NumPy, Pandas, SciPy, Scikit-learn, PyTorch).
• **SQL**: Relational query design, schema normalization, and database querying.
• **C / C++**: Foundational data structures and algorithmic complexity.

🧠 **Machine Learning & Deep Learning**:
• Supervised & Unsupervised Learning (Regression, Classification, Clustering, Ensembles)
• XGBoost, LightGBM, CatBoost
• Neural Networks (ANN, 2D-CNN, RNN, LSTM)
• Feature Engineering, Imbalanced Learning (SMOTE), and Rigorous Model Evaluation

🗣️ **NLP & Generative AI**:
• Retrieval-Augmented Generation (RAG) & Vector Databases
• Intent Classification, Prompt Engineering & Defense
• Transformers, Embeddings, and Sequence-to-Sequence Modeling

👁️ **Computer Vision & Speech AI**:
• Transfer Learning (ResNet, MobileNet, EfficientNet)
• Grad-CAM Visual Explainability, OpenCV
• Speech Acoustic Feature Extraction (Log-Mel Spectrograms, MFCCs) via Librosa

🚀 **Deployment & Tooling**:
• FastAPI, Flask, Streamlit, Gradio
• React, Vite, Tailwind CSS, Plotly.js, Three.js
• Git, GitHub, VS Code, Jupyter, Power BI, Microsoft Excel`,
        actions: [
          { type: 'scroll', label: 'View 57+ Verified Skills', payload: 'skills' },
          { type: 'scroll', label: 'Explore Interactive Lab', payload: 'mllab' },
        ],
        confidence: 0.97,
        sources: ['skills.ts'],
      };
    }

    // 19. Production vs Portfolio Systems (Methodological discussion)
    if (
      containsAny(query, ['production system', 'difference between projects and production', 'production vs portfolio', 'limitations', 'real world'])
    ) {
      return {
        text: `Nagendra maintains a clear, honest distinction between portfolio/educational prototypes and commercial enterprise production systems:

1. **Scale & Infrastructure**:
• Portfolio projects run on single-container microservices (FastAPI on Render, Streamlit, local CPU/GPU).
• Full production systems require Kubernetes clustering, horizontal pod autoscaling, distributed Kafka/RabbitMQ message queues, and Multi-AZ database replication.

2. **Continuous Monitoring & MLOps**:
• Portfolio models are evaluated on static benchmark splits (e.g. Banking77, CREMA-D, RSNA).
• Production systems require live telemetry for data drift, concept drift, feature store freshness, latency degradation, and shadow model deployment.

3. **Data Governance & Security**:
• While projects like ShopEase implement regex PII masking and prompt injection filters, production enterprise systems require strict SOC2/HIPAA compliance, OAuth2 token rotation, encrypted vault stores, and automated red-teaming.

4. **Safety Boundaries**:
• Medical models like SmartMed Vision and the Heart Disease calculator are strictly for **scientific/educational exploration**, never for unassisted patient triage.`,
        actions: [
          { type: 'scroll', label: 'Explore ShopEase AI Case Study', payload: 'projects' },
          { type: 'scroll', label: 'View About Section', payload: 'about' },
        ],
        confidence: 0.96,
        sources: ['projects.ts', 'experience.ts'],
      };
    }

    // 20. Contact & Professional Links
    if (
      containsAny(query, ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'resume', 'cv', 'socials'])
    ) {
      return {
        text: `You can reach Nagendra Kushwaha directly through:

📬 **Email**: [${profileData.contact.email}](mailto:${profileData.contact.email})
📱 **Phone**: ${profileData.contact.phone || '+91 8817036391'}
📍 **Location**: ${profileData.contact.location}

🌐 **Professional Profiles**:
• **GitHub**: [github.com/Nagendrakushwaha](https://github.com/Nagendrakushwaha)
• **LinkedIn**: [linkedin.com/in/nagendra-kushwaha-165ba2296](https://linkedin.com/in/nagendra-kushwaha-165ba2296)

📄 **Resumes Available for Download**:
• **AI/ML Resume** (/AI_ML%20resume.pdf)
• **Data Science Resume** (/Data_science%20resume.pdf)`,
        actions: [
          { type: 'scroll', label: 'Go to Contact Section', payload: 'contact' },
          { type: 'external_link', label: 'Open GitHub Profile', payload: 'https://github.com/Nagendrakushwaha' },
          { type: 'external_link', label: 'Open LinkedIn Profile', payload: 'https://linkedin.com/in/nagendra-kushwaha-165ba2296' },
        ],
        confidence: 0.99,
        sources: ['profile.ts'],
      };
    }

    // 21. Specific Technology inquiry check (e.g., "Does he have experience with Docker/PyTorch/FastAPI?")
    if (query.startsWith('does he have experience with') || query.startsWith('does he know') || query.startsWith('has he worked with')) {
      const techQuery = query.replace(/^(does he have experience with|does he know|has he worked with)\s*/, '').trim();
      const matchedProjects = projectsData.filter((p) =>
        p.technologies.some((t) => t.toLowerCase().includes(techQuery))
      );

      if (matchedProjects.length > 0) {
        return {
          text: `Yes, Nagendra has verified hands-on project experience with **${techQuery.toUpperCase()}**.

He utilized it in the following systems:
${matchedProjects.map((p) => `• **${p.title}**: ${p.shortDescription}`).join('\n')}

Would you like to examine the architecture or repository for any of these projects?`,
          actions: [
            { type: 'project_modal', label: `View ${matchedProjects[0].shortTitle || 'Project'}`, payload: matchedProjects[0].id },
            { type: 'scroll', label: 'Explore Skills Matrix', payload: 'skills' },
          ],
          confidence: 0.94,
          sources: ['projects.ts', 'skills.ts'],
        };
      }
    }

    // 22. Unverified Claim or Metric inquiry test
    if (
      containsAny(query, ['unverified', 'production revenue', 'funding', 'patents', 'awards', 'million users', 'fake', 'not verified'])
    ) {
      return {
        text: `In accordance with Nagendra's strict data integrity standards:

• **No unverified metrics**: Nagendra does not claim commercial revenue, venture funding, patented technology, or client deployments that lack empirical documentation.
• **Transparent evaluation**: All stated performance numbers (such as Banking77 88.72% accuracy, CIC-IDS2017 99.64% test accuracy, or 0.80 CREMA-D AUC) are derived directly from held-out academic and open-source benchmark splits.
• If a metric or credential is not documented in his published GitHub repositories, verified transcripts, or official resumes, it is considered **unverified** and will not be fabricated.`,
        actions: [
          { type: 'scroll', label: 'View Academic Foundation', payload: 'about' },
          { type: 'scroll', label: 'Explore Verified Projects', payload: 'projects' },
        ],
        confidence: 0.95,
        sources: ['profile.ts', 'projects.ts'],
      };
    }

    // 23. Direct project matching by title/slug
    for (const p of projectsData) {
      const pTitle = normalizeText(p.title);
      const pShort = normalizeText(p.shortTitle || '');
      if (query.includes(pTitle) || (pShort && query.includes(pShort))) {
        return {
          text: `**${p.title}** (${p.domain}):

${p.shortDescription}

• **Problem**: ${p.problemStatement}
• **Architecture**: ${p.architectureOverview}
• **Technologies**: ${p.technologies.join(', ')}
${p.githubUrl ? `• **Repository**: [${p.githubUrl}](${p.githubUrl})` : ''}
${p.liveDemoUrl ? `• **Live Demo**: [${p.liveDemoUrl}](${p.liveDemoUrl})` : ''}`,
          actions: [
            { type: 'project_modal', label: `Open ${p.shortTitle || p.title} Case Study`, payload: p.id },
            p.githubUrl ? { type: 'external_link', label: 'GitHub Repository', payload: p.githubUrl } : null,
          ].filter(Boolean) as ChatAction[],
          confidence: 0.92,
          sources: ['projects.ts'],
        };
      }
    }

    // Fallback response: Respectful, intelligent, conversational
    return {
      text: `I'm **Mr. Kennedy**, Nagendra's AI assistant. While I don't have a verified record matching "${raw}", I can guide you through:

• **Verified Projects**: Customer Support AI (ShopEase), Speech Emotion Detection, SiperVision Medical AI, NIDS, and Sales Forecasting.
• **Technical Expertise**: Python, PyTorch, RAG architectures, Scikit-learn, Power BI, and full-stack APIs.
• **Academic Background**: Sam Global University B.Tech CSE (2023–2027, CGPA: 7.85/10).
• **Professional Experience**: UptoSkill Internship, BCG Forage simulation, and Internship Catalyst mentoring.

Feel free to choose one of the suggested topics below or speak your question aloud!`,
      actions: [
        { type: 'scroll', label: 'Explore Verified Projects', payload: 'projects' },
        { type: 'scroll', label: 'View Skills', payload: 'skills' },
        { type: 'scroll', label: 'Contact Nagendra', payload: 'contact' },
      ],
      confidence: 0.5,
      isFallback: true,
      sources: ['profile.ts'],
    };
  }
}

export const kennedyEngine = KennedyKnowledgeEngine.getInstance();
// Backward compatibility alias
export const novaEngine = kennedyEngine;
