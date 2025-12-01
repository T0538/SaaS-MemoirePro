import React, { useState } from 'react';
import { analyzeCV, generateCoverLetter } from '../services/geminiService';
import { FileText, PenTool, CheckCircle, Loader2, AlertCircle, Upload, ChevronRight, Sparkles, Briefcase, Award } from 'lucide-react';

export const CoachingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cv' | 'letter'>('cv');
  const [cvText, setCvText] = useState('');
  const [targetJob, setTargetJob] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeCV = async () => {
    if (!cvText || !targetJob) return;
    setIsLoading(true);
    setResult('');
    try {
      const feedback = await analyzeCV(cvText, targetJob);
      setResult(feedback);
    } catch (error) {
      console.error(error);
      setResult("Une erreur est survenue lors de l'analyse.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLetter = async () => {
    if (!cvText || !jobDescription) return;
    setIsLoading(true);
    setResult('');
    try {
      const letter = await generateCoverLetter(cvText, jobDescription);
      setResult(letter);
    } catch (error) {
      console.error(error);
      setResult("Une erreur est survenue lors de la rédaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
            <Award size={14} /> Coaching IA Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">Carrière</span> mérite l'excellence.
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Optimisez votre CV et générez des lettres de motivation percutantes grâce à notre IA de recrutement avancée.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          
          {/* Sidebar Navigation */}
          <div className="md:w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
            <button 
              onClick={() => { setActiveTab('cv'); setResult(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'cv' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <FileText size={18} /> Analyse CV
            </button>
            <button 
              onClick={() => { setActiveTab('letter'); setResult(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'letter' ? 'bg-white text-amber-600 shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <PenTool size={18} /> Lettre de Motivation
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 md:p-10">
            {activeTab === 'cv' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Audit de CV par IA
                  </h2>
                  <p className="text-slate-500 text-sm">Copiez le texte de votre CV pour obtenir un score et des améliorations.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Poste visé</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Chef de Projet Digital, Développeur Fullstack..." 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contenu du CV (Texte)</label>
                    <textarea 
                      placeholder="Copiez-collez tout le texte de votre CV ici..." 
                      className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleAnalyzeCV}
                    disabled={isLoading || !cvText || !targetJob}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Analyser mon CV</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'letter' && (
              <div className="space-y-6 animate-fade-in">
                 <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <PenTool className="text-amber-600" /> Générateur de Lettre
                  </h2>
                  <p className="text-slate-500 text-sm">Créez une lettre unique basée sur votre profil et l'offre.</p>
                </div>

                <div className="space-y-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Votre Profil (Résumé/CV)</label>
                    <textarea 
                      placeholder="Vos expériences clés, compétences..." 
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm"
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description de l'Offre</label>
                    <textarea 
                      placeholder="Copiez-collez l'offre d'emploi ici..." 
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-sm"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleGenerateLetter}
                    disabled={isLoading || !cvText || !jobDescription}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <><Briefcase size={18} /> Rédiger la lettre</>}
                  </button>
                </div>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} /> Résultat de l'IA
                  </h3>
                  <div className="prose prose-sm prose-slate max-w-none whitespace-pre-line">
                    {result}
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Copier le texte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
