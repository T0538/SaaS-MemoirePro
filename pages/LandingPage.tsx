
import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, BookOpen, ShieldCheck, Zap, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('memoirepro_user');
    setIsAuthenticated(!!user);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Dark Green & Human Design */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 text-emerald-300 text-sm font-bold mb-8 border border-emerald-800 backdrop-blur-sm">
             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
             Nouvelle version v2.5 disponible
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight tracking-tight">
            Votre mémoire de Licence,<br/>
            <span className="text-emerald-400">rédigé avec excellence.</span>
          </h1>
          
          <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            L'assistant intelligent qui structure, rédige et humanise votre mémoire professionnel. 
            Spécialisé en QHSE, Management, Finance et plus encore.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-5">
            <Link 
              to={isAuthenticated ? "/app" : "/signup"} 
              className="w-full md:w-auto px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transform hover:-translate-y-1 text-lg"
            >
              {isAuthenticated ? "Accéder à mon espace" : "Commencer Gratuitement"}
              <ArrowRight size={20} />
            </Link>
            <Link to="/resources" className="w-full md:w-auto px-8 py-4 bg-transparent border-2 border-emerald-800 text-emerald-100 font-bold rounded-full hover:bg-emerald-900 hover:border-emerald-700 transition-all flex items-center justify-center gap-2 text-lg">
              <BookOpen size={20} />
              Voir les guides
            </Link>
          </div>

          <div className="mt-20 pt-8 border-t border-emerald-900/50 flex flex-wrap justify-center gap-12 opacity-60">
            <span className="text-emerald-200 text-xl font-serif font-bold">Université de Lyon</span>
            <span className="text-emerald-200 text-xl font-serif font-bold">CNAM</span>
            <span className="text-emerald-200 text-xl font-serif font-bold">IAE France</span>
            <span className="text-emerald-200 text-xl font-serif font-bold">ESG</span>
          </div>
        </div>
      </section>

      {/* Features Grid - Monochrome Icons */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Pourquoi choisir MémoirePro ?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Nous ne nous contentons pas de générer du texte. Nous construisons une réflexion académique structurée.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <ShieldCheck className="text-emerald-600" size={32} />,
                title: "Expertise QHSE & Technique",
                desc: "Notre modèle connaît les normes ISO 9001, 14001, 45001 et le Code du Travail sur le bout des doigts."
              },
              {
                icon: <Users className="text-emerald-600" size={32} />,
                title: "Simulateur de Jury",
                desc: "Entraînez-vous face à un jury virtuel pour anticiper les questions pièges de la soutenance."
              },
              {
                icon: <BookOpen className="text-emerald-600" size={32} />,
                title: "Structure Académique",
                desc: "Introduction, problématique, revue de littérature, méthodologie : le plan parfait, généré instantanément."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                <div className="mb-6 bg-emerald-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "group-hover:text-white transition-colors text-emerald-600" })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section - Clean */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">Du sujet vague au mémoire validé.</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 flex items-center justify-center font-bold shrink-0 text-lg">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Définition du contexte</h4>
                    <p className="text-slate-500 leading-relaxed">Entrez simplement votre sujet et votre entreprise. L'IA analyse les enjeux sectoriels.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 flex items-center justify-center font-bold shrink-0 text-lg">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Validation du plan</h4>
                    <p className="text-slate-500 leading-relaxed">L'IA propose un sommaire détaillé. Ajustez, ajoutez ou supprimez des parties selon vos besoins.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-lg shadow-lg shadow-emerald-100">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-700 mb-1">Rédaction & Entraînement</h4>
                    <p className="text-slate-500 leading-relaxed">Générez le contenu, humanisez le style et préparez votre oral avec le simulateur.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <Link 
                  to={isAuthenticated ? "/app" : "/signup"} 
                  className="text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-2 hover:gap-3 transition-all"
                >
                  {isAuthenticated ? "Accéder à l'éditeur" : "Essayer la démo interactive"} 
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            
            <div className="relative bg-slate-50 p-2 rounded-3xl border border-slate-100">
               <img 
                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                 alt="App Interface" 
                 className="relative rounded-2xl shadow-sm grayscale-[10%] hover:grayscale-0 transition-all duration-500"
               />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
