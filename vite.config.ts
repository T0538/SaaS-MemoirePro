import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis le fichier .env ou .env.local
  
  // Fix: Cast process to any to avoid TS error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // LOGIQUE INTELLIGENTE : Cherche la clé sous plusieurs noms possibles
  // Cela permet de supporter votre fichier actuel sans devoir le renommer
  const detectedApiKey = env.API_KEY || env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Injecte la valeur trouvée directement dans le code à la place de process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(detectedApiKey),
      // Mock de sécurité pour éviter les crashs si 'process' est accédé ailleurs
      'process.env': {
        API_KEY: detectedApiKey
      }
    }
  };
});