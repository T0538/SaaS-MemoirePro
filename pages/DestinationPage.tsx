
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { ArrowLeft, CheckCircle2, GraduationCap, Info, Calendar, Calculator, FileCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className={`absolute inset-0 bg-slate-900/40 z-10`}></div>
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10`}></div>
        <img src={data.heroImage} alt={data.title} className="w-full h-full object-cover transform scale-105" />
        
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 lg:p-20">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-bold backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    <ArrowLeft size={16} /> Retour à l'accueil
                </Link>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">{data.title}</h1>
                <p className="text-xl md:text-2xl text-slate-100 max-w-2xl font-light leading-relaxed drop-shadow-md">{data.subtitle}</p>
            </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 relative z-20 -mt-10 mx-6 md:mx-auto max-w-6xl rounded-2xl shadow-xl p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8">
          {data.stats.map((stat, idx) => (
              <div key={idx} className="text-center md:text-left flex-1 border-b md:border-b-0 md:border-r border-slate-100 last:border-0 pb-6 md:pb-0">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-3xl font-bold ${theme.text}`}>{stat.value}</p>
              </div>
          ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* Main Content */}
         <div className="lg:col-span-8 space-y-16">
             
             {/* Intro */}
             <section>
                 <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Pourquoi choisir cette destination ?</h2>
                 <p className="text-slate-600 text-lg leading-relaxed bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                     {data.description}
                 </p>
             </section>

             {/* Timeline Steps */}
             <section>
                 <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Les étapes clés</h2>
                    <span className={`text-xs font-sans font-bold text-white px-3 py-1 rounded-full shadow-md bg-gradient-to-r ${theme.gradient}`}>Parcours type</span>
                 </div>
                 
                 <div className="space-y-10 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                     {data.steps.map((step, idx) => (
                         <div key={idx} className="relative flex gap-8 group">
                             <div className={`w-16 h-16 rounded-2xl bg-white border-2 ${theme.border} flex items-center justify-center shrink-0 z-10 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                 {React.createElement(step.icon, { size: 28, className: theme.text })}
                             </div>
                             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex-1 hover:shadow-lg transition-all duration-300 hover:border-slate-300 relative overflow-hidden group-hover:-translate-y-1">
                                 <div className={`absolute top-0 left-0 w-1 h-full ${theme.bg}`}></div>
                                 <h3 className="text-xl font-bold text-slate-900 mb-3">{idx + 1}. {step.title}</h3>
                                 <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </section>

             {/* Budget & Checklist Grid */}
             <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Budget */}
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                     <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                         <Calculator size={24} className={theme.text} />
                         Budget Mensuel Estimé
                     </h3>
                     <div className="space-y-4">
                         {data.budget.map((item, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                 <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded-lg bg-white ${theme.text}`}>
                                         {React.createElement(item.icon, { size: 16 })}
                                     </div>
                                     <span className="text-sm font-medium text-slate-700">{item.item}</span>
                                 </div>
                                 <span className="font-bold text-slate-900">{item.cost}</span>
                             </div>
                         ))}
                     </div>
                     <p className="text-xs text-slate-400 mt-4 text-center">Hors frais de scolarité annuels</p>
                 </div>

                 {/* Checklist */}
                 <div className={`bg-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden`}>
                     <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bg} opacity-20 rounded-full blur-3xl transform translate-x-10 -translate-y-10`}></div>
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                         <FileCheck size={24} className="text-white" />
                         Documents Requis
                     </h3>
                     <ul className="space-y-3 relative z-10">
                         {data.checklist.map((item, idx) => (
                             <li key={idx} className="flex items-start gap-3">
                                 <div className={`mt-0.5 p-0.5 rounded bg-white/20`}>
                                     <CheckCircle2 size={14} className="text-white" />
                                 </div>
                                 <span className="text-sm text-slate-200 font-medium">{item}</span>
                             </li>
                         ))}
                     </ul>
                     <button className={`mt-8 w-full py-3 bg-white ${theme.text} font-bold rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-2 text-sm relative z-10`}>
                         Télécharger la checklist PDF
                     </button>
                 </div>
             </section>

             {/* Calendrier */}
             <section className="bg-white rounded-3xl border border-slate-200 p-8 overflow-hidden">
                 <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                     <Calendar size={24} className={theme.text} />
                     Calendrier Idéal
                 </h3>
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 hidden md:block -z-0"></div>
                     {data.deadlines.map((dl, idx) => (
                         <div key={idx} className="relative z-10 flex flex-col items-center text-center group w-full md:w-auto">
                             <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mb-4 ${theme.bg} group-hover:scale-125 transition-transform`}></div>
                             <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 group-hover:border-slate-300 transition-colors w-full md:w-auto">
                                 <span className={`block text-xs font-bold uppercase tracking-wider ${theme.text} mb-1`}>{dl.month}</span>
                                 <span className="text-xs font-medium text-slate-700">{dl.action}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </section>

             {/* Top Universities */}
             <section>
                 <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Établissements de référence</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     {data.universities.map((uni, idx) => (
                         <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm">
                             <div className={`p-3 rounded-xl ${theme.bgLight}`}>
                                 <GraduationCap size={24} className={theme.text} />
                             </div>
                             <span className="font-bold text-slate-700 text-lg">{uni}</span>
                         </div>
                     ))}
                 </div>
             </section>

         </div>

         {/* Sidebar Tips */}
         <div className="lg:col-span-4 space-y-8">
             <div className={`bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border-t-4 ${theme.border} border-x border-b border-slate-100 sticky top-24`}>
                 <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-slate-900">
                     <Info size={28} className={theme.text} />
                     Conseils Pratiques
                 </h3>
                 <div className="space-y-8">
                     {data.tips.map((tip, idx) => (
                         <div key={idx} className="flex gap-4">
                             <div className="mt-1 shrink-0">
                                 <CheckCircle2 size={20} className={theme.text} />
                             </div>
                             <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                 {tip}
                             </p>
                         </div>
                     ))}
                 </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-3xl shadow-lg text-center text-white">
                 <h3 className="text-xl font-bold mb-4">Besoin d'un dossier en béton ?</h3>
                 <p className="text-slate-400 text-sm mb-8">
                     Lettre de motivation, projet d'étude... L'IA vous aide à rédiger des documents parfaits pour Campus France ou Parcoursup.
                 </p>
                 <Link to="/signup" className={`block w-full py-4 px-6 bg-white ${theme.text} font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all`}>
                     Utiliser l'Assistant Rédaction
                 </Link>
             </div>
         </div>

      </div>
    </div>
  );
};
