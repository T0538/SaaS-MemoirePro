import { GoogleGenAI, Type } from "@google/genai";
import { Domain, Chapter, Section } from '../types';

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