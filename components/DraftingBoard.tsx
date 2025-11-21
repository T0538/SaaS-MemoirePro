import React, { useState, useEffect, useRef } from 'react';
import { ThesisProject, Section, JuryQuestion, Reference, SourceDoc } from '../types';
import { generateSectionContent, improveText, expandContent, generateJuryQuestions, suggestReferences, askDocumentContext } from '../services/geminiService';
import { 
  Bot, 
  AlertCircle, 
  Download, 
  Menu,
  Save,
  Wand2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Printer,
  ChevronUp,
  Lock,
  CreditCard,
  Maximize2,
  Users,
  X,
  HelpCircle,
  Book,
  Copy,
  Plus,
  Calendar,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle,
  Search,
  MessageSquare,
  ArrowRight,
  Check,
  Home,
  Upload, // Added Upload icon
  File as FileIcon // Added File icon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; 

interface DraftingBoardProps {
  project: ThesisProject;
  onUpdateProject: (project: ThesisProject) => void;
}

export const DraftingBoard: React.FC<DraftingBoardProps> = ({ project, onUpdateProject }) => {
  const navigate = useNavigate();
  const [activeChapterId, setActiveChapterId] = useState<string>(project.chapters[0]?.id || '');
  const [activeSectionId, setActiveSectionId] = useState<string>(project.chapters[0]?.sections[0]?.id || '');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  // Export Menu State
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Editor State
  const [editorContent, setEditorContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [improveInstruction, setImproveInstruction] = useState('');
  const [showImproveInput, setShowImproveInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // BIBLIOGRAPHY STATE
  const [showBiblioPanel, setShowBiblioPanel] = useState(false);
  const [references, setReferences] = useState<Reference[]>([]);
  const [suggestedRefs, setSuggestedRefs] = useState<Reference[]>([]);
  const [isBiblioLoading, setIsBiblioLoading] = useState(false);

  // DOC CHAT STATE
  const [showDocPanel, setShowDocPanel] = useState(false);
  const [sourceDocs, setSourceDocs] = useState<SourceDoc[]>([]);
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [docQuery, setDocQuery] = useState('');
  const [docChatHistory, setDocChatHistory] = useState<{sender: 'user'|'ai', text: string}[]>([]);
  const [isDocLoading, setIsDocLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  // PLANNING COACH STATE
  const [showDateInput, setShowDateInput] = useState(false);
  const [tempDeadline, setTempDeadline] = useState('');
  const [stats, setStats] = useState({ wordCount: 0, daysLeft: 0, dailyGoal: 0, progress: 0 });

  // LICENCE STATE
  const [isPremium, setIsPremium] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const MAX_FREE_GENERATIONS = 3;

  // GOD MODE (DEV)
  const activateGodMode = () => {
      if(confirm("Activer le mode Admin (Premium gratuit) ?")) {
          localStorage.setItem('memoirepro_license', 'premium');
          setIsPremium(true);
          alert("Mode Premium activé !");
      }
  }

  useEffect(() => {
    const license = localStorage.getItem('memoirepro_license');
    setIsPremium(license === 'premium');
    
    const count = parseInt(localStorage.getItem('memoirepro_gen_count') || '0');
    setGenerationCount(count);
  }, []);

  // CALCUL DU PLANNING RETROACTIF
  useEffect(() => {
    calculateStats();
  }, [project, editorContent]);

  const calculateStats = () => {
    // 1. Total Words
    let totalWords = 0;
    project.chapters.forEach(c => {
      c.sections.forEach(s => {
        totalWords += (s.content || '').split(/\s+/).filter(w => w.length > 0).length;
      });
    });

    // 2. Days Left
    let daysLeft = 0;
    let dailyGoal = 0;
    const TARGET_WORDS = 10000; // Standard Licence Pro

    if (project.deadline) {
      const today = new Date();
      const deadlineDate = new Date(project.deadline);
      today.setHours(0,0,0,0);
      deadlineDate.setHours(0,0,0,0);
      
      const diffTime = deadlineDate.getTime() - today.getTime();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (daysLeft > 0) {
        dailyGoal = Math.max(0, Math.ceil((TARGET_WORDS - totalWords) / daysLeft));
      } else if (daysLeft < 0) {
        daysLeft = 0;
      }
    }

    setStats({
      wordCount: totalWords,
      daysLeft,
      dailyGoal,
      progress: Math.min(100, Math.round((totalWords / TARGET_WORDS) * 100))
    });
  };

  const handleSetDeadline = () => {
    if (tempDeadline) {
        onUpdateProject({ ...project, deadline: tempDeadline });
        setShowDateInput(false);
    }
  };

  const incrementGenCount = () => {
    if (!isPremium) {
      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      localStorage.setItem('memoirepro_gen_count', newCount.toString());
    }
  };

  const activeChapter = project.chapters.find(c => c.id === activeChapterId);
  const activeSection = activeChapter?.sections.find(s => s.id === activeSectionId);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editorContent]);

  // Sync editor content when selection changes
  useEffect(() => {
    if (activeSection) {
      setEditorContent(activeSection.content || "");
      setGenerationError(null);
      setShowImproveInput(false);
    }
  }, [activeSectionId, activeChapterId]);

  // Helper to close sidebar on mobile when tool is selected
  const handleToolSelect = () => {
      if (window.innerWidth < 768) {
          setSidebarOpen(false);
      }
  };

  // --- PREMIUM FEATURE GATES ---
  
  const checkPremium = (featureName: string) => {
      if (!isPremium) {
          if(confirm(`La fonctionnalité '${featureName}' est réservée aux membres Pro (3$). Débloquer maintenant ?`)) {
              navigate('/pricing');
          }
          return false;
      }
      return true;
  };

  // --- FILE UPLOAD HANDLER ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate reading PDF/DOCX (In real app, use pdf.js or mammoth.js)
    // Here we read text files natively, and "pretend" to read others for UI demo
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newDoc: SourceDoc = {
        id: Date.now().toString(),
        title: file.name,
        content: content || "Contenu du fichier extrait...",
        date: new Date()
      };
      setSourceDocs([...sourceDocs, newDoc]);
    };

    if (file.type === "text/plain") {
      reader.readAsText(file);
    } else {
      // For PDF/Word in this frontend-only demo, we simulate extraction
      // or warn the user.
      alert("Note : L'extraction PDF/Word nécessite un serveur. Pour cette démo, un document vide est ajouté. Veuillez copier-coller le texte pour une analyse réelle.");
      const newDoc: SourceDoc = {
        id: Date.now().toString(),
        title: file.name,
        content: "(Contenu binaire non extrait - Copiez le texte ici)",
        date: new Date()
      };
      setSourceDocs([...sourceDocs, newDoc]);
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!activeChapter || !activeSection) return;
    
    if (!isPremium && generationCount >= MAX_FREE_GENERATIONS && !editorContent) {
      if(confirm(`Vous avez atteint la limite de ${MAX_FREE_GENERATIONS} sections gratuites. Passez à la version Pro pour continuer en illimité (3$).`)) {
        navigate('/pricing');
      }
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const content = await generateSectionContent(
        project.title,
        project.domain,
        activeChapter.title,
        activeSection.title,
        activeSection.content
      );
      
      handleSaveContent(content, 'completed');
      incrementGenCount();

    } catch (err) {
      setGenerationError("L'IA a rencontré un problème. Réessayez.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async () => {
      if (!checkPremium("Humanisation")) return;

      if (!improveInstruction || !editorContent) return;
      setIsGenerating(true);
      try {
          const improved = await improveText(editorContent, improveInstruction);
          setEditorContent(improved);
          handleSaveContent(improved, activeSection?.status || 'pending');
          setImproveInstruction('');
          setShowImproveInput(false);
      } catch(e) {
          setGenerationError("Impossible d'améliorer le texte.");
      } finally {
          setIsGenerating(false);
      }
  }

  const handleExpand = async () => {
      if (!checkPremium("Développeur Intelligent")) return;

      if (!editorContent || editorContent.length < 10) {
          alert("Écrivez au moins quelques notes avant de développer.");
          return;
      }

      setIsGenerating(true);
      try {
          const expanded = await expandContent(editorContent, project.domain);
          setEditorContent(expanded);
          handleSaveContent(expanded, 'completed');
      } catch(e) {
          setGenerationError("Erreur lors du développement du texte.");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleJuryClick = () => {
      if (!checkPremium("Simulateur Jury")) return;
      navigate('/jury');
  }

  const handleBiblioClick = () => {
      if (!checkPremium("Bibliographe IA")) return;
      setShowBiblioPanel(true);
      handleToolSelect();
  }

  const handleDocChatClick = () => {
      if (!checkPremium("Chat avec Sources")) return;
      setShowDocPanel(true);
      handleToolSelect();
  }

  const handleSuggestBiblio = async () => {
      setIsBiblioLoading(true);
      try {
          const context = activeChapter ? `${project.title} - ${activeChapter.title}` : project.title;
          const suggestions = await suggestReferences(context, project.domain);
          setSuggestedRefs(suggestions);
      } catch(e) {
          alert("Impossible de trouver des suggestions.");
      } finally {
          setIsBiblioLoading(false);
      }
  };

  const handleAddRef = (ref: Reference) => {
      setReferences([...references, ref]);
      setSuggestedRefs(suggestedRefs.filter(r => r.id !== ref.id));
  };

  const handleCopyCitation = (citation: string) => {
      navigator.clipboard.writeText(citation);
      alert("Citation copiée !");
  };

  const handleAddDoc = () => {
      if (!newDocTitle || !newDocContent) return;
      const newDoc: SourceDoc = {
          id: Date.now().toString(),
          title: newDocTitle,
          content: newDocContent,
          date: new Date()
      };
      setSourceDocs([...sourceDocs, newDoc]);
      setNewDocTitle('');
      setNewDocContent('');
  };

  const handleAskDoc = async () => {
      if (!docQuery) return;
      
      const context = sourceDocs.map(d => `[Doc: ${d.title}]\n${d.content}`).join('\n\n');
      if (!context) {
          alert("Ajoutez d'abord des documents.");
          return;
      }

      setDocChatHistory([...docChatHistory, { sender: 'user', text: docQuery }]);
      setIsDocLoading(true);
      const q = docQuery;
      setDocQuery('');

      try {
          const answer = await askDocumentContext(q, context);
          setDocChatHistory(prev => [...prev, { sender: 'ai', text: answer }]);
      } catch(e) {
          setDocChatHistory(prev => [...prev, { sender: 'ai', text: "Erreur lors de l'analyse." }]);
      } finally {
          setIsDocLoading(false);
      }
  };

  const handleSaveContent = (content: string, status: Section['status']) => {
    if (!activeChapterId || !activeSectionId) return;
    
    const updatedChapters = project.chapters.map(c => {
      if (c.id !== activeChapterId) return c;
      return {
        ...c,
        sections: c.sections.map(s => {
          if (s.id !== activeSectionId) return s;
          return { ...s, content, status };
        })
      };
    });

    setEditorContent(content);
    onUpdateProject({ ...project, chapters: updatedChapters, updatedAt: new Date() });
  };

  const handleExportWord = () => {
    if (!checkPremium("Export Word (.doc)")) return;

    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>body { font-family: 'Times New Roman', serif; font-size: 12pt; }</style></head><body>";
    const postHtml = "</body></html>";
    
    let htmlContent = `<h1 style="text-align:center; font-size: 24pt; margin-bottom: 40px;">${project.title}</h1>`;
    htmlContent += `<p style="text-align:center; margin-bottom: 80px;">Mémoire de fin d'études - Domaine : ${project.domain}</p>`;

    project.chapters.forEach(c => {
        htmlContent += `<h2 style="page-break-before: always; color: #2e3546; font-size: 18pt; margin-top: 20px;">${c.title}</h2>`;
        c.sections.forEach(s => {
            htmlContent += `<h3 style="color: #4f46e5; font-size: 14pt; margin-top: 15px;">${s.title}</h3>`;
            const paragraphs = (s.content || 'Section vide').split('\n').filter(p => p.trim() !== '').map(p => `<p style="text-align: justify; line-height: 1.5;">${p}</p>`).join('');
            htmlContent += paragraphs;
        });
    });

    if (references.length > 0) {
        htmlContent += `<h2 style="page-break-before: always; color: #2e3546; font-size: 18pt; margin-top: 20px;">Bibliographie</h2>`;
        references.forEach(ref => {
            htmlContent += `<p style="margin-bottom: 10px;">${ref.citation}</p>`;
        });
    }

    const html = preHtml + htmlContent + postHtml;
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    // @ts-ignore
    if((navigator as any).msSaveOrOpenBlob ){
        // @ts-ignore
        (navigator as any).msSaveOrOpenBlob(blob, `memoire_${project.title.substring(0,10)}.doc`);
    } else {
        downloadLink.href = url;
        downloadLink.download = `memoire_${project.title.substring(0,10)}.doc`;
        downloadLink.click();
    }
    document.body.removeChild(downloadLink);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let content = `
      <html>
        <head>
          <title>${project.title} - Impression</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
            body { font-family: 'Merriweather', serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { text-align: center; font-size: 2.5rem; margin-bottom: 1rem; color: #111827; }
            .subtitle { text-align: center; color: #6b7280; margin-bottom: 4rem; font-style: italic; }
            h2 { border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; margin-top: 3rem; color: #1f2937; page-break-before: always; }
            h3 { color: #4f46e5; margin-top: 2rem; font-size: 1.2rem; }
            p { margin-bottom: 1rem; text-align: justify; }
            .biblio { margin-top: 3rem; border-top: 4px solid #e5e7eb; padding-top: 2rem; }
            .ref { margin-bottom: 1rem; padding-left: 1rem; border-left: 3px solid #cbd5e1; }
            @media print {
              body { padding: 0; max-width: 100%; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${project.title}</h1>
          <p class="subtitle">Mémoire en ${project.domain}</p>
    `;

    project.chapters.forEach(c => {
      content += `<h2>${c.title}</h2>`;
      c.sections.forEach(s => {
        content += `<h3>${s.title}</h3>`;
        const paragraphs = (s.content || '').split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
        content += paragraphs;
      });
    });

    if (references.length > 0) {
        content += `<div class="biblio"><h2>Bibliographie</h2>`;
        references.forEach(ref => {
            content += `<div class="ref">${ref.citation}</div>`;
        });
        content += `</div>`;
    }

    content += `
          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 500); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setShowExportMenu(false);
  };

  return (
    <div className="flex h-[100dvh] bg-[#F3F4F6] overflow-hidden font-sans text-slate-900 fixed top-0 left-0 w-full z-50">
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-72'} transition-transform duration-300 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-[100] fixed md:relative w-72 shadow-xl md:shadow-none`}>
        <div className="p-4 h-16 border-b border-slate-100 flex justify-between items-center bg-emerald-900 text-white">
            <div className="flex items-center gap-2 font-bold cursor-pointer" onDoubleClick={activateGodMode} title="Double-clic pour activer le mode Admin">
                <FileText size={16} className="text-emerald-400"/>
                <span className="truncate max-w-[150px]">Éditeur Pro</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-white/10 rounded"><ChevronLeft size={20} /></button>
        </div>

        {/* FREE TIER BANNER */}
        {!isPremium && (
            <div className="bg-emerald-50 p-4 border-b border-emerald-100">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
                    <span>Essai Gratuit</span>
                    <span>{generationCount}/{MAX_FREE_GENERATIONS}</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-1.5 mb-3">
                    <div className="bg-emerald-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((generationCount/MAX_FREE_GENERATIONS)*100, 100)}%` }}></div>
                </div>
                <button onClick={() => navigate('/pricing')} className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition">
                    <CreditCard size={12} />
                    Passer Pro (3$)
                </button>
            </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          
          {/* COACH PLANNING WIDGET */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={12} /> Coach Planning
                  </h4>
                  {project.deadline && <span className="text-xs font-bold text-emerald-600">J-{stats.daysLeft}</span>}
              </div>
              
              {!project.deadline ? (
                  showDateInput ? (
                    <div className="flex gap-2">
                      <input 
                          type="date" 
                          className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded"
                          onChange={(e) => setTempDeadline(e.target.value)}
                      />
                      <button 
                        onClick={handleSetDeadline} 
                        className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-700"
                        disabled={!tempDeadline}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                      <button 
                          onClick={() => setShowDateInput(true)} 
                          className="w-full py-2 bg-white border border-dashed border-slate-300 text-slate-500 text-xs rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition"
                      >
                          + Définir ma date de rendu
                      </button>
                  )
              ) : (
                  <div className="space-y-3">
                      <div>
                          <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">Progression</span>
                              <span className="font-bold text-slate-700">{stats.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stats.progress}%` }}></div>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 text-right">{stats.wordCount} / 10 000 mots</p>
                      </div>
                  </div>
              )}
          </div>

          {/* Outils Intelligents Section */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-3 flex items-center gap-2">
               <Wand2 size={12} /> Boîte à outils IA
            </h4>
            <div className="space-y-2">
                 <button onClick={() => {handleExpand(); handleToolSelect();}} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition text-left">
                     <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><Maximize2 size={16}/></div>
                     Développer le texte
                     {!isPremium && <Lock size={12} className="ml-auto text-slate-300"/>}
                 </button>
                 <button onClick={handleJuryClick} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition text-left">
                     <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><Users size={16}/></div>
                     Simulateur Jury
                     {!isPremium && <Lock size={12} className="ml-auto text-slate-300"/>}
                 </button>
                 <button onClick={handleBiblioClick} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition text-left">
                     <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><Book size={16}/></div>
                     Bibliographe IA
                     {!isPremium && <Lock size={12} className="ml-auto text-slate-300"/>}
                 </button>
                 <button onClick={handleDocChatClick} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition text-left">
                     <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><Search size={16}/></div>
                     Chat avec Sources
                     {!isPremium && <Lock size={12} className="ml-auto text-slate-300"/>}
                 </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            {project.chapters.map((chapter, idx) => (
                <div key={chapter.id} className="mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-3 truncate" title={chapter.title}>
                    {idx + 1}. {chapter.title}
                </h4>
                <ul className="space-y-0.5">
                    {chapter.sections.map((section) => {
                    const isActive = section.id === activeSectionId;
                    return (
                        <li key={section.id}>
                        <button
                            onClick={() => {
                            setActiveChapterId(chapter.id);
                            setActiveSectionId(section.id);
                            handleToolSelect();
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-start gap-2 transition-all ${
                            isActive 
                                ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-sm' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${section.status === 'completed' ? 'bg-emerald-500' : isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className="leading-tight">{section.title}</span>
                        </button>
                        </li>
                    );
                    })}
                </ul>
                </div>
            ))}
          </div>
        </div>
        
        {/* Footer Sidebar with Export Menu - RESTORED */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 relative">
             <div className={`absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all origin-bottom duration-200 ${showExportMenu ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                 <button onClick={handleExportWord} className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition border-b border-slate-100">
                     <div className="flex items-center gap-3">
                        <FileText size={16} className="text-emerald-600" />
                        <span>Word (.doc)</span>
                     </div>
                     {!isPremium && <Lock size={12} className="text-slate-400" />}
                 </button>
                 <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                     <Printer size={16} className="text-emerald-600" />
                     <span>PDF (Impression)</span>
                 </button>
             </div>

             <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition shadow-sm"
             >
                <div className="flex items-center gap-2">
                    <Download size={16} />
                    Exporter
                </div>
                <ChevronUp size={14} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
             </button>
        </div>
      </div>

      {/* BIBLIOGRAPHY PANEL OVERLAY - RESTORED */}
      {showBiblioPanel && (
         <div className="absolute inset-0 z-[110] flex justify-end">
             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowBiblioPanel(false)}></div>
             <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-fade-in flex flex-col">
                 <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                     <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                         <Book className="text-emerald-600" />
                         Bibliographe Express
                     </div>
                     <button onClick={() => setShowBiblioPanel(false)} className="text-slate-400 hover:text-slate-700"><X /></button>
                 </div>

                 <div className="p-6 flex-1 overflow-y-auto">
                     {/* Actions */}
                     <div className="mb-8 space-y-4">
                         <button 
                             onClick={handleSuggestBiblio}
                             disabled={isBiblioLoading}
                             className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
                         >
                             {isBiblioLoading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Wand2 size={18} />}
                             Suggérer des sources
                         </button>
                         <p className="text-xs text-slate-500 text-center">L'IA cherche des livres et articles pertinents et formate la citation en APA 7.</p>
                     </div>

                     {/* Suggestions */}
                     {suggestedRefs.length > 0 && (
                         <div className="mb-8">
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suggestions ({suggestedRefs.length})</h4>
                             <div className="space-y-3">
                                 {suggestedRefs.map(ref => (
                                     <div key={ref.id} className="p-3 border border-emerald-100 bg-emerald-50 rounded-lg text-sm group">
                                         <p className="text-slate-800 font-medium mb-1">{ref.title}</p>
                                         <p className="text-slate-500 text-xs mb-2">{ref.author} ({ref.year})</p>
                                         <div className="flex gap-2">
                                             <button onClick={() => handleAddRef(ref)} className="flex-1 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded font-medium text-xs hover:bg-emerald-100">Ajouter</button>
                                             <button onClick={() => handleCopyCitation(ref.citation)} className="px-3 py-1.5 bg-white border border-emerald-200 text-slate-600 rounded hover:bg-slate-50" title="Copier"><Copy size={14}/></button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}

                     {/* Ma Bibliographie */}
                     <div>
                         <div className="flex items-center justify-between mb-3">
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ma Bibliographie ({references.length})</h4>
                             {references.length > 0 && (
                                 <button onClick={() => {
                                     const allText = references.map(r => r.citation).join('\n\n');
                                     navigator.clipboard.writeText(allText);
                                     alert('Toute la bibliographie a été copiée !');
                                 }} className="text-xs text-emerald-600 hover:underline">Tout copier</button>
                             )}
                         </div>
                         
                         {references.length === 0 ? (
                             <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                                 Aucune référence enregistrée.
                             </div>
                         ) : (
                             <div className="space-y-3">
                                 {references.map((ref, idx) => (
                                     <div key={idx} className="p-3 border border-slate-200 bg-white rounded-lg text-sm relative group hover:shadow-md transition">
                                         <p className="text-slate-800 font-serif text-xs leading-relaxed pr-6">{ref.citation}</p>
                                         <button 
                                            onClick={() => handleCopyCitation(ref.citation)}
                                            className="absolute top-2 right-2 text-slate-300 hover:text-emerald-600"
                                         >
                                             <Copy size={14} />
                                         </button>
                                     </div>
                                 ))}
                             </div>
                         )}
                     </div>
                 </div>
             </div>
         </div>
      )}

      {/* DOC CHAT PANEL OVERLAY - RESTORED */}
      {showDocPanel && (
         <div className="absolute inset-0 z-[110] flex justify-end">
             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDocPanel(false)}></div>
             <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-fade-in flex flex-col">
                 <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                     <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                         <Search className="text-emerald-600" />
                         Chat avec Sources
                     </div>
                     <button onClick={() => setShowDocPanel(false)} className="text-slate-400 hover:text-slate-700"><X /></button>
                 </div>

                 <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Documents List */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50 max-h-[30%] overflow-y-auto">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mes Documents ({sourceDocs.length})</h4>
                        <div className="space-y-2">
                            {sourceDocs.map(doc => (
                                <div key={doc.id} className="bg-white p-2 rounded border border-slate-200 text-xs flex items-center justify-between">
                                    <span className="truncate font-medium text-slate-700">{doc.title}</span>
                                    <span className="text-slate-400">{doc.content.length > 100 ? Math.round(doc.content.length/1000) + 'k chars' : 'court'}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".txt,.md,.pdf,.doc,.docx"
                                className="hidden"
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded mb-2 flex items-center justify-center gap-2 border border-slate-200"
                            >
                                <Upload size={14} /> Importer un fichier
                            </button>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-px flex-1 bg-slate-200"></span>
                                <span className="text-[10px] text-slate-400">OU</span>
                                <span className="h-px flex-1 bg-slate-200"></span>
                            </div>

                            <input 
                                className="w-full mb-2 px-2 py-1 text-xs border rounded" 
                                placeholder="Titre (ex: Rapport 2023)" 
                                value={newDocTitle}
                                onChange={e => setNewDocTitle(e.target.value)}
                            />
                            <textarea 
                                className="w-full mb-2 px-2 py-1 text-xs border rounded resize-none" 
                                rows={2} 
                                placeholder="Collez le texte du document ici..." 
                                value={newDocContent}
                                onChange={e => setNewDocContent(e.target.value)}
                            />
                            <button onClick={handleAddDoc} disabled={!newDocContent || !newDocTitle} className="w-full py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 disabled:opacity-50">
                                + Ajouter ce texte
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                        {docChatHistory.length === 0 && (
                            <div className="text-center text-slate-400 text-sm py-8">
                                Importez vos cours ou PDF, puis posez une question.<br/>Ex: "Que dit le rapport sur la RSE ?"
                            </div>
                        )}
                        {docChatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isDocLoading && (
                            <div className="flex justify-start"><div className="bg-slate-100 p-3 rounded-xl text-sm text-slate-500">Analyse en cours...</div></div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Votre question sur les documents..."
                                value={docQuery}
                                onChange={e => setDocQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAskDoc()}
                            />
                            <button onClick={handleAskDoc} disabled={isDocLoading || !docQuery} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                 </div>
             </div>
         </div>
      )}


      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* Top Bar - Optimized Text Layout */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-[30]">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className={`md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <Menu size={20} />
            </button>
            
            {/* Text Container with min-w-0 for truncation */}
            <div className="flex flex-col min-w-0 justify-center">
               <div className="flex items-center gap-1 text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-bold truncate leading-none mb-0.5">
                  <span className="truncate">{activeChapter?.title || 'Chapitre'}</span>
                  <ChevronRight size={10} className="shrink-0" />
                  <span className="text-emerald-600 truncate">Section</span>
               </div>
               <div className="flex items-center gap-2 min-w-0">
                 {activeSection?.status === 'completed' && <CheckCircle size={14} className="text-emerald-500 shrink-0"/>}
                 <span className="font-bold text-slate-800 text-sm md:text-base truncate" title={activeSection?.title}>
                   {activeSection?.title || 'Titre de la section'}
                 </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-2">
             {/* Home Button - NEW */}
             <Link to="/" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Retour à l'accueil">
                 <Home size={18} />
             </Link>

             <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                {isGenerating ? (
                   <span className="text-emerald-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                      <span className="hidden sm:inline">Rédaction...</span>
                   </span>
                ) : (
                   <>
                     <Save size={12} />
                     <span className="hidden sm:inline">Enregistré</span>
                   </>
                )}
             </div>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto relative bg-slate-100/50 pt-20 md:pt-0">
           <div className="max-w-3xl mx-auto py-8 px-4 md:py-12 md:px-12 min-h-full flex flex-col">
              
              {/* Humanizer Bar */}
              <div className="mb-6 bg-white p-2 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-2 sticky top-0 z-[20]">
                 <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                 </div>
                 {showImproveInput ? (
                    <div className="flex-1 flex gap-2">
                       <input 
                         type="text"
                         className="flex-1 text-sm outline-none text-slate-700 placeholder-slate-400 bg-transparent"
                         placeholder="Ex: Rends le ton plus formel..."
                         value={improveInstruction}
                         onChange={(e) => setImproveInstruction(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleImprove()}
                         autoFocus
                       />
                       <button 
                         onClick={handleImprove}
                         className="bg-emerald-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-emerald-700"
                       >
                         Go
                       </button>
                       <button onClick={() => setShowImproveInput(false)} className="p-1 text-slate-400 hover:text-slate-600"><X size={14}/></button>
                    </div>
                 ) : (
                    <button 
                       onClick={() => setShowImproveInput(true)}
                       className="flex-1 text-left text-sm text-slate-400 hover:text-slate-600 transition"
                    >
                       Demander à l'IA d'améliorer ou reformuler...
                    </button>
                 )}
              </div>

              {/* Paper */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[60vh] p-6 md:p-16 relative cursor-text" onClick={() => textareaRef.current?.focus()}>
                 {generationError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                       <AlertCircle size={16} />
                       {generationError}
                    </div>
                 )}
                 
                 <textarea
                    ref={textareaRef}
                    value={editorContent}
                    onChange={(e) => {
                       setEditorContent(e.target.value);
                       handleSaveContent(e.target.value, 'pending');
                    }}
                    className="w-full h-full resize-none outline-none text-slate-800 text-lg leading-relaxed font-serif placeholder-slate-300 bg-transparent overflow-hidden"
                    placeholder="Commencez à écrire ou utilisez 'Générer'..."
                    spellCheck={false}
                 />

                 {!editorContent && !isGenerating && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
                       <button 
                          onClick={handleGenerate}
                          className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 font-bold text-white transition-all duration-200 bg-emerald-900 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 hover:bg-emerald-600 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full md:w-auto"
                       >
                          <Wand2 size={20} className="animate-pulse" />
                          Générer cette section
                       </button>
                       <p className="mt-4 text-xs md:text-sm text-slate-400">L'IA va rédiger environ 400 mots basés sur votre plan.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};