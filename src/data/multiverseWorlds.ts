import type { MultiverseWorld } from '../types/portfolio';

export const multiverseWorlds: MultiverseWorld[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    tagline: 'Intelligent Agents & Cognitive Systems',
    description: 'A luminous world illuminated by synaptic neural rings, conversational agents, and decision-making architectures.',
    themeColor: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.6)',
    position: [-4.2, 0.8, -1.5],
    radius: 1.4,
    rotationSpeed: 0.008,
    features: [
      'Customer Support AI & Conversational Agents',
      'Intelligent Anomaly Detection',
      'Knowledge Graphs & Recommendation Systems'
    ]
  },
  {
    id: 'datascience',
    name: 'Data Science & Analytics',
    tagline: 'Statistical Inference & Predictive Intelligence',
    description: 'An azure sphere enveloped in swirling data rings, statistical distributions, and high-dimensional feature analysis.',
    themeColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    position: [3.8, 1.6, -2.5],
    radius: 1.25,
    rotationSpeed: 0.012,
    features: [
      'Exploratory Data Analysis (EDA)',
      'Retail Sales & Demand Forecasting',
      'Fraud Detection & Imbalanced Data Handling'
    ]
  },
  {
    id: 'deeplearning',
    name: 'Deep Learning & Vision',
    tagline: 'Convolutional & Recurrent Neural Architectures',
    description: 'A deep violet cosmic planet radiating with layered tensor networks, acoustic spectral representations, and medical vision.',
    themeColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    position: [-2.2, -2.5, -2.0],
    radius: 1.35,
    rotationSpeed: 0.009,
    features: [
      'Speech Emotion Recognition (SER)',
      'Medical Image Analysis (SiperVision)',
      'Transformer & Recurrent Sequence Modeling'
    ]
  },
  {
    id: 'software',
    name: 'Software & Systems',
    tagline: 'APIs, Pipelines & Engineering Architecture',
    description: 'A structured geometric world representing production APIs, scalable data pipelines, clean code, and deployment systems.',
    themeColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    position: [4.4, -1.8, -1.8],
    radius: 1.15,
    rotationSpeed: 0.007,
    features: [
      'FastAPI & Flask Model Serving',
      'Interactive Streamlit & Web Dashboards',
      'Modular Python Architecture & Version Control'
    ]
  }
];
