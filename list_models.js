
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const key = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.API_KEY;
const genAI = new GoogleGenerativeAI(key.split(',')[0]);

async function listModels() {
  try {
    // Note: The SDK might not have a direct listModels method exposed on the main class in some versions,
    // but usually it's via the API manager or we just try a known working model.
    // Actually, GoogleGenerativeAI class doesn't have listModels.
    // We have to use the model manager if available, or just test known models.
    
    // Let's test if gemini-pro works (1.0)
    console.log("Testing gemini-pro...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log("gemini-pro works:", result.response.text());
    
    console.log("Testing gemini-1.5-flash...");
    const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result2 = await model2.generateContent("Hello");
    console.log("gemini-1.5-flash works:", result2.response.text());

  } catch (e) {
    console.error("Error:", e.message);
  }
}

listModels();
