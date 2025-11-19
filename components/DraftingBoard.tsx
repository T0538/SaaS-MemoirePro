import React, { useState, useEffect, useRef } from 'react';
import { ThesisProject, Section } from '../types';
import { generateSectionContent, improveText } from '../services/geminiService';
import { 
  Bot, 
  Check, 
  AlertCircle, 
  Download, 
  Menu,
  Save,
  Wand2,
  MoreVertical,
  FileText,
  ChevronLeft,
  Printer,
  FileCheck,
  ChevronUp
} from 'lucide-react';

interface DraftingBoardProps {
  project: ThesisProject;
  onUpdateProject: (project: ThesisProject) => void;
}

export const DraftingBoard: React.FC<DraftingBoardProps> = ({ project, onUpdateProject }) => {
  const [activeChapterId, setActiveChapterId] = useState<string>(project.chapters[0]?.id || '');
  const [activeSectionId, setActiveSectionId] = useState<string>(project.chapters[0]?.sections[0]?.id || '');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Export Menu State
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Editor State
  const [editorContent, setEditorContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [improveInstruction, setImproveInstruction] = useState('');
  const [showImproveInput, setShowImproveInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleGenerate = async () => {
    if (!activeChapter || !activeSection) return;
    
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
    } catch (err) {
      setGenerationError("L'IA a rencontré un problème. Réessayez.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async () => {
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

  // EXPORT WORD (.DOC)
  const handleExportWord = () => {
    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>body { font-family: 'Times New Roman', serif; font-size: 12pt; }</style></head><body>";
    const postHtml = "</body></html>";
    
    let htmlContent = `<h1 style="text-align:center; font-size: 24pt; margin-bottom: 40px;">${project.title}</h1>`;
    htmlContent += `<p style="text-align:center; margin-bottom: 80px;">Mémoire de fin d'études - Domaine : ${project.domain}</p>`;

    project.chapters.forEach(c => {
        htmlContent += `<h2 style="page-break-before: always; color: #2e3546; font-size: 18pt; margin-top: 20px;">${c.title}</h2>`;
        c.sections.forEach(s => {
            htmlContent += `<h3 style="color: #4f46e5; font-size: 14pt; margin-top: 15px;">${s.title}</h3>`;
            // Remplace les sauts de ligne simples par des paragraphes pour Word
            const paragraphs = (s.content || 'Section vide').split('\n').filter(p => p.trim() !== '').map(p => `<p style="text-align: justify; line-height: 1.5;">${p}</p>`).join('');
            htmlContent += paragraphs;
        });
    });

    const html = preHtml + htmlContent + postHtml;
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    // @ts-ignore - msSaveOrOpenBlob is IE specific
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

  // EXPORT PDF (VIA PRINT)
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
    // Important: h-[calc(100vh)] is crucial here to make it act like an app despite global scroll
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans text-slate-900 fixed top-0 left-0 w-full z-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full opacity-0'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 z-20 absolute md:relative shadow-xl md:shadow-none`}>
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
            <div className="flex items-center gap-2 font-bold">
                <FileText size={16} className="text-indigo-400"/>
                <span className="truncate max-w-[150px]">Éditeur Pro</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400"><ChevronLeft /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {project.chapters.map((chapter, idx) => (
            <div key={chapter.id} className="animate-fade-in" style={{animationDelay: `${idx * 0.05}s`}}>
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
                          if(window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-start gap-2 transition-all ${
                          isActive 
                            ? 'bg-indigo-50 text-indigo-900 font-semibold shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${section.status === 'completed' ? 'bg-green-500' : isActive ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                        <span className="leading-tight">{section.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer Sidebar with Export Menu */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 relative">
             <div className={`absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all origin-bottom duration-200 ${showExportMenu ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                 <button onClick={handleExportWord} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition border-b border-slate-100">
                     <FileText size={16} className="text-blue-600" />
                     <span>Word (.doc)</span>
                 </button>
                 <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
                     <Printer size={16} className="text-red-600" />
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

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition"
            >
              <Menu size={20} />
            </button>
            <nav className="hidden md:flex items-center text-sm text-slate-500">
               <span className="font-medium text-slate-900 truncate max-w-[200px]">{activeChapter?.title}</span>
               <span className="mx-2">/</span>
               <span className="truncate max-w-[200px]">{activeSection?.title}</span>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 mr-4 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                 <Save size={12} />
                 {editorContent ? 'Sauvegardé' : 'Prêt'}
             </div>
             
             <button
                onClick={() => setShowImproveInput(!showImproveInput)}
                disabled={isGenerating || !editorContent}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition disabled:opacity-50"
            >
                <Wand2 size={16} />
                <span className="hidden md:inline">Améliorer</span>
            </button>

             <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-md shadow-slate-900/10 transition disabled:opacity-70"
            >
                {isGenerating ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="hidden md:inline">Rédaction...</span>
                    </>
                ) : (
                    <>
                        <Bot size={16} />
                        <span>{editorContent ? 'Régénérer' : 'Générer (IA)'}</span>
                    </>
                )}
            </button>
          </div>
        </header>

        {/* Writing Surface */}
        <main className="flex-1 overflow-y-auto relative bg-[#F3F4F6] p-4 md:p-8 flex justify-center">
            
            {/* The "Paper" */}
            <div className="w-full max-w-[850px] min-h-[calc(100vh-8rem)] bg-white shadow-xl shadow-slate-200/50 rounded-none md:rounded-sm px-8 py-12 md:px-16 md:py-20 relative transition-all">
                
                {/* Contextual Warning */}
                {generationError && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start gap-3 animate-fade-in">
                        <AlertCircle className="text-red-500 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm text-red-800 font-medium">Erreur de génération</p>
                            <p className="text-xs text-red-600">{generationError}</p>
                        </div>
                    </div>
                )}

                {/* AI Improvement Input Floating */}
                {showImproveInput && (
                   <div className="mb-8 p-4 bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 rounded-xl flex gap-3 animate-fade-in sticky top-0 z-20 shadow-sm">
                       <input 
                           autoFocus
                           type="text" 
                           value={improveInstruction}
                           onChange={(e) => setImproveInstruction(e.target.value)}
                           placeholder="Instruction à l'IA (ex: 'Rends ce passage plus nuancé', 'Ajoute un exemple QHSE')..."
                           className="flex-1 px-4 py-2 text-sm border border-indigo-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
                           onKeyDown={(e) => e.key === 'Enter' && handleImprove()}
                       />
                       <button 
                          onClick={handleImprove}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition"
                       >
                           Go
                       </button>
                   </div>
                )}

                {/* Title in Document */}
                <div className="mb-8 pb-4 border-b border-slate-100">
                    <h1 className="text-3xl font-serif font-bold text-slate-900 leading-tight mb-2">
                        {activeSection?.title}
                    </h1>
                    <p className="text-sm text-slate-400 font-sans uppercase tracking-widest">
                        {activeChapter?.title}
                    </p>
                </div>

                {/* Content Editor */}
                <div className="relative min-h-[400px]">
                    {isGenerating && (
                        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-lg">
                            <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-100">
                                <div className="relative w-16 h-16 mb-4">
                                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                    <Bot className="absolute inset-0 m-auto text-indigo-600" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Rédaction en cours</h3>
                                <p className="text-slate-500 text-sm mt-1 text-center max-w-[200px]">L'IA structure ses arguments et rédige le contenu expert...</p>
                            </div>
                        </div>
                    )}
                    
                    <textarea
                        ref={textareaRef}
                        className="w-full h-full resize-none outline-none border-none p-0 text-lg leading-[1.8] text-slate-800 font-serif placeholder-slate-300 bg-transparent overflow-hidden"
                        placeholder="Le contenu de votre section apparaîtra ici. Cliquez sur 'Générer (IA)' pour commencer ou écrivez directement..."
                        value={editorContent}
                        onChange={(e) => {
                            setEditorContent(e.target.value);
                        }}
                        onBlur={() => handleSaveContent(editorContent, editorContent.length > 100 ? 'completed' : 'pending')}
                        spellCheck={false}
                    />
                </div>
                
                {/* Footer of Page */}
                <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-300 text-xs font-sans">
                    <span>MémoirePro AI • Brouillon confidentiel</span>
                    <span>{editorContent.split(/\s+/).filter(w => w.length > 0).length} mots</span>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};