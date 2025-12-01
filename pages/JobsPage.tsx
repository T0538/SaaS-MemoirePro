import React, { useState } from 'react';
import { searchJobsWithAI } from '../services/geminiService';
import { Search, MapPin, Briefcase, DollarSign, Sparkles, ArrowRight, Loader2, Building2, Globe, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Dakar, Sénégal'); // Default detection mock
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchJobsWithAI(query, location);
      setJobs(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Hero Search Section */}
      <div className="bg-slate-900 text-white pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} /> Nouvelle Fonctionnalité IA
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            Trouvez le job <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">parfait</span>, où que vous soyez.
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Notre IA analyse votre profil et vos ambitions pour scanner les opportunités locales et internationales en temps réel.
          </p>

          <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-6 py-3 md:border-r border-slate-100">
              <Search className="text-slate-400 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Ex: Stage Marketing, Ingénieur Civil..." 
                className="w-full ml-3 outline-none text-slate-900 placeholder-slate-400 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-3 md:border-r border-slate-100">
              <MapPin className="text-slate-400 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Localisation (ou 'Monde')" 
                className="w-full ml-3 outline-none text-slate-900 placeholder-slate-400 font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 md:w-auto w-full"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Rechercher'}
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-400">
            <span>Populaire :</span>
            <button onClick={() => setQuery("Data Scientist")} className="hover:text-white underline decoration-slate-600 hover:decoration-blue-400 underline-offset-4 transition-all">Data Scientist</button>
            <button onClick={() => setQuery("Développeur React")} className="hover:text-white underline decoration-slate-600 hover:decoration-blue-400 underline-offset-4 transition-all">Développeur React</button>
            <button onClick={() => setQuery("Assistant RH")} className="hover:text-white underline decoration-slate-600 hover:decoration-blue-400 underline-offset-4 transition-all">Assistant RH</button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {!hasSearched && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Opportunités Globales</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Accédez à des offres exclusives en Afrique, en Europe et au Canada grâce à nos partenaires.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Matching IA</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Notre algorithme ne cherche pas juste des mots-clés, il comprend le contexte et vos compétences transférables.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                        <Briefcase size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Stages & Premier Emploi</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Une section dédiée aux étudiants et jeunes diplômés pour lancer votre carrière sans expérience.
                    </p>
                </div>
            </div>
        )}

        {hasSearched && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
                {/* Filters Sidebar */}
                <div className="hidden lg:block space-y-8">
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Filter size={16} /> Filtres
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                Télétravail possible
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                Stage / Alternance
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                CDI
                            </label>
                        </div>
                    </div>
                </div>

                {/* Job List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            {jobs.length} offres trouvées pour "{query}"
                        </h2>
                        <span className="text-sm text-slate-500">Trié par pertinence</span>
                    </div>

                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden">
                            {job.matchScore > 90 && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    {job.matchScore}% Match
                                </div>
                            )}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xl shrink-0">
                                    {job.company.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                                        {job.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-3">
                                        <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                        <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full"><Briefcase size={14} /> {job.type}</span>
                                        <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                        {job.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.skills.map((skill: string) => (
                                            <span key={skill} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xs text-slate-400">Posté {job.postedAt}</span>
                                        <a 
                                            href={job.applyUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            Postuler maintenant <ArrowRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {jobs.length === 0 && !isLoading && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <p className="text-slate-500 mb-4">Aucune offre trouvée pour cette recherche.</p>
                            <button onClick={() => {setQuery(''); setLocation(''); setHasSearched(false);}} className="text-blue-600 font-bold hover:underline">
                                Nouvelle recherche
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
