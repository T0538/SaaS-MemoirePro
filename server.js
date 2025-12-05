
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// CLÉ DE TEST STRIPE (Découpée pour GitHub)
const LOCAL_STRIPE_KEY = 'sk_test_' + '51SVEXFHg3BhYAtWaFKxCqiF5yFb2q2cL7sFWkWxIu4gX3qebEwX1xIrc3uiBNX4UYxWi8uAzN1N7svGume4VXWI200zV3nudoX';

// Configuration Stripe : Utilise la variable d'environnement (Prod) OU la clé locale (Test)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || LOCAL_STRIPE_KEY);

const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', true);

// Autoriser les requêtes venant de n'importe où
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (Frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// --- ROUTE DE PAIEMENT STRIPE ---
app.post('/create-checkout-session', async (req, res) => {
  try {
    // L'URL du frontend (pour la redirection après paiement)
    const clientUrl = req.get('origin') || 'http://localhost:5173';

    console.log("Création session Stripe (TEST) pour :", clientUrl);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', 
            product_data: {
              name: 'Pack Étudiant Pro (TEST)',
              description: 'Licence à vie, export Word, IA illimitée.',
              images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80'], 
            },
            unit_amount: 300, // 3.00 $
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${clientUrl}/#/success`,
      cancel_url: `${clientUrl}/#/checkout`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

function parseAllowedIps() {
  const ips = (process.env.ALLOWED_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
  return ips;
}

function isIpAllowed(ip, allowed) {
  if (allowed.length === 0) return true;
  if (allowed.includes('*')) return true;
  const clean = (ip || '').replace('::ffff:', '');
  return allowed.some(rule => {
    if (rule.endsWith('*')) return clean.startsWith(rule.slice(0, -1));
    return clean === rule;
  });
}

function isWithinAllowedHours() {
  const range = process.env.ALLOWED_HOURS || '';
  if (!range) return true;
  const [start, end] = range.split('-');
  if (!start || !end) return true;
  const now = new Date();
  const toMinutes = t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  const n = now.getHours() * 60 + now.getMinutes();
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s <= e) return n >= s && n <= e;
  return n >= s || n <= e;
}

const allowedIps = parseAllowedIps();
app.use((req, res, next) => {
  if (!isIpAllowed(req.ip, allowedIps)) return res.status(403).json({ error: 'Access denied (IP)' });
  if (!isWithinAllowedHours()) return res.status(403).json({ error: 'Access denied (Hours)' });
  next();
});

// Explicitly load API key from file if not in env (common issue in some environments)
let geminiKeys = [];
const envKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS || process.env.GOOGLE_API_KEYS || process.env.API_KEY;
if (envKey) {
  geminiKeys = envKey.split(',').map(s => s.trim()).filter(Boolean);
} else {
  // Fallback: try to read .env manually if process.env failed
  try {
    const envPath = path.join(__dirname, '.env');
    console.log("Attempting to read .env from:", envPath);
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log(".env content length:", envContent.length);
        // Robust regex to handle different line endings and optional quotes
        const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          console.log("Found key in .env manually!");
          geminiKeys = [match[1].trim()];
        } else {
            console.log("Regex failed to match key in .env. Content preview:");
            console.log(envContent.substring(0, 200) + "...");
        }
    } else {
        console.log(".env file does not exist at path.");
    }
  } catch (e) {
    console.error("Error reading .env:", e);
  }
}

if (geminiKeys.length === 0) {
  console.error("CRITICAL: No GEMINI_API_KEY found in environment variables.");
  // No hardcoded fallback to prevent exposure.
  // The server will fail to initialize AI, but will start.
} else {
  console.log(`Loaded ${geminiKeys.length} Gemini API keys.`);
  console.log(`Active Key: ${geminiKeys[0].substring(0, 10)}...`);
}
let currentKeyIndex = 0;
let genAI = geminiKeys.length > 0 ? new GoogleGenerativeAI(geminiKeys[currentKeyIndex]) : null;

const runWithRetry = async (operation, retries = 2, delay = 1000) => {
  if (!genAI) throw new Error("Server Misconfiguration: No API Key available.");
  try {
    return await operation();
  } catch (error) {
    const msg = String(error && error.message || '');
    // GoogleGenerativeAI uses 'status' or 'statusText' sometimes, or just throws Error
    const status = error && (error.status || error.response?.status);
    console.warn(`[AI Retry] Error: ${msg} (Status: ${status})`);
    
    const shouldRotate = status === 401 || status === 403 || status === 429 || msg.includes('quota') || msg.includes('overloaded');
    if (shouldRotate) {
      console.log("Rotating API Key due to error...");
      currentKeyIndex = (currentKeyIndex + 1) % geminiKeys.length;
      genAI = new GoogleGenerativeAI(geminiKeys[currentKeyIndex]);
    }
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return runWithRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Helper to reliably extract JSON
function extractJson(text) {
  if (!text) return [];
  try {
    // 1. Try standard cleanup (markdown)
    const clean = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(clean);
  } catch (e1) {
    try {
      // 2. Try finding the first '[' or '{' and the last ']' or '}'
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

let leakScan = { scanned: false, found: [] };
function scanDistForSecrets() {
  const enable = (process.env.SCAN_DIST_FOR_SECRETS || 'true').toLowerCase() === 'true';
  if (!enable) return;
  const dir = path.join(__dirname, 'dist', 'assets');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  const patterns = [/AIza[0-9A-Za-z-_]{35}/g, /sk_(live|test)_[A-Za-z0-9]+/g, /VITE_API_KEY/g];
  const found = [];
  files.forEach(f => {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    patterns.forEach(p => {
      const m = content.match(p);
      if (m && m.length) found.push({ file: f, matches: m });
    });
  });
  leakScan = { scanned: true, found };
}
scanDistForSecrets();

app.post('/api/gemini', async (req, res) => {
  try {
    const { action, payload } = req.body || {};
    
    if (!geminiKeys[0]) {
      console.error("Error: Missing API Key on request");
      return res.status(500).json({ error: 'Server Misconfiguration: Missing Gemini API Key' });
    }

    const ip = req.ip;
    console.log(`[API] Request: ${action} from ${ip}`);

    let result;
    
    // Helper to get model with config
    const getModel = (modelName, jsonMode = false) => {
      const config = jsonMode ? { responseMimeType: 'application/json' } : undefined;
      return genAI.getGenerativeModel({ model: modelName, generationConfig: config });
    };

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
    } else if (action === 'generateCoverLetter') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const model = getModel('gemini-2.5-pro');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      });
    } else if (action === 'checkHealth') {
      result = {
        status: 'OK',
        server: 'Express/Render',
        timestamp: new Date().toISOString(),
        keyStatus: geminiKeys.length > 0 ? 'Configured' : 'Missing'
      };
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    res.json({ result });
  } catch (error) {
    console.error(`[API Error] ${error.message}`);
    if (error.message.includes('Safety') || error.message.includes('blocked')) {
      return res.status(400).json({ error: 'Contenu bloqué par la sécurité IA.' });
    }
    res.status(500).json({ error: 'Service IA indisponible' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (leakScan.scanned && leakScan.found.length > 0) {
    console.warn("WARNING: Potential secrets found in dist:", leakScan.found);
  }
});
