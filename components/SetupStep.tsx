import React from 'react';
import { Domain } from '../types';
import { GraduationCap, ArrowRight, Sparkles, BookOpen, FileText, ClipboardPaste } from 'lucide-react';

interface SetupStepProps {
  onComplete: (data: { title: string; domain: Domain; context: string; importedOutline?: string }) => void;
  isLoading: boolean;
}

export const SetupStep: React.FC<SetupStepProps> = ({ onComplete, isLoading }) => {
  const [mode, setMode] = React.useState<'wizard' | 'import'>('wizard');
  const [title, setTitle] = React.useState('');
  const [domain, setDomain] = React.useState<Domain>(Domain.QHSE);
  const [context, setContext] = React.useState('');
  const [importedOutline, setImportedOutline] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'wizard') {
      if (title && context) {
        onComplete({ title, domain, context });
      }
    } else {
      if (title && importedOutline) {
        // Pour l'import, on passe un contexte vide par défaut, ou on peut l'utiliser si rempli
        onComplete({ title, domain, context: "Import manuel", importedOutline });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      
      {/* Mode Selection Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex">
          <button
            onClick={() => setMode('wizard')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'wizard' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Sparkles size={16} />
            Assistant IA
          </button>
          <button
            onClick={() => setMode('import')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'import' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ClipboardPaste size={16} />
            J'ai déjà un plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Left Panel - Visual/Info */}
        <div className="md:col-span-2 bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-transparent z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
              {mode === 'wizard' ? (
                <Sparkles size={24} className="text-indigo-300" />
              ) : (
                <FileText size={24} className="text-emerald-300" />
              )}
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4 leading-tight">
              {mode === 'wizard' ? "Démarrez votre Mémoire d'Excellence" : "Importez votre structure"}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {mode === 'wizard' 
                ? "Notre IA, calibrée sur des exigences académiques strictes, va structurer votre pensée et rédiger un contenu initial de haute qualité."
                : "Collez votre sommaire existant (Word, PDF). Nous allons le transformer en projet interactif prêt pour la rédaction assistée."
              }
            </p>
          </div>
          
          <div className="relative z-10 mt-8 space-y-4">
            {mode === 'wizard' ? (
              <>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span>Normes Académiques</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                  <span>Style Professionnel</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                  <span>Reconnaissance automatique</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                  <span>Gain de temps immédiat</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="md:col-span-3 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sujet du Mémoire</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 placeholder-slate-400 font-medium"
                placeholder="Ex: L'impact de la norme ISO 45001 sur la performance..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Domaine d'expertise</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 appearance-none cursor-pointer"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as Domain)}
                >
                  {Object.values(Domain).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            {mode === 'wizard' ? (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contexte & Problématique</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-slate-800 placeholder-slate-400 text-sm leading-relaxed"
                  placeholder="Décrivez l'entreprise, le problème observé et votre angle d'attaque. Plus vous êtes précis, plus l'IA sera pertinente..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            ) : (
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Collez votre plan ici</label>
                 <textarea
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-slate-800 placeholder-slate-400 text-sm leading-relaxed font-mono"
                  placeholder={`Introduction
1. État de l'art
   1.1 Historique
   1.2 Concepts clés
2. Méthodologie
   2.1 Terrain d'étude
...`}
                  value={importedOutline}
                  onChange={(e) => setImportedOutline(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-2">Astuce : Utilisez des numéros (1., 1.1) ou des tirets pour aider notre parser.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="animate-pulse">Analyse du sujet...</span>
                </>
              ) : (
                <>
                  {mode === 'wizard' ? "Initialiser le Projet" : "Importer et Démarrer"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};