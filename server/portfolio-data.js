// Auto-generated portfolio verified dataset
export const profileData = {
  "name": "Nagendra Kushwaha",
  "shortName": "NK",
  "title": "AI & DATA SCIENCE PORTFOLIO",
  "role": "AI/ML Engineer & Data Scientist",
  "direction": "Generative AI / LLM Developer",
  "positioning": "AI/ML Engineer • Data Scientist • Generative AI & Deep Learning Specialist",
  "avatarUrl": "/profile.png",
  "resumes": [
    {
      "label": "AI/ML Resume",
      "url": "/AI_ML%20resume.pdf",
      "filename": "Nagendra_Kushwaha_AI_ML_Resume.pdf"
    },
    {
      "label": "Data Science Resume",
      "url": "/Data_science%20resume.pdf",
      "filename": "Nagendra_Kushwaha_Data_Science_Resume.pdf"
    }
  ],
  "education": {
    "degree": "Bachelor of Technology (B.Tech)",
    "field": "Computer Science and Engineering",
    "institution": "Sam Global University",
    "location": "Bhopal, Madhya Pradesh, India",
    "period": "2023 – 2027",
    "cgpa": "7.85 / 10",
    "schoolName": "Government Higher Secondary School",
    "schoolLocation": "Kannoudhi, Shahdol, Madhya Pradesh, India"
  },
  "careerInterests": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing (NLP)",
    "Retrieval-Augmented Generation (RAG)",
    "Computer Vision & Medical AI",
    "Speech Acoustic Modeling",
    "Data Science & Predictive Analytics"
  ],
  "objective": "I specialize in developing end-to-end AI applications, predictive models, and data-driven solutions using Python, PyTorch, Scikit-learn, and FastAPI. I enjoy turning complex data into meaningful insights and transforming innovative ideas into practical, scalable applications.",
  "bioSummary": "I'm an AI/ML Engineer and aspiring Data Scientist passionate about building intelligent systems that solve real-world problems. My expertise spans Machine Learning, Deep Learning, Natural Language Processing, and Generative AI.",
  "contact": {
    "email": "shibbuk707@gmail.com",
    "phone": "+91 8817036391",
    "github": "https://github.com/Nagendrakushwaha",
    "linkedin": "https://linkedin.com/in/nagendra-kushwaha-165ba2296",
    "location": "Bhopal, Madhya Pradesh, India"
  }
};

export const projectsData = [
  {
    "id": "customer-support-ai",
    "title": "Customer Support Conversational AI (ShopEase)",
    "shortTitle": "ShopEase Conversational AI",
    "slug": "customer-support-ai",
    "domain": "Artificial Intelligence",
    "tag": "Featured / Production Conversational AI",
    "image": "/projects/shopease/cover.png",
    "shortDescription": "Enterprise conversational AI platform combining Banking77 intent classification (88.72% test accuracy, 88.76% Macro F1) with grounded RAG vector search across 102 policy chunks, prompt-injection defense, and PII masking.",
    "problemStatement": "Customer service desks suffer from inaccurate intent recognition, vulnerability to prompt injection attacks, leakage of sensitive user credentials and PII, and hallucinated policy answers.",
    "objective": "Engineer an end-to-end conversational AI customer support engine combining fine-grained intent classification across 77 classes with grounded RAG retrieval across 14 documents (102 vector chunks), automated input sanitization, and confidence-based human agent escalation.",
    "technologies": [
      "Python",
      "FastAPI",
      "React",
      "NLP",
      "RAG",
      "Transformers",
      "Vector DB",
      "PyMuPDF",
      "Prompt Protection"
    ],
    "datasetInfo": {
      "name": "Banking77 Benchmark & Enterprise Policies",
      "description": "13,080 customer queries across 77 intent classes + 14 enterprise policy documents chunked into 102 vector embeddings.",
      "samples": "10,003 Train / 3,080 Test splits",
      "sourceOrType": "Banking77 benchmark + verified enterprise policy corpus"
    },
    "methodology": [
      "Multi-class intent classification across 77 distinct banking and service categories.",
      "Dense semantic vector retrieval across 14 policy documents split into 102 chunks via PyMuPDF.",
      "Multi-tier security guardrails: prompt-injection pattern filtering and regex/embedding-based PII masking.",
      "Calibrated confidence thresholding with seamless routing to human support agents for low-confidence queries.",
      "High-throughput asynchronous FastAPI microservice deployed on Render."
    ],
    "architectureOverview": "User Query -> Prompt Guardrail & PII Masking -> Banking77 Intent Classifier -> 102-Chunk Vector Policy Retrieval -> Confidence Scoring -> Grounded Response or Human Escalation.",
    "metrics": [
      {
        "label": "Banking77 Test Accuracy",
        "value": "88.72%",
        "status": "verified",
        "note": "Evaluated across 77 fine-grained classes"
      },
      {
        "label": "Macro F1-Score",
        "value": "88.76%",
        "status": "verified",
        "note": "Consistent precision/recall balance across rare classes"
      },
      {
        "label": "Policy Index Size",
        "value": "102 Chunks",
        "status": "verified",
        "note": "14 enterprise policy documents indexed"
      },
      {
        "label": "Security Guardrails",
        "value": "PII & Injection Filtered",
        "status": "verified",
        "note": "Sanitizes queries before model inference"
      }
    ],
    "challengesAndLimitations": [
      "Handling 77 fine-grained, semantically overlapping customer intent categories.",
      "Securing generative responses against prompt injection attacks and sensitive data exposure.",
      "Eliminating model hallucinations on strict enterprise policy constraints."
    ],
    "githubUrl": "https://github.com/Nagendrakushwaha/customer_support_AI",
    "liveDemoUrl": "https://customer-support-ai-6.onrender.com/",
    "demoAvailable": true,
    "demoType": "interactive_lab",
    "featured": true
  },
  {
    "id": "speech-emotion-detection",
    "title": "Speech English Emotion Detection",
    "shortTitle": "Speech Emotion Recognition",
    "slug": "speech-english-emotion-detection",
    "domain": "Deep Learning",
    "tag": "Featured / Acoustic Deep Learning",
    "image": "/projects/shopease/cover.png",
    "shortDescription": "Custom deep 2D-CNN in PyTorch classifying 6 speech emotions from 7,442 CREMA-D audio clips with strict speaker-independent splits, achieving 0.80 Macro AUC on held-out test speakers.",
    "problemStatement": "Human speech emotion conveys subtle acoustic cues through pitch variation, temporal energy, and spectral harmonics, but real-world recognition models frequently overfit to specific speaker vocal characteristics rather than generalizable emotional signatures.",
    "objective": "Extract 64-band Log-Mel Spectrograms and 40 acoustic features (MFCCs, RMS, ZCR) and train a deep 2D-CNN with strict speaker-independent cross-validation to classify 6 vocal emotions (Neutral, Happy, Sad, Angry, Fearful, Disgust).",
    "technologies": [
      "Python",
      "PyTorch",
      "Librosa",
      "2D-CNN",
      "SenseVoiceSmall",
      "FastAPI",
      "React",
      "NumPy"
    ],
    "datasetInfo": {
      "name": "CREMA-D Speech Emotion Audio Corpus",
      "description": "7,442 professional vocal recordings with verified multi-speaker emotional expressions.",
      "samples": "7,442 audio clips with speaker-independent patient splits"
    },
    "methodology": [
      "Audio preprocessing, silence trimming, amplitude standardization, and STFT windowing.",
      "Extraction of 64-band Log-Mel Spectrograms and 40 acoustic features (MFCCs, Root-Mean-Square Energy, Zero-Crossing Rate).",
      "Custom 2D Convolutional Neural Network with batch normalization, dropout regularization, and residual blocks.",
      "Integration of SenseVoiceSmall foundation model for ASR transcription alongside low-latency FastAPI inference."
    ],
    "architectureOverview": "Raw Speech Waveform -> STFT Windowing -> 64-Band Log-Mel Spectrogram -> PyTorch 2D-CNN Backbone -> Emotion Probability Distribution (0.80 Macro AUC).",
    "metrics": [
      {
        "label": "Macro AUC",
        "value": "0.80",
        "status": "verified",
        "note": "Measured on held-out unseen speaker identities"
      },
      {
        "label": "Acoustic Bands",
        "value": "64-Band Log-Mel",
        "status": "verified",
        "note": "Captures subtle vocal harmonic energy"
      },
      {
        "label": "Corpus Size",
        "value": "7,442 Clips",
        "status": "verified",
        "note": "CREMA-D benchmark dataset"
      }
    ],
    "challengesAndLimitations": [
      "Speaker individuality and vocal tract geometry causing distribution shifts.",
      "Acoustic microphone noise and clipping in variable real-world recording hardware.",
      "Cross-lingual emotion generalization boundaries."
    ],
    "githubUrl": "https://github.com/Nagendrakushwaha/speech_english_emotion_detection",
    "demoAvailable": true,
    "demoType": "interactive_lab",
    "featured": true
  },
  {
    "id": "sipervision-medical-vision",
    "title": "SiperVision / SmartMed Vision — Explainable Pneumonia Detection",
    "shortTitle": "SmartMed Medical Vision",
    "slug": "sipervision-medical-vision",
    "domain": "Computer Vision",
    "tag": "Featured / Explainable Medical AI",
    "image": "/projects/smartmed-vision/cover.png",
    "shortDescription": "Explainable deep computer vision system on 26,684 RSNA chest DICOM radiographs; fine-tuned EfficientNet-B0 achieving 93.60% accuracy and 0.9562 ROC-AUC with Grad-CAM localization. (Research Only).",
    "problemStatement": "Radiographic opacity detection requires high diagnostic sensitivity and spatial interpretability, but deep neural networks often operate as opaque black boxes without localization verification.",
    "objective": "Build an explainable medical computer vision pipeline comparing ResNet-18, MobileNetV3-Small, and EfficientNet-B0 on RSNA radiographs, combining Grad-CAM attention maps with ground-truth bounding-box localization. Enforces strict educational/research safety boundaries.",
    "technologies": [
      "PyTorch",
      "FastAPI",
      "React",
      "ResNet-18",
      "MobileNetV3-Small",
      "EfficientNet-B0",
      "Grad-CAM",
      "OpenCV",
      "Albumentations"
    ],
    "datasetInfo": {
      "name": "RSNA Pneumonia Detection Challenge",
      "description": "26,684 chest DICOM radiographs with ground-truth bounding-box annotations.",
      "samples": "26,684 radiographs with leak-free patient-level splits",
      "sourceOrType": "Radiological Society of North America (RSNA)"
    },
    "methodology": [
      "Radiograph standardization, CLAHE contrast enhancement, and patient-level train/validation/test splitting.",
      "Transfer learning across three backbones: ResNet-18, MobileNetV3-Small, and EfficientNet-B0.",
      "Grad-CAM saliency mapping to generate visual activation heatmaps and validate alignment against ground-truth bounding boxes.",
      "Sub-60ms CPU inference optimization for clinical decision support simulation served via FastAPI."
    ],
    "architectureOverview": "Chest X-Ray Ingestion -> CLAHE Normalization -> EfficientNet-B0 Backbone -> Binary Pneumonia Classification -> Grad-CAM Saliency & Bounding Box Overlay.",
    "metrics": [
      {
        "label": "EfficientNet-B0 Accuracy",
        "value": "93.60%",
        "status": "verified",
        "note": "Evaluated on leak-free patient test split"
      },
      {
        "label": "ROC-AUC",
        "value": "0.9562",
        "status": "verified",
        "note": "High discriminative sensitivity"
      },
      {
        "label": "CPU Inference Latency",
        "value": "< 60 ms",
        "status": "verified",
        "note": "Optimized for standard clinical workstations"
      }
    ],
    "dataIntegrityNote": "SmartMed Vision / SiperVision is developed strictly for educational and scientific research purposes, not for unassisted clinical diagnosis or patient treatment.",
    "challengesAndLimitations": [
      "Class imbalance and co-occurring pulmonary comorbidities (atelectasis, effusion).",
      "Scanner hardware variation across hospital imaging centers.",
      "Strict regulatory requirement for human-in-the-loop diagnostic review."
    ],
    "githubUrl": "https://github.com/Nagendrakushwaha/SiperVision_medicalVision",
    "demoAvailable": true,
    "demoType": "interactive_lab",
    "featured": true
  },
  {
    "id": "cognivision-ai",
    "title": "Cognivision AI — Multimodal Document Intelligence",
    "shortTitle": "Cognivision Multimodal AI",
    "slug": "cognivision-ai",
    "domain": "Computer Vision",
    "tag": "Featured / Multimodal Document AI",
    "image": "/projects/cognivision/cover.png",
    "shortDescription": "Multimodal Document Intelligence system evaluated on ICDAR SROIE scanned receipts, pairing OCR bounding-box analysis with custom CogniNet-CNN, MobileNetV3-Small, and Grad-CAM explainability optimized for AMD Ryzen 5 CPU.",
    "problemStatement": "Real-world receipt and invoice documents suffer from noisy scans, irregular typography, non-standard layouts, and strict inference latency constraints on standard CPU environments.",
    "objective": "Build an applied multimodal Document AI system combining OCR token spatial representations with visual CNN backbones to parse receipts with visual explainability and edge CPU optimization.",
    "technologies": [
      "PyTorch",
      "FastAPI",
      "React",
      "MobileNetV3-Small",
      "CogniNet-CNN",
      "Grad-CAM",
      "OCR",
      "OpenCV"
    ],
    "datasetInfo": {
      "name": "ICDAR SROIE Benchmark Dataset",
      "description": "Scanned receipts and tax invoices with ground-truth token bounding boxes.",
      "sourceOrType": "ICDAR SROIE Competition Corpus"
    },
    "methodology": [
      "OCR tokenization and 2D spatial bounding-box extraction from scanned documents.",
      "Visual feature extraction using lightweight MobileNetV3-Small and custom CogniNet-CNN.",
      "Grad-CAM heatmap generation to visualize spatial document attention during field extraction.",
      "Inference optimization benchmarked on AMD Ryzen 5 5500U CPU."
    ],
    "architectureOverview": "Scanned Receipt -> OCR Spatial Bounding Boxes -> MobileNetV3-Small / CogniNet-CNN -> Grad-CAM Heatmap -> Key Information Extraction (Company, Date, Total).",
    "metrics": [
      {
        "label": "Target Dataset",
        "value": "ICDAR SROIE Benchmark",
        "status": "verified",
        "note": "Competitive document AI dataset"
      },
      {
        "label": "Optimization Target",
        "value": "AMD Ryzen 5 CPU",
        "status": "verified",
        "note": "Edge CPU latency benchmarked"
      },
      {
        "label": "Explainability",
        "value": "Grad-CAM Attention",
        "status": "verified",
        "note": "Visualizes document token focus"
      }
    ],
    "challengesAndLimitations": [
      "Skewed, low-contrast, or crumpled thermal paper receipts.",
      "Varying invoice formats without standardized key-value positioning."
    ],
    "githubUrl": "https://github.com/Nagendrakushwaha/Cognivision-AI",
    "demoAvailable": false,
    "demoType": "none",
    "featured": true
  },
  {
    "id": "network-intrusion-detection",
    "title": "AI-Powered Network Intrusion Detection System",
    "shortTitle": "Network Intrusion Detection",
    "slug": "network-intrusion-detection",
    "domain": "Cybersecurity",
    "tag": "Featured / Scalable ML",
    "image": "/projects/nids/cover.png",
    "shortDescription": "Scalable network traffic classification pipeline evaluated on CIC-IDS2017 (2,262,141 processed rows × 79 features), achieving 99.64% test accuracy (0.9964) and 0.99 ROC-AUC across ensemble tree models.",
    "problemStatement": "High-throughput computer networks encounter sophisticated intrusions, distributed denial-of-service (DDoS) floods, and port scanning probes that evade signature-based firewalls.",
    "objective": "Preprocess and scale 2.26M+ network flow records from the CIC-IDS2017 benchmark across 79 features, train classical and ensemble tree models, and serve persistent detection through Streamlit.",
    "technologies": [
      "Python",
      "Pandas",
      "NumPy",
      "PySpark",
      "XGBoost",
      "LightGBM",
      "CatBoost",
      "Streamlit"
    ],
    "datasetInfo": {
      "name": "CIC-IDS2017 Cybersecurity Benchmark",
      "description": "2,262,141 processed rows × 79 columns; 565,536 test rows capturing benign traffic and 14 attack profiles.",
      "samples": "2,262,141 rows × 79 features (565,536 test set)",
      "sourceOrType": "Canadian Institute for Cybersecurity (CIC)"
    },
    "methodology": [
      "Merging and cleaning 8 raw network flow CSV captures; removing infinite values and imputing missing fields.",
      "Feature engineering and selection reducing 80+ columns to 79 processed attributes.",
      "Training and comparing 7 model architectures: Logistic Regression, Decision Tree, Random Forest, Extra Trees, XGBoost, LightGBM, and CatBoost.",
      "Model serialization and interactive flow simulation interface in Streamlit."
    ],
    "architectureOverview": "Network Packet Flow Capture -> 79-Dimensional Flow Aggregation -> Robust Scaling -> Ensemble Tree Classifier -> 99.64% Benign/Attack Verdict.",
    "metrics": [
      {
        "label": "Test Accuracy",
        "value": "99.64%",
        "status": "verified",
        "note": "Measured on 565,536 held-out test rows"
      },
      {
        "label": "ROC-AUC",
        "value": "0.99",
        "status": "verified",
        "note": "Exceptional discriminative separation"
      },
      {
        "label": "Precision",
        "value": "0.93",
        "status": "verified",
        "note": "Low false positive alarm rate"
      },
      {
        "label": "Processed Dataset",
        "value": "2.26M Rows × 79 Cols",
        "status": "verified",
        "note": "Full CIC-IDS2017 benchmark"
      }
    ],
    "dataIntegrityNote": "Verified experimental test accuracy: 99.6449% (0.996449) on 565,536 test samples from the processed CIC-IDS2017 split.",
    "challengesAndLimitations": [
      "Extreme class skew between benign background traffic and rare attack vectors.",
      "Inference throughput demands on 10Gbps+ core switching fabrics."
    ],
    "githubUrl": "https://github.com/Nagendrakushwa/AI-Powered-Network-Intrusion-Detection-System",
    "demoAvailable": true,
    "demoType": "interactive_lab",
    "featured": true
  },
  {
    "id": "movie-recommendation-system",
    "title": "Movie Recommendation System",
    "shortTitle": "Movie Recommendation",
    "slug": "movie-recommendation-system",
    "domain": "Machine Learning",
    "tag": "Recommendation Systems",
    "image": "/projects/movie-recommendation/cover.png",
    "shortDescription": "Content-based movie recommendation system using cosine similarity over vectorized metadata, achieving Precision@10 of 0.93 with interactive Streamlit deployment and TMDB API integration.",
    "problemStatement": "Digital streaming catalogs require accurate recommendation algorithms that surface relevant content without cold-start friction.",
    "objective": "Vectorize movie metadata (genres, cast, keywords, directors) and implement cosine similarity ranking to deliver top-K personalized movie recommendations with poster visual fetching.",
    "technologies": [
      "Python",
      "Scikit-learn",
      "Pandas",
      "Streamlit",
      "TMDB API",
      "Cosine Similarity"
    ],
    "datasetInfo": {
      "name": "Movie Metadata & Ratings Corpus",
      "description": "Structured movie metadata containing plot summaries, genres, cast, and user ratings.",
      "sourceOrType": "TMDB & MovieLens corpus"
    },
    "methodology": [
      "Metadata preprocessing, string normalization, and token vectorization.",
      "Cosine similarity matrix computation for content-based retrieval.",
      "Deployment of interactive Streamlit application with live TMDB poster fetching."
    ],
    "architectureOverview": "Movie Catalog -> Metadata Vectorization -> Cosine Similarity Matrix -> Ranked Top-10 Recommendations (Precision@10: 0.93).",
    "metrics": [
      {
        "label": "Precision@10",
        "value": "0.93",
        "status": "verified",
        "note": "Verified top-10 recommendation relevance"
      },
      {
        "label": "Deployment",
        "value": "Streamlit + TMDB API",
        "status": "verified",
        "note": "Live poster and metadata fetching"
      }
    ],
    "challengesAndLimitations": [
      "Cold-start problem for newly released titles with sparse metadata.",
      "Over-specialization without collaborative social signals."
    ],
    "demoAvailable": false,
    "demoType": "none",
    "featured": false
  },
  {
    "id": "retail-sales-forecasting",
    "title": "Retail Sales Forecasting",
    "shortTitle": "Retail Sales Forecasting",
    "slug": "retail-sales-forecasting",
    "domain": "Data Science",
    "tag": "Time-Series Predictive ML",
    "image": "/projects/retail-sales-prediction/cover.png",
    "shortDescription": "Time-series forecasting regression pipeline engineering rolling statistics and lag features; best-performing XGBoost model achieved verified RMSE: 4931.76 and MAE: 4374.29, served via Flask.",
    "problemStatement": "Retail chains require accurate future store sales and inventory demand forecasts to prevent stockouts, minimize inventory holding costs, and optimize staffing.",
    "objective": "Engineer temporal lag features, rolling window statistics, and promotional indicators to train XGBoost and ensemble regressors that forecast multi-horizon retail sales.",
    "technologies": [
      "Python",
      "XGBoost",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Flask",
      "Matplotlib",
      "Seaborn"
    ],
    "datasetInfo": {
      "name": "Historical Retail Store Sales Records",
      "description": "Weekly store department sales records enriched with promotional markdown and calendar indicators.",
      "sourceOrType": "Retail department sales history"
    },
    "methodology": [
      "Time-series decomposition, trend identification, and seasonal lag feature engineering.",
      "Rolling window statistics (7-day, 14-day, 30-day moving averages and standard deviations).",
      "Training and hyperparameter tuning of XGBoost, Random Forest, and linear regression models.",
      "Deployment of Flask web service for sales query projections."
    ],
    "architectureOverview": "Sales History -> Lag & Rolling Feature Engineering -> XGBoost Regressor -> Multi-Horizon Demand Projections (RMSE: 4931.76).",
    "metrics": [
      {
        "label": "Verified RMSE",
        "value": "4931.76",
        "status": "verified",
        "note": "Root Mean Squared Error on test horizon"
      },
      {
        "label": "Verified MAE",
        "value": "4374.29",
        "status": "verified",
        "note": "Mean Absolute Error"
      },
      {
        "label": "Best Model",
        "value": "XGBoost Regressor",
        "status": "verified",
        "note": "Outperformed linear baselines"
      }
    ],
    "challengesAndLimitations": [
      "Unforeseen macro-economic volatility and promotional supply chain shocks.",
      "Sparse historical sales records for newly opened department locations."
    ],
    "githubUrl": "https://github.com/Nagendrakushwa/Retail_Sales_prediction",
    "demoAvailable": false,
    "demoType": "none",
    "featured": false
  },
  {
    "id": "sms-spam-detection",
    "title": "SMS Spam Detection",
    "shortTitle": "SMS Spam Classifier",
    "slug": "sms-spam-detection",
    "domain": "Machine Learning",
    "tag": "NLP Text Classification",
    "image": "/projects/spam-detection/cover.png",
    "shortDescription": "Completed NLP text classification pipeline transforming raw message text into discriminatory signals, achieving verified 98% accuracy, 98% precision, and 0.95 F1 using Scikit-Learn.",
    "problemStatement": "Mobile phone users receive unsolicited spam and phishing text messages that compromise privacy and security.",
    "objective": "Transform raw message text into numerical vectors and evaluate classical probabilistic classifiers to classify SMS messages as spam or legitimate with minimal false alarms.",
    "technologies": [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "NLP",
      "TF-IDF"
    ],
    "datasetInfo": {
      "name": "Spam Message Collection Dataset",
      "description": "Thousands of labeled English SMS messages categorized as legitimate (ham) or spam.",
      "sourceOrType": "Public text benchmark corpus"
    },
    "methodology": [
      "Text lowercasing, punctuation stripping, stopword removal, and tokenization.",
      "TF-IDF n-gram vectorization.",
      "Training Multinomial Naive Bayes and Support Vector Machine classifiers.",
      "Threshold calibration to ensure legitimate ham messages are not misclassified as spam."
    ],
    "architectureOverview": "SMS Text -> Token Normalization -> TF-IDF Vectorizer -> Naive Bayes Classifier -> 98% Accurate Verdict.",
    "metrics": [
      {
        "label": "Accuracy",
        "value": "98%",
        "status": "verified",
        "note": "Verified test accuracy"
      },
      {
        "label": "Precision",
        "value": "98%",
        "status": "verified",
        "note": "High precision prevents legitimate message loss"
      },
      {
        "label": "F1-Score",
        "value": "0.95",
        "status": "verified",
        "note": "Robust harmonic mean"
      }
    ],
    "challengesAndLimitations": [
      "Adversarial misspellings and leetspeak engineered to bypass standard tokenizers.",
      "Zero-tolerance for false positive errors on urgent legitimate communications."
    ],
    "demoAvailable": true,
    "demoType": "interactive_lab",
    "featured": true
  },
  {
    "id": "fraud-detection",
    "title": "Credit Card Fraud Detection",
    "shortTitle": "Fraud Detection",
    "slug": "fraud-detection",
    "domain": "Machine Learning",
    "tag": "Imbalanced Classification",
    "image": "/projects/fraud-detection/cover.png",
    "shortDescription": "Applied classification study on highly skewed credit card transaction data. Demonstrates why baseline Logistic Regression 99.37% (0.9937) accuracy is deceptively misleading, requiring SMOTE balancing to achieve 86% fraud recall and 85% precision.",
    "problemStatement": "Fraudulent financial transactions represent less than 0.2% of total transaction volume. A naive majority-class model easily scores 99.8% accuracy while failing to detect a single actual fraud, necessitating recall-focused metrics and calibrated probability thresholds.",
    "objective": "Apply data preprocessing, feature engineering, and imbalanced classification techniques to identify fraudulent transactions with strong recall (86%) and low false alarms, comparing baseline Logistic Regression (0.9937 accuracy) against balanced ensemble models.",
    "technologies": [
      "Python",
      "Pandas",
      "Scikit-learn",
      "SMOTE",
      "NumPy",
      "Jupyter"
    ],
    "datasetInfo": {
      "name": "Credit Card Fraud Anomaly Dataset",
      "description": "284,807 European cardholder transactions with 28 PCA-transformed features and binary Class label (0.172% fraud incidence).",
      "sourceOrType": "Financial transaction benchmark"
    },
    "methodology": [
      "Standardization of Time and Amount distributions; PCA dimensionality preservation.",
      "Analysis of naive model failure modes: Logistic Regression unweighted achieved 0.9937 accuracy but missed critical frauds due to class imbalance.",
      "Synthetic Minority Over-sampling Technique (SMOTE) and Random Under-Sampling to balance decision planes.",
      "Threshold tuning and Precision-Recall Area Under Curve (PR-AUC) optimization to prioritize fraud recall."
    ],
    "architectureOverview": "Transaction Stream -> PCA Normalization -> Class Rebalancing (SMOTE) -> Calibrated Classifier -> 86% Fraud Recall Alert.",
    "metrics": [
      {
        "label": "SMOTE Recall",
        "value": "86%",
        "status": "verified",
        "note": "Fraud detection sensitivity"
      },
      {
        "label": "Precision",
        "value": "85%",
        "status": "verified",
        "note": "False positive control"
      },
      {
        "label": "Baseline Accuracy",
        "value": "99.37% (0.9937)",
        "status": "reported_historical",
        "note": "Deceptive without recall analysis"
      },
      {
        "label": "F1-Score",
        "value": "0.83",
        "status": "verified",
        "note": "Harmonic mean under balanced sampling"
      }
    ],
    "dataIntegrityNote": "Important methodological lesson: High accuracy (0.9937) alone is not evidence of effective fraud detection. An honest evaluation requires evaluating recall, PR-AUC, and false-negative risk.",
    "challengesAndLimitations": [
      "Concept drift and evolving fraud attack patterns over time.",
      "Strict sub-50ms latency constraints for real-time payment gateway authorization."
    ],
    "githubUrl": "https://github.com/Nagendrakushwaha/coadsoft_task3/blob/main/task%203%20ml%20project.ipynb",
    "demoAvailable": false,
    "demoType": "none",
    "featured": false
  },
  {
    "id": "heart-disease-prediction",
    "title": "Heart Disease Predictive Modeling & Risk Estimator",
    "shortTitle": "Cardiovascular Risk Estimator",
    "slug": "heart-disease-prediction",
    "domain": "Machine Learning",
    "tag": "Predictive Healthcare ML",
    "image": "/projects/smartmed-vision/cover.png",
    "shortDescription": "Supervised predictive modeling pipeline evaluated on 919 patient records across 16 clinical fields, deployed with a Gradio interface. (Educational Demonstration Only).",
    "problemStatement": "Early cardiovascular risk stratification relies on complex interactions between hemodynamic biomarkers (resting blood pressure, serum cholesterol, ST-depression, peak heart rate) that require calibrated multivariable modeling.",
    "objective": "Build an educational machine learning classifier using 919 patient records and 16 clinical attributes to estimate cardiovascular risk probability, deployed via an interactive Gradio web interface.",
    "technologies": [
      "Python",
      "Scikit-learn",
      "Gradio",
      "Pandas",
      "NumPy",
      "Logistic Regression",
      "Random Forest"
    ],
    "datasetInfo": {
      "name": "Cardiovascular Clinical Dataset",
      "description": "919 comprehensive clinical patient records across 16 biometric and cardiovascular attributes.",
      "samples": "919 records × 16 features",
      "sourceOrType": "Multi-source clinical cardiac dataset"
    },
    "methodology": [
      "Data cleaning, missing-value imputation, and categorical encoding across 16 diagnostic variables.",
      "Exploratory data analysis of hemodynamic factors (cholesterol, resting blood pressure, ST-depression oldpeak).",
      "Training and comparative cross-validation of Logistic Regression, Support Vector Classifiers, and Random Forests.",
      "Interactive Gradio web interface for dynamic parameter tuning and risk probability estimation."
    ],
    "architectureOverview": "16 Clinical Attributes -> Data Preprocessing & Scaling -> Calibrated Risk Classifier -> Gradio Web UI Probability Output.",
    "metrics": [
      {
        "label": "Dataset Volume",
        "value": "919 Records",
        "status": "verified",
        "note": "16 clinical diagnostic fields"
      },
      {
        "label": "Interface",
        "value": "Gradio Web UI",
        "status": "verified",
        "note": "Interactive real-time parameter tuning"
      },
      {
        "label": "Safety Boundary",
        "value": "Educational Only",
        "status": "verified",
        "note": "Not for unassisted clinical diagnosis"
      }
    ],
    "dataIntegrityNote": "Educational & research project only. This predictive model is designed to demonstrate multi-variable machine learning methods and must never be used as a clinically validated diagnostic tool.",
    "challengesAndLimitations": [
      "Limited sample size (919 records) compared to institutional medical populations.",
      "Potential demographic bias in original clinical trial cohort distributions."
    ],
    "demoAvailable": true,
    "demoType": "interactive_lab",
    "featured": false
  },
  {
    "id": "instacart-ecommerce-intelligence",
    "title": "Instacart E-Commerce Decision Intelligence Platform",
    "shortTitle": "Instacart Decision Intelligence",
    "slug": "instacart-ecommerce-intelligence",
    "domain": "Data Science",
    "tag": "E-Commerce Analytics & ML",
    "image": "/projects/retail-sales-prediction/cover.png",
    "shortDescription": "Comprehensive customer order and reorder decision intelligence platform combining large-scale exploratory analytics, sequence modeling (100-epoch training schedule), and interactive Plotly visual telemetry.",
    "problemStatement": "High-frequency e-commerce platforms need to anticipate repetitive basket replenishment, identify aisle-level transition probabilities, and personalize cart recommendations across millions of historical orders.",
    "objective": "Analyze order replenishment frequencies, engineer temporal reorder indicators, and model basket-sequencing dynamics across 100 training epochs with rich Plotly analytics.",
    "technologies": [
      "Python",
      "Pandas",
      "NumPy",
      "Deep Learning",
      "Plotly",
      "Scikit-learn",
      "Matplotlib"
    ],
    "datasetInfo": {
      "name": "Instacart Market Basket Analysis Corpus",
      "description": "3M+ customer orders across 200,000+ users, detailing order sequencing, reorder flags, and product aisles.",
      "sourceOrType": "Instacart Market Basket benchmark"
    },
    "methodology": [
      "Data transformation, user-order aggregation, and aisle/department frequency mining.",
      "Feature engineering: user reorder ratio, cart add-order position, days-since-prior-order cycles.",
      "Sequence and representation modeling configured with up to 100 training epochs.",
      "Plotly interactive visual telemetry for department baskets, reorder distributions, and customer clusters."
    ],
    "architectureOverview": "User Order Stream -> Temporal Basket Aggregation -> Sequential Decision Model (100 Epochs) -> Interactive Plotly Telemetry.",
    "metrics": [
      {
        "label": "Training Epochs",
        "value": "100 Epochs",
        "status": "verified",
        "note": "Target model optimization configuration"
      },
      {
        "label": "Visualization",
        "value": "Interactive Plotly",
        "status": "verified",
        "note": "Dynamic department & reorder telemetry"
      },
      {
        "label": "Task Focus",
        "value": "Basket Decision Intelligence",
        "status": "verified",
        "note": "Repeat-purchase predictive analysis"
      }
    ],
    "challengesAndLimitations": [
      "High-dimensional product space with 49,000+ distinct catalog SKUs.",
      "Sparse repeat-purchase histories for occasional or seasonal e-commerce shoppers."
    ],
    "demoAvailable": false,
    "demoType": "none",
    "featured": false
  },
  {
    "id": "english-hindi-translation",
    "title": "English-Hindi Neural Machine Translation",
    "shortTitle": "English-Hindi Translation",
    "slug": "english-hindi-translation",
    "domain": "Deep Learning",
    "tag": "NLP / Generative AI",
    "image": "/projects/english-hindi-translation/cover.png",
    "shortDescription": "Sequence-to-sequence neural machine translation exploration examining the practical details of working with Devanagari text, Unicode normalization, and sentence filtering.",
    "problemStatement": "Parallel bilingual language corpora require careful Unicode normalization, sentence-length filtering, and vocabulary indexing before supporting translation models.",
    "objective": "Implement Devanagari Unicode normalization, sentence-length filtering, and train sequence-to-sequence neural architectures to translate English to Hindi.",
    "technologies": [
      "Python",
      "Deep Learning",
      "NLP",
      "PyTorch",
      "Unicode Normalization"
    ],
    "datasetInfo": {
      "name": "Hindi-English Parallel Text Dataset",
      "description": "Sentence pairs in English and Hindi Devanagari script.",
      "sourceOrType": "Parallel language translation corpus"
    },
    "methodology": [
      "Devanagari Unicode normalization, diacritic handling, and punctuation standardization.",
      "Sentence-length filtering and train/validation/test dataset splitting.",
      "Sequence-to-sequence translation architecture exploration."
    ],
    "architectureOverview": "English Input -> Unicode Normalization -> Seq2Seq Encoder-Decoder -> Devanagari Hindi Translation.",
    "metrics": [
      {
        "label": "Task Focus",
        "value": "Sequence-to-Sequence NLP",
        "status": "verified",
        "note": "Devanagari text representation"
      },
      {
        "label": "Preprocessing",
        "value": "Unicode Normalization",
        "status": "verified",
        "note": "Sentence-length filtering"
      }
    ],
    "challengesAndLimitations": [
      "Morphological complexity and inflectional nuances in Hindi grammar.",
      "Vocabulary out-of-vocabulary (OOV) tokens in domain-specific technical prose."
    ],
    "demoAvailable": false,
    "demoType": "none",
    "featured": false
  }
];

export const skillsData = [
  {
    "name": "Python",
    "level": "Core",
    "category": "Programming",
    "description": "Primary language for data, models, and experiments."
  },
  {
    "name": "NumPy",
    "level": "Core",
    "category": "Programming",
    "description": "Numerical computing and array-based workflows."
  },
  {
    "name": "Pandas",
    "level": "Core",
    "category": "Programming",
    "description": "Data cleaning, transformation, and analysis."
  },
  {
    "name": "SciPy",
    "level": "Working Knowledge",
    "category": "Programming",
    "description": "Scientific and statistical computing foundations."
  },
  {
    "name": "Matplotlib",
    "level": "Working Knowledge",
    "category": "Programming",
    "description": "Clear visual analysis of data and results."
  },
  {
    "name": "Seaborn",
    "level": "Working Knowledge",
    "category": "Programming",
    "description": "Statistical visual exploration."
  },
  {
    "name": "Scikit-learn",
    "level": "Core",
    "category": "Programming",
    "description": "Classical machine learning workflows."
  },
  {
    "name": "PyTorch",
    "level": "Working Knowledge",
    "category": "Programming",
    "description": "Deep learning experimentation and model building."
  },
  {
    "name": "TensorFlow",
    "level": "Working Knowledge",
    "category": "Programming",
    "description": "Exploring deep learning workflows."
  },
  {
    "name": "Keras",
    "level": "Working Knowledge",
    "category": "Programming",
    "description": "High-level neural network experimentation."
  },
  {
    "name": "Regression",
    "level": "Core",
    "category": "Machine Learning",
    "description": "Predictive modeling foundations."
  },
  {
    "name": "Classification",
    "level": "Core",
    "category": "Machine Learning",
    "description": "Supervised learning for practical decisions."
  },
  {
    "name": "Clustering",
    "level": "Working Knowledge",
    "category": "Machine Learning",
    "description": "Unsupervised grouping and exploration."
  },
  {
    "name": "Ensemble Methods",
    "level": "Working Knowledge",
    "category": "Machine Learning",
    "description": "Combining models for robust predictions."
  },
  {
    "name": "XGBoost",
    "level": "Working Knowledge",
    "category": "Machine Learning",
    "description": "Gradient boosting for structured data."
  },
  {
    "name": "LightGBM",
    "level": "Working Knowledge",
    "category": "Machine Learning",
    "description": "Efficient gradient boosting exploration."
  },
  {
    "name": "CatBoost",
    "level": "Working Knowledge",
    "category": "Machine Learning",
    "description": "Boosting with categorical feature support."
  },
  {
    "name": "Feature Engineering",
    "level": "Core",
    "category": "Machine Learning",
    "description": "Turning raw data into useful signals."
  },
  {
    "name": "Data Preprocessing",
    "level": "Core",
    "category": "Machine Learning",
    "description": "Preparing data for reliable modeling."
  },
  {
    "name": "Model Evaluation",
    "level": "Core",
    "category": "Machine Learning",
    "description": "Comparing models with appropriate evaluation thinking."
  },
  {
    "name": "ANN",
    "level": "Working Knowledge",
    "category": "Deep Learning",
    "description": "Artificial neural network foundations."
  },
  {
    "name": "CNN",
    "level": "Working Knowledge",
    "category": "Deep Learning",
    "description": "Convolutional architectures and visual patterns."
  },
  {
    "name": "RNN",
    "level": "Working Knowledge",
    "category": "Deep Learning",
    "description": "Sequence modeling foundations."
  },
  {
    "name": "LSTM",
    "level": "Working Knowledge",
    "category": "Deep Learning",
    "description": "Long-range sequence modeling."
  },
  {
    "name": "GRU",
    "level": "Working Knowledge",
    "category": "Deep Learning",
    "description": "Gated recurrent sequence modeling."
  },
  {
    "name": "Computer Vision",
    "level": "Exploring",
    "category": "Deep Learning",
    "description": "Visual intelligence and representation learning."
  },
  {
    "name": "Transfer Learning",
    "level": "Exploring",
    "category": "Deep Learning",
    "description": "Reusing learned representations."
  },
  {
    "name": "NLP",
    "level": "Working Knowledge",
    "category": "NLP",
    "description": "Working with language data and text pipelines."
  },
  {
    "name": "Transformers",
    "level": "Working Knowledge",
    "category": "NLP",
    "description": "Exploring modern language architectures."
  },
  {
    "name": "Neural Machine Translation",
    "level": "Working Knowledge",
    "category": "NLP",
    "description": "Translation data and sequence-to-sequence concepts."
  },
  {
    "name": "English-Hindi Translation",
    "level": "Working Knowledge",
    "category": "NLP",
    "description": "Language work across English and Devanagari text."
  },
  {
    "name": "Generative AI",
    "level": "Exploring",
    "category": "Generative AI",
    "description": "Learning how generative systems become useful applications."
  },
  {
    "name": "LLM Development",
    "level": "Exploring",
    "category": "Generative AI",
    "description": "Exploring practical large language model workflows."
  },
  {
    "name": "RAG",
    "level": "Exploring",
    "category": "Generative AI",
    "description": "Retrieval-augmented generation concepts."
  },
  {
    "name": "Prompt Engineering",
    "level": "Exploring",
    "category": "Generative AI",
    "description": "Designing clearer instructions for model behavior."
  },
  {
    "name": "Sentence Transformers",
    "level": "Exploring",
    "category": "Generative AI",
    "description": "Semantic representation and similarity."
  },
  {
    "name": "Embeddings",
    "level": "Exploring",
    "category": "Generative AI",
    "description": "Representing language for retrieval and comparison."
  },
  {
    "name": "Vector Databases",
    "level": "Exploring",
    "category": "Generative AI",
    "description": "Learning storage patterns for semantic retrieval."
  },
  {
    "name": "SQL",
    "level": "Core",
    "category": "Data",
    "description": "Querying and reasoning about structured data."
  },
  {
    "name": "PostgreSQL",
    "level": "Working Knowledge",
    "category": "Data",
    "description": "Relational data and production-minded SQL."
  },
  {
    "name": "MySQL",
    "level": "Working Knowledge",
    "category": "Data",
    "description": "Relational database foundations."
  },
  {
    "name": "BigQuery",
    "level": "Exploring",
    "category": "Data",
    "description": "Learning cloud-scale analytical querying."
  },
  {
    "name": "Query Optimization",
    "level": "Exploring",
    "category": "Data",
    "description": "Thinking about efficient data access."
  },
  {
    "name": "Data Analysis",
    "level": "Core",
    "category": "Data",
    "description": "Turning data into clear observations."
  },
  {
    "name": "Data Visualization",
    "level": "Core",
    "category": "Data",
    "description": "Communicating patterns with purposeful visuals."
  },
  {
    "name": "Git",
    "level": "Core",
    "category": "Tools",
    "description": "Version control for repeatable work."
  },
  {
    "name": "GitHub",
    "level": "Core",
    "category": "Tools",
    "description": "Sharing projects and collaborating in public."
  },
  {
    "name": "VS Code",
    "level": "Core",
    "category": "Tools",
    "description": "Primary development environment."
  },
  {
    "name": "Jupyter",
    "level": "Core",
    "category": "Tools",
    "description": "Interactive data and model exploration."
  },
  {
    "name": "Google Colab",
    "level": "Working Knowledge",
    "category": "Tools",
    "description": "Cloud notebooks for experiments."
  },
  {
    "name": "Kaggle",
    "level": "Working Knowledge",
    "category": "Tools",
    "description": "Datasets, notebooks, and practical learning."
  },
  {
    "name": "Power BI",
    "level": "Exploring",
    "category": "Tools",
    "description": "Business-facing data visualization."
  },
  {
    "name": "Streamlit",
    "level": "Working Knowledge",
    "category": "Tools",
    "description": "Lightweight interfaces for data applications."
  },
  {
    "name": "FastAPI",
    "level": "Working Knowledge",
    "category": "Tools",
    "description": "Serving Python capabilities through APIs."
  },
  {
    "name": "Docker",
    "level": "Exploring",
    "category": "Tools",
    "description": "Learning portable application environments."
  },
  {
    "name": "Netlify",
    "level": "Working Knowledge",
    "category": "Tools",
    "description": "Deploying frontend applications."
  },
  {
    "name": "Vercel",
    "level": "Working Knowledge",
    "category": "Tools",
    "description": "Deploying web experiences."
  }
];

export const experienceData = [
  {
    "type": "corporate",
    "role": "Lead Generation & Market Research Executive",
    "organization": "Tex Web Solutions Pvt. Ltd.",
    "period": "Currently Working",
    "isCurrent": true,
    "description": "Working as a Lead Generation & Market Research Executive at Tex Web Solutions Pvt. Ltd., contributing to international B2B prospecting, market intelligence, business research, and client acquisition initiatives. Responsible for identifying potential business opportunities, researching target industries, evaluating companies' digital presence, and maintaining structured prospect databases to support business development activities.",
    "highlights": [
      "Conduct international B2B prospect research across the USA, UK, Canada, and Australia.",
      "Identify potential business clients for web development, software solutions, SEO, and digital marketing services.",
      "Perform industry-focused research across Roofing, Real Estate, Coaching, and Personal Branding.",
      "Research company owners, founders, CEOs, and relevant decision-makers.",
      "Collect, organize, and validate business contact information and company profiles.",
      "Utilize Google Maps, LinkedIn, search engines, business directories, and research platforms.",
      "Develop and maintain structured lead databases to support prospecting and sales operations.",
      "Evaluate business websites and digital presence to identify potential service requirements.",
      "Explore AI-assisted research, data enrichment, and automation workflows to improve operational efficiency."
    ],
    "skillsUsed": [
      "International B2B Research",
      "Lead Generation",
      "Market Intelligence",
      "Business Research",
      "Client Prospecting",
      "Data Collection & Verification",
      "Lead Enrichment",
      "Digital Market Analysis",
      "AI-Assisted Automation"
    ],
    "isEmployment": true
  },
  {
    "type": "internship",
    "role": "Data Analytics Intern",
    "organization": "UptoSkill",
    "period": "13 Dec 2025 – 13 Mar 2026",
    "highlights": [
      "Cleaned, transformed, and performed exploratory data analysis (EDA) on structured datasets using Python, Pandas, and NumPy to identify critical business patterns.",
      "Engineered robust preprocessing pipelines for missing-value handling, categorical encoding, and feature transformation to improve data quality for downstream modeling.",
      "Designed interactive executive dashboards and reports using Power BI and Microsoft Excel to communicate operational trends and data-driven insights to stakeholders."
    ],
    "skillsUsed": [
      "Python",
      "Pandas",
      "NumPy",
      "EDA",
      "Feature Engineering",
      "Power BI",
      "Microsoft Excel",
      "SQL"
    ],
    "isEmployment": true
  },
  {
    "type": "virtual_experience",
    "role": "Data Science Virtual Experience Program",
    "organization": "Boston Consulting Group (BCG) — Forage",
    "period": "Completed Tasks Before Deadline",
    "highlights": [
      "Conducted business case simulation analyzing real-world customer churn and financial indicators.",
      "Performed exploratory data analysis (EDA), customer feature engineering, and model evaluation in Python.",
      "Formulated actionable commercial recommendations and synthesized data-driven business presentations.",
      "Completed project tasks through Forage virtual experience (distinguished from full-time employment)."
    ],
    "skillsUsed": [
      "Python",
      "Exploratory Data Analysis",
      "Customer Analytics",
      "Business Intelligence",
      "Feature Engineering"
    ],
    "isEmployment": false
  },
  {
    "type": "mentorship",
    "role": "Data Science Mentor",
    "organization": "Internship Catalyst",
    "period": "Currently Active",
    "highlights": [
      "Guiding learners through core data science concepts, mathematical intuition, and practical Python implementations.",
      "Mentoring students in analytical thinking, exploratory data analysis, problem solving, and project-based machine learning.",
      "Reviewing code repositories, providing architectural feedback, and assisting in debugging model workflows."
    ],
    "skillsUsed": [
      "Data Science Pedagogy",
      "Machine Learning",
      "Code Review",
      "Python",
      "Analytical Thinking"
    ],
    "isEmployment": false
  },
  {
    "type": "academic",
    "role": "B.Tech in Computer Science and Engineering",
    "organization": "Sam Global University, Bhopal, Madhya Pradesh, India",
    "period": "2023 – 2027 (CGPA: 7.85 / 10)",
    "highlights": [
      "Final-year Computer Science Engineering student specializing in Machine Learning, Deep Learning, Natural Language Processing, and Artificial Intelligence.",
      "Coursework in Data Structures, Algorithms, Discrete Mathematics, Database Management Systems (DBMS), and Operating Systems.",
      "Hands-on empirical research in acoustic feature extraction, grounded RAG architectures, and explainable medical computer vision."
    ],
    "skillsUsed": [
      "C / C++",
      "Python",
      "Data Structures",
      "Algorithms",
      "DBMS",
      "Mathematics for Machine Learning"
    ],
    "isEmployment": false
  },
  {
    "type": "academic",
    "role": "Higher Secondary School Education",
    "organization": "Government Higher Secondary School, Kannoudhi, Shahdol, Madhya Pradesh",
    "period": "Completed",
    "highlights": [
      "Strong foundational focus in physical sciences, mathematics, and analytical problem-solving.",
      "Developed early passion for computer engineering and algorithms."
    ],
    "skillsUsed": [
      "Mathematics",
      "Science",
      "Analytical Thinking",
      "Computer Foundations"
    ],
    "isEmployment": false
  }
];

export const certificationsData = [
  {
    "title": "AI/ML Specialization",
    "issuer": "L&T EduTech",
    "status": "Verified Certification",
    "description": "Comprehensive program covering classical machine learning, neural network architectures, and practical model development."
  },
  {
    "title": "SQL & NoSQL Database Engineering",
    "issuer": "L&T EduTech",
    "status": "Verified Certification",
    "description": "Relational query design, indexing, transactions, and distributed NoSQL storage patterns."
  },
  {
    "title": "Data Analysis with Python",
    "issuer": "IBM SkillsBuild",
    "status": "Verified Certification",
    "description": "End-to-end data wrangling, exploratory data analysis, statistical plotting, and scikit-learn modeling."
  }
];
