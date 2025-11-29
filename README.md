<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MémoirePro SaaS - Rédaction de Mémoire avec IA

Bienvenue sur le projet MémoirePro. Ce SaaS aide les étudiants à structurer et rédiger leur mémoire universitaire grâce à l'intelligence artificielle (Gemini).

## 🚀 Démarrage Rapide

**Prérequis :** Node.js (v18+)

### 1. Installation
Installez les dépendances du projet :
```bash
npm install
```

### 2. Configuration de la Clé API Gemini
Ce projet nécessite une clé API Google Gemini pour fonctionner.

1. **Obtenir une clé :** Rendez-vous sur [Google AI Studio](https://aistudio.google.com/app/apikey) et créez une clé API gratuite.
2. **Configurer le projet :**
   - Créez un fichier `.env` à la racine du projet (vous pouvez copier `.env.example`).
   - Ajoutez votre clé dans le fichier `.env` :
     ```env
     API_KEY=votre_cle_api_commencant_par_AIza...
     ```
   *(Note : Le projet supporte aussi `VITE_API_KEY` ou `GEMINI_API_KEY`)*

### 3. Lancer l'application
Démarrez le serveur de développement :
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

## 🛠 Technologies
- **Frontend :** React, TypeScript, Vite, TailwindCSS
- **AI :** Google Gemini 2.5 Pro (via SDK `@google/genai`)
- **Paiement :** Stripe (Intégration basique)

## ⚠️ Note Importante
Le modèle IA est configuré sur **Gemini 2.5 Pro**. Assurez-vous que votre clé API a accès aux derniers modèles via Google AI Studio.
