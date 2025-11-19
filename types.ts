
export enum Domain {
  QHSE = 'Qualité, Hygiène, Sécurité, Environnement (QHSE)',
  MARKETING = 'Marketing & Communication',
  MANAGEMENT = 'Management & RH',
  INFORMATIQUE = 'Informatique & Réseaux',
  LOGISTIQUE = 'Logistique & Transport',
  FINANCE = 'Comptabilité & Finance',
  GENIE_CIVIL = 'Génie Civil',
  AUTRE = 'Autre'
}

export interface Section {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'generating' | 'completed';
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface ThesisProject {
  id: string;
  title: string;
  domain: Domain;
  context: string; // Brief description or problematic
  chapters: Chapter[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string; // Contenu complet de l'article (HTML ou Markdown text)
  readTime: string;
  date: string;
  imageUrl?: string;
  slug: string;
  author: string;
}

export interface JuryQuestion {
  id: string;
  question: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  suggestion: string;
}

// --- JURY SIMULATOR TYPES ---

export interface JuryPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  tone: 'Strict' | 'Bienveillant' | 'Technique' | 'Provocateur';
  avatar: string; // Emoji or Icon name
}

export interface JuryMessage {
  id: string;
  sender: 'jury' | 'user';
  content: string;
  score?: number; // 0-100 (Feedback hidden or visible)
  critique?: string; // Internal AI critique
}

export type WizardStep = 'setup' | 'outline' | 'drafting';
