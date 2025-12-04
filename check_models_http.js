
const https = require('https');
require('dotenv').config();

const key = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.API_KEY || '').split(',')[0];

if (!key) {
  console.error("No API Key found");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log("Available models:");
        json.models.forEach(m => {
          if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
            console.log("- " + m.name);
          }
        });
      } else {
        console.log("Response:", data);
      }
    } catch (e) {
      console.log("Raw response:", data);
    }
  });
}).on('error', (e) => {
  console.error("Error:", e);
});
