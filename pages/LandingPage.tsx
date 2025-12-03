
import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, BookOpen, ShieldCheck, Zap, Users, Award, MessageSquare, Compass, Search, Star, Globe, FileText, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Nouvelle version v2.5 disponible",
    title: <>Votre mémoire de Licence,<br/><span className="text-blue-400 font-extrabold relative inline-block transform -rotate-1">rédigé avec excellence.</span></>,
    desc: "L'assistant intelligent qui structure, rédige et humanise votre mémoire professionnel. Spécialisé en QHSE, Management, Finance et plus encore.",
    ctaPrimary: "Commencer la rédaction",
    ctaSecondary: "Voir les guides",
    linkPrimary: "/app",
    linkSecondary: "/resources",
    icon: <BookOpen size={20} />,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2573&auto=format&fit=crop"
  },
  {
    id: 2,
    badge: "Entraînement Oral IA",
    title: <>Ne craignez plus le jury,<br/><span className="text-blue-400 font-extrabold relative inline-block transform -rotate-1">dominez votre soutenance.</span></>,
    desc: "Simulateur de Grand Oral immersif. Affrontez un jury virtuel (Bienveillant, Strict ou Technique) et recevez un feedback immédiat sur vos réponses.",
    ctaPrimary: "Simuler mon jury",
    ctaSecondary: "Conseils oral",
    linkPrimary: "/jury",
    linkSecondary: "/blog/reussir-soutenance",
    icon: <Users size={20} />,
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 3,
    badge: "Orientation & Avenir",
    title: <>Trouvez votre voie<br/><span className="text-blue-400 font-extrabold relative inline-block transform -rotate-1">en Europe ou en Afrique.</span></>,
    desc: "Test d'orientation par IA, guides pour Campus France, concours d'écoles d'ingénieurs et démarches de visa. Construisez votre avenir.",
    ctaPrimary: "Faire le test gratuit",
    ctaSecondary: "Choisir un pays",
    linkPrimary: "/orientation",
    linkSecondary: "/destinations/europe",
    icon: <Compass size={20} />,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 4,
    badge: "Analyse Documentaire",
    title: <>Ne lisez plus tout,<br/><span className="text-blue-400 font-extrabold relative inline-block transform -rotate-1">chattez avec vos sources.</span></>,
    desc: "Importez vos PDF, rapports et cours. Posez des questions à l'IA pour extraire les citations clés et synthétiser l'information en secondes.",
    ctaPrimary: "Analyser mes documents",
    ctaSecondary: "Voir la démo",
    linkPrimary: "/app",
    linkSecondary: "/app",
    icon: <Search size={20} />,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop"
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Licence QHSE",
    content: "J'étais bloquée sur ma problématique depuis 2 semaines. En 10 minutes, l'IA m'a proposé 3 axes pertinents et validés par mon tuteur.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Thomas K.",
    role: "Master Finance",
    content: "Le simulateur de jury est bluffant. Les questions posées par l'IA étaient quasiment les mêmes que celles de mon vrai jury !",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Amina D.",
    role: "École d'Ingénieur",
    content: "Grâce aux guides d'orientation, j'ai pu monter mon dossier Campus France sans stress. Je suis acceptée à Lyon !",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop"
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
    }, 5000); // 5 secondes pour plus de temps de lecture

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Hero Section - Dynamic Slider */}
      <section 
        className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden bg-slate-900 text-white min-h-[100dvh] md:min-h-[800px] flex flex-col justify-center rounded-b-[2rem] md:rounded-b-[3rem] shadow-2xl shadow-blue-900/20"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Elements - Humanized & Blue */}
        <div className="absolute inset-0 z-0">
            {/* Background Images with Fade Transition - MORE VISIBLE */}
            {HERO_SLIDES.map((slide, idx) => (
                <div 
                    key={`bg-${slide.id}`}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform ${currentSlide === idx ? 'opacity-50 scale-105' : 'opacity-0 scale-100'}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                />
            ))}
            
            {/* Gradient Overlay for Readability - LIGHTER */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none mix-blend-overlay opacity-60">
            {/* Organic Shapes - BEHIND TEXT BUT SUBTLE */}
            <div className={`absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/20 rounded-full blur-[80px] md:blur-[120px] transition-all duration-1000 ease-in-out ${currentSlide % 2 === 0 ? 'scale-100 translate-x-0' : 'scale-110 translate-x-10 md:translate-x-20'}`}></div>
            <div className={`absolute bottom-[-20%] left-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-indigo-500/20 rounded-full blur-[80px] md:blur-[120px] transition-all duration-1000 ease-in-out ${currentSlide % 2 !== 0 ? 'scale-100 translate-y-0' : 'scale-110 translate-y-10 md:translate-y-20'}`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center flex-1 flex flex-col justify-center items-center w-full">
          
          {/* Badge */}
          <div key={`badge-${currentSlide}`} className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-900/30 text-blue-200 text-xs md:text-sm font-bold mb-6 md:mb-8 border border-blue-700/50 backdrop-blur-md animate-fade-in shadow-lg shadow-blue-900/20">
             <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
             {activeSlide.badge}
          </div>

          {/* Title & Desc with Key for Animation */}
          <div key={`content-${currentSlide}`} className="animate-fade-in max-w-5xl w-full">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-6 md:mb-8 leading-tight tracking-tight transition-all duration-500 drop-shadow-lg">
                {activeSlide.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed font-medium px-2 drop-shadow-md">
                {activeSlide.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4">
                <Link 
                to={isAuthenticated && activeSlide.linkPrimary === '/signup' ? "/app" : (isAuthenticated ? activeSlide.linkPrimary : "/signup")} 
                className="group w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30 transform hover:-translate-y-1 hover:scale-105 text-base md:text-lg"
                >
                {isAuthenticated && activeSlide.linkPrimary === '/signup' ? "Accéder à mon espace" : activeSlide.ctaPrimary}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={activeSlide.linkSecondary} className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white/5 border border-white/10 text-blue-100 font-bold rounded-full hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 text-base md:text-lg backdrop-blur-sm">
                {activeSlide.icon}
                {activeSlide.ctaSecondary}
                </Link>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="flex gap-2 md:gap-3 mt-12 md:mt-16 z-20">
             {HERO_SLIDES.map((slide, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 md:w-12 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'w-1.5 md:w-2 bg-slate-700 hover:bg-slate-600'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                 />
             ))}
          </div>
        </div>
      </section>

      {/* Trusted By - Social Proof Strip */}
      <div className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6">Recommandé par les étudiants de</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-slate-600 text-lg md:text-xl font-serif font-bold hover:text-blue-600 transition-colors cursor-default flex items-center gap-2"><Award size={20}/> Université de Lyon</span>
            <span className="text-slate-600 text-lg md:text-xl font-serif font-bold hover:text-blue-600 transition-colors cursor-default flex items-center gap-2"><Award size={20}/> CNAM</span>
            <span className="text-slate-600 text-lg md:text-xl font-serif font-bold hover:text-blue-600 transition-colors cursor-default flex items-center gap-2"><Award size={20}/> IAE France</span>
            <span className="text-slate-600 text-lg md:text-xl font-serif font-bold hover:text-blue-600 transition-colors cursor-default flex items-center gap-2"><Award size={20}/> ESG</span>
            <span className="text-slate-600 text-lg md:text-xl font-serif font-bold hover:text-blue-600 transition-colors cursor-default flex items-center gap-2"><Award size={20}/> HEC Dakar</span>
          </div>
        </div>
      </div>

      {/* Features Grid - Updated & Humanized */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Tout pour réussir, au même endroit.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Une suite d'outils intelligents conçue pour vous accompagner de la première idée jusqu'à la soutenance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen className="text-blue-600" size={28} />,
                title: "Rédacteur Intelligent",
                desc: "Générez des plans structurés et rédigez vos chapitres avec l'aide de l'IA, section par section.",
                color: "bg-blue-50"
              },
              {
                icon: <Users className="text-indigo-600" size={28} />,
                title: "Simulateur de Jury",
                desc: "Entraînez-vous à l'oral face à des jurys virtuels aux personnalités variées pour être prêt le jour J.",
                color: "bg-indigo-50"
              },
              {
                icon: <Compass className="text-teal-600" size={28} />,
                title: "Orientation & Visa",
                desc: "Tests d'orientation, choix de pays et guides complets pour vos démarches de mobilité internationale.",
                color: "bg-teal-50"
              },
              {
                icon: <Search className="text-amber-600" size={28} />,
                title: "Analyse de Sources",
                desc: "Importez vos PDF et discutez avec eux pour extraire citations et synthèses en un éclair.",
                color: "bg-amber-50"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className={`mb-6 ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Humanizing the platform */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
                <Star size={14} fill="currentColor" /> Avis Étudiants
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Ils ont validé grâce à MémoirePro</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col relative">
                    <div className="absolute top-8 right-8 text-blue-100">
                        <MessageSquare size={40} fill="currentColor" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                        <div>
                            <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                            <p className="text-slate-500 text-sm">{testimonial.role}</p>
                        </div>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed flex-1">
                        "{testimonial.content}"
                    </p>
                    <div className="mt-6 flex text-amber-400 gap-1">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section - Simplified & Visual */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                        Plus qu'un outil,<br/>
                        <span className="text-blue-400">votre copilote de réussite.</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                        MémoirePro s'adapte à votre niveau et à vos besoins. Que vous soyez en début de réflexion ou à la veille du dépôt, nous avons les outils pour vous débloquer.
                    </p>
                    
                    <div className="space-y-6">
                        {[
                            "Génération de plan conforme aux normes académiques",
                            "Suggestions de rédaction anti-plagiat",
                            "Recherche bibliographique automatisée",
                            "Coaching oral personnalisé par IA"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400">
                                    <Check size={20} strokeWidth={3} />
                                </div>
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    {/* Decorative card stack effect */}
                    <div className="absolute top-4 -right-4 w-full h-full bg-blue-600 rounded-3xl opacity-20 transform rotate-3"></div>
                    <div className="absolute top-2 -right-2 w-full h-full bg-blue-600 rounded-3xl opacity-40 transform rotate-1"></div>
                    <div className="relative bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-700 flex items-center gap-4 bg-slate-800/50 backdrop-blur">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="h-2 w-32 bg-slate-600 rounded-full opacity-50"></div>
                        </div>
                        <div className="p-8 bg-slate-900/50">
                             {/* Simulated Interface */}
                             <div className="flex gap-6 mb-8">
                                 <div className="w-1/3 space-y-3">
                                     <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                                     <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse"></div>
                                     <div className="h-32 w-full bg-slate-800 rounded-xl border border-slate-700 mt-4"></div>
                                 </div>
                                 <div className="flex-1 space-y-4">
                                     <div className="h-8 w-3/4 bg-blue-900/30 rounded-lg border border-blue-800/50 flex items-center px-4 text-blue-400 text-sm font-mono">
                                         Generating outline...
                                     </div>
                                     <div className="space-y-2">
                                         <div className="h-2 w-full bg-slate-700 rounded"></div>
                                         <div className="h-2 w-full bg-slate-700 rounded"></div>
                                         <div className="h-2 w-5/6 bg-slate-700 rounded"></div>
                                     </div>
                                     <div className="space-y-2 pt-4">
                                         <div className="h-2 w-full bg-slate-700 rounded"></div>
                                         <div className="h-2 w-4/5 bg-slate-700 rounded"></div>
                                     </div>
                                 </div>
                             </div>
                             <div className="flex justify-end">
                                 <div className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/50">Exporter en PDF</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA - Impactful */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 md:p-20 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                {/* Abstract Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 relative z-10">Prêt à valider votre année ?</h2>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
                    Rejoignez les étudiants qui ont déjà rédigé leur mémoire avec MémoirePro. C'est gratuit pour commencer.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                    <Link 
                        to="/signup" 
                        className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        Créer mon compte gratuit <ArrowRight size={18} />
                    </Link>
                    <Link 
                        to="/pricing" 
                        className="px-8 py-4 bg-blue-800/50 text-white font-bold rounded-full hover:bg-blue-800 transition-all border border-blue-400/30 backdrop-blur-sm flex items-center justify-center gap-2"
                    >
                        Voir les offres
                    </Link>
                </div>
                <p className="mt-6 text-sm text-blue-200/70 relative z-10">Pas de carte bancaire requise • Annulation à tout moment</p>
            </div>
        </div>
      </section>
    </div>
  );
};
