import React from 'react';
import { ArrowRight, CheckCircle2, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap size={14} />
            <span>Nouvelle Version : Moteur IA "Human Like" v2.5</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
            Votre mémoire de Licence,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">rédigé avec excellence.</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            L'assistant intelligent qui structure, rédige et humanise votre mémoire professionnel. 
            Spécialisé en QHSE, Management, Finance et plus encore.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/app" className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]">
              Commencer Gratuitement
              <ArrowRight size={18} />
            </Link>
            <Link to="/resources" className="w-full md:w-auto px-8 py-4 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2">
              <BookOpen size={18} />
              Voir les guides
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Word_font_awesome.svg/1200px-Word_font_awesome.svg.png" alt="Word" className="h-8 invert brightness-0" />
            <span className="text-white text-xl font-serif font-bold">Université de Lyon</span>
            <span className="text-white text-xl font-serif font-bold">CNAM</span>
            <span className="text-white text-xl font-serif font-bold">IAE France</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Pourquoi choisir MémoirePro ?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Nous ne nous contentons pas de générer du texte. Nous construisons une réflexion académique structurée.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <ShieldCheck className="text-emerald-500" size={32} />,
                title: "Expertise QHSE & Technique",
                desc: "Notre modèle connaît les normes ISO 9001, 14001, 45001 et le Code du Travail sur le bout des doigts."
              },
              {
                icon: <Zap className="text-amber-500" size={32} />,
                title: "Rédaction Humanisée",
                desc: "Fini le style robotique. Nos algorithmes varient la structure des phrases pour un rendu 100% naturel."
              },
              {
                icon: <BookOpen className="text-indigo-500" size={32} />,
                title: "Structure Académique",
                desc: "Introduction, problématique, revue de littérature, méthodologie : le plan parfait, généré instantanément."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">Du sujet vague au mémoire validé en 3 étapes.</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Définition du contexte</h4>
                    <p className="text-slate-600">Entrez simplement votre sujet et votre entreprise. L'IA analyse les enjeux sectoriels.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Validation du plan</h4>
                    <p className="text-slate-600">L'IA propose un sommaire détaillé. Ajustez, ajoutez ou supprimez des parties selon vos besoins.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-indigo-600">Rédaction assistée</h4>
                    <p className="text-slate-600">Générez le contenu section par section, reformulez et exportez le tout en format propre.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link to="/app" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-2">
                  Essayer la démo interactive <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-2xl"></div>
               <img 
                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                 alt="App Interface" 
                 className="relative rounded-2xl shadow-2xl border-4 border-white"
               />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};