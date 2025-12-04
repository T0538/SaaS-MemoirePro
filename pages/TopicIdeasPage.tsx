import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, ArrowRight, Loader2, GraduationCap, Lightbulb, Target, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateTopicIdeas, TopicIdea } from '../services/geminiService';

export const TopicIdeasPage: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<TopicIdea[]>([]);
  const [step, setStep] = useState<'input' | 'results'>('input');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !interests) return;

    setIsLoading(true);
    try {
      const results = await generateTopicIdeas(domain, interests);
      setIdeas(results);
      setStep('results');
    } catch (error) {
      console.error("Erreur génération sujets:", error);
      // Fallback ou notification d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Spécial Outil */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                    <BrainCircuit size={20} />
                </div>
                <span className="font-serif font-bold text-slate-900 text-lg">MémoirePro <span className="text-blue-600">Genius</span></span>
            </div>
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                Retour à l'accueil
            </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        
        {step === 'input' ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                            <Sparkles size={12} className="text-amber-400" /> Assistant de Recherche IA
                        </div>
                        <h1 className="text-3xl font-serif font-bold mb-4">Trouvons votre sujet idéal.</h1>
                        <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                            Notre IA analyse votre profil académique pour vous proposer des sujets pertinents, validables et originaux.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleGenerate} className="p-8 md:p-12 space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Votre Domaine d'Études</label>
                        <div className="relative">
                            <GraduationCap className="absolute top-3.5 left-4 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="Ex: Marketing Digital, Droit des Affaires, Psychologie..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Vos Centres d'Intérêt / Mots-clés</label>
                        <div className="relative">
                            <Target className="absolute top-3.5 left-4 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                placeholder="Ex: Luxe, Intelligence Artificielle, RSE, Afrique..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Analyse en cours...
                            </>
                        ) : (
                            <>
                                Générer mes sujets <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        ) : (
            <div className="animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 shadow-sm">
                        <Lightbulb size={32} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Sujets Recommandés</h2>
                    <p className="text-slate-500">Basés sur votre profil : <span className="font-bold text-slate-700">{domain}</span> • <span className="font-bold text-slate-700">{interests}</span></p>
                </div>

                <div className="space-y-6">
                    {ideas.map((idea, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    idea.difficulty === 'Facile' ? 'bg-green-50 text-green-700 border-green-100' :
                                    idea.difficulty === 'Moyen' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                    Niveau : {idea.difficulty}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option {idx + 1}</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                                {idea.title}
                            </h3>
                            
                            <p className="text-slate-600 leading-relaxed mb-6">
                                {idea.description}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-6">
                                <BookOpen size={16} className="text-blue-500" />
                                <span className="font-medium">Méthodologie conseillée :</span> {idea.methodology}
                            </div>

                            <div className="flex gap-3">
                                <Link 
                                    to="/app" 
                                    className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-slate-200"
                                >
                                    Choisir ce sujet <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <button 
                        onClick={() => setStep('input')}
                        className="text-slate-500 font-medium hover:text-slate-800 transition-colors underline decoration-slate-300 hover:decoration-slate-800"
                    >
                        Faire une nouvelle recherche
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};
