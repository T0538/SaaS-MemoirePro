import { GoogleGenAI, Type } from "@google/genai";
import { Domain, Chapter, Section, JuryQuestion, JuryPersona, JuryMessage, Reference } from '../types';

// Helper to create ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initialisation sécurisée de l'IA
// @ts-ignore
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("Clé API manquante.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

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
    if (retries > 0 && (error?.status === 503 || error?.status === 429 || error?.message?.includes('overloaded'))) {
      console.warn(`Gemini API Busy. Retrying... (${retries} left)`);
      await new Promise(r => setTimeout(r, delay));
      return runWithRetry(operation, retries - 1, delay * 2);
    }
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
    Tu es un Directeur de Recherche universitaire exigeant.
    Sujet : "${topic}". Domaine : ${domain}.
    Contexte étudiant : "${context}".

    Mission : Construire un plan de mémoire (Sommaire) de niveau professionnel.
    Le plan doit suivre la logique : Introduction / Revue de littérature / Méthodologie / Résultats / Discussion.
    
    Évite les titres génériques ("Introduction"). Sois précis ("La problématique de la RSE en PME industrielle").

    Réponds UNIQUEMENT avec du JSON valide :
  `;

  try {
    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash', // UPGRADE MODEL
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "sections"]
          }
        }
      }
    }));

    const rawData = JSON.parse(response.text || "[]");

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
    throw new Error("Erreur IA. Veuillez réessayer.");
  }
};

export const parseImportedOutline = (text: string): Chapter[] => {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    // Détection basique des chapitres (I., 1., Chapitre)
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
    RÔLE : Tu es un expert académique rédigeant un mémoire professionnel.
    SUJET GLOBAL : ${topic}
    CONTEXTE ACTUEL : Chapitre "${chapterTitle}" > Section "${sectionTitle}".

    ${HUMANIZER_INSTRUCTIONS}
    
    CONSIGNE DE RÉDACTION :
    - Rédige environ 500 mots.
    - Sois dense, précis et analytique.
    - Évite le remplissage. Chaque phrase doit apporter une information.
    - Intègre des références théoriques implicites.
    
    ${currentContent ? `Base-toi sur ces notes pour rédiger : "${currentContent}"` : ''}
  `;

  try {
    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash', // UPGRADE
      contents: prompt,
    }));
    return response.text || "";
  } catch (error) {
    throw new Error("Service surchargé.");
  }
};

export const improveText = async (text: string, instruction: string): Promise<string> => {
  try {
    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
        Tu es un éditeur littéraire académique.
        Texte source : "${text}"
        Instruction de l'utilisateur : "${instruction}"
        
        Applique l'instruction tout en respectant ces règles :
        1. Garde un ton formel et universitaire.
        2. Améliore la fluidité et la variété du vocabulaire.
        3. Supprime les répétitions.
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
      Tu es un rédacteur expert en ${domain}.
      Transforme ces notes brèves en un texte académique développé et argumenté.
      
      Notes : "${text}"

      Objectif : Multiplier le volume par 3 sans diluer le sens.
      Méthode : 
      1. Explicite les concepts.
      2. Ajoute des exemples concrets.
      3. Connecte logiquement les idées.
    `;

    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    }));
    return response.text || text;
  } catch (e) {
    throw new Error("Erreur expansion.");
  }
};

export const generateJuryQuestions = async (text: string, domain: string): Promise<JuryQuestion[]> => {
  try {
    const prompt = `
      Analyse ce texte de mémoire en tant que Jury de soutenance sévère (${domain}).
      Texte : "${text.substring(0, 2000)}..."

      Génère 3 questions pièges ou d'approfondissement.
      Format JSON requis.
    `;

    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    }));
    
    const data = JSON.parse(response.text || "[]");
    return data.map((q: any) => ({
        id: generateId(),
        question: q.question || q.Question,
        difficulty: 'Difficile',
        suggestion: q.suggestion || q.Answer || "Réponse suggérée..."
    }));
  } catch (e) {
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
      Rôle : ${persona.name}, ${persona.role}. Ton : ${persona.tone}.
      Sujet : ${topic}.

      HISTORIQUE :
      ${chatHistory}

      DERNIÈRE RÉPONSE CANDIDAT : "${lastUserMessage}"

      Analyse la réponse. Si elle est vague, attaque. Si elle est bonne, challenge.
      Donne une note de crédibilité (0-100) sur cette réponse précise.
      Réponds en JSON : { "jury_response": "...", "score": 80, "critique": "..." }
    `;
  
    try {
      const response = await runWithRetry(() => ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      }));
  
      const data = JSON.parse(response.text || "{}");
      return {
        content: data.jury_response || "Pouvez-vous développer ?",
        score: data.score || 50,
        critique: data.critique || "Analyse en cours..."
      };
    } catch (e) {
      return { content: "Erreur technique du jury.", score: 50, critique: "Erreur." };
    }
};

export const suggestReferences = async (topic: string, domain: string): Promise<Reference[]> => {
  try {
    const prompt = `
      Agis comme un documentaliste universitaire. Sujet : "${topic}".
      Donne 4 références (Livres, Articles, Rapports) RÉELLES et MAJEURES.
      Format JSON APA 7.
    `;

    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    }));

    const data = JSON.parse(response.text || "[]");
    return data.map((ref: any) => ({
      id: generateId(),
      type: 'book',
      title: ref.title,
      author: ref.author,
      year: ref.year,
      citation: `${ref.author} (${ref.year}). ${ref.title}.`
    }));
  } catch (e) {
    return [];
  }
}

export const askDocumentContext = async (query: string, documentsContext: string): Promise<string> => {
  try {
    const prompt = `
      Analyse ces documents et réponds à la question.
      DOCUMENTS : "${documentsContext.substring(0, 30000)}"
      QUESTION : "${query}"
      
      Réponse synthétique et précise :
    `;

    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    }));
    return response.text || "Pas de réponse trouvée.";
  } catch (e) {
    return "Erreur analyse.";
  }
}

export const analyzeOrientationProfile = async (profileData: any): Promise<any> => {
  // (Code existant inchangé, juste passage en gemini-2.0-flash si besoin)
  // ...
   const prompt = `
    Conseiller d'orientation expert. Analyse ce profil : ${JSON.stringify(profileData)}.
    JSON attendu : { "archetype": "...", "analysis": "...", "recommendations": [...] }
  `;
   try {
    const response = await runWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    }));
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Erreur orientation.");
  }
};