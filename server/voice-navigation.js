/**
 * Core Deterministic Voice-Controlled Portfolio Navigation Router
 * Shared between backend test runner and frontend client.
 */

export function normalizeVoiceInput(input) {
  return (input || '')
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesAny(text, patterns) {
  return patterns.some((p) => {
    if (typeof p === 'string') {
      return text.includes(p);
    }
    return p.test(text);
  });
}

export function matchNavigationIntent(rawInput) {
  const text = normalizeVoiceInput(rawInput);
  if (!text) {
    return {
      matched: false,
      actionType: 'none',
      spokenResponse: '',
      spokenResponseHindi: '',
      displayMessage: '',
    };
  }

  // 1. BEST / FEATURED AI PROJECT
  if (
    matchesAny(text, [
      /\b(best|top|featured|flagship|favorite|primary)\s+(ai\s+)?project\b/,
      /\bshow\s+(me\s+)?(my\s+)?best\b/,
      /\bshowcase\s+best\b/,
      'best ai project',
      'top project',
      'featured project',
      'सबसे अच्छा प्रोजेक्ट',
      'बेस्ट प्रोजेक्ट',
    ])
  ) {
    return {
      matched: true,
      actionType: 'open_project',
      projectSlug: 'customer-support-ai',
      targetId: 'projects',
      spokenResponse: "Opening Nagendra's featured AI project: Customer Support Conversational AI with enterprise RAG and sub-180 millisecond retrieval.",
      spokenResponseHindi: "नागेंद्र का फ्लैगशिप प्रोजेक्ट कस्टमर सपोर्ट कन्वर्सेशनल एआई ओपन किया जा रहा है।",
      displayMessage: "Opening featured AI project case study: **Customer Support Conversational AI (ShopEase)**.",
      actionLabel: "View Customer Support AI",
    };
  }

  // 2. SPECIFIC PROJECT CASE STUDIES (Only if intended as navigation, not as conversational question)
  const hasProjectNavIntent =
    /\b(open|show|view|explore|take\s+me|display|modal|case\s+study|details)\b/.test(text) ||
    /\b(project|system|engine|model|architecture)\b/.test(text) ||
    text.length < 32;
  const isConversationalQuestion = /\b(why|how|what|explain|describe)\b/.test(text);

  if (hasProjectNavIntent && !isConversationalQuestion) {
    if (matchesAny(text, ['customer support', 'shopease', 'banking77', 'कस्टमर सपोर्ट'])) {
      return {
        matched: true,
        actionType: 'open_project',
        projectSlug: 'customer-support-ai',
        targetId: 'projects',
        spokenResponse: "Opening Nagendra's Customer Support Conversational AI project with enterprise RAG and sub-180 millisecond retrieval.",
        spokenResponseHindi: 'कस्टमर सपोर्ट कन्वर्सेशनल एआई प्रोजेक्ट ओपन किया जा रहा है।',
        displayMessage: 'Opening **Customer Support Conversational AI (ShopEase)** case study.',
        actionLabel: 'View Customer Support AI',
      };
    }

    if (matchesAny(text, ['speech emotion', 'audio emotion', 'crema d', 'crema-d', 'vocal emotion', 'स्पीच इमोशन'])) {
      return {
        matched: true,
        actionType: 'open_project',
        projectSlug: 'speech-english-emotion-detection',
        targetId: 'projects',
        spokenResponse: "Opening the Speech Emotion Recognition project utilizing Mel-spectrograms and deep neural representations.",
        spokenResponseHindi: 'स्पीच इमोशन रिकॉग्निशन प्रोजेक्ट खोला जा रहा है।',
        displayMessage: 'Opening **Speech Emotion Recognition** system case study.',
        actionLabel: 'View Speech Emotion Project',
      };
    }

    if (matchesAny(text, ['fraud detection', 'credit card fraud', 'fraud model', 'क्रेडिट कार्ड फ्रॉड'])) {
      return {
        matched: true,
        actionType: 'open_project',
        projectSlug: 'credit-card-fraud-detection',
        targetId: 'projects',
        spokenResponse: "Opening the Credit Card Fraud Detection project, engineered to handle severe class imbalance with precision-recall trade-offs.",
        spokenResponseHindi: 'क्रेडिट कार्ड फ्रॉड डिटेक्शन प्रोजेक्ट ओपन किया जा रहा है।',
        displayMessage: 'Opening **Credit Card Fraud Detection** case study.',
        actionLabel: 'View Fraud Detection Project',
      };
    }

    if (matchesAny(text, ['movie recommendation', 'movie recommender', 'recommendation system', 'मूवी रिकमेंडेशन'])) {
      return {
        matched: true,
        actionType: 'open_project',
        projectSlug: 'movie-recommendation-engine',
        targetId: 'projects',
        spokenResponse: "Opening the Movie Recommendation Engine built with vector cosine similarity and TMDB API metadata.",
        spokenResponseHindi: 'मूवी रिकमेंडेशन इंजन प्रोजेक्ट ओपन किया जा रहा है।',
        displayMessage: 'Opening **Movie Recommendation Engine** case study.',
        actionLabel: 'View Movie Recommendation',
      };
    }

    if (matchesAny(text, ['retail sales', 'sales forecasting', 'store sales', 'time series forecasting', 'सेल्स फोरकास्टिंग'])) {
      return {
        matched: true,
        actionType: 'open_project',
        projectSlug: 'retail-sales-forecasting',
        targetId: 'projects',
        spokenResponse: "Opening the Retail Sales Time-Series Forecasting project powered by XGBoost with seasonality modeling.",
        spokenResponseHindi: 'रिटेल सेल्स टाइम सीरीज फोरकास्टिंग प्रोजेक्ट ओपन किया जा रहा है।',
        displayMessage: 'Opening **Retail Sales Forecasting** case study.',
        actionLabel: 'View Retail Sales Project',
      };
    }

    if (matchesAny(text, ['smartmed', 'radiology', 'x ray', 'chest radiograph', 'medical ai', 'रेडियोलॉजी'])) {
      return {
        matched: true,
        actionType: 'open_project',
        projectSlug: 'smartmed-radiology',
        targetId: 'projects',
        spokenResponse: "Opening the SmartMed Radiology AI project with deep convolutional architectures for pathology classification.",
        spokenResponseHindi: 'स्मार्टमेड रेडियोलॉजी एआई प्रोजेक्ट ओपन किया जा रहा है।',
        displayMessage: 'Opening **SmartMed Radiology AI** case study.',
        actionLabel: 'View Radiology AI',
      };
    }

    if (matchesAny(text, ['nids', 'network intrusion', 'intrusion detection', 'cybersecurity project', 'नेटवर्क इंट्रूजन'])) {
      return {
        matched: true,
        actionType: 'open_project',
        projectSlug: 'nids-network-intrusion',
        targetId: 'projects',
        spokenResponse: "Opening the Network Intrusion Detection System evaluated on over 2.2 million traffic samples.",
        spokenResponseHindi: 'नेटवर्क इंट्रूजन डिटेक्शन सिस्टम प्रोजेक्ट ओपन किया जा रहा है।',
        displayMessage: 'Opening **Network Intrusion Detection System** case study.',
        actionLabel: 'View NIDS Project',
      };
    }
  }

  // 3. RESUME / CV
  if (
    matchesAny(text, [
      /\b(open|show|get|download|view|display)\s+(me\s+)?(my\s+|the\s+)?(resume|cv|biodata|bio\s*data|curriculum\s+vitae)\b/,
      /\b(resume|cv|curriculum\s+vitae)\b/,
      'open my resume',
      'show me my resume',
      'download resume',
      'open resume',
      'view cv',
      'रिज्यूमे खोलो',
      'रिज्यूमे दिखाओ',
      'सीवी खोलो',
      'सीवी दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'open_resume',
      targetId: 'hero',
      spokenResponse: "Opening Nagendra's verified resume in a new tab.",
      spokenResponseHindi: 'नागेंद्र का ऑफिशियल टेक्निकल रिज्यूमे नए टैब में खोला जा रहा है।',
      displayMessage: "Opening Nagendra's verified resume: [AI/ML Resume](/AI_ML%20resume.pdf).",
      actionLabel: 'Download AI/ML Resume',
    };
  }

  // 4. PROFESSIONAL EXPERIENCE
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(professional\s+)?(experience|work|career|jobs?|employment|internships?)\b/,
      /\b(professional\s+experience|work\s+experience|career\s+history|employment\s+history)\b/,
      'show me my professional experience',
      'open my experience',
      'show experience',
      'take me to experience',
      'where did nagendra work',
      'where does nagendra work',
      'tex web solutions',
      'uptoskill',
      'अनुभव दिखाओ',
      'वर्क एक्सपीरियंस दिखाओ',
      'नौकरी दिखाओ',
      'करियर दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'experience',
      spokenResponse: "Here is Nagendra's professional experience, including his role at Tex Web Solutions and data analytics background.",
      spokenResponseHindi: 'यह रहा नागेंद्र का प्रोफेशनल वर्क एक्सपीरियंस और करियर टाइमलाइन।',
      displayMessage: "Navigating to **Professional Experience** (Tex Web Solutions Pvt. Ltd., UptoSkill, BCG Virtual Experience).",
      actionLabel: 'Explore Professional Timeline',
    };
  }

  // 5. EDUCATION
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(education|academics?|college|university|degrees?|qualifications?|studies|school)\b/,
      /\b(academic\s+background|educational\s+background|university\s+degrees?)\b/,
      'take me to my education',
      'show my education',
      'open education',
      'sam global university',
      'cgpa',
      'where did he study',
      'college degree',
      'पढ़ाई दिखाओ',
      'एजुकेशन दिखाओ',
      'कॉलेज दिखाओ',
      'डिग्री दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'education',
      spokenResponse: "Here are Nagendra's academic credentials at Sam Global University with a verified CGPA of 7.85.",
      spokenResponseHindi: 'ये रही नागेंद्र की सैम ग्लोबल यूनिवर्सिटी की एजुकेशनल डिटेल्स और सीजीपीए।',
      displayMessage: "Navigating to **Education** (Sam Global University, B.Tech Computer Science & Engineering, CGPA: 7.85 / 10).",
      actionLabel: 'View Academic Timeline',
    };
  }

  // 6. PROJECTS SECTION
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(projects?|portfolio\s+projects?|ai\s+projects?|ml\s+projects?|work\s+samples?)\b/,
      /\b(projects\s+section|projects\s+galaxy|portfolio\s+showcase)\b/,
      'open my projects',
      'show me my projects',
      'show projects',
      'open projects',
      'explore projects',
      'view projects',
      'work samples',
      'प्रोजेक्ट्स दिखाओ',
      'प्रोजेक्ट्स खोलो',
      'प्रोजेक्ट दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'projects',
      spokenResponse: "Here are Nagendra's projects and machine learning solutions.",
      spokenResponseHindi: 'ये रहे नागेंद्र के वेरीफाइड प्रोजेक्ट्स और मशीन लर्निंग सिस्टम्स।',
      displayMessage: "Navigating to **Projects & AI Solutions** (12 verified machine learning architectures).",
      actionLabel: 'View Projects Galaxy',
    };
  }

  // 7. TECHNICAL SKILLS SECTION
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(skills?|tech\s+stack|technologies|proficiencies|tools|languages)\b/,
      /\b(technical\s+skills|skill\s+matrix|skills\s+section)\b/,
      'show skills',
      'open skills',
      'what technologies does he know',
      'what tools does he use',
      '57 technical skills',
      'स्किल्स दिखाओ',
      'तकनीकी ज्ञान दिखाओ',
      'टूल्स दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'skills',
      spokenResponse: "Here is Nagendra's technical skills matrix spanning 57 verified competencies.",
      spokenResponseHindi: 'ये रही नागेंद्र की 57 टेक्निकल स्किल्स और टेक स्टैक।',
      displayMessage: "Navigating to **Technical Skills & Expertise** (Python, PyTorch, Scikit-learn, Transformers, RAG, FastAPI).",
      actionLabel: 'Explore Skills Matrix',
    };
  }

  // 8. INTERACTIVE ML LAB
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(lab|mllab|ml\s+lab|interactive\s+lab|simulations?|demonstrations?)\b/,
      'interactive ml lab',
      'open lab',
      'show lab',
      'run simulation',
      'लैब दिखाओ',
      'सिम्युलेशन दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'mllab',
      spokenResponse: "Navigating to the Interactive Machine Learning Laboratory.",
      spokenResponseHindi: 'इंटरएक्टिव मशीन लर्निंग लैब पर जाया जा रहा है।',
      displayMessage: "Navigating to **Interactive AI/ML Laboratory** (live model simulators & evaluation charts).",
      actionLabel: 'Open Interactive Lab',
    };
  }

  // 9. CERTIFICATIONS SECTION
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(certifications?|certificates?|credentials?|achievements?|awards?)\b/,
      'show certifications',
      'open certifications',
      'view certificates',
      'सर्टिफिकेट दिखाओ',
      'प्रमाण पत्र दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'certifications',
      spokenResponse: "Here are Nagendra's verified certifications and credentials.",
      spokenResponseHindi: 'ये रहे नागेंद्र के वेरीफाइड सर्टिफिकेट्स और अचीवमेंट्स।',
      displayMessage: "Navigating to **Certifications & Achievements**.",
      actionLabel: 'View Certifications',
    };
  }

  // 10. CONTACT SECTION
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(contact|reach\s+out|hire|inquiries?|get\s+in\s+touch)\b/,
      'open contact',
      'get in touch',
      'how to hire nagendra',
      'email nagendra',
      'phone number',
      'संपर्क करो',
      'कांटेक्ट दिखाओ',
      'ईमेल दिखाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'contact',
      spokenResponse: "Here is Nagendra's contact information and direct channels to get in touch.",
      spokenResponseHindi: 'ये रही नागेंद्र से संपर्क करने की जानकारी।',
      displayMessage: "Navigating to **Contact Section** (shibbuk707@gmail.com • +91 8817036391 • Bhopal, MP).",
      actionLabel: 'Go to Contact',
    };
  }

  // 11. HOMEPAGE / TOP / HERO
  if (
    matchesAny(text, [
      /\b(go\s+back\s+to|take\s+me\s+back\s+to|return\s+to|go\s+to|navigate\s+to)\s+(the\s+)?(home|homepage|top|landing\s+page|hero|start)\b/,
      /\b(return\s+to\s+top|back\s+to\s+top|scroll\s+to\s+top)\b/,
      'go back to the homepage',
      'go back home',
      'back to home',
      'homepage',
      'home section',
      'top of page',
      'होमपेज पर जाओ',
      'होम पर जाओ',
      'शुरुआत में जाओ',
      'ऊपर जाओ',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'hero',
      direction: 'top',
      spokenResponse: "Returning to the homepage.",
      spokenResponseHindi: 'होमपेज पर वापस जाया जा रहा है।',
      displayMessage: "Returning to **Homepage & Hero Overview**.",
      actionLabel: 'Return to Top',
    };
  }

  // 12. ABOUT ME / BIO
  if (
    matchesAny(text, [
      /\b(open|show|take\s+me\s+to|navigate\s+to|go\s+to|scroll\s+to|view)\s+(me\s+)?(my\s+|the\s+)?(about|about\s+me|bio|biography|introduction)\b/,
      'tell me about nagendra',
      'who is nagendra',
      'about nagendra',
      'introduce nagendra',
      'about me',
      'नागेंद्र के बारे में बताओ',
      'अबाउट मी दिखाओ',
      'परिचय दो',
    ])
  ) {
    return {
      matched: true,
      actionType: 'scroll_section',
      targetId: 'about',
      spokenResponse: "Nagendra Kushwaha is an AI and Machine Learning Engineer and aspiring Data Scientist based in Bhopal, specializing in Deep Learning, NLP, and Generative AI.",
      spokenResponseHindi: "नागेंद्र कुशवाहा भोपाल, मध्य प्रदेश स्थित एआई और मशीन लर्निंग इंजीनियर और डेटा साइंटिस्ट हैं।",
      displayMessage: "Nagendra Kushwaha is an **AI/ML Engineer and aspiring Data Scientist** based in Bhopal, Madhya Pradesh, specializing in Deep Learning, NLP, and Generative AI.",
      actionLabel: 'Explore About Me Section',
    };
  }

  // 13. VIEWPORT SCROLL COMMANDS
  if (matchesAny(text, ['scroll down', 'go down', 'page down', 'नीचे जाओ', 'नीचे करो'])) {
    return {
      matched: true,
      actionType: 'scroll_direction',
      direction: 'down',
      spokenResponse: "Scrolling down.",
      spokenResponseHindi: "नीचे स्क्रॉल किया जा रहा है।",
      displayMessage: "Scrolling down portfolio page.",
    };
  }

  if (matchesAny(text, ['scroll up', 'go up', 'page up', 'ऊपर जाओ', 'ऊपर करो'])) {
    return {
      matched: true,
      actionType: 'scroll_direction',
      direction: 'up',
      spokenResponse: "Scrolling up.",
      spokenResponseHindi: "ऊपर स्क्रॉल किया जा रहा है।",
      displayMessage: "Scrolling up portfolio page.",
    };
  }

  // 14. MODAL CLOSE COMMAND
  if (matchesAny(text, ['close modal', 'close project', 'close window', 'exit project', 'बंद करो'])) {
    return {
      matched: true,
      actionType: 'close_modal',
      spokenResponse: "Closing the project case study modal.",
      spokenResponseHindi: "प्रोजेक्ट विंडो बंद की जा रही है।",
      displayMessage: "Closing active modal window.",
    };
  }

  return {
    matched: false,
    actionType: 'none',
    spokenResponse: '',
    spokenResponseHindi: '',
    displayMessage: '',
  };
}
