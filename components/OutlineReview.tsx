import React, { useState } from 'react';
import { Chapter } from '../types';
import { FileText, CheckCircle, RefreshCcw, Trash2, Plus, GripVertical, Download, ChevronDown, Printer, ArrowRight } from 'lucide-react';

interface OutlineReviewProps {
  chapters: Chapter[];
  onConfirm: (chapters: Chapter[]) => void;
  onRegenerate: () => void;
}

export const OutlineReview: React.FC<OutlineReviewProps> = ({ chapters, onConfirm, onRegenerate }) => {
  const [editableChapters, setEditableChapters] = React.useState<Chapter[]>(chapters);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSectionChange = (chapIndex: number, secIndex: number, val: string) => {
    const newChaps = [...editableChapters];
    newChaps[chapIndex].sections[secIndex].title = val;
    setEditableChapters(newChaps);
  };

  const addSection = (chapIndex: number) => {
    const newChaps = [...editableChapters];
    newChaps[chapIndex].sections.push({
      id: Math.random().toString(),
      title: "Nouvelle section...",
      content: "",
      status: 'pending'
    });
    setEditableChapters(newChaps);
  };

  const removeSection = (chapIndex: number, secIndex: number) => {
    const newChaps = [...editableChapters];
    newChaps[chapIndex].sections.splice(secIndex, 1);
    setEditableChapters(newChaps);
  };

  // EXPORT WORD (.DOC) - PLAN UNIQUEMENT
  const handleExportWord = () => {
    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export Plan</title><style>body { font-family: 'Times New Roman', serif; font-size: 12pt; } h1 { text-align: center; } h2 { color: #2e3546; margin-top: 20px; } ul { margin-bottom: 15px; } li { margin-bottom: 5px; }</style></head><body>";
    const postHtml = "</body></html>";
    
    let htmlContent = `<h1>Plan du Mémoire</h1>`;
    htmlContent += `<p style="text-align: center; margin-bottom: 40px;">Structure prévisionnelle</p>`;

    editableChapters.forEach((c, idx) => {
        htmlContent += `<h2>Chapitre ${idx + 1} : ${c.title}</h2>`;
        htmlContent += `<ul>`;
        c.sections.forEach(s => {
            htmlContent += `<li>${s.title}</li>`;
        });
        htmlContent += `</ul>`;
    });

    const html = preHtml + htmlContent + postHtml;
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    if((navigator as any).msSaveOrOpenBlob ){
        (navigator as any).msSaveOrOpenBlob(blob, `plan_memoire.doc`);
    } else {
        downloadLink.href = url;
        downloadLink.download = `plan_memoire.doc`;
        downloadLink.click();
    }
    document.body.removeChild(downloadLink);
    setShowExportMenu(false);
  };

  // EXPORT PDF (VIA PRINT) - PLAN UNIQUEMENT
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let content = `
      <html>
        <head>
          <title>Plan du Mémoire</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
            body { font-family: 'Merriweather', serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { text-align: center; font-size: 2rem; margin-bottom: 0.5rem; color: #111827; }
            .subtitle { text-align: center; color: #6b7280; margin-bottom: 3rem; font-style: italic; }
            .chapter { margin-top: 2rem; page-break-inside: avoid; }
            .chapter-title { font-weight: bold; font-size: 1.2rem; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; margin-bottom: 1rem; }
            ul { list-style-type: none; padding-left: 0; }
            li { padding: 0.5rem 0; padding-left: 1.5rem; border-left: 2px solid #e5e7eb; margin-bottom: 0.25rem; color: #4b5563; }
            @media print {
              body { padding: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <h1>Plan Détaillé du Mémoire</h1>
          <p class="subtitle">Document de travail généré par MémoirePro</p>
    `;

    editableChapters.forEach((c, idx) => {
      content += `
        <div class="chapter">
            <div class="chapter-title">Chapitre ${idx + 1} : ${c.title}</div>
            <ul>
                ${c.sections.map(s => `<li>${s.title}</li>`).join('')}
            </ul>
        </div>
      `;
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
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Structure du Mémoire</h2>
          <p className="text-slate-500 mt-2">L'IA a établi cette feuille de route. Validez-la ou exportez-la pour votre tuteur.</p>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Export Dropdown */}
             <div className="relative">
                 <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
                 >
                    <Download size={16} />
                    Exporter le plan
                    <ChevronDown size={14} />
                 </button>
                 
                 {showExportMenu && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 animate-fade-in">
                         <button onClick={handleExportWord} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition border-b border-slate-50">
                             <FileText size={16} className="text-blue-600" />
                             <span>Word (.doc)</span>
                         </button>
                         <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
                             <Printer size={16} className="text-red-600" />
                             <span>PDF (Impression)</span>
                         </button>
                     </div>
                 )}
                 {/* Click outside handler could be added here for robustness */}
                 {showExportMenu && (
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)}></div>
                 )}
             </div>

            <button 
            onClick={onRegenerate}
            className="text-slate-600 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition"
            >
            <RefreshCcw size={16} />
            Régénérer
            </button>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        {editableChapters.map((chapter, cIdx) => (
          <div key={chapter.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-white text-slate-900 font-bold w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                  {cIdx + 1}
                </span>
                <h3 className="font-serif font-bold text-slate-800 text-lg">{chapter.title}</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              {chapter.sections.map((section, sIdx) => (
                <div key={section.id} className="group flex items-center gap-3">
                  <GripVertical size={16} className="text-slate-300 cursor-move" />
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionChange(cIdx, sIdx, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                  <button
                    onClick={() => removeSection(cIdx, sIdx)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    title="Supprimer la section"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => addSection(cIdx)}
                className="mt-2 flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition w-fit"
              >
                <Plus size={14} />
                Ajouter une section
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onConfirm(editableChapters)}
          className="bg-slate-900 hover:bg-indigo-600 text-white text-lg font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-200 flex items-center gap-3 transform hover:-translate-y-1"
        >
          <CheckCircle size={24} />
          Valider le plan et commencer
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};