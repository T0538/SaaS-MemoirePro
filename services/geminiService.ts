import { Domain, Chapter, Section, JuryQuestion, JuryPersona, JuryMessage, Reference } from '../types';

// Helper to create ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to clean JSON output from AI
const cleanJson = (text: string): string => {
  // Remove markdown code blocks
  let clean = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  // Remove any leading/trailing whitespace
  return clean.trim();
};

// Helper to clean Raw Text output from AI (remove markdown stars, prefixes)
const cleanRawText = (text: string): string => {
  // Remove stars used for bolding
  let clean = text.replace(/\*\*/g, '').replace(/\*/g, '');
  
  // Remove common AI conversational prefixes (aggressive trimming)
  const prefixesToRemove = [
    /^Absolument[.,!]\s*/i,
    /^Bien sûr[.,!]\s*/i,
    /^Voici le texte[.,!:]\s*/i,
    /^En tant qu'expert.*?[.,!:]\s*/i,
    /^D'accord.*?[.,!]\s*/i,
    /^Certainement.*?[.,!]\s*/i
  ];
  
  prefixesToRemove.forEach(regex => {
    clean = clean.replace(regex, '');
  });

  return clean.trim();
};

const postAI = async (action: string, payload: any): Promise<any> => {
  // En dev (localhost), l'URL est relative. En prod, on utilise la variable d'env VITE_API_URL.
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${baseUrl}/api/gemini`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("AI Error:", data);
    throw new Error(data.error || data.message || 'Service IA indisponible (Erreur inconnue)');
  }
  return data.result;
};

// Modèle performant pour le raisonnement complexe (Plan, Rédaction)
const MODEL_REASONING = 'gemini-2.5-pro';
// Modèle rapide pour les interactions chat (Jury, Questions)
const MODEL_FAST = 'gemini-2.5-flash'; 

// --- INSTRUCTIONS D'HUMANISATION V3 (PRO) ---
const HUMANIZER_INSTRUCTIONS = `
DIRECTIVES CRITIQUES DE STYLE "NIVEAU MASTER/DOCTORAT" :

1. **ANTI-ROBOT STRICT & FORMATAGE** :
   - INTERDIT : Le formatage Markdown (pas de **gras**, pas de *italique* avec des étoiles). Texte brut uniquement style Word.
   - INTERDIT : Le méta-langage ("Voici la section...", "En tant qu'expert...", "Absolument..."). Commencer directement le sujet.
   - INTERDIT : Les phrases de transition lourdes ("Dans un premier temps", "Il est crucial de noter", "En conclusion").
   - INTERDIT : Les listes à puces systématiques. Privilégier les paragraphes rédigés et argumentés.

2. **TON EXPERT & NUANCÉ** :
   - Utilise le "Nous" de modestie ou le "Il" impersonnel.
   - Adopte le doute méthodique : "Il semble que...", "Les données suggèrent...", "Cette hypothèse mérite d'être nuancée".
   - Utilise un vocabulaire technique précis lié au domaine (${Domain.QHSE} => ISO 45001, PDCA, AMDEC ; Finance => EBITDA, IFRS, etc.).

3. **RYTHME & STRUCTURE** :
   - Varie la longueur des phrases (une courte percutante après une longue explicative).
   - Connecte les idées par la logique (Causalité, Opposition) et non par des mots de liaison artificiels.
   - Cite (fictivement ou réellement) des auteurs ou des concepts théoriques pour appuyer l'argumentation.
`;

// --- SYSTEME DE RETRY ---
const runWithRetry = async <T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    // Gestion spécifique des erreurs de surcharge ou de quota
    if (retries > 0 && (error?.status === 503 || error?.status === 429 || error?.message?.includes('overloaded') || error?.message?.includes('quota'))) {
      console.warn(`Gemini API Surchargée. Nouvelle tentative... (${retries} restants)`);
      await new Promise(r => setTimeout(r, delay));
      return runWithRetry(operation, retries - 1, delay * 2);
    }
    console.error("Erreur Gemini non gérée:", error);
    throw error;
  }
};

// --- FONCTIONS DE GÉNÉRATION ---

export interface TopicIdea {
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  methodology: string;
}

export const generateTopicIdeas = async (
  domain: string,
  interests: string
): Promise<TopicIdea[]> => {
  const prompt = `
    RÔLE : Tu es un Directeur de Recherche prestigieux. Ton but est de proposer des sujets de mémoire pertinents, innovants et réalisables.
    
    DOMAINE D'ÉTUDE : ${domain}
    CENTRES D'INTÉRÊT : ${interests}

    TACHE : Propose 3 sujets de mémoire excellents pour un étudiant de ce domaine.
    
    FORMAT DE SORTIE ATTENDU (JSON Tableau d'objets uniquement) :
    [
      {
        "title": "Titre académique complet et accrocheur",
        "description": "Courte explication de la problématique (2 phrases max)",
        "difficulty": "Facile" | "Moyen" | "Difficile",
        "methodology": "Type d'étude conseillée (ex: Qualitative, Étude de cas, Analyse quantitative)"
      }
    ]
  `;

  return runWithRetry(async () => {
    const result = await postAI('generateTopicIdeas', { prompt });
    return result as TopicIdea[];
  });
};

export const generateThesisOutline = async (
  topic: string, 
  domain: Domain, 
  context: string
): Promise<Chapter[]> => {
  
  const prompt = `
    RÔLE : Tu es un Directeur de Recherche universitaire senior, expert en ${domain}.
    
    SUJET DU MÉMOIRE : "${topic}"
    CONTEXTE ET PROBLÉMATIQUE : "${context}"

    MISSION : 
    Générer un plan de mémoire (Sommaire) de niveau Master/Ingénieur, parfaitement structuré, logique et académique.
    Ce plan doit permettre de répondre à une problématique complexe.

    STRUCTURE OBLIGATOIRE :
    1. **Introduction Générale** (Doit contenir : Contextualisation, Problématique, Hypothèses, Annonce du plan).
    2. **PARTIE I : Cadre Théorique / Revue de Littérature** (État de l'art, définitions, concepts clés).
    3. **PARTIE II : Méthodologie / Cadre Empirique** (Démarche, outils, terrain d'étude).
    4. **PARTIE III : Résultats & Discussion** (Analyse des données, vérification des hypothèses, préconisations).
    5. **Conclusion Générale** (Synthèse, limites, ouverture).
    6. **Bibliographie** (Juste le titre du chapitre).

    CONSIGNES DE QUALITÉ :
    - Titres précis et évocateurs (Pas juste "Chapitre 1", mais "Chapitre 1 : L'impact de la RSE sur...").
    - Sous-parties logiques (Sections).
    - Vocabulaire académique pointu.
    
    FORMAT DE SORTIE :
    Réponds UNIQUEMENT avec un tableau JSON valide respectant ce schéma exact.
  `;

  try {
    const rawData = await postAI('generateThesisOutline', { topic, domain, context });
    return rawData.map((chap: any) => ({
      id: generateId(),
      title: chap.title,
      sections: chap.sections.map((secTitle: string) => ({
        id: generateId(),
        title: secTitle,
        content: "",
        status: 'pending'
      }))
    }));
  } catch (error) {
    console.error("Error generating outline:", error);
    throw new Error("Impossible de générer le plan. Veuillez vérifier votre connexion ou réessayer plus tard.");
  }
};

export const parseImportedOutline = (text: string): Chapter[] => {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    // Détection améliorée des chapitres (I., 1., Chapitre, Partie)
    const isChapter = /^(chapitre|partie|module|\d+\.|[IVX]+\.)/i.test(trimmed) || 
                      (trimmed === trimmed.toUpperCase() && /[a-zA-Z]/.test(trimmed) && trimmed.length > 4);

    if (isChapter) {
      currentChapter = {
        id: generateId(),
        title: trimmed.replace(/^(chapitre|partie|module|\d+\.|[IVX]+\.)\s*[:|-]?\s*/i, '').trim(),
        sections: []
      };
      chapters.push(currentChapter);
    } else {
      if (!currentChapter) {
         currentChapter = { id: generateId(), title: "Introduction Générale", sections: [] };
         chapters.push(currentChapter);
      }
      const cleanTitle = trimmed.replace(/^[-*•>]\s*/, '').trim();
      if(cleanTitle) {
          currentChapter.sections.push({ id: generateId(), title: cleanTitle, content: "", status: 'pending' });
      }
    }
  });
  
  return chapters;
}

export const generateSectionContent = async (
  topic: string,
  domain: Domain,
  chapterTitle: string,
  sectionTitle: string,
  currentContent: string = ""
): Promise<string> => {

  const prompt = `
    RÔLE : Tu es un chercheur académique rédigeant une section de mémoire.
    SUJET GLOBAL : ${topic}
    CHAPITRE : "${chapterTitle}"
    SECTION À RÉDIGER : "${sectionTitle}"

    ${HUMANIZER_INSTRUCTIONS}
    
    CONSIGNE DE RÉDACTION :
    - Rédige un contenu dense (environ 600-800 mots).
    - Structure : Introduction de la section -> Développement argumenté -> Conclusion partielle.
    - Intègre des références théoriques implicites ou explicites.
    - Sois très analytique. Évite la description simple.
    
    ${currentContent ? `NOTE IMPORTANTE : Complète et enrichis ce début de texte : "${currentContent}"` : ''}
  `;

  try {
    const text = await postAI('generateSectionContent', { prompt });
    return cleanRawText(text || "");
  } catch (error) {
    console.error("Erreur rédaction:", error);
    throw new Error("Service de rédaction momentanément indisponible.");
  }
};

export const improveText = async (text: string, instruction: string): Promise<string> => {
  try {
    const res = await postAI('improveText', { prompt: `
        RÔLE : Éditeur académique rigoureux.
        TEXTE SOURCE : "${text}"
        INSTRUCTION : "${instruction}"
        
        MISSION : Réécris le texte en appliquant l'instruction.
        CRITÈRES : Ton universitaire, vocabulaire riche, syntaxe impeccable.
        FORMAT : Texte brut sans markdown ni commentaires.
      ` });
    return cleanRawText(res || text);
  } catch (e) {
    return text;
  }
};

export const expandContent = async (text: string, domain: string): Promise<string> => {
  try {
    const prompt = `
      RÔLE : Expert académique en ${domain}.
      MISSION : Transformer ces notes en un texte académique formel et dense.
      
      NOTES SOURCE : "${text}"

      OBJECTIF : 
      - Tripler le volume.
      - Ajouter des exemples concrets et des définitions.
      - Assurer les transitions logiques.
      - Ton formel, scientifique et professionnel.

      FORMAT IMPÉRATIF :
      - Texte brut uniquement (style Word).
      - AUCUNE étoile (*) pour le gras ou l'italique.
      - AUCUNE phrase de discussion ("Voici le texte...", "Absolument...", "J'ai développé...").
      - Commence DIRECTEMENT par le contenu rédactionnel.
    `;

    const res = await postAI('expandContent', { prompt });
    return cleanRawText(res || text);
  } catch (e) {
    throw new Error("Impossible d'étendre le contenu.");
  }
};

export const generateJuryQuestions = async (text: string, domain: string): Promise<JuryQuestion[]> => {
  try {
    const prompt = `
      Analyse ce texte de mémoire en tant que Jury de soutenance sévère (${domain}).
      Texte : "${text.substring(0, 4000)}"

      Génère 3 questions pertinentes (pièges, méthodologie, ou approfondissement théorique).
      Réponds UNIQUEMENT en JSON.
    `;

    const data = await postAI('generateJuryQuestions', { prompt });

    return data.map((q: any) => ({
        id: generateId(),
        question: q.question,
        difficulty: 'Difficile',
        suggestion: q.suggestion
    }));
  } catch (e) {
    console.error("Erreur Jury Questions:", e);
    return [];
  }
};

export const interactWithJury = async (
    history: JuryMessage[], 
    persona: JuryPersona, 
    topic: string
  ): Promise<{ content: string; score: number; critique: string }> => {
  
    const lastUserMessage = history.filter(m => m.sender === 'user').pop()?.content || "Je suis prêt.";
    const chatHistory = history.map(m => `${m.sender === 'jury' ? 'JURY' : 'CANDIDAT'}: ${m.content}`).join('\n');
  
    const prompt = `
      SIMULATION GRAND ORAL.
      Rôle : ${persona.name}, ${persona.role}. 
      Caractère : ${persona.tone}.
      Sujet du mémoire : ${topic}.

      HISTORIQUE DE LA DISCUSSION :
      ${chatHistory}

      DERNIÈRE RÉPONSE DU CANDIDAT : "${lastUserMessage}"

      MISSION :
      1. Analyse la réponse du candidat (Clarté, Pertinence, Profondeur).
      2. Si la réponse est faible, attaque ou demande des précisions.
      3. Si la réponse est forte, passe à un autre angle ou félicite brièvement avant de relancer.
      4. Reste dans le personnage (${persona.tone}).

      FORMAT JSON ATTENDU :
      { "jury_response": "...", "score": 85, "critique": "Explication de la note..." }
    `;
  
    try {
      const data = await postAI('interactWithJury', { prompt });
      
      return {
        content: data.jury_response || "Pouvez-vous préciser votre pensée ?",
        score: data.score || 50,
        critique: data.critique || "Analyse en cours..."
      };
    } catch (e) {
      return { content: "Je n'ai pas bien compris, pouvez-vous répéter ?", score: 50, critique: "Erreur technique." };
    }
};

export const suggestReferences = async (topic: string, domain: string): Promise<Reference[]> => {
  try {
    const prompt = `
      Agis comme un bibliothécaire universitaire expert en ${domain}.
      Sujet : "${topic}".
      
      Trouve 5 références bibliographiques MAJEURES et RÉELLES (Ouvrages de référence, Articles fondateurs).
      Format attendu : JSON (Liste d'objets avec title, author, year).
    `;

    const data = await postAI('suggestReferences', { prompt });

    return data.map((ref: any) => ({
      id: generateId(),
      type: 'book',
      title: ref.title,
      author: ref.author,
      year: ref.year,
      citation: `${ref.author} (${ref.year}). ${ref.title}.`
    }));
  } catch (e) {
    console.error("Erreur Biblio:", e);
    return [];
  }
}

export const askDocumentContext = async (query: string, documentsContext: string): Promise<string> => {
  try {
    const prompt = `
      CONTEXTE DOCUMENTAIRE :
      "${documentsContext.substring(0, 50000)}" // Large context allowed in Gemini 1.5

      QUESTION UTILISATEUR : "${query}"
      
      Réponds à la question en te basant EXCLUSIVEMENT sur le contexte fourni ci-dessus.
      Si la réponse n'est pas dans le texte, dis-le.
    `;
    const res = await postAI('askDocumentContext', { prompt });
    return res || "Je ne trouve pas la réponse dans vos documents.";
  } catch (e) {
    return "Désolé, je ne peux pas analyser ces documents pour le moment.";
  }
}

export const analyzeOrientationProfile = async (profileData: any): Promise<any> => {
   const prompt = `
    Tu es un Conseiller d'Orientation Psychologue Expert.
    Profil étudiant : ${JSON.stringify(profileData)}.
    
    Analyse ce profil pour déterminer :
    1. L'archétype (ex: Le Créatif, L'Analytique, Le Leader...).
    2. Une analyse psychologique et professionnelle.
    3. 3 recommandations de carrière précises.

    Réponds UNIQUEMENT avec un JSON valide respectant ce schéma :
    {
      "archetype": "Titre de l'archétype",
      "analysis": "Paragraphe d'analyse détaillée",
      "recommendations": [
        {
          "title": "Nom du métier ou de la voie",
          "description": "Pourquoi cela correspond",
          "schools": "Exemples d'écoles ou formations",
          "jobs": "Exemples de débouchés précis"
        }
      ]
    }
  `;
  try {
    const data = await postAI('analyzeOrientationProfile', { prompt });
    return data;
  } catch (e) {
    console.error("Erreur Orientation:", e);
    // Fallback data en cas d'erreur pour éviter le crash
    return {
        archetype: "Profil en cours d'analyse",
        analysis: "L'IA n'a pas pu finaliser l'analyse complète. Veuillez réessayer.",
        recommendations: []
    };
  }
};

// JOB SEARCH SERVICE
export const searchJobsWithAI = async (query: string, userLocation: string): Promise<any[]> => {
    // 1. Analyze the query with Gemini to extract intent (keywords, role, location if specified)
    const prompt = `
      Tu es un expert en recrutement international.
      L'utilisateur cherche : "${query}".
      Sa localisation actuelle : "${userLocation}".

      Génère une liste de 5 offres d'emploi RÉELLES (ou très réalistes basées sur le marché actuel).
      Pour chaque offre, tu dois fournir les détails exacts d'entreprises qui recrutent généralement pour ce type de poste.

      Format JSON attendu par offre :
      {
        "id": "string",
        "title": "Titre du poste",
        "company": "Nom de l'entreprise (ex: Google, L'Oréal, Startup X)",
        "location": "Ville, Pays",
        "type": "CDI / Stage / Alternance",
        "salary": "Salaire estimé (ex: 35k-45k€)",
        "description": "Courte description accrocheuse",
        "matchScore": 95,
        "skills": ["Compétence 1", "Compétence 2"],
        "postedAt": "Il y a 2 jours"
      }
      
      Retourne UNIQUEMENT le tableau JSON.
    `;

    try {
        const results = await postAI('searchJobsWithAI', { prompt });

        // Enrichir avec des liens de recherche intelligents (Google Jobs / LinkedIn)
        return results.map((job: any) => ({
            ...job,
            applyUrl: `https://www.google.com/search?ibp=htl;jobs&q=${encodeURIComponent(job.title + ' ' + job.company + ' ' + job.location)}`
        }));

    } catch (e) {
        console.error("Job Search Error:", e);
        // Fallback jobs with smart links
        return [
            {
                id: "1",
                title: "Consultant Junior",
                company: "Deloitte",
                location: userLocation || "Paris, France",
                type: "CDI",
                salary: "38k€ - 45k€",
                description: "Accompagnez la transformation digitale des grandes entreprises.",
                matchScore: 85,
                skills: ["Analyse", "PowerPoint", "Anglais"],
                postedAt: "Il y a 1 jour",
                applyUrl: `https://www.google.com/search?ibp=htl;jobs&q=${encodeURIComponent("Consultant Junior Deloitte " + userLocation)}`
            },
            {
                id: "2",
                title: "Business Developer",
                company: "Tech Startup",
                location: userLocation || "Paris, France",
                type: "Stage",
                salary: "1000€ - 1200€",
                description: "Développez le portefeuille client d'une startup en pleine croissance.",
                matchScore: 80,
                skills: ["Vente", "Prospection", "CRM"],
                postedAt: "Il y a 3 jours",
                applyUrl: `https://www.google.com/search?ibp=htl;jobs&q=${encodeURIComponent("Business Developer Startup " + userLocation)}`
            }
        ];
    }
};

// --- COACHING CARRIÈRE ---

export interface CVAnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export const analyzeCV = async (cvText: string, targetJob: string): Promise<CVAnalysisResult> => {
  const prompt = `
    RÔLE : Expert en Recrutement International (Type McKinsey/Google).
    CV DU CANDIDAT (Texte brut) : "${cvText.substring(0, 8000)}"
    POSTE VISÉ : "${targetJob}"

    MISSION : 
    Réalise un audit professionnel de ce CV. Sois direct, précis et constructif.
    PAS DE LANGUE DE BOIS. PAS DE GÉNÉRALITÉS.

    INSTRUCTIONS STRICTES DE STYLE :
    1. INTERDIT D'UTILISER LE GRAS MARKDOWN (les étoiles **).
    2. INTERDIT D'UTILISER LES PUCES MARKDOWN (* ou -) DANS LE TEXTE JSON.
    3. Utilise un langage professionnel, corporatif et percutant.

    FORMAT DE SORTIE (JSON UNIQUEMENT) :
    {
      "score": (Nombre entre 0 et 100),
      "summary": "Un paragraphe exécutif résumant le profil en 3 phrases max.",
      "strengths": ["Point fort 1 (bref)", "Point fort 2", "Point fort 3"],
      "weaknesses": ["Point faible 1 (critique)", "Point faible 2"],
      "improvements": ["Action concrète 1", "Action concrète 2", "Action concrète 3"]
    }
  `;

  try {
    const data = await postAI('analyzeCV', { prompt });
    return data as CVAnalysisResult;

  } catch (error) {
    console.error("CV Analysis Error:", error);
    throw new Error("L'analyse du CV a échoué. Veuillez réessayer.");
  }
};

export const generateCoverLetter = async (cvText: string, jobDescription: string): Promise<string> => {
  const prompt = `
    RÔLE : Expert en Copywriting RH.
    PROFIL CANDIDAT : "${cvText.substring(0, 3000)}"
    OFFRE D'EMPLOI : "${jobDescription.substring(0, 3000)}"

    MISSION :
    Rédige une lettre de motivation ULTRA-PERSONNALISÉE et PERCUTANTE.
    
    INSTRUCTIONS DE STYLE (CRITIQUE) :
    1. **INTERDIT ABSOLU** d'utiliser des balises Markdown comme **gras**, *italique*, ou des titres (###).
    2. **INTERDIT** de mettre des placeholders comme [Nom de l'entreprise] -> DÉDUIS-LE ou mets "votre entreprise".
    3. PAS de "Objet: Candidature au poste de...". Commence directement par "Madame, Monsieur,".
    4. Ton : Professionnel, Confiant, Orienté Résultats.
    5. Format : Texte brut, paragraphes bien aérés.
    
    La lettre doit donner envie de rencontrer le candidat immédiatement.
  `;

  try {
    const text = await postAI('generateCoverLetter', { prompt });
    return text;

  } catch (error) {
    console.error("Cover Letter Error:", error);
    throw new Error("La génération de la lettre a échoué.");
  }
};
