
import { Code, Briefcase, Scale, Stethoscope, HardHat, Palette, Megaphone, Users, Languages, Leaf, Calculator, Cpu, Gavel, HeartPulse, Truck, PenTool } from 'lucide-react';

export interface Job {
  title: string;
  salary: string;
  desc: string;
}

export interface Formation {
  level: string; // BAC+3, BAC+5
  name: string;
  desc: string;
}

export interface FiliereData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  icon: any;
  color: string; // 'emerald', 'blue', 'purple', etc.
  stats: { label: string; value: string }[];
  skills: string[];
  jobs: Job[];
  formations: Formation[];
}

export const FILIERES: Record<string, FiliereData> = {
  'informatique': {
    id: 'informatique',
    title: "Informatique & Numérique",
    subtitle: "Codez le monde de demain",
    description: "Le secteur le plus dynamique du siècle. De la cybersécurité à l'IA, les besoins sont immenses et les salaires attractifs, que ce soit en ESN, en startup ou chez les géants de la tech.",
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    icon: Code,
    color: "blue",
    stats: [
      { label: "Salaire Junior", value: "35k€ - 45k€" },
      { label: "Taux d'emploi", value: "98%" },
      { label: "Tendance", value: "IA & Cyber" }
    ],
    skills: ["Algorithmique", "Développement Web/Mobile", "Bases de données", "Gestion de projet Agile", "Cybersécurité"],
    jobs: [
      { title: "Développeur Fullstack", salary: "40k€", desc: "Création de sites et applications de A à Z." },
      { title: "Data Scientist", salary: "48k€", desc: "Analyse de données complexes et IA." },
      { title: "Expert Cybersécurité", salary: "50k€", desc: "Protection des systèmes d'information." }
    ],
    formations: [
      { level: "BAC+3", name: "BUT Informatique / Licence Pro", desc: "Formation technique opérationnelle immédiate." },
      { level: "BAC+5", name: "Master / École d'Ingénieur", desc: "Expertise approfondie et gestion de projet." }
    ]
  },
  'gestion': {
    id: 'gestion',
    title: "Gestion & Commerce",
    subtitle: "Pilotez la performance des entreprises",
    description: "Le cœur du réacteur. Des RH à la Finance en passant par le Management, ces métiers sont indispensables à toute organisation pour structurer son activité et croître.",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    icon: Briefcase,
    color: "emerald",
    stats: [
      { label: "Salaire Junior", value: "32k€ - 42k€" },
      { label: "Insertion", value: "Rapide" },
      { label: "Secteurs", value: "Tous" }
    ],
    skills: ["Comptabilité", "Droit des affaires", "Management d'équipe", "Stratégie", "Anglais professionnel"],
    jobs: [
      { title: "Contrôleur de Gestion", salary: "38k€", desc: "Pilotage des budgets et de la performance." },
      { title: "Responsable RH", salary: "35k€", desc: "Recrutement, formation et gestion sociale." },
      { title: "Business Developer", salary: "35k€ + Variable", desc: "Développement commercial et partenariats." }
    ],
    formations: [
      { level: "BAC+3", name: "Licence Gestion / BUT GEA", desc: "Bases solides en compta, RH et management." },
      { level: "BAC+5", name: "Master / École de Commerce", desc: "Spécialisation (Finance, Audit, RH International)." }
    ]
  },
  'droit': {
    id: 'droit',
    title: "Droit & Sciences Politiques",
    subtitle: "Défendez les droits et régulez la société",
    description: "Une filière d'excellence et de rigueur. Qu'il s'agisse d'avocature, de notariat ou de droit d'entreprise, ce domaine exige une grande capacité d'analyse et de synthèse.",
    heroImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2012&auto=format&fit=crop",
    icon: Scale,
    color: "red",
    stats: [
      { label: "Salaire Junior", value: "30k€ - 60k€" },
      { label: "Sélectivité", value: "Haute" },
      { label: "Débouchés", value: "Juridique & Public" }
    ],
    skills: ["Raisonnement juridique", "Synthèse", "Art oratoire", "Veille réglementaire", "Rédaction"],
    jobs: [
      { title: "Juriste d'entreprise", salary: "35k€", desc: "Conseil juridique interne et conformité." },
      { title: "Avocat", salary: "Variable", desc: "Défense et conseil client (Barreau obligatoire)." },
      { title: "Notaire", salary: "Élevé", desc: "Officier public, expert de l'immobilier et famille." }
    ],
    formations: [
      { level: "BAC+3", name: "Licence de Droit", desc: "Le socle fondamental indispensable." },
      { level: "BAC+5", name: "Master Spécialisé", desc: "Droit des affaires, Droit Pénal, Droit Public..." }
    ]
  },
  'sante': {
    id: 'sante',
    title: "Santé & Social",
    subtitle: "Prendre soin des autres",
    description: "Des métiers de vocation avec une sécurité de l'emploi totale. Le secteur recrute massivement, du soin pur (infirmier, médecin) à l'accompagnement social.",
    heroImage: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop",
    icon: Stethoscope,
    color: "teal",
    stats: [
      { label: "Salaire Junior", value: "25k€ - 50k€" },
      { label: "Demande", value: "Très forte" },
      { label: "Utilité", value: "Maximale" }
    ],
    skills: ["Empathie", "Rigueur scientifique", "Résistance au stress", "Travail d'équipe", "Éthique"],
    jobs: [
      { title: "Infirmier(e) DE", salary: "28k€", desc: "Soins techniques et relationnel patient." },
      { title: "Cadre de Santé", salary: "40k€", desc: "Management d'équipes soignantes." },
      { title: "Éducateur Spécialisé", salary: "25k€", desc: "Accompagnement des publics fragiles." }
    ],
    formations: [
      { level: "BAC+3", name: "Diplôme d'État (DE)", desc: "Formation professionnalisante (IFSI, IRTS)." },
      { level: "BAC+9+", name: "Médecine / Pharmacie", desc: "Parcours long et sélectif." }
    ]
  },
  'ingenierie': {
    id: 'ingenierie',
    title: "Ingénierie & Industrie",
    subtitle: "Concevoir les systèmes complexes",
    description: "BTP, Mécanique, Énergie, Aéronautique. Les ingénieurs façonnent les infrastructures et les produits de demain. Un diplôme très valorisé à l'international.",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
    icon: HardHat,
    color: "orange",
    stats: [
      { label: "Salaire Junior", value: "38k€ - 45k€" },
      { label: "Prestige", value: "Élevé" },
      { label: "International", value: "Oui" }
    ],
    skills: ["Mathématiques", "Physique", "Gestion de projet", "Innovation", "Technique"],
    jobs: [
      { title: "Ingénieur Travaux", salary: "40k€", desc: "Pilotage de chantiers BTP." },
      { title: "Ingénieur R&D", salary: "42k€", desc: "Recherche et développement de nouveaux produits." },
      { title: "Chef de Projet Industriel", salary: "45k€", desc: "Optimisation de la production." }
    ],
    formations: [
      { level: "BAC+5", name: "École d'Ingénieur (CTI)", desc: "La voie royale (Polytech, INSA, Centrales...)." },
      { level: "BAC+3", name: "BUT GMP / GCCD", desc: "Techniciens supérieurs opérationnels." }
    ]
  },
  'art': {
    id: 'art',
    title: "Art, Design & Création",
    subtitle: "Donnez vie à votre imagination",
    description: "Graphisme, UI/UX, Mode, Architecture. Des métiers où la créativité rencontre la technique. La constitution d'un portfolio solide est aussi importante que le diplôme.",
    heroImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974&auto=format&fit=crop",
    icon: Palette,
    color: "purple",
    stats: [
      { label: "Salaire Junior", value: "25k€ - 35k€" },
      { label: "Statut", value: "Salarié / Free" },
      { label: "Portfolio", value: "Crucial" }
    ],
    skills: ["Suite Adobe", "Créativité", "Sens esthétique", "Culture visuelle", "Communication"],
    jobs: [
      { title: "UX/UI Designer", salary: "38k€", desc: "Conception d'interfaces web et mobiles." },
      { title: "Directeur Artistique", salary: "45k€", desc: "Gestion de l'identité visuelle de marques." },
      { title: "Architecte", salary: "35k€", desc: "Conception de bâtiments et espaces." }
    ],
    formations: [
      { level: "BAC+3", name: "DN MADE / Bachelor", desc: "Formation artistique technique." },
      { level: "BAC+5", name: "DSAA / Écoles d'Art", desc: "Conception et direction de projet." }
    ]
  },
  'marketing': {
    id: 'marketing',
    title: "Marketing & Communication",
    subtitle: "Faites connaître et vendre",
    description: "Digital, Événementiel, Relations Presse. Un secteur qui a muté avec le web. La maîtrise des réseaux sociaux et de la data est devenue incontournable.",
    heroImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2070&auto=format&fit=crop",
    icon: Megaphone,
    color: "pink",
    stats: [
      { label: "Salaire Junior", value: "28k€ - 35k€" },
      { label: "Évolution", value: "Rapide" },
      { label: "Digital", value: "Omniprésent" }
    ],
    skills: ["SEO/SEA", "Rédaction", "Analyse de données", "Créativité", "Réseaux sociaux"],
    jobs: [
      { title: "Chef de Produit", salary: "35k€", desc: "Gestion du cycle de vie d'un produit." },
      { title: "Community Manager", salary: "28k€", desc: "Gestion de l'image de marque en ligne." },
      { title: "Traffic Manager", salary: "38k€", desc: "Acquisition de trafic web (Ads, SEO)." }
    ],
    formations: [
      { level: "BAC+3", name: "BUT Tech de Co / InfoCom", desc: "Bases du commerce et de la com." },
      { level: "BAC+5", name: "Master Marketing / ESC", desc: "Stratégie digitale et management." }
    ]
  },
  'social': {
    id: 'social',
    title: "Sciences Sociales & Psycho",
    subtitle: "Comprendre l'humain et la société",
    description: "Psychologie, Sociologie, Histoire. Des études passionnantes qui mènent à l'enseignement, au journalisme, aux RH ou au travail social.",
    heroImage: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop",
    icon: Users,
    color: "indigo",
    stats: [
      { label: "Salaire Junior", value: "24k€ - 32k€" },
      { label: "Secteur", value: "Public / Asso" },
      { label: "Concours", value: "Fréquents" }
    ],
    skills: ["Esprit critique", "Rédaction", "Analyse", "Culture générale", "Écoute"],
    jobs: [
      { title: "Psychologue", salary: "30k€", desc: "Accompagnement thérapeutique (Titre protégé)." },
      { title: "Journaliste", salary: "Variable", desc: "Information et enquête." },
      { title: "Chargé de mission", salary: "28k€", desc: "Gestion de projets publics ou associatifs." }
    ],
    formations: [
      { level: "BAC+3", name: "Licence SHS", desc: "Culture générale et méthodologie." },
      { level: "BAC+5", name: "Master Pro / Recherche", desc: "Spécialisation indispensable pour l'emploi." }
    ]
  },
  'langues': {
    id: 'langues',
    title: "Langues & International",
    subtitle: "Le monde est votre bureau",
    description: "LEA, LLCER, Traduction. Indispensable pour le commerce international, le tourisme, la diplomatie ou l'enseignement. L'anglais ne suffit plus !",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    icon: Languages,
    color: "cyan",
    stats: [
      { label: "Salaire Junior", value: "26k€ - 34k€" },
      { label: "Mobilité", value: "Totale" },
      { label: "Atout", value: "Polyvalence" }
    ],
    skills: ["Traduction", "Interculturalité", "Communication", "Commerce", "Pédagogie"],
    jobs: [
      { title: "Traducteur / Interprète", salary: "Variable", desc: "Transposition de contenus." },
      { title: "Responsable Export", salary: "40k€", desc: "Vente à l'international." },
      { title: "Guide Conférencier", salary: "25k€", desc: "Tourisme et culture." }
    ],
    formations: [
      { level: "BAC+3", name: "Licence LEA / LLCER", desc: "Langues Appliquées (Commerce) ou Littérature." },
      { level: "BAC+5", name: "Master Commerce Int.", desc: "Double compétence Langue + Business." }
    ]
  },
  'environnement': {
    id: 'environnement',
    title: "Environnement & RSE",
    subtitle: "Sauvez la planète, c'est un métier",
    description: "Le secteur de l'avenir. Gestion de l'eau, énergies renouvelables, RSE en entreprise. Des métiers techniques et stratégiques en pleine explosion.",
    heroImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop",
    icon: Leaf,
    color: "green",
    stats: [
      { label: "Salaire Junior", value: "30k€ - 38k€" },
      { label: "Croissance", value: "Explosive" },
      { label: "Impact", value: "Positif" }
    ],
    skills: ["Réglementation", "Biologie/Chimie", "Gestion de projet", "Pédagogie", "Audit"],
    jobs: [
      { title: "Ingénieur Écologue", salary: "35k€", desc: "Étude d'impact sur la biodiversité." },
      { title: "Responsable RSE", salary: "40k€", desc: "Stratégie durable de l'entreprise." },
      { title: "Technicien GPE", salary: "25k€", desc: "Gestion et Protection de l'Environnement." }
    ],
    formations: [
      { level: "BAC+3", name: "BUT HSE / Licence Pro", desc: "Technique et terrain." },
      { level: "BAC+5", name: "Master Environnement", desc: "Ingénierie et stratégie durable." }
    ]
  }
};
