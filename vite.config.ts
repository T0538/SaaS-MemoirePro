import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis le fichier .env ou .env.local
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Récupération sécurisée des clés
  const detectedApiKey = env.API_KEY || env.GEMINI_API_KEY || '';

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