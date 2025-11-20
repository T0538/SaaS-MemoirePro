
import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, BookOpen, ShieldCheck, Zap, Users, Award, MessageSquare, Compass, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Nouvelle version v2.5 disponible",
    title: <>Votre mémoire de Licence,<br/><span className="text-emerald-400">rédigé avec excellence.</span></>,
    desc: "L'assistant intelligent qui structure, rédige et humanise votre mémoire professionnel. Spécialisé en QHSE, Management, Finance et plus encore.",
    ctaPrimary: "Commencer la rédaction",
    ctaSecondary: "Voir les guides",
    linkPrimary: "/app",
    linkSecondary: "/resources",
    icon: <BookOpen size={20} />
  },
  {
    id: 2,
    badge: "Entraînement Oral IA",
    title: <>Ne craignez plus le jury,<br/><span className="text-emerald-400">dominez votre soutenance.</span></>,
    desc: "Simulateur de Grand Oral immersif. Affrontez un jury virtuel (Bienveillant, Strict ou Technique) et recevez un feedback immédiat sur vos réponses.",
    ctaPrimary: "Simuler mon jury",
    ctaSecondary: "Conseils oral",
    linkPrimary: "/jury",
    linkSecondary: "/blog/reussir-soutenance",
    icon: <Users size={20} />
  },
  {
    id: 3,
    badge: "Orientation & Avenir",
    title: <>Trouvez votre voie<br/><span className="text-emerald-400">en Europe ou en Afrique.</span></>,
    desc: "Test d'orientation par IA, guides pour Campus France, concours d'écoles d'ingénieurs et démarches de visa. Construisez votre avenir.",
    ctaPrimary: "Faire le test gratuit",
    ctaSecondary: "Choisir un pays",
    linkPrimary: "/orientation",
    linkSecondary: "/destinations/europe",
    icon: <Compass size={20} />
  },
  {
    id: 4,
    badge: "Analyse Documentaire",
    title: <>Ne lisez plus tout,<br/><span className="text-emerald-400">chattez avec vos sources.</span></>,
    desc: "Importez vos PDF, rapports et cours. Posez des questions à l'IA pour extraire les citations clés et synthétiser l'information en secondes.",
    ctaPrimary: "Analyser mes documents",
    ctaSecondary: "Voir la démo",
    linkPrimary: "/app",
    linkSecondary: "/app",
    icon: <Search size={20} />
  }
];

export const LandingPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('memoirepro_user');
    setIsAuthenticated(!!user);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000); // 4 secondes pour laisser le temps de lire

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Dynamic Slider */}
      <section 
        className="relative pt-24 pb-32 overflow-hidden bg-emerald-950 text-white min-h-[700px] flex flex-col justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] transition-all duration-1000 ease-in-out ${currentSlide % 2 === 0 ? 'translate-x-0' : 'translate-x-20'}`}></div>
            <div className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-800/20 rounded-full blur-[120px] transition-all duration-1000 ease-in-out ${currentSlide % 2 !== 0 ? 'translate-y-0' : 'translate-y-20'}`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex-1 flex flex-col justify-center items-center">
          
          {/* Badge */}
          <div key={`badge-${currentSlide}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 text-emerald-300 text-sm font-bold mb-8 border border-emerald-800 backdrop-blur-sm animate-fade-in">
             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
             {activeSlide.badge}
          </div>

          {/* Title & Desc with Key for Animation */}
          <div key={`content-${currentSlide}`} className="animate-fade-in max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight tracking-tight transition-all duration-500">
                {activeSlide.title}
            </h1>
            
            <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                {activeSlide.desc}
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-5">
                <Link 
                to={isAuthenticated && activeSlide.linkPrimary === '/signup' ? "/app" : (isAuthenticated ? activeSlide.linkPrimary : "/signup")} 
                className="w-full md:w-auto px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transform hover:-translate-y-1 text-lg"
                >
                {isAuthenticated && activeSlide.linkPrimary === '/signup' ? "Accéder à mon espace" : activeSlide.ctaPrimary}
                <ArrowRight size={20} />
                </Link>
                <Link to={activeSlide.linkSecondary} className="w-full md:w-auto px-8 py-4 bg-transparent border-2 border-emerald-800 text-emerald-100 font-bold rounded-full hover:bg-emerald-900 hover:border-emerald-700 transition-all flex items-center justify-center gap-2 text-lg">
                {activeSlide.icon}
                {activeSlide.ctaSecondary}
                </Link>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="flex gap-3 mt-16 z-20">
             {HERO_SLIDES.map((slide, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-12 bg-emerald-400' : 'w-2 bg-emerald-800 hover:bg-emerald-700'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                 />
             ))}
          </div>

          {/* Universities Logos */}
          <div className="mt-16 pt-8 border-t border-emerald-900/50 flex flex-wrap justify-center gap-12 opacity-60">
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
                  {React.cloneElement(feature.icon as React.ReactElement<any>, { className: "group-hover:text-white transition-colors text-emerald-600" })}
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
