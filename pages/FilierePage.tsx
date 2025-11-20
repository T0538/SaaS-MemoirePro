
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { FILIERES } from '../data/filieres';
import { ArrowLeft, CheckCircle2, Briefcase, GraduationCap, TrendingUp, DollarSign } from 'lucide-react';

export const FilierePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = FILIERES[slug || 'informatique'];

  if (!data) {
    return <Navigate to="/" />;
  }

  // Mapping des couleurs pour le style dynamique
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    teal: 'text-teal-600 bg-teal-50 border-teal-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    pink: 'text-pink-600 bg-pink-50 border-pink-200',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    green: 'text-green-600 bg-green-50 border-green-200',
  };

  const theme = colorClasses[data.color] || colorClasses.blue;
  const textColor = theme.split(' ')[0];
  const bgColor = theme.split(' ')[1];
  const borderColor = theme.split(' ')[2];

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img src={data.heroImage} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-12 md:pb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-bold backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <ArrowLeft size={16} /> Retour à l'accueil
            </Link>
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-white shadow-lg ${textColor}`}>
                    {React.createElement(data.icon, { size: 32 })}
                </div>
                <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-500/30">Filière d'Avenir</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight shadow-black drop-shadow-lg">
                {data.title}
            </h1>
            <p className="text-xl text-slate-100 max-w-2xl font-light leading-relaxed drop-shadow-md">
                {data.subtitle}
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
          {/* Stats Row */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {data.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col md:border-r border-slate-100 last:border-0 px-4">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</span>
                      <span className={`text-3xl font-bold ${textColor}`}>{stat.value}</span>
                  </div>
              ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-12">
                  
                  <section>
                      <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Pourquoi choisir cette voie ?</h2>
                      <p className="text-lg text-slate-600 leading-relaxed bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                          {data.description}
                      </p>
                  </section>

                  <section>
                      <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                          <TrendingUp className={textColor} /> Compétences Clés
                      </h2>
                      <div className="flex flex-wrap gap-3">
                          {data.skills.map((skill, idx) => (
                              <span key={idx} className={`px-4 py-2 rounded-full text-sm font-bold ${bgColor} ${textColor} border ${borderColor}`}>
                                  {skill}
                              </span>
                          ))}
                      </div>
                  </section>

                  <section>
                      <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                          <GraduationCap className={textColor} /> Formations Types
                      </h2>
                      <div className="space-y-4">
                          {data.formations.map((form, idx) => (
                              <div key={idx} className="flex gap-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg ${bgColor} ${textColor}`}>
                                      {form.level}
                                  </div>
                                  <div>
                                      <h3 className="text-lg font-bold text-slate-900 mb-1">{form.name}</h3>
                                      <p className="text-slate-500">{form.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </section>

              </div>

              {/* Right Column - Jobs */}
              <div className="space-y-8">
                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <Briefcase size={20} className="text-emerald-400" />
                          Débouchés & Salaires
                      </h3>
                      <div className="space-y-6">
                          {data.jobs.map((job, idx) => (
                              <div key={idx} className="pb-6 border-b border-slate-700 last:border-0 last:pb-0">
                                  <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-white text-lg">{job.title}</h4>
                                      <span className="text-emerald-400 font-mono text-sm bg-emerald-900/50 px-2 py-1 rounded border border-emerald-800">{job.salary}</span>
                                  </div>
                                  <p className="text-slate-400 text-sm leading-relaxed">{job.desc}</p>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className={`p-8 rounded-3xl border ${borderColor} ${bgColor}`}>
                      <h3 className={`text-lg font-bold mb-4 ${textColor}`}>Besoin d'y voir plus clair ?</h3>
                      <p className="text-slate-600 text-sm mb-6">
                          Faites notre test d'orientation par IA pour vérifier si la filière <strong>{data.title}</strong> correspond vraiment à votre profil.
                      </p>
                      <Link to="/orientation" className={`block w-full py-3 px-6 rounded-xl font-bold text-center text-white shadow-md hover:opacity-90 transition-opacity bg-slate-900`}>
                          Faire le test gratuit
                      </Link>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};
