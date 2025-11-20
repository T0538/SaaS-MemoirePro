
import { Globe2, MapPin, Wallet, GraduationCap, Calendar, CheckCircle2, FileCheck, Home, Plane, Calculator, AlertCircle } from 'lucide-react';

export interface DestinationData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  color: string; 
  stats: { label: string; value: string }[];
  steps: { title: string; desc: string; icon: any }[];
  universities: string[];
  tips: string[];
  // New Specific Systems
  checklist: string[];
  budget: { item: string; cost: string; icon: any }[];
  deadlines: { month: string; action: string }[];
  relatedGuides: { title: string; link: string }[];
}

export const DESTINATIONS: Record<string, DestinationData> = {
  europe: {
    id: 'europe',
    title: "Étudier en Europe",
    subtitle: "Diplômes d'excellence et ouverture culturelle",
    description: "La France, la Belgique et l'Allemagne restent les destinations favorites. Le système LMD (Licence-Master-Doctorat) est standardisé, facilitant les équivalences et la mobilité via Erasmus+.",
    heroImage: "https://images.unsplash.com/photo-1499856871940-a09627c6d7db?q=80&w=2070&auto=format&fit=crop",
    color: "blue",
    stats: [
      { label: "Coût moyen/an", value: "3k€ - 15k€" },
      { label: "Visa", value: "Schengen VLS-TS" },
      { label: "Langue", value: "Français/Anglais" }
    ],
    steps: [
      { title: "Procédure Campus France", desc: "Inscription obligatoire sur la plateforme 'Études en France' (EEF). Dossier à soumettre avant décembre/janvier pour la rentrée de septembre.", icon: Globe2 },
      { title: "Admission & TCF", desc: "Passez les tests de langue (TCF/DELF) si requis (Niveau B2 minimum souvent exigé). Les universités sélectionnent sur dossier académique.", icon: GraduationCap },
      { title: "Visa & Logement", desc: "Une fois l'accord préalable reçu, bloquez votre caution bancaire (AVI ~7380€) et demandez votre Visa. Réservez votre logement Crous ou privé.", icon: Home }
    ],
    universities: [
      "Sorbonne Université (France)", 
      "Université Libre de Bruxelles (Belgique)", 
      "EPFL (Suisse)", 
      "TU Munich (Allemagne)",
      "Université de Bologne (Italie)"
    ],
    tips: [
      "Privilégiez les villes moyennes (Lille, Toulouse, Lyon) où le coût de la vie est 40% moins cher qu'à Paris.",
      "Le job étudiant est autorisé (20h/semaine) et permet de couvrir une partie des frais de vie.",
      "Les bourses d'exonération partielle existent pour les étudiants étrangers brillants, renseignez-vous tôt."
    ],
    checklist: [
      "Passeport en cours de validité",
      "Attestation de virement irrévocable (AVI)",
      "Attestation d'hébergement (3 mois min.)",
      "Assurance voyage",
      "Derniers relevés de notes certifiés",
      "Certificat TCF/DELF B2"
    ],
    budget: [
      { item: "Logement (Studio)", cost: "400€ - 800€", icon: Home },
      { item: "Alimentation", cost: "200€ - 300€", icon: Wallet },
      { item: "Transport", cost: "30€ - 75€", icon: Plane },
      { item: "Loisirs & Autres", cost: "100€", icon: Calculator }
    ],
    deadlines: [
      { month: "Octobre", action: "Ouverture Campus France" },
      { month: "Décembre", action: "Date limite dossiers" },
      { month: "Avril", action: "Réponses des universités" },
      { month: "Juin", action: "Demande de Visa" }
    ],
    relatedGuides: [
      { title: "Comment rédiger sa lettre de motivation Campus France ?", link: "/blog/guide-methodologique" },
      { title: "Réussir son entretien consulaire (Campus France)", link: "/blog/reussir-soutenance" },
      { title: "Top 10 des villes étudiantes les moins chères", link: "/blog/themes-memoire-licence-pro" },
      { title: "Gérer son budget étudiant en Euro", link: "/resources" }
    ]
  },
  africa: {
    id: 'africa',
    title: "Étudier en Afrique",
    subtitle: "L'excellence continentale en pleine émergence",
    description: "Pourquoi partir loin ? L'Afrique dispose aujourd'hui d'écoles d'ingénieurs et de management de classe mondiale, souvent en partenariat avec des institutions internationales. Le système CAMES garantit la reconnaissance des diplômes.",
    heroImage: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2072&auto=format&fit=crop",
    color: "amber",
    stats: [
      { label: "Coût moyen/an", value: "1k€ - 5k€" },
      { label: "Système", value: "CAMES / LMD" },
      { label: "Croissance", value: "+15% étudiants" }
    ],
    steps: [
      { title: "Concours Communs", desc: "Les grandes écoles (INPHB, CESAG, EAM, 2iE) recrutent via des concours internationaux rigoureux organisés simultanément dans plusieurs capitales.", icon: FileCheck },
      { title: "Dossier Académique", desc: "Pour les universités publiques (UCAD, UGB...), l'admission se fait sur étude des relevés de notes (Seconde à Terminale). La mention au Bac est souvent déterminante.", icon: Calendar },
      { title: "Bourses & Mobilité", desc: "Renseignez-vous sur les bourses d'excellence de votre gouvernement et les programmes de mobilité inter-États.", icon: Wallet }
    ],
    universities: [
      "INPHB (Côte d'Ivoire)", 
      "UCAD - Cheikh Anta Diop (Sénégal)", 
      "UM6P (Maroc)", 
      "2iE (Burkina Faso)",
      "University of Cape Town (Afrique du Sud)"
    ],
    tips: [
      "Les diplômes sont reconnus par le CAMES, facilitant la mobilité professionnelle dans toute l'Afrique francophone.",
      "Les filières techniques (Mines, Pétrole, Agronomie, BTP) offrent une employabilité quasi immédiate sur le continent.",
      "Le coût de la vie est maîtrisé et l'adaptation culturelle est immédiate, permettant de se concentrer sur les études."
    ],
    checklist: [
      "Relevés de notes certifiés",
      "Attestation de réussite au Bac",
      "Extrait de naissance",
      "Carte d'identité nationale",
      "Frais de dossier concours"
    ],
    budget: [
      { item: "Logement (Cité U)", cost: "50€ - 150€", icon: Home },
      { item: "Alimentation", cost: "100€ - 150€", icon: Wallet },
      { item: "Transport", cost: "20€", icon: Plane },
      { item: "Matériel scolaire", cost: "50€", icon: Calculator }
    ],
    deadlines: [
      { month: "Mars", action: "Ouverture des concours" },
      { month: "Mai", action: "Épreuves écrites" },
      { month: "Juillet", action: "Résultats d'admission" },
      { month: "Septembre", action: "Rentrée académique" }
    ],
    relatedGuides: [
      { title: "Préparer les concours d'ingénieurs (INPHB, EAM)", link: "/resources" },
      { title: "Obtenir une bourse d'excellence nationale", link: "/resources" },
      { title: "Les 10 filières d'avenir en Afrique de l'Ouest", link: "/blog/themes-memoire-licence-pro" },
      { title: "Logement étudiant à Dakar et Abidjan", link: "/resources" }
    ]
  },
  canada: {
    id: 'canada',
    title: "Canada & Amérique du Nord",
    subtitle: "Vivre le rêve Nord-Américain",
    description: "Une qualité de vie exceptionnelle, une pédagogie basée sur la pratique et des opportunités d'immigration après les études. Le Canada est très ouvert aux francophones.",
    heroImage: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1965&auto=format&fit=crop",
    color: "red",
    stats: [
      { label: "Coût moyen/an", value: "15k$ - 30k$" },
      { label: "Rentrée", value: "Hiver / Automne" },
      { label: "Travail", value: "Permis Post-Diplôme" }
    ],
    steps: [
      { title: "Admission Universitaire", desc: "Choisissez votre programme (Cégep ou Université). Les délais sont stricts (souvent 6-9 mois avant). Postulez directement sur le site de l'établissement.", icon: GraduationCap },
      { title: "CAQ & Permis d'études", desc: "Spécifique au Québec : obtenez d'abord le Certificat d'Acceptation du Québec (CAQ), puis le permis d'études fédéral. C'est une double procédure.", icon: FileCheck },
      { title: "Preuve Financière", desc: "Vous devez prouver que vous pouvez payer la 1ère année et vivre sur place (env. 15 000 $CAD de subsistance sur un compte bloqué).", icon: Wallet }
    ],
    universities: [
      "Université Laval (Québec)", 
      "Université de Montréal (UdeM)", 
      "McGill University (Anglophone)", 
      "Université d'Ottawa",
      "HEC Montréal"
    ],
    tips: [
      "Il existe des bourses d'exemption pour réduire les frais de scolarité au niveau des étudiants québécois (très sélectif).",
      "Le Permis de Travail Post-Diplôme (PTPD) est un atout majeur pour acquérir une expérience nord-américaine de 3 ans.",
      "Préparez-vous à l'hiver ! Il fait froid, mais les villes souterraines et le confort sont adaptés."
    ],
    checklist: [
      "Passeport valide",
      "Lettre d'admission officielle",
      "Preuves de capacité financière",
      "CAQ (pour le Québec)",
      "Données biométriques",
      "Examen médical (si requis)"
    ],
    budget: [
      { item: "Logement", cost: "800$ - 1200$", icon: Home },
      { item: "Alimentation", cost: "400$", icon: Wallet },
      { item: "Assurance Santé", cost: "75$", icon: AlertCircle },
      { item: "Transport", cost: "100$", icon: Plane }
    ],
    deadlines: [
      { month: "Janvier", action: "Fin des admissions (Automne)" },
      { month: "Mars", action: "Demande de CAQ" },
      { month: "Mai", action: "Demande Permis d'études" },
      { month: "Août", action: "Arrivée au Canada" }
    ],
    relatedGuides: [
      { title: "Lettre d'explication pour le permis d'études", link: "/resources" },
      { title: "Comprendre le système scolaire québécois", link: "/resources" },
      { title: "Budget : Vivre à Montréal avec 1200$", link: "/resources" },
      { title: "Trouver un job étudiant au Canada", link: "/resources" }
    ]
  }
};
