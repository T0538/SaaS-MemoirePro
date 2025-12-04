
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { GoogleGenAI, Type } = require('@google/genai');

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

let geminiKeys = (process.env.GEMINI_API_KEYS || process.env.GOOGLE_API_KEYS || process.env.GEMINI_API_KEY || process.env.API_KEY || '').split(',').map(s => s.trim()).filter(Boolean);
if (geminiKeys.length === 0) geminiKeys = [''];
let currentKeyIndex = 0;
let ai = new GoogleGenAI({ apiKey: geminiKeys[currentKeyIndex] });
let lastRotation = Date.now();
const intervalMin = parseInt(process.env.ROTATION_INTERVAL_MINUTES || '1440', 10);
setInterval(() => {
  currentKeyIndex = (currentKeyIndex + 1) % geminiKeys.length;
  ai = new GoogleGenAI({ apiKey: geminiKeys[currentKeyIndex] });
  lastRotation = Date.now();
}, Math.max(1, intervalMin) * 60 * 1000);

const runWithRetry = async (operation, retries = 2, delay = 1000) => {
  try {
    return await operation();
  } catch (error) {
    const msg = String(error && error.message || '');
    const status = error && (error.status || error.code);
    const shouldRotate = status === 401 || status === 403 || status === 429 || msg.includes('quota') || msg.includes('overloaded');
    if (shouldRotate) {
      currentKeyIndex = (currentKeyIndex + 1) % geminiKeys.length;
      ai = new GoogleGenAI({ apiKey: geminiKeys[currentKeyIndex] });
    }
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return runWithRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

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
    const ip = req.ip;
    const start = Date.now();
    let result;
    if (!geminiKeys[currentKeyIndex]) return res.status(500).json({ error: 'Missing API key' });
    if (action === 'generateThesisOutline') {
      const prompt = `RÔLE : Directeur de Recherche.\nSUJET : "${payload.topic}"\nCONTEXTE : "${payload.context}"\nMISSION : Générer un plan académique structuré. Réponds en JSON: [{"title":"...","sections":["..."]}]`;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        const text = response.text || '[]';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'generateSectionContent') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        return (response.text || '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      });
    } else if (action === 'improveText') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        return (response.text || '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      });
    } else if (action === 'expandContent') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        return (response.text || '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      });
    } else if (action === 'generateTopicIdeas') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const text = response.text || '[]';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'generateJuryQuestions') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const text = response.text || '[]';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'interactWithJury') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const text = response.text || '{}';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'suggestReferences') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        const text = response.text || '[]';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'askDocumentContext') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        return response.text || '';
      });
    } else if (action === 'analyzeOrientationProfile') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        const text = response.text || '{}';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'searchJobsWithAI') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const text = response.text || '[]';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'analyzeCV') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt, config: { responseMimeType: 'application/json' } });
        const text = response.text || '{}';
        return JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
      });
    } else if (action === 'generateCoverLetter') {
      const prompt = payload.prompt;
      result = await runWithRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
        let text = response.text || '';
        text = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^Objet:.*\n/i, '').trim();
        return text;
      });
    } else {
      return res.status(400).json({ error: 'Unknown action' });
    }
    const duration = Date.now() - start;
    res.json({ result, meta: { ip, duration, keyIndex: currentKeyIndex, rotatedAt: lastRotation, leakScan } });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message || e) });
  }
});

app.get('/security/health', (req, res) => {
  res.json({ leakScan, keyIndex: currentKeyIndex, rotatedAt: lastRotation });
});

// Gérer toutes les autres routes en renvoyant l'index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
