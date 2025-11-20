
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { ArrowLeft, CheckCircle2, GraduationCap, Info, Calendar, Calculator, FileCheck, Lightbulb, ArrowRight } from 'lucide-react';

export const DestinationPage: React.FC = () => {
  const { region } = useParams<{ region: string }>();
  const data = DESTINATIONS[region || 'europe'];

  if (!data) {
    return <Navigate to="/" />;
  }

  // Dynamic color classes mapping
  const colorClasses: Record<string, any> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-100', gradient: 'from-blue-500 to-indigo-600', listMarker: 'marker:text-blue-500' },
    amber: { bg: 'bg-amber-600', text: 'text-amber-600', bgLight: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-100', gradient: 'from-amber-500 to-orange-600', listMarker: 'marker:text-amber-500' },
    red: { bg: 'bg-red-600', text: 'text-red-600', bgLight: 'bg-red-50', border: 'border-red-200', ring: 'ring-red-100', gradient: 'from-red-500 to-rose-600', listMarker: 'marker:text-red-500' },
  };

  const theme = colorClasses[data.color] || colorClasses.blue;

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[500px] lg:h-[60vh] flex flex-col justify-end overflow-hidden">
        <div className={`absolute inset-0 bg-slate-900/50 z-10`}></div>
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10`}></div>
        <img src={data.heroImage} alt={data.title} className="absolute inset-0 w-full h-full object-cover transform scale-105" />
        
        <div className="relative z-20 p-6 md:p-12 lg:p-20 w-full">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 md:mb-8 transition-colors text-xs md:text-sm font-bold backdrop-blur-md bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 hover:bg-white/20">
                    <ArrowLeft size={14} /> Retour à l'accueil
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-xl">
                    {data.title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-slate-100 max-w-2xl font-light leading-relaxed drop-shadow-md opacity-90">
                    {data.subtitle}
                </p>
            </div>
        </div>
      </div>

      {/* Stats Bar - Floating Overlap */}
      <div className="px-4 md:px-6">
          <div className="bg-white border border-slate-100 relative z-30 -mt-8 md:-mt-12 mx-auto max-w-6xl rounded-2xl shadow-xl p-6 md:p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {data.stats.map((stat, idx) => (
                  <div key={idx} className="text-center sm:text-left pt-4 sm:pt-0 pl-0 sm:pl-6 first:pl-0">
                      <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2">{stat.label}</p>
                      <p className={`text-xl md:text-3xl font-bold ${theme.text}`}>{stat.value}</p>
                  </div>
              ))}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* Main Content */}
         <div className="lg:col-span-8 space-y-12 md:space-y-16">
             
             {/* Intro */}
             <section>
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 md:mb-6">Pourquoi choisir cette destination ?</h2>
                 <div className="text-slate-600 text-base md:text-lg leading-relaxed bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
                     {data.description}
                 </div>
             </section>

             {/* Timeline Steps */}
             <section>
                 <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Les étapes clés</h2>
                    <span className={`w-fit text-[10px] md:text-xs font-sans font-bold text-white px-3 py-1 rounded-full shadow-md bg-gradient-to-r ${theme.gradient}`}>Parcours type</span>
                 </div>
                 
                 <div className="space-y-8 md:space-y-10 relative before:absolute before:left-6 md:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 pl-2">
                     {data.steps.map((step, idx) => (
                         <div key={idx} className="relative flex gap-4 md:gap-8 group">
                             <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white border-2 ${theme.border} flex items-center justify-center shrink-0 z-10 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                 {React.createElement(step.icon, { size: 20, className: `md:w-7 md:h-7 ${theme.text}` })}
                             </div>
                             <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex-1 hover:shadow-lg transition-all duration-300 hover:border-slate-300 relative overflow-hidden group-hover:-translate-y-1">
                                 <div className={`absolute top-0 left-0 w-1 h-full ${theme.bg}`}></div>
                                 <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3 flex items-center gap-2">
                                     <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center">{idx + 1}</span>
                                     {step.title}
                                 </h3>
                                 <p className="text-sm md:text-base text-slate-600 leading-relaxed">{step.desc}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </section>

             {/* Budget & Checklist Grid */}
             <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 {/* Budget */}
                 <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                     <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                         <Calculator size={20} className={theme.text} />
                         Budget Mensuel
                     </h3>
                     <div className="space-y-3 md:space-y-4">
                         {data.budget.map((item, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                 <div className="flex items-center gap-3">
                                     <div className={`p-1.5 md:p-2 rounded-lg bg-white ${theme.text}`}>
                                         {React.createElement(item.icon, { size: 14 })}
                                     </div>
                                     <span className="text-xs md:text-sm font-medium text-slate-700">{item.item}</span>
                                 </div>
                                 <span className="text-sm md:text-base font-bold text-slate-900">{item.cost}</span>
                             </div>
                         ))}
                     </div>
                     <p className="text-[10px] md:text-xs text-slate-400 mt-4 text-center">Hors frais de scolarité annuels</p>
                 </div>

                 {/* Checklist */}
                 <div className={`bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden h-full flex flex-col`}>
                     <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bg} opacity-20 rounded-full blur-3xl transform translate-x-10 -translate-y-10`}></div>
                     <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                         <FileCheck size={20} className="text-white" />
                         Documents Requis
                     </h3>
                     <ul className="space-y-3 relative z-10 flex-1">
                         {data.checklist.map((item, idx) => (
                             <li key={idx} className="flex items-start gap-3">
                                 <div className={`mt-0.5 p-0.5 rounded bg-white/20 shrink-0`}>
                                     <CheckCircle2 size={12} className="text-white" />
                                 </div>
                                 <span className="text-xs md:text-sm text-slate-200 font-medium leading-snug">{item}</span>
                             </li>
                         ))}
                     </ul>
                     <button className={`mt-8 w-full py-3 bg-white ${theme.text} font-bold rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-2 text-sm relative z-10`}>
                         Télécharger la checklist
                     </button>
                 </div>
             </section>

             {/* Calendrier */}
             <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 overflow-hidden">
                 <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                     <Calendar size={20} className={theme.text} />
                     Calendrier Idéal
                 </h3>
                 {/* Desktop Layout */}
                 <div className="hidden md:flex flex-row justify-between items-center gap-4 relative">
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
                     {data.deadlines.map((dl, idx) => (
                         <div key={idx} className="relative z-10 flex flex-col items-center text-center group flex-1">
                             <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm mb-4 ${theme.bg} group-hover:scale-150 transition-transform`}></div>
                             <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 group-hover:border-slate-300 transition-colors w-full max-w-[140px]">
                                 <span className={`block text-[10px] font-bold uppercase tracking-wider ${theme.text} mb-1`}>{dl.month}</span>
                                 <span className="text-xs font-medium text-slate-700 block leading-tight">{dl.action}</span>
                             </div>
                         </div>
                     ))}
                 </div>

                 {/* Mobile Layout (Vertical List) */}
                 <div className="md:hidden relative space-y-6 pl-4 border-l-2 border-slate-100">
                     {data.deadlines.map((dl, idx) => (
                         <div key={idx} className="relative">
                             <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${theme.bg}`}></div>
                             <div>
                                 <span className={`block text-xs font-bold uppercase tracking-wider ${theme.text} mb-0.5`}>{dl.month}</span>
                                 <span className="text-sm font-medium text-slate-700">{dl.action}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </section>

             {/* Top Universities */}
             <section>
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6 md:mb-8">Établissements de référence</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                     {data.universities.map((uni, idx) => (
                         <div key={idx} className="flex items-center gap-4 p-4 md:p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm hover:shadow-md">
                             <div className={`p-2.5 md:p-3 rounded-xl ${theme.bgLight}`}>
                                 <GraduationCap size={20} className={theme.text} />
                             </div>
                             <span className="font-bold text-slate-700 text-sm md:text-lg leading-tight">{uni}</span>
                         </div>
                     ))}
                 </div>
             </section>

         </div>

         {/* Sidebar - Stacked bottom on mobile */}
         <div className="lg:col-span-4 space-y-8">
             
             {/* CONSEILS PRATIQUES WIDGET */}
             <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 lg:sticky lg:top-24">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Lightbulb size={16} className={theme.text} />
                    Conseils Pratiques
                 </h4>
                 
                 <ul className="space-y-5 mb-8">
                    {data.relatedGuides.map((guide, idx) => (
                        <li key={idx}>
                            <Link to={guide.link} className="group flex items-start gap-3 hover:translate-x-1 transition-transform">
                                <span className={`w-1.5 h-1.5 mt-2 rounded-full shrink-0 ${theme.bg}`}></span>
                                <span className="text-slate-600 font-medium text-sm group-hover:text-slate-900 leading-relaxed">
                                    {guide.title}
                                </span>
                            </Link>
                        </li>
                    ))}
                 </ul>

                 <Link to="/resources" className={`inline-flex items-center gap-2 text-sm font-bold ${theme.text} hover:underline group`}>
                     Voir tous les guides 
                     <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                 </Link>
             </div>

             {/* Info Clés Widget */}
             <div className={`bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100`}>
                 <h3 className="text-lg md:text-xl font-serif font-bold mb-6 flex items-center gap-3 text-slate-900">
                     <Info size={20} className="text-slate-400" />
                     Le saviez-vous ?
                 </h3>
                 <div className="space-y-6">
                     {data.tips.map((tip, idx) => (
                         <div key={idx} className="flex gap-4">
                             <div className="mt-1 shrink-0">
                                 <CheckCircle2 size={16} className="text-slate-400" />
                             </div>
                             <p className="text-slate-600 text-sm leading-relaxed">
                                 {tip}
                             </p>
                         </div>
                     ))}
                 </div>
             </div>

             <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-lg text-center text-white">
                 <h3 className="text-lg md:text-xl font-bold mb-4">Besoin d'un dossier en béton ?</h3>
                 <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                     Lettre de motivation, projet d'étude... L'IA vous aide à rédiger des documents parfaits pour Campus France ou Parcoursup.
                 </p>
                 <Link to="/signup" className={`block w-full py-3 md:py-4 px-6 bg-white ${theme.text} font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-sm md:text-base`}>
                     Utiliser l'Assistant Rédaction
                 </Link>
             </div>
         </div>

      </div>
    </div>
  );
};
