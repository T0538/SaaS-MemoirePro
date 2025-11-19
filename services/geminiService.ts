
import { GoogleGenAI, Type } from "@google/genai";
import { Domain, Chapter, Section, JuryQuestion, JuryPersona, JuryMessage } from '../types';

// Helper to create ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initialisation sécurisée de l'IA
// @ts-ignore : Ignore l'avertissement TypeScript car Vite remplace cette valeur lors du lancement
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("Clé API manquante. Assurez-vous d'avoir un fichier .env avec API_KEY ou GEMINI_API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Instructions de style pour "humaniser" le contenu
const HUMANIZER_INSTRUCTIONS = `
DIRECTIVES DE STYLE ET D'HUMANISATION (CRITIQUE) :
1.  **Bannir le "Style IA"** : N'utilise JAMAIS de phrases de transition clichées comme "En conclusion", "Il est important de noter", "Dans le monde d'aujourd'hui".
2.  **Ton Expert** : Adopte le ton d'un expert du domaine. Utilise le doute méthodique.
3.  **Vocabulaire Spécifique** : Utilise le jargon technique du domaine (${Domain.QHSE} => ISO 45001, AMDEC, Document Unique, etc.).
`;

export const generateThesisOutline = async (
  topic: string, 
  domain: Domain, 
  context: string
): Promise<Chapter[]> => {
  
  const prompt = `
    Tu es un directeur de recherche. Sujet : "${topic}". Domaine : ${domain}. Contexte : "${context}".
    Construis un plan détaillé et rigoureux (sommaire) pour un mémoire de fin d'études.
    Structure : Intro théorique -> Méthodologie -> Analyse terrain -> Recommandations.
    Réponds UNIQUEMENT avec du JSON.
  `;

  try {
    // UTILISATION DE GEMINI FLASH (Gratuit et Rapide) pour éviter l'erreur 429
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Titre du chapitre" },
              sections: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "sections"]
          }
        }
      }
    });

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
    throw new Error("Impossible de générer le plan. Vérifiez votre clé API ou vos quotas.");
  }
};

export const parseImportedOutline = (text: string): Chapter[] => {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    // Detect Chapter: Starts with "1.", "I.", "Chapitre", "Module", "Partie"
    // OR is ALL CAPS and length > 4 (heuristic for titles)
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
      // If no chapter exists yet, create a default one (Intro)
      if (!currentChapter) {
         currentChapter = {
             id: generateId(),
             title: "Introduction & Contexte",
             sections: []
         };
         chapters.push(currentChapter);
      }
      
      // Clean up section bullets
      const cleanTitle = trimmed.replace(/^[-*•>]\s*/, '').trim();
      if(cleanTitle) {
          currentChapter.sections.push({
            id: generateId(),
            title: cleanTitle,
            content: "",
            status: 'pending'
          });
      }
    }
  });
  
  // Ensure chapters without sections don't break UI
  return chapters.map(c => {
      if (c.sections.length === 0) {
          c.sections.push({
              id: generateId(),
              title: "Introduction du chapitre",
              content: "",
              status: 'pending'
          });
      }
      return c;
  });
}

export const generateSectionContent = async (
  topic: string,
  domain: Domain,
  chapterTitle: string,
  sectionTitle: string,
  currentContent: string = ""
): Promise<string> => {

  const prompt = `
    Rédige une section de mémoire de Licence Pro.
    Sujet : ${topic} | Chapitre : ${chapterTitle} | Section : ${sectionTitle}
    
    ${HUMANIZER_INSTRUCTIONS}
    
    Volume : 400 mots environ.
    Style : Dense, informatif, analytique. Pas de généralités.
    
    ${currentContent ? `Améliore ce texte existant : ${currentContent}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Utilisation du modèle Flash compatible Free Tier
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Erreur lors de la rédaction.");
  }
};

export const improveText = async (text: string, instruction: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Agis comme un éditeur expert. Texte original : "${text}". Instruction : ${instruction}. ${HUMANIZER_INSTRUCTIONS}`
    });
    return response.text || text;
  } catch (e) {
    return text;
  }
};

// FEATURE PREMIUM : Magic Expander
export const expandContent = async (text: string, domain: string): Promise<string> => {
  try {
    const prompt = `
      Tu es un expert académique en ${domain}.
      Ta mission : Prendre ces notes en vrac (bullet points ou phrases courtes) et les transformer en paragraphes académiques denses et structurés.
      
      Contenu à développer : "${text}"

      Règles :
      1. Garde le sens original mais multiplie le volume par 3.
      2. Ajoute des connecteurs logiques (En outre, Par ailleurs, C'est pourquoi).
      3. Intègre des exemples théoriques pertinents liés au domaine.
      4. Utilise un style impersonnel et soutenu.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || text;
  } catch (e) {
    console.error("Expand Error", e);
    throw new Error("Erreur lors du développement du texte.");
  }
};

// FEATURE PREMIUM : Jury Simulator (Simple)
export const generateJuryQuestions = async (text: string, domain: string): Promise<JuryQuestion[]> => {
  try {
    const prompt = `
      Agis comme un jury de soutenance de fin d'études, très exigeant et pointilleux, spécialisé en ${domain}.
      Lis le texte suivant (extrait de mémoire) : "${text.substring(0, 2000)}..."

      Génère 3 questions difficiles que tu poserais à l'étudiant pour tester la solidité de son raisonnement.
      Pour chaque question, fournis une suggestion de réponse idéale.
      
      Réponds UNIQUEMENT en JSON avec ce format :
      [
        { "question": "...", "difficulty": "Moyen", "suggestion": "..." },
        { "question": "...", "difficulty": "Difficile", "suggestion": "..." }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((q: any) => ({
      id: generateId(),
      question: q.question,
      difficulty: q.difficulty,
      suggestion: q.suggestion
    }));
  } catch (e) {
    console.error("Jury Error", e);
    return [];
  }
};

// FEATURE PREMIUM : Jury Simulator (Immersive Chat)
export const interactWithJury = async (
    history: JuryMessage[], 
    persona: JuryPersona, 
    topic: string
  ): Promise<{ content: string; score: number; critique: string }> => {
  
    const lastUserMessage = history.filter(m => m.sender === 'user').pop()?.content || "Je suis prêt.";
  
    const systemPrompt = `
      Tu incarnes ${persona.name}, un ${persona.role}.
      Ton caractère est : ${persona.tone}.
      Tu participes à la soutenance du mémoire sur le sujet : "${topic}".
      
      Ta mission :
      1. Analyser la réponse de l'étudiant.
      2. Attribuer une note de crédibilité/conviction sur 100.
      3. Faire une critique interne (pourquoi cette note).
      4. Poser la question suivante ou rebondir pour piéger l'étudiant si sa réponse est faible.
      
      Reste toujours dans ton rôle. Sois réaliste, parfois sec si le persona est 'Strict', ou pointilleux si 'Technique'.
      Ne sois pas complaisant.
      
      Réponds UNIQUEMENT au format JSON :
      {
        "jury_response": "Ta réaction et ta prochaine question ici...",
        "score": 75,
        "critique": "L'étudiant est vague sur la méthodologie..."
      }
    `;
  
    const chatHistory = history.map(m => `${m.sender === 'jury' ? 'JURY' : 'ETUDIANT'}: ${m.content}`).join('\n');
  
    const prompt = `
      ${systemPrompt}
  
      HISTORIQUE DE LA SOUTENANCE :
      ${chatHistory}
  
      ETUDIANT (Dernière réponse) : "${lastUserMessage}"
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
  
      const data = JSON.parse(response.text || "{}");
      return {
        content: data.jury_response || "Pouvez-vous préciser ?",
        score: data.score || 50,
        critique: data.critique || "Réponse moyenne."
      };
    } catch (e) {
      console.error("Jury Chat Error", e);
      return {
        content: "Je n'ai pas bien saisi, pouvez-vous reformuler ?",
        score: 50,
        critique: "Erreur technique."
      };
    }
};
