
import React, { useState, useEffect } from 'react';
import { GraduationCap, ChevronDown, Sparkles, FileText, Users, Award, Menu, X, LogIn, User, PenTool, Calendar, Book, Search, Download, Layout, Compass, MapPin, Globe2, Target, Lightbulb } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isOrientationOpen, setIsOrientationOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('memoirepro_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('memoirepro_user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-slate-900 group z-50 relative">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl transition-all duration-300 shadow-md shadow-emerald-100">
            <GraduationCap size={26} />
          </div>
          <div>
            <span className="text-xl font-serif font-bold tracking-tight block leading-none">MémoirePro</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold group-hover:text-emerald-600 transition-colors">Intelligence Académique</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          
          {/* MEGA MENU: FONCTIONNALITÉS */}
          <div className="relative group mega-menu-group py-6">
            <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
              Fonctionnalités
              <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-emerald-600" />
            </button>
            
            <div className="mega-menu-content opacity-0 invisible absolute top-full -left-20 w-[800px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform translate-y-2 transition-all duration-200 cursor-default grid grid-cols-12 z-50">
               {/* ... (Contenu existant conservé) ... */}
               <div className="col-span-7 p-8 border-r border-slate-50">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <PenTool size={14} /> Rédaction & Structure
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                      <Link to="/app" className="group/item block">
                         <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                <Layout size={18} />
                            </div>
                            <span className="font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors">Générateur de Plan</span>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pl-[3.25rem]">Structurez vos idées en chapitres cohérents.</p>
                      </Link>

                      <Link to="/app" className="group/item block">
                         <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                <Sparkles size={18} />
                            </div>
                            <span className="font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors">Humanisateur v2.5</span>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pl-[3.25rem]">Reformulez le texte pour un style académique.</p>
                      </Link>

                      <Link to="/app" className="group/item block">
                         <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                <Book size={18} />
                            </div>
                            <span className="font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors">Bibliographe APA</span>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pl-[3.25rem]">Citations et références aux normes.</p>
                      </Link>

                       <Link to="/app" className="group/item block">
                         <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                                <Calendar size={18} />
                            </div>
                            <span className="font-bold text-slate-800 group-hover/item:text-emerald-700 transition-colors">Coach Planning</span>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pl-[3.25rem]">Objectifs quotidiens anti-procrastination.</p>
                      </Link>
                  </div>
               </div>

               <div className="col-span-5 p-8 bg-slate-50">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Award size={14} /> Outils Avancés
                  </div>
                  <div className="space-y-5">
                      <Link to="/jury" className="flex items-start gap-4 group/item p-3 -mx-3 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                          <div className="w-10 h-10 bg-white text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform shadow-sm">
                              <Users size={20} />
                          </div>
                          <div>
                              <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 text-sm">Simulateur Jury</h4>
                                  <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wide">Nouveau</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">Entraînement oral immersif.</p>
                          </div>
                      </Link>

                      <Link to="/app" className="flex items-start gap-4 group/item p-3 -mx-3 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                          <div className="w-10 h-10 bg-white text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform shadow-sm">
                              <Search size={20} />
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-900 text-sm">Chat avec Sources</h4>
                              <p className="text-xs text-slate-500 mt-1">Analysez vos PDF et documents.</p>
                          </div>
                      </Link>

                      <Link to="/pricing" className="flex items-start gap-4 group/item p-3 -mx-3 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                          <div className="w-10 h-10 bg-white text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform shadow-sm">
                              <Download size={20} />
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-900 text-sm">Exports Pro</h4>
                              <p className="text-xs text-slate-500 mt-1">Word (.doc) et PDF imprimable.</p>
                          </div>
                      </Link>
                  </div>
               </div>
               
               <div className="col-span-12 bg-emerald-900 py-3 px-8 flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-100">🚀 Plus de 10 000 mémoires validés avec notre suite.</span>
                  <Link to="/signup" className="text-xs font-bold text-white flex items-center gap-1 hover:text-emerald-200 transition">
                     Essayer gratuitement <span className="text-lg leading-none">→</span>
                  </Link>
               </div>
            </div>
          </div>

          {/* MEGA MENU: ORIENTATION POST-BAC (NOUVEAU) */}
          <div className="relative group mega-menu-group py-6">
            <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
              Orientation Post-Bac
              <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-emerald-600" />
            </button>
            
            <div className="mega-menu-content opacity-0 invisible absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform translate-y-2 transition-all duration-200 cursor-default grid grid-cols-3 z-50">
               
               {/* Col 1: Test d'Orientation (Mise en avant) */}
               <div className="col-span-1 bg-slate-50 p-8 border-r border-slate-100 flex flex-col h-full relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                        <Compass size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">Test d'Orientation IA</h3>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        Répondez à 10 questions et laissez notre algorithme analyser votre profil pour vous suggérer les filières idéales.
                    </p>
                    <Link to="/orientation" className="inline-flex items-center justify-center px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-all w-full shadow-md">
                        Faire le test gratuit
                    </Link>
                  </div>
                  {/* Déco */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-100/50 rounded-full blur-2xl"></div>
               </div>

               {/* Col 2: Destinations */}
               <div className="col-span-1 p-8 border-r border-slate-50">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Globe2 size={14} /> Par Destination
                  </div>
                  <div className="space-y-1">
                      <Link to="/destinations/europe" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group/item">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                              <MapPin size={14} />
                          </div>
                          <div>
                              <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-blue-600 transition">Étudier en Europe</h4>
                              <p className="text-[10px] text-slate-500">Campus France, Visas, Logement.</p>
                          </div>
                      </Link>
                      <Link to="/destinations/africa" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group/item">
                          <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                              <MapPin size={14} />
                          </div>
                          <div>
                              <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-amber-600 transition">Étudier en Afrique</h4>
                              <p className="text-[10px] text-slate-500">Concours, Écoles d'ingénieurs.</p>
                          </div>
                      </Link>
                      <Link to="/destinations/canada" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group/item">
                          <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
                              <MapPin size={14} />
                          </div>
                          <div>
                              <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-red-600 transition">Canada & International</h4>
                              <p className="text-[10px] text-slate-500">Bourses et équivalences.</p>
                          </div>
                      </Link>
                  </div>
               </div>

               {/* Col 3: Guides Pratiques */}
               <div className="col-span-1 p-8">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Lightbulb size={14} /> Conseils Pratiques
                  </div>
                  <ul className="space-y-3">
                      <li>
                          <Link to="/blog/guide-methodologique" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:translate-x-1 transition-all">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                              Comment rédiger sa lettre de motivation ?
                          </Link>
                      </li>
                      <li>
                          <Link to="/blog/guide-methodologique" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:translate-x-1 transition-all">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                              Réussir son entretien d'admission
                          </Link>
                      </li>
                      <li>
                          <Link to="/blog/guide-methodologique" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:translate-x-1 transition-all">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                              Les 10 filières d'avenir en 2025
                          </Link>
                      </li>
                       <li>
                          <Link to="/blog/guide-methodologique" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:translate-x-1 transition-all">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                              Gérer son budget étudiant
                          </Link>
                      </li>
                  </ul>
                  <Link to="/resources" className="mt-6 block text-center text-xs font-bold text-emerald-600 hover:underline">
                      Voir tous les guides d'orientation →
                  </Link>
               </div>
            </div>
          </div>

          {/* MEGA MENU: RESSOURCES */}
          <div className="relative group mega-menu-group py-6">
            <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
              Ressources
              <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-emerald-600" />
            </button>
            
            <div className="mega-menu-content opacity-0 invisible absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-xl shadow-xl border border-slate-100 p-6 transform translate-y-2 transition-all duration-200 cursor-default z-50">
              
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guides & Conseils</p>
                <Link to="/resources" className="text-xs font-bold text-emerald-600 hover:underline">Voir tout</Link>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Link to="/blog/guide-methodologique" className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors group/item">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Guide Méthodologique</h4>
                    <p className="text-[10px] text-slate-500">De la problématique à la conclusion.</p>
                  </div>
                </Link>

                <Link to="/blog/structure-memoire-qhse" className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors group/item">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Spécial QHSE</h4>
                    <p className="text-[10px] text-slate-500">Normes ISO & Analyses techniques.</p>
                  </div>
                </Link>

                <Link to="/blog/reussir-soutenance" className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors group/item">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Préparation Soutenance</h4>
                    <p className="text-[10px] text-slate-500">Slides, posture et questions.</p>
                  </div>
                </Link>
                
                 <Link to="/blog/exemples-memoires" className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors group/item">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Exemples Validés</h4>
                    <p className="text-[10px] text-slate-500">Inspiration note 16/20+.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <Link to="/pricing" className="text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition">Tarifs</Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-full transition-all border border-slate-200"
              >
                <div className="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                  <User size={16} />
                </div>
                <span>{user.name || 'Mon Compte'}</span>
                <ChevronDown size={14} />
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                <Link to="/app" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium">Accéder à l'App</Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium border-t border-slate-50"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-2 px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors">
                <LogIn size={16} />
                Connexion
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-emerald-600 rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-100 focus:outline-none transform hover:-translate-y-0.5">
                Démarrer
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="lg:hidden p-2 text-slate-600 z-50 relative hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-6 lg:hidden animate-fade-in flex flex-col h-screen overflow-y-auto">
          <nav className="flex flex-col gap-2 text-lg font-medium text-slate-800">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-slate-100">Accueil</Link>
            
            {/* Mobile Features Accordion */}
            <div className="border-b border-slate-100 py-4">
               <button 
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center justify-between w-full font-bold text-slate-900"
              >
                Fonctionnalités
                <ChevronDown size={20} className={`transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>
              
              {isFeaturesOpen && (
                 <div className="mt-4 flex flex-col gap-3 pl-2">
                    <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><PenTool size={16} /></div>
                        Rédaction & Plan
                    </Link>
                    <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Sparkles size={16} /></div>
                        Humanisateur IA
                    </Link>
                    <Link to="/jury" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 text-sm text-slate-600 bg-white border border-emerald-100">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Users size={16} /></div>
                        Simulateur Jury
                    </Link>
                    <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Book size={16} /></div>
                        Bibliographe
                    </Link>
                     <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Search size={16} /></div>
                        Chat Sources
                    </Link>
                 </div>
              )}
            </div>

             {/* Mobile Orientation Accordion */}
             <div className="border-b border-slate-100 py-4">
               <button 
                onClick={() => setIsOrientationOpen(!isOrientationOpen)}
                className="flex items-center justify-between w-full font-bold text-slate-900"
              >
                Orientation Post-Bac
                <ChevronDown size={20} className={`transition-transform duration-300 ${isOrientationOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>
              
              {isOrientationOpen && (
                 <div className="mt-4 flex flex-col gap-3 pl-2">
                    <Link to="/orientation" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 bg-slate-50">
                        <div className="bg-emerald-600 p-1.5 rounded text-white"><Compass size={16} /></div>
                        Faire le Test d'Orientation
                    </Link>
                    <Link to="/destinations/europe" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Globe2 size={16} /></div>
                        Étudier en Europe
                    </Link>
                    <Link to="/destinations/africa" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-amber-100 p-1.5 rounded text-amber-600"><MapPin size={16} /></div>
                        Étudier en Afrique
                    </Link>
                     <Link to="/destinations/canada" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-red-100 p-1.5 rounded text-red-600"><MapPin size={16} /></div>
                        Canada & International
                    </Link>
                 </div>
              )}
            </div>

            {/* Mobile Resources Accordion */}
            <div className="border-b border-slate-100 py-4">
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center justify-between w-full font-bold text-slate-900"
              >
                Ressources
                <ChevronDown size={20} className={`transition-transform duration-300 ${isResourcesOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="mt-4 flex flex-col gap-3 pl-2">
                  <Link to="/blog/guide-methodologique" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                      <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><FileText size={16} /></div>
                      Guide Méthodo
                  </Link>
                  <Link to="/blog/reussir-soutenance" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                      <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Users size={16} /></div>
                      Soutenance
                  </Link>
                  <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-600 text-sm font-bold pl-2 mt-1">Tout voir →</Link>
                </div>
              )}
            </div>

            <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-slate-100">Tarifs</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-slate-100">Contact</Link>
          </nav>

          <div className="mt-auto pb-8 space-y-4">
            {user ? (
              <>
                 <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white transition-all duration-200 bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg">
                  Accéder à mon espace
                </Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full py-3 text-center text-red-600 font-bold text-sm">
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50">
                  Se connecter
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white transition-all duration-200 bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg">
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
