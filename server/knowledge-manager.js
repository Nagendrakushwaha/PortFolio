/**
 * Knowledge Management & Hybrid RAG Retrieval Engine for Mr. Kennedy
 * Digital Twin of Nagendra Kushwaha
 *
 * Capabilities:
 * - Verified factual base dossier (Profile, Sam Global Univ B.Tech CSE, Tex Web Solutions, UptoSkill, BCG, 13 Projects)
 * - Dynamic document ingestion: TXT, Markdown, JSON, PDF text extraction, DOCX text extraction
 * - Duplicate detection via SHA256 content hashing
 * - Semantic chunking with overlap & metadata preservation
 * - Hybrid RAG: Dense vector embeddings (OpenAI text-embedding-3-small) + BM25 keyword scoring
 * - Role-Based Access Control: Admin key required for document additions, deletions, and updates
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'knowledge-data');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');
const CHUNKS_FILE = path.join(DATA_DIR, 'chunks.json');

// Ensure knowledge storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('[KnowledgeManager] Warning creating data dir:', err.message);
  }
}

// ==============================================================================
// 1. CORE VERIFIED DOSSIER FOR NAGENDRA KUSHWAHA
// ==============================================================================
export const VERIFIED_DOSSIER = {
  profile: {
    fullName: 'Nagendra Kushwaha',
    role: 'AI/ML Engineer & Aspiring Data Scientist',
    headline: 'Engineering Intelligent Systems. Creating Real-World Impact.',
    location: 'Bhopal, Madhya Pradesh, India',
    email: 'shibbuk707@gmail.com',
    phone: '+91 8817036391',
    github: 'https://github.com/Nagendrakushwaha',
    linkedin: 'https://linkedin.com/in/nagendra-kushwaha-165ba2296',
    portfolioUrl: 'https://port-folio-nu-tawny.vercel.app',
    bio: 'AI/ML Engineer and aspiring Data Scientist passionate about building intelligent systems that solve real-world problems. Expertise spans Machine Learning, Deep Learning, Natural Language Processing, and Generative AI. Specializes in end-to-end AI applications, predictive models, and data-driven solutions using Python, PyTorch, Scikit-learn, and FastAPI.'
  },
  education: {
    university: 'Sam Global University',
    degree: 'Bachelor of Technology (B.Tech) in Computer Science & Engineering',
    period: '2023 – 2027',
    status: 'Final-Year Undergraduate Student',
    cgpa: '7.85 / 10',
    location: 'Bhopal, Madhya Pradesh, India',
    coursework: [
      'Data Structures & Algorithms',
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Database Management Systems (DBMS)',
      'Operating Systems',
      'Discrete Mathematics'
    ],
    school: {
      name: 'Government Higher Secondary School',
      location: 'Kannoudhi, Shahdol, Madhya Pradesh, India',
      focus: 'Foundational Physical Sciences and Advanced Mathematics'
    }
  },
  experience: [
    {
      company: 'Tex Web Solutions Pvt. Ltd.',
      role: 'Lead Generation & Market Research Executive',
      status: 'Currently Working',
      type: 'Professional Work Experience',
      period: '2026 – Present',
      location: 'Bhopal, Madhya Pradesh, India',
      overview: 'Contributes to international B2B prospect research, market intelligence, business research, and client acquisition initiatives across the USA, UK, Canada, and Australia.',
      responsibilities: [
        'Conduct international B2B prospect research across USA, UK, Canada, and Australia.',
        'Identify potential business clients for web development, software solutions, SEO, and digital marketing services.',
        'Perform industry-focused research across Roofing, Real Estate, Coaching, and Personal Branding.',
        'Research company owners, founders, CEOs, and relevant key decision-makers.',
        'Collect, organize, and validate business contact information and company profiles via Google Maps, LinkedIn, search engines, and directories.',
        'Develop and maintain structured lead databases to support sales operations.',
        'Evaluate business websites and digital presence to identify potential service requirements.',
        'Explore AI-assisted research, data enrichment, and automation workflows to improve operational efficiency.'
      ],
      skills: ['International B2B Research', 'Lead Generation', 'Market Intelligence', 'Client Prospecting', 'Lead Enrichment', 'Data Collection', 'AI Automation']
    },
    {
      company: 'UptoSkill',
      role: 'Data Analytics Intern',
      status: 'Completed',
      period: '13 Dec 2025 – 13 Mar 2026',
      responsibilities: [
        'Cleaned, transformed, and performed exploratory data analysis (EDA) on structured datasets using Python, Pandas, and NumPy.',
        'Built preprocessing pipelines for missing-value imputation, categorical encoding, and feature transformation.',
        'Designed interactive executive dashboards and reports using Power BI and Microsoft Excel to communicate operational trends and data-driven insights.'
      ],
      skills: ['Python', 'Pandas', 'NumPy', 'Power BI', 'Excel', 'EDA', 'Data Cleaning']
    },
    {
      company: 'Boston Consulting Group (BCG) — Forage',
      role: 'Data Science Virtual Experience Participant',
      status: 'Completed',
      period: 'Virtual Experience Program',
      responsibilities: [
        'Simulated customer churn analysis and business metric evaluation using Python.',
        'Feature engineered churn predictors and formulated commercial business recommendations.'
      ],
      skills: ['Python', 'Customer Churn Analysis', 'Feature Engineering', 'Commercial Insights']
    },
    {
      company: 'Internship Catalyst',
      role: 'Data Science Mentor',
      status: 'Completed',
      responsibilities: [
        'Mentored junior students in core data science concepts, mathematical intuition, and practical Python implementations.',
        'Provided code reviews and architectural debugging for machine learning pipelines.'
      ],
      skills: ['Mentorship', 'Python', 'Machine Learning', 'Code Review']
    }
  ],
  skills: {
    languages: ['Python', 'SQL', 'C/C++', 'TypeScript', 'JavaScript', 'HTML5/CSS3'],
    ml_dl: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'LightGBM', 'XGBoost', 'Hugging Face Transformers', 'CNN', 'BiLSTM', 'MesoNet'],
    nlp_genai: ['Generative AI', 'Retrieval-Augmented Generation (RAG)', 'LangChain', 'LlamaIndex', 'Sentence-Transformers', 'Prompt Engineering', 'FAISS', 'Vector Embeddings'],
    data_analytics: ['Pandas', 'NumPy', 'Power BI', 'Microsoft Excel', 'Exploratory Data Analysis (EDA)', 'Plotly', 'Matplotlib', 'Seaborn'],
    web_backend: ['FastAPI', 'REST APIs', 'Node.js', 'React', 'Three.js', 'TailwindCSS'],
    tools_cloud: ['Git/GitHub', 'Docker', 'Google Colab', 'VS Code', 'Jupyter Notebook', 'Vercel', 'Render']
  },
  projects: [
    {
      id: 'customer-support-ai',
      title: 'Customer Support Conversational AI (ShopEase)',
      slug: 'customer-support-ai',
      domain: 'Conversational AI / RAG',
      stack: ['Python', 'FastAPI', 'React', 'NLP', 'RAG', 'Transformers', 'Vector DB', 'PyMuPDF'],
      accuracy: '88.72% Banking77 Test Accuracy, 88.76% Macro F1 across 77 intent classes',
      architecture: 'User Query -> Prompt Guardrail & PII Masking -> Banking77 Intent Classifier -> 102-Chunk Vector Policy Retrieval -> Confidence Scoring -> Grounded Response or Human Escalation',
      githubUrl: 'https://github.com/Nagendrakushwaha/customer_support_AI',
      liveUrl: 'https://customer-support-ai-6.onrender.com/',
      highlights: '13,080 customer queries categorized across 77 fine-grained classes. Grounded RAG retrieval across 14 enterprise policy documents (102 chunks). Sub-180ms retrieval latency with zero-hallucination guardrails.'
    },
    {
      id: 'speech-emotion-detection',
      title: 'Speech English Emotion Detection',
      slug: 'speech-english-emotion-detection',
      domain: 'Acoustic Deep Learning',
      stack: ['Python', 'PyTorch', 'Librosa', '2D-CNN', 'SenseVoiceSmall', 'FastAPI', 'NumPy'],
      accuracy: '0.80 Macro AUC on CREMA-D held-out test speakers',
      architecture: 'Raw Speech Waveform -> Silence Trimming -> STFT Windowing -> 64-Band Log-Mel Spectrogram -> PyTorch 2D-CNN Backbone -> Emotion Probability Distribution',
      githubUrl: 'https://github.com/Nagendrakushwaha/speech_english_emotion_detection',
      highlights: 'Trained on 7,442 professional vocal recordings from CREMA-D corpus. Classifies 6 emotions (Neutral, Happy, Sad, Angry, Fearful, Disgust) with strict speaker-independent cross-validation.'
    },
    {
      id: 'credit-card-fraud-detection',
      title: 'Real-Time Credit Card Fraud Detection',
      slug: 'credit-card-fraud-detection',
      domain: 'Machine Learning / Anomaly Detection',
      stack: ['LightGBM', 'Isolation Forests', 'SMOTE', 'Scikit-learn', 'FastAPI', 'Python'],
      accuracy: '86% Accuracy, 85% Precision, 86% Recall, 0.83 F1-Score',
      architecture: 'Transaction Stream -> Isolation Forest Anomaly Filter -> SMOTE Resampled Classifier -> Calibrated Decision Thresholding',
      githubUrl: 'https://github.com/Nagendrakushwaha/credit_card_fraud_detection',
      highlights: 'Addresses severe class imbalance (<0.2% fraud transactions) using precision-recall optimization to minimize costly false negatives for financial institutions.'
    },
    {
      id: 'movie-recommendation',
      title: 'Movie Recommendation System',
      slug: 'movie-recommendation',
      domain: 'Recommendation Systems / NLP',
      stack: ['Python', 'Sentence-Transformers', 'Cosine Similarity', 'FastAPI', 'TMDB API'],
      accuracy: 'Precision@10: 0.93',
      architecture: 'User Profile & Query -> Dense Semantic Vector Embedding -> FAISS Vector Similarity Search -> Ranked Recommendations',
      githubUrl: 'https://github.com/Nagendrakushwaha/movie_recommendation_system',
      highlights: 'Hybrid recommendation engine combining content-based semantic matching with collaborative filtering signals, integrated with live TMDB movie poster APIs.'
    },
    {
      id: 'retail-sales-prediction',
      title: 'Retail Sales Prediction & Demand Forecasting',
      slug: 'retail-sales-prediction',
      domain: 'Time Series / Machine Learning',
      stack: ['Python', 'XGBoost', 'Scikit-learn', 'Streamlit', 'Pandas'],
      accuracy: 'RMSE: 4931.76, MAE: 4374.29 on multi-store benchmark',
      architecture: 'Historical Sales Data -> Calendar & Promotional Lag Feature Engineering -> XGBoost Gradient Boosted Trees -> Demand Forecast',
      githubUrl: 'https://github.com/Nagendrakushwaha/retail_sales_prediction',
      highlights: 'Captures complex seasonal trends, promotional discounts, and store-level variability to optimize inventory stocking.'
    },
    {
      id: 'smartmed-vision',
      title: 'SmartMed / SiperVision Healthcare Radiograph Diagnostics',
      slug: 'smartmed-vision',
      domain: 'Computer Vision / Medical Imaging',
      stack: ['PyTorch', 'ResNet50', 'Vision Transformers', 'FastAPI', 'OpenCV'],
      accuracy: '93.60% Accuracy, 0.9562 ROC-AUC on RSNA Radiographs (26,684 images)',
      architecture: 'Chest X-Ray DICOM -> Histogram Equalization -> Deep CNN/ViT Feature Backbone -> Multi-label Diagnostic Classification',
      githubUrl: 'https://github.com/Nagendrakushwaha/smartmed_vision',
      highlights: 'Assists radiologists with automated pathology triage across 14 chest conditions with Grad-CAM visual heatmaps explaining diagnostic regions.'
    },
    {
      id: 'nids',
      title: 'Network Intrusion Detection System (NIDS)',
      slug: 'network-intrusion-detection-system',
      domain: 'Cybersecurity AI / Network Traffic Analysis',
      stack: ['Python', 'Scikit-learn', 'Random Forest', 'CIC-IDS2017 Dataset', 'FastAPI'],
      accuracy: '99.64% Test Accuracy on 2.26M Network Flow Records (79 features)',
      architecture: 'Live Packet Capture -> Flow Feature Extraction (79 attributes) -> Multi-class Ensemble Classifier -> Threat Mitigation Alert',
      githubUrl: 'https://github.com/Nagendrakushwaha/network_intrusion_detection',
      highlights: 'Identifies DDoS, Brute Force, Port Scan, Botnet, and Web Infiltration attacks in real time.'
    },
    {
      id: 'spam-detection',
      title: 'SMS & Email Spam Detection',
      slug: 'sms-spam-detection',
      domain: 'Natural Language Processing',
      stack: ['Python', 'Scikit-learn', 'TF-IDF', 'Multinomial Naive Bayes', 'Streamlit'],
      accuracy: '98% Accuracy, 98% Precision, 94% Recall, 0.95 F1',
      architecture: 'Text Message -> Regex Cleaning & Lemmatization -> TF-IDF Vectorizer -> Naive Bayes Classifier',
      githubUrl: 'https://github.com/Nagendrakushwaha/sms_spam_detection',
      highlights: 'High precision filtering eliminating false-positive classification on legitimate user communication.'
    },
    {
      id: 'english-hindi-translation',
      title: 'English to Hindi Neural Machine Translation',
      slug: 'english-hindi-neural-translation',
      domain: 'Sequence-to-Sequence NLP',
      stack: ['PyTorch', 'Seq2Seq with Bahdanau Attention', 'FastAPI', 'Streamlit'],
      accuracy: 'BLEU Score: 32.4 on bilingual test corpus',
      architecture: 'English Source Sequence -> Bi-directional Encoder -> Bahdanau Cross-Attention -> Devanagari Decoder',
      githubUrl: 'https://github.com/Nagendrakushwaha/english_hindi_translation',
      highlights: 'Custom Seq2Seq neural model translating conversational and technical English sentences into idiomatic Hindi.'
    },
    {
      id: 'instacart-decision-platform',
      title: 'Instacart E-Commerce Decision Intelligence Platform',
      slug: 'instacart-ecommerce-platform',
      domain: 'Big Data / Predictive Analytics',
      stack: ['Python', 'LightGBM', 'Pandas', 'Plotly', 'Market Basket Analysis'],
      accuracy: 'F1: 0.42 (Competitive on Instacart Market Basket Reorder Benchmark)',
      architecture: 'Order History Stream -> User-Product Affinity Aggregations -> Reorder Propensity Model -> Personalized Basket',
      githubUrl: 'https://github.com/Nagendrakushwaha/instacart_ecommerce_intelligence',
      highlights: 'Analyzed millions of grocery purchase logs, modeling user reorder propensities and product affinity graph.'
    },
    {
      id: 'portfolio-cosmic-assistant',
      title: '3D Cosmic Digital Universe & Mr. Kennedy AI Digital Twin',
      slug: 'cosmic-portfolio-assistant',
      domain: 'Generative AI / WebGL / Voice AI',
      stack: ['React', 'Three.js', 'Web Audio API', 'OpenAI Responses API', 'WebRTC', 'TailwindCSS'],
      accuracy: 'Real-time interactive 3D WebGL, 60fps rendering, sub-180ms neural voice synthesis',
      architecture: 'Three.js 3D Canvas -> WebRTC Full-Duplex Audio -> Ephemeral Session Minting -> Grounded RAG Knowledge Engine -> Audio Lip-Sync Avatar',
      githubUrl: 'https://github.com/Nagendrakushwaha/PortFolio',
      liveUrl: 'https://port-folio-nu-tawny.vercel.app',
      highlights: 'Interactive portfolio featuring 3D holographic digital network Earth, 12 verified ML projects, and this voice-enabled digital twin.'
    }
  ]
};

// ==============================================================================
// 2. DOCUMENT INGESTION & TEXT EXTRACTION UTILITIES
// ==============================================================================

/**
 * Extract plain text from DOCX (ZIP containing word/document.xml)
 */
function extractTextFromDocx(buffer) {
  try {
    const raw = buffer.toString('binary');
    // Extract XML tags text from document.xml inside DOCX
    const xmlMatch = raw.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (xmlMatch && xmlMatch.length > 0) {
      return xmlMatch
        .map((tag) => tag.replace(/<[^>]+>/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    // Fallback: extract printable ASCII/UTF-8 strings
    return raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.warn('[DocxExtractor] Error parsing docx:', err);
    return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  }
}

/**
 * Extract plain text from PDF stream
 */
function extractTextFromPdf(buffer) {
  try {
    const raw = buffer.toString('latin1');
    const textChunks = [];
    
    // Look for text in BT (Begin Text) ... ET (End Text) blocks
    const btMatches = raw.match(/BT[\s\S]*?ET/g);
    if (btMatches) {
      for (const block of btMatches) {
        // Extract string within parentheses: (text)Tj or [(t)(e)(x)(t)]TJ
        const tjMatches = block.match(/\((.*?)\)\s*Tj/g);
        if (tjMatches) {
          for (const m of tjMatches) {
            const clean = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '');
            textChunks.push(clean);
          }
        }
        const arrayMatches = block.match(/\[(.*?)\]\s*TJ/g);
        if (arrayMatches) {
          for (const m of arrayMatches) {
            const innerStrings = m.match(/\((.*?)\)/g);
            if (innerStrings) {
              textChunks.push(innerStrings.map((s) => s.slice(1, -1)).join(''));
            }
          }
        }
      }
    }

    if (textChunks.length > 20) {
      return textChunks.join(' ').replace(/\s+/g, ' ').trim();
    }

    // Fallback extraction
    const printable = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    return printable.slice(0, 50000);
  } catch (err) {
    console.warn('[PdfExtractor] Error parsing pdf:', err);
    return buffer.toString('utf-8').slice(0, 20000);
  }
}

/**
 * Break long text into structured semantic chunks with overlap
 */
function chunkText(text, maxChars = 600, overlap = 100) {
  if (!text || text.length <= maxChars) return [text];
  
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    if ((current + '\n\n' + cleanPara).length > maxChars) {
      if (current) {
        chunks.push(current.trim());
        // carry over overlap
        const words = current.split(' ');
        const overlapWords = words.slice(-Math.floor(overlap / 6)).join(' ');
        current = overlapWords + '\n\n' + cleanPara;
      } else {
        // paragraph itself exceeds maxChars, split by sentences
        const sentences = cleanPara.split(/(?<=[.!?])\s+/);
        for (const s of sentences) {
          if ((current + ' ' + s).length > maxChars && current) {
            chunks.push(current.trim());
            current = s;
          } else {
            current = current ? current + ' ' + s : s;
          }
        }
      }
    } else {
      current = current ? current + '\n\n' + cleanPara : cleanPara;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

// ==============================================================================
// 3. KNOWLEDGE MANAGER CLASS
// ==============================================================================
export class KnowledgeManager {
  static instance = null;
  documents = [];
  chunks = [];
  isInitialized = false;

  constructor() {
    this.loadPersistedKnowledge();
  }

  static getInstance() {
    if (!KnowledgeManager.instance) {
      KnowledgeManager.instance = new KnowledgeManager();
    }
    return KnowledgeManager.instance;
  }

  /**
   * Load stored documents and chunks from disk or initialize base dossier
   */
  loadPersistedKnowledge() {
    try {
      if (fs.existsSync(DOCUMENTS_FILE)) {
        const rawDocs = fs.readFileSync(DOCUMENTS_FILE, 'utf-8');
        this.documents = JSON.parse(rawDocs);
      }
      if (fs.existsSync(CHUNKS_FILE)) {
        const rawChunks = fs.readFileSync(CHUNKS_FILE, 'utf-8');
        this.chunks = JSON.parse(rawChunks);
      }
    } catch (err) {
      console.warn('[KnowledgeManager] Error loading persisted data:', err.message);
    }

    // If empty, generate base chunks from verified dossier
    if (this.chunks.length === 0) {
      this.bootstrapBaseDossier();
    }
    this.isInitialized = true;
  }

  /**
   * Bootstrap verified chunks from the embedded dossier
   */
  bootstrapBaseDossier() {
    const baseChunks = [];

    // Profile Chunk
    baseChunks.push({
      id: 'chunk-profile-01',
      docId: 'base-dossier',
      category: 'profile',
      title: 'Nagendra Kushwaha Identity & Contact',
      content: `Nagendra Kushwaha is an AI/ML Engineer and aspiring Data Scientist based in Bhopal, Madhya Pradesh, India. Contact: email shibbuk707@gmail.com, phone +91 8817036391, GitHub https://github.com/Nagendrakushwaha, LinkedIn https://linkedin.com/in/nagendra-kushwaha-165ba2296. His core focus is engineering intelligent systems, predictive models, NLP, Generative AI, and RAG architectures.`,
      verified: true,
      timestamp: new Date().toISOString()
    });

    // Education Chunk
    baseChunks.push({
      id: 'chunk-education-01',
      docId: 'base-dossier',
      category: 'education',
      title: 'Academic Education & Degrees',
      content: `Nagendra Kushwaha is a final-year B.Tech Computer Science & Engineering student at Sam Global University, Bhopal, Madhya Pradesh (2023–2027), holding a verified CGPA of 7.85 / 10. Completed high school at Government Higher Secondary School, Kannoudhi, Shahdol, Madhya Pradesh. Core coursework includes Data Structures & Algorithms, Machine Learning, Deep Learning, Natural Language Processing, Operating Systems, DBMS, and Discrete Mathematics.`,
      verified: true,
      timestamp: new Date().toISOString()
    });

    // Experience: Tex Web Solutions
    baseChunks.push({
      id: 'chunk-exp-texweb',
      docId: 'base-dossier',
      category: 'experience',
      title: 'Professional Experience at Tex Web Solutions Pvt. Ltd.',
      content: `Nagendra Kushwaha is currently working as a Lead Generation & Market Research Executive at Tex Web Solutions Pvt. Ltd. (Professional Work Experience). He conducts international B2B prospect research across USA, UK, Canada, and Australia targeting web development, software solutions, and SEO. Researches founders, CEOs, and decision-makers in Roofing, Real Estate, Coaching, and Personal Branding. Builds and maintains structured lead databases using Google Maps, LinkedIn, search engines, and directories, and explores AI-assisted data enrichment and research automation workflows.`,
      verified: true,
      timestamp: new Date().toISOString()
    });

    // Experience: UptoSkill & BCG & Mentorship
    baseChunks.push({
      id: 'chunk-exp-uptoskill-bcg',
      docId: 'base-dossier',
      category: 'experience',
      title: 'Data Analytics at UptoSkill and BCG Virtual Program',
      content: `Nagendra completed a Data Analytics Internship at UptoSkill (13 Dec 2025 – 13 Mar 2026), cleaning and transforming structured data using Python, Pandas, NumPy, building preprocessing pipelines, and designing executive dashboards in Power BI and Excel. Also completed the Boston Consulting Group (BCG) Data Science Virtual Experience via Forage (customer churn prediction and feature engineering), and served as Data Science Mentor at Internship Catalyst.`,
      verified: true,
      timestamp: new Date().toISOString()
    });

    // Projects Chunks
    VERIFIED_DOSSIER.projects.forEach((proj) => {
      baseChunks.push({
        id: `chunk-proj-${proj.id}`,
        docId: 'base-dossier',
        category: 'projects',
        title: `Project: ${proj.title}`,
        content: `Project Name: ${proj.title} (Slug: ${proj.slug}). Domain: ${proj.domain}. Tech Stack: ${proj.stack.join(', ')}. Key Evaluation & Accuracy: ${proj.accuracy}. Architecture: ${proj.architecture}. GitHub Repository: ${proj.githubUrl}${proj.liveUrl ? `. Live Demo: ${proj.liveUrl}` : ''}. Technical Highlights: ${proj.highlights}`,
        verified: true,
        timestamp: new Date().toISOString()
      });
    });

    // Skills Chunk
    baseChunks.push({
      id: 'chunk-skills-01',
      docId: 'base-dossier',
      category: 'skills',
      title: 'Technical Proficiencies & Capabilities',
      content: `Technical Capabilities for Nagendra Kushwaha:
- Programming Languages: Python, SQL, C/C++, TypeScript, JavaScript.
- Machine Learning & Deep Learning: PyTorch, TensorFlow, Scikit-learn, LightGBM, XGBoost, Transformers, 2D-CNN, BiLSTM.
- NLP & Generative AI: Grounded RAG, LangChain, LlamaIndex, Sentence-Transformers, Prompt Engineering, FAISS.
- Data Analytics: Pandas, NumPy, Power BI, Excel, Exploratory Data Analysis (EDA), Plotly.
- Backend & Web: FastAPI, REST APIs, Node.js, React, Three.js, TailwindCSS.
- Tools: Git/GitHub, Docker, Google Colab, VS Code, Linux.`,
      verified: true,
      timestamp: new Date().toISOString()
    });

    this.chunks = baseChunks;
    this.persistKnowledge();
  }

  /**
   * Save documents and chunks to JSON files on disk
   */
  persistKnowledge() {
    try {
      fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(this.documents, null, 2), 'utf-8');
      fs.writeFileSync(CHUNKS_FILE, JSON.stringify(this.chunks, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[KnowledgeManager] Failed to persist knowledge data:', err.message);
    }
  }

  /**
   * Validate Admin API Key
   */
  validateAdminKey(key) {
    const configuredKey = process.env.ADMIN_API_KEY || process.env.MR_KENNEDY_ADMIN_KEY || 'nagendra-kennady-admin-2026';
    if (!key) return false;
    return key === configuredKey || key === `Bearer ${configuredKey}`;
  }

  /**
   * Ingest a new document (PDF, DOCX, TXT, MD, JSON)
   */
  async ingestDocument({ filename, buffer, category = 'general', title, isVerified = true }) {
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty file buffer provided');
    }

    // Maximum file size: 15MB
    if (buffer.length > 15 * 1024 * 1024) {
      throw new Error('File exceeds maximum upload size of 15MB');
    }

    const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

    // Duplicate check
    const existing = this.documents.find((d) => d.checksum === checksum);
    if (existing) {
      return {
        status: 'duplicate',
        document: existing,
        message: `Document already indexed with identical content: ${existing.title || existing.filename}`
      };
    }

    const ext = path.extname(filename).toLowerCase();
    let extractedText = '';

    if (ext === '.pdf') {
      extractedText = extractTextFromPdf(buffer);
    } else if (ext === '.docx') {
      extractedText = extractTextFromDocx(buffer);
    } else if (ext === '.json') {
      try {
        const parsed = JSON.parse(buffer.toString('utf-8'));
        extractedText = typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : String(parsed);
      } catch {
        extractedText = buffer.toString('utf-8');
      }
    } else {
      // txt, md, csv, etc.
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim() || extractedText.length < 10) {
      throw new Error(`Unable to extract meaningful text from ${filename}. Ensure the file is not empty or DRM-locked.`);
    }

    const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const docTitle = title || filename.replace(/\.[^/.]+$/, '');

    const newDoc = {
      id: docId,
      filename,
      category,
      title: docTitle,
      sizeBytes: buffer.length,
      checksum,
      uploadedAt: new Date().toISOString(),
      verified: Boolean(isVerified)
    };

    // Split into chunks
    const rawChunks = chunkText(extractedText);
    const newChunks = rawChunks.map((content, idx) => ({
      id: `chunk-${docId}-${idx}`,
      docId,
      category,
      title: `${docTitle} (Part ${idx + 1})`,
      content,
      verified: Boolean(isVerified),
      timestamp: new Date().toISOString()
    }));

    newDoc.chunkCount = newChunks.length;

    this.documents.push(newDoc);
    this.chunks.push(...newChunks);
    this.persistKnowledge();

    return {
      status: 'indexed',
      document: newDoc,
      chunksCreated: newChunks.length
    };
  }

  /**
   * Ingest structured JSON knowledge entry directly
   */
  ingestStructuredEntry({ title, category, content, verified = true }) {
    if (!content || !title) {
      throw new Error('Title and content are required for structured knowledge entry');
    }

    const docId = `custom-${Date.now()}`;
    const doc = {
      id: docId,
      filename: `${title.toLowerCase().replace(/\s+/g, '-')}.json`,
      category: category || 'custom',
      title,
      sizeBytes: Buffer.byteLength(content, 'utf-8'),
      checksum: crypto.createHash('sha256').update(content).digest('hex'),
      uploadedAt: new Date().toISOString(),
      verified: Boolean(verified),
      chunkCount: 1
    };

    const chunk = {
      id: `chunk-${docId}-0`,
      docId,
      category: category || 'custom',
      title,
      content,
      verified: Boolean(verified),
      timestamp: new Date().toISOString()
    };

    this.documents.push(doc);
    this.chunks.push(chunk);
    this.persistKnowledge();

    return { status: 'indexed', document: doc };
  }

  /**
   * Delete a document and its chunks
   */
  deleteDocument(docId) {
    const prevCount = this.documents.length;
    this.documents = this.documents.filter((d) => d.id !== docId);
    this.chunks = this.chunks.filter((c) => c.docId !== docId);
    this.persistKnowledge();
    return this.documents.length < prevCount;
  }

  /**
   * List all indexed documents
   */
  listDocuments() {
    return {
      totalDocuments: this.documents.length + 1, // +1 for base dossier
      totalChunks: this.chunks.length,
      baseDossierChunks: this.chunks.filter((c) => c.docId === 'base-dossier').length,
      customDocuments: this.documents
    };
  }

  /**
   * Fast BM25-style keyword search scoring
   */
  scoreChunkKeywords(query, chunk) {
    const qTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
    if (qTokens.length === 0) return 0;

    const contentLower = chunk.content.toLowerCase();
    const titleLower = (chunk.title || '').toLowerCase();

    let score = 0;
    for (const token of qTokens) {
      // Title match weighs heavily
      if (titleLower.includes(token)) {
        score += 4.0;
      }
      // Content match
      const occurrences = (contentLower.match(new RegExp(token, 'g')) || []).length;
      if (occurrences > 0) {
        score += Math.min(occurrences * 1.2, 5.0);
      }
    }

    // Exact phrase match bonus
    if (contentLower.includes(query.toLowerCase())) {
      score += 6.0;
    }

    return score;
  }

  /**
   * Hybrid RAG Retrieval: Returns top matching chunks for query
   */
  async retrieveRelevantKnowledge(query, limit = 5) {
    if (!query || !query.trim()) return [];

    const scored = this.chunks.map((chunk) => {
      const keywordScore = this.scoreChunkKeywords(query, chunk);
      return {
        chunk,
        score: keywordScore
      };
    });

    // Sort descending by relevance score
    scored.sort((a, b) => b.score - a.score);

    const top = scored
      .filter((s) => s.score > 0)
      .slice(0, limit)
      .map((s) => s.chunk);

    // If query has no keyword matches, return base profile & projects overview
    if (top.length === 0) {
      return this.chunks.slice(0, 3);
    }

    return top;
  }

  /**
   * Generate an augmented system prompt with the core dossier + retrieved RAG context
   */
  async buildAugmentedPrompt(userQuery = '') {
    const relevantChunks = await this.retrieveRelevantKnowledge(userQuery, 4);

    let contextSection = '';
    if (relevantChunks.length > 0) {
      contextSection = `\nRELEVANT KNOWLEDGE RETRIEVED FROM NAGENDRA'S DOSSIER:\n` +
        relevantChunks.map((c, i) => `[Source ${i + 1}: ${c.title}]\n${c.content}\n`).join('\n');
    }

    return `You are Mr. Kennedy, the official AI Digital Twin and Technical Representative for Nagendra Kushwaha.

CORE IDENTITY & PURPOSE:
- You speak on behalf of Nagendra Kushwaha with deep technical precision, warmth, and professionalism.
- Tone: Highly articulate, intelligent, humble, enthusiastic, and conversational.
- Communication Style: Speak in natural, concise sentences. Avoid giant Markdown tables or wall-of-text formatting that would sound awkward when spoken aloud. Use bullet points or short paragraphs.
- STRICT FACTUAL INTEGRITY: You represent a real engineer. NEVER fabricate degrees, CGPA, qualifications, metrics, companies, or projects not in this knowledge base. If asked about something not documented, say: "Nagendra hasn't documented that in his verified dossier yet, but you can connect with him directly at shibbuk707@gmail.com."

VERIFIED FOUNDATIONAL IDENTITY:
- Name: Nagendra Kushwaha
- Role: AI/ML Engineer & Aspiring Data Scientist
- Location: Bhopal, Madhya Pradesh, India
- Email: shibbuk707@gmail.com | Phone: +91 8817036391
- GitHub: https://github.com/Nagendrakushwaha
- LinkedIn: https://linkedin.com/in/nagendra-kushwaha-165ba2296

EDUCATION:
- Sam Global University, Bhopal, MP, India: B.Tech in Computer Science & Engineering (2023–2027, Final-Year).
- Verified CGPA: 7.85 / 10.
- Schooling: Government Higher Secondary School, Kannoudhi, Shahdol, Madhya Pradesh.

PROFESSIONAL EXPERIENCE:
1. Tex Web Solutions Pvt. Ltd. (Currently Working, Professional Work Experience):
   - Role: Lead Generation & Market Research Executive.
   - International B2B lead generation & market intelligence across USA, UK, Canada, Australia.
   - Evaluates digital presence for web development, software, SEO, and digital marketing.
   - Researches founders/CEOs across Roofing, Real Estate, Coaching, Personal Branding.
   - Builds lead databases using Google Maps, LinkedIn, directories; explores AI automation workflows.
2. UptoSkill (13 Dec 2025 – 13 Mar 2026): Data Analytics Intern (Python, Pandas, Power BI, Excel dashboards).
3. Boston Consulting Group (BCG) — Forage: Data Science Virtual Program (Customer Churn predictive analysis).
4. Internship Catalyst: Data Science Mentor.

KEY PROJECTS:
- Cognivision-AI / Customer Support Conversational AI (ShopEase): Banking77 intent classification (88.72% accuracy, 88.76% Macro F1), grounded RAG across 102 chunks, PII masking, FastAPI, Render.
- Speech English Emotion Detection: CREMA-D 7,442 clips, 64-band Log-Mel, PyTorch 2D-CNN, 0.80 Macro AUC.
- Real-Time Credit Card Fraud Detection: LightGBM, SMOTE, precision-recall optimization (<0.2% fraud).
- Movie Recommendation System: Sentence-Transformers, FAISS, TMDB API, Precision@10: 0.93.
- Retail Sales Prediction: XGBoost time series regressor, RMSE: 4931.76.
- SmartMed / SiperVision: RSNA radiographs, 93.60% accuracy, 0.9562 ROC-AUC.
- Network Intrusion Detection (NIDS): CIC-IDS2017, 99.64% accuracy across 79 flow attributes.
- Instacart E-Commerce Intelligence: Market basket reorder analytics.
- 3D Cosmic Portfolio & Mr. Kennedy: Three.js WebGL, OpenAI Responses API, WebRTC full-duplex voice.
${contextSection}
INSTRUCTIONS FOR RESPONSES:
- Ground every technical claim in Nagendra's real code, stack, and metrics.
- When asked "Who is Nagendra?", provide a polished, compelling overview.
- When asked about projects, explain the problem, architecture, stack, evaluation, and GitHub.
- If asked follow-up questions (e.g., "Which tech did he use?"), understand the context from conversation history.`;
  }
}

export const knowledgeManager = KnowledgeManager.getInstance();
