import { GoogleGenAI, Type } from "@google/genai";
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

// Initialisation sécurisée de l'IA
// Utilisation de process.env typé (définis via vite.config.ts)
const apiKey = (process.env.API_KEY as string) || '';

if (!apiKey) {
  console.warn("ATTENTION : Clé API Gemini manquante. Vérifiez le fichier .env ou vite.config.ts");
}

const ai = new GoogleGenAI({ apiKey });

// Modèle performant pour le raisonnement complexe (Plan, Rédaction)
const MODEL_REASONING = 'gemini-2.5-pro';
// Modèle rapide pour les interactions chat (Jury, Questions)
const MODEL_FAST = 'gemini-2.5-flash'; 

// --- INSTRUCTIONS D'HUMANISATION V3 (PRO) ---
const HUMANIZER_INSTRUCTIONS = `
DIRECTIVES CRITIQUES DE STYLE "NIVEAU MASTER/DOCTORAT" :

1. **ANTI-ROBOT STRICT** :
   - INTERDIT : Les phrases de transition lourdes ("Dans un premier temps", "Il est crucial de noter", "En conclusion").
   - INTERDIT : Les listes à puces systématiques. Privilégier les paragraphes rédigés et argumentés.
   - INTERDIT : Les généralités vides ("De nos jours, le sujet est important...").

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
    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_REASONING, // Utilisation de PRO pour la structure
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Titre du chapitre (ex: 'Partie I: ...')" },
              sections: {
                type: Type.ARRAY,
                items: { type: Type.STRING, description: "Titre de la section" }
              }
            },
            required: ["title", "sections"]
          }
        }
      }
    }));

    // Nettoyage et parsing sécurisé
    const jsonText = cleanJson(response.text || "[]");
    let rawData;
    try {
      rawData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", parseError, response.text);
      throw new Error("Le plan généré n'est pas un JSON valide.");
    }

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
    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_REASONING, // PRO pour la qualité rédactionnelle
      contents: prompt,
    }));
    return response.text || "";
  } catch (error) {
    console.error("Erreur rédaction:", error);
    throw new Error("Service de rédaction momentanément indisponible.");
  }
};

export const improveText = async (text: string, instruction: string): Promise<string> => {
  try {
    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_REASONING, // PRO pour bien comprendre les nuances
      contents: `
        RÔLE : Éditeur académique rigoureux.
        TEXTE SOURCE : "${text}"
        INSTRUCTION : "${instruction}"
        
        MISSION : Réécris le texte en appliquant l'instruction.
        CRITÈRES : Ton universitaire, vocabulaire riche, syntaxe impeccable.
      `
    }));
    return response.text || text;
  } catch (e) {
    return text;
  }
};

export const expandContent = async (text: string, domain: string): Promise<string> => {
  try {
    const prompt = `
      RÔLE : Expert en ${domain}.
      MISSION : Développer ces notes pour en faire un texte académique complet.
      
      NOTES SOURCE : "${text}"

      OBJECTIF : 
      - Tripler le volume.
      - Ajouter des exemples concrets et des définitions.
      - Assurer les transitions logiques.
      - Ton formel et scientifique.
    `;

    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_REASONING,
      contents: prompt
    }));
    return response.text || text;
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

    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_FAST, // Flash suffit pour analyser et poser des questions
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              suggestion: { type: Type.STRING }
            },
            required: ["question", "suggestion"]
          }
        }
      }
    }));
    
    const jsonText = cleanJson(response.text || "[]");
    const data = JSON.parse(jsonText);

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
      const response = await runWithRetry(() => ai.models.generateContent({
        model: MODEL_FAST, // Flash pour la réactivité du chat
        contents: prompt,
        config: { responseMimeType: "application/json" }
      }));
  
      const jsonText = cleanJson(response.text || "{}");
      const data = JSON.parse(jsonText);
      
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

    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_REASONING, // Pro pour éviter les hallucinations bibliographiques
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              year: { type: Type.STRING } // String car parfois "2023" ou "Mai 2023"
            },
            required: ["title", "author", "year"]
          }
        }
      }
    }));

    const jsonText = cleanJson(response.text || "[]");
    const data = JSON.parse(jsonText);

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

    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_REASONING, // 1.5 Pro a une grande fenêtre de contexte (1M tokens)
      contents: prompt
    }));
    return response.text || "Je ne trouve pas la réponse dans vos documents.";
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
    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_REASONING,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            analysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  schools: { type: Type.STRING },
                  jobs: { type: Type.STRING }
                },
                required: ["title", "description", "schools", "jobs"]
              }
            }
          },
          required: ["archetype", "analysis", "recommendations"]
        }
      }
    }));
    const jsonText = cleanJson(response.text || "{}");
    return JSON.parse(jsonText);
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
      Tu es un chasseur de tête expert IA.
      L'utilisateur cherche : "${query}".
      Sa localisation actuelle : "${userLocation}".

      Génère une liste de 5 offres d'emploi fictives mais réalistes qui correspondent PARFAITEMENT à sa demande.
      Si l'utilisateur cherche à l'étranger, respecte ça. Sinon, cherche autour de sa localisation.
      
      Format JSON attendu par offre :
      {
        "id": "string",
        "title": "Titre du poste",
        "company": "Nom de l'entreprise",
        "location": "Ville, Pays",
        "type": "CDI / Stage / Alternance",
        "salary": "Salaire estimé (ex: 35k-45k€)",
        "description": "Courte description accrocheuse (2 phrases max)",
        "matchScore": 95 (Score de pertinence entre 0 et 100),
        "skills": ["Compétence 1", "Compétence 2", "Compétence 3"],
        "postedAt": "Il y a 2 jours"
      }
      
      Retourne UNIQUEMENT le tableau JSON.
    `;

    try {
        const response = await runWithRetry(() => ai.models.generateContent({
            model: MODEL_FAST, // Fast model is enough for generating list
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }));
        
        const jsonText = cleanJson(response.text || "[]");
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Job Search Error:", e);
        // Fallback jobs
        return [
            {
                id: "1",
                title: "Consultant Junior (Fallback)",
                company: "Global Corp",
                location: userLocation || "Paris, France",
                type: "CDI",
                salary: "35k€ - 42k€",
                description: "Opportunité pour jeune diplômé dynamique. Formation assurée.",
                matchScore: 80,
                skills: ["Analyse", "Communication", "Office 365"],
                postedAt: "Il y a 1 jour"
            }
        ];
    }
};
