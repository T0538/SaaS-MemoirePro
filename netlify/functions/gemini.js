const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuration des en-têtes CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Logique de chargement de la clé API (similaire à server.js)
const getGeminiKey = () => {
  const envKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS || process.env.GOOGLE_API_KEYS || process.env.API_KEY;
  if (envKey) {
    const keys = envKey.split(',').map(s => s.trim()).filter(Boolean);
    if (keys.length > 0) return keys[0];
  }
  // Fallback Hardcoded (pour garantir le fonctionnement immédiat)
  return 'AIzaSyAPS1Z1eokteVis0kGrXa6FNXvoFDpxy_8';
};

// Initialisation de l'IA
const genAI = new GoogleGenerativeAI(getGeminiKey());

// Helper pour extraire le JSON proprement
function extractJson(text) {
  if (!text) return [];
  try {
    // 1. Nettoyage standard (markdown)
    const clean = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(clean);
  } catch (e1) {
    try {
      // 2. Recherche heuristique des délimiteurs JSON
      const firstArr = text.indexOf('[');
      const firstObj = text.indexOf('{');
      let start = -1;
      if (firstArr !== -1 && firstObj !== -1) start = Math.min(firstArr, firstObj);
      else if (firstArr !== -1) start = firstArr;
      else if (firstObj !== -1) start = firstObj;

      const lastArr = text.lastIndexOf(']');
      const lastObj = text.lastIndexOf('}');
      let end = -1;
      if (lastArr !== -1 && lastObj !== -1) end = Math.max(lastArr, lastObj);
      else if (lastArr !== -1) end = lastArr;
      else if (lastObj !== -1) end = lastObj;

      if (start !== -1 && end !== -1 && end > start) {
        const extracted = text.substring(start, end + 1);
        return JSON.parse(extracted);
      }
      throw e1;
    } catch (e2) {
      console.error("[JSON Error] Failed to parse:", text.substring(0, 200) + "...");
      throw new Error("Invalid JSON response from AI");
    }
  }
}

// Helper pour la réinitialisation et le retry
const runWithRetry = async (operation, retries = 2, delay = 1000) => {
  try {
    return await operation();
  } catch (error) {
    const msg = String(error && error.message || '');
    const status = error && (error.status || error.response?.status);
    console.warn(`[AI Retry] Error: ${msg} (Status: ${status})`);
    
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return runWithRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Gérer les requêtes OPTIONS (Preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { action, payload } = JSON.parse(event.body || '{}');
    
    if (!action) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing action' }) };
    }

    // Helper pour obtenir le modèle
    const getModel = (modelName, jsonMode = false) => {
      const config = jsonMode ? { responseMimeType: 'application/json' } : undefined;
      return genAI.getGenerativeModel({ model: modelName, generationConfig: config });
    };

    let result;

    // Logique principale (copiée de server.js)
    if (action === 'generateThesisOutline') {
      const prompt = `RÔLE : Directeur de Recherche.\nSUJET : "${payload.topic}"\nCONTEXTE : "${payload.context}"\nMISSION : Générer un plan académique structuré. Réponds en JSON: [{"title":"...","sections":["..."]}]`;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else if (action === 'generateSectionContent') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return (response.text() || '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      });
    } else if (action === 'improveText') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return (response.text() || '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      });
    } else if (action === 'expandContent') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return (response.text() || '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      });
    } else if (action === 'generateTopicIdeas') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-flash', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else if (action === 'generateJuryQuestions') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-flash', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else if (action === 'interactWithJury') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-flash', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else if (action === 'suggestReferences') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else if (action === 'askDocumentContext') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || '';
      });
    } else if (action === 'analyzeOrientationProfile') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else if (action === 'searchJobsWithAI') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-flash', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else if (action === 'analyzeCV') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro', true);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return extractJson(response.text());
      });
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result })
    };

  } catch (error) {
    console.error(`[Function Error] ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `Service IA indisponible (Online Fix): ${error.message}`,
        details: error.stack
      })
    };
  }
};
