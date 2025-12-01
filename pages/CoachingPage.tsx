import React, { useState, useRef } from 'react';
import { analyzeCV, generateCoverLetter } from '../services/geminiService';
import { FileText, PenTool, CheckCircle, Loader2, AlertCircle, Upload, ChevronRight, Sparkles, Briefcase, Award, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const CoachingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cv' | 'letter'>('cv');
  const [cvText, setCvText] = useState('');
  const [targetJob, setTargetJob] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsLoading(true);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        // Try basic extraction first, if worker fails, alert user
        try {
           text = await extractTextFromPdf(file);
        } catch (e) {
           console.error("PDF Worker Error", e);
           alert("Erreur de lecture PDF (Worker). Veuillez copier-coller le texte pour l'instant ou réessayer.");
           setIsLoading(false);
           return;
        }
      } else {
        text = await file.text();
      }
      
      // Clean up extra whitespace
      text = text.replace(/\s+/g, ' ').trim();
      setCvText(text);
    } catch (error) {
      console.error("Erreur lecture fichier:", error);
      alert("Impossible de lire ce fichier. Essayez de copier-coller le texte.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setUploadedFileName(null);
    setCvText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyzeCV = async () => {
    if (!cvText || !targetJob) return;
    setIsLoading(true);
    setResult(null);
    try {
      const feedback = await analyzeCV(cvText, targetJob);
      setResult(feedback); // Now returns JSON object
    } catch (error) {
      console.error(error);
      setResult(null);
      alert("Une erreur est survenue lors de l'analyse.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLetter = async () => {
    if (!cvText || !jobDescription) return;
    setIsLoading(true);
    setResult(null);
    try {
      const letter = await generateCoverLetter(cvText, jobDescription);
      setResult(letter); // Returns string
    } catch (error) {
      console.error(error);
      setResult(null);
      alert("Une erreur est survenue lors de la rédaction.");
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
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contenu du CV (Texte ou PDF)</label>
                            
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              accept=".pdf,.txt"
                              className="hidden"
                            />

                            {!uploadedFileName ? (
                              <div 
                                onClick={triggerFileUpload}
                                className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-600 mb-4"
                              >
                                <Upload size={24} />
                                <span className="text-sm font-bold">Cliquez pour uploader votre CV (PDF)</span>
                                <span className="text-xs">ou collez le texte ci-dessous</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4 text-blue-800 text-sm font-bold">
                                <span className="flex items-center gap-2"><FileText size={16}/> {uploadedFileName}</span>
                                <button onClick={clearFile} className="p-1 hover:bg-blue-100 rounded-full"><X size={16}/></button>
                              </div>
                            )}

                            <textarea 
                              placeholder="Le contenu de votre CV apparaîtra ici après upload, ou vous pouvez le coller directement..." 
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
                            
                            {/* Reuse Upload Logic for Letter Tab too if needed, or just keep text area */}
                            <div className="flex items-center gap-2 mb-2">
                              <button 
                                onClick={triggerFileUpload}
                                className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-full flex items-center gap-1 transition"
                              >
                                <Upload size={12} /> Importer un CV (PDF)
                              </button>
                              {uploadedFileName && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle size={12}/> {uploadedFileName} chargé</span>}
                            </div>

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
                
                {activeTab === 'cv' && typeof result === 'object' ? (
                  // --- CV ANALYSIS UI ---
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                         {/* Score Circle */}
                         <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={result.score >= 70 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444"} strokeWidth="3" strokeDasharray={`${result.score}, 100`} className="animate-[spin_1s_ease-out_reverse]" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-3xl font-bold text-slate-800">{result.score}</span>
                              <span className="text-xs text-slate-500 uppercase font-bold">Score</span>
                            </div>
                         </div>
                         <div className="flex-1">
                           <h3 className="text-xl font-bold text-slate-900 mb-2">Bilan de l'Audit</h3>
                           <p className="text-slate-600 leading-relaxed">{result.summary}</p>
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                          <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2"><CheckCircle size={18}/> Points Forts</h4>
                          <ul className="space-y-2">
                            {result.strengths.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm text-green-900 flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                          <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2"><AlertCircle size={18}/> Points Faibles</h4>
                          <ul className="space-y-2">
                            {result.weaknesses.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm text-red-900 flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
                         <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2"><Sparkles size={18}/> Plan d'Action & Améliorations</h4>
                         <ul className="space-y-3">
                            {result.improvements.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm text-blue-900 flex items-start gap-2 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                <span className="text-blue-500 font-bold text-lg">{(idx + 1).toString().padStart(2, '0')}</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  // --- LETTER UI (String) ---
                  <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 shadow-inner">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">
                      <PenTool className="text-amber-600" size={20} /> Lettre Générée
                    </h3>
                    <div className="prose prose-slate max-w-none whitespace-pre-line font-serif text-slate-800 leading-relaxed bg-white p-8 shadow-sm rounded-lg border border-slate-100">
                      {result}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => navigator.clipboard.writeText(result)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg flex items-center gap-2"
                      >
                        <CheckCircle size={18} /> Copier la lettre
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
