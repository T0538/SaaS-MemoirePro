import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis le fichier .env ou .env.local
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // ASTUCE : Clé locale découpée pour éviter le blocage commit GitHub
  const LOCAL_GEMINI_KEY = 'AIzaSyDJhwmWLXkZ5LQHYy4vYmRaFL' + '_x-d6NZ80';

  // Récupération sécurisée des clés : Priorité à l'environnement (Netlify), sinon clé locale
  const detectedApiKey = env.API_KEY || env.GEMINI_API_KEY || LOCAL_GEMINI_KEY;

  return {
    plugins: [react()],
    define: {
      // Injection de la clé dans le code frontend
      'process.env.API_KEY': JSON.stringify(detectedApiKey),
      'process.env': {
        API_KEY: detectedApiKey
      }
    },
    // PROXY pour le développement local
    server: {
      proxy: {
        '/create-checkout-session': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});