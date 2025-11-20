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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/resources');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 font-sans shadow-sm">
      
      {/* TOP BAR : Logo | Search | Auth */}
      <div className="bg-white border-b border-slate-100 py-3 px-6">
         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-slate-900 group shrink-0">
                <div className="bg-emerald-600 text-white p-2 rounded-xl transition-all duration-300 shadow-md shadow-emerald-100 group-hover:scale-105">
                    <GraduationCap size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-serif font-bold tracking-tight leading-none group-hover:text-emerald-700 transition-colors">MémoirePro</span>
                </div>
            </Link>

            {/* Search Bar (Desktop Only) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <form onSubmit={handleSearch} className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Rechercher un guide, un outil..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            {/* Auth & Mobile Toggle */}
            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-3">
                    {user ? (
                        <div className="relative group">
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-full transition-all shadow-sm"
                            >
                                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                                    <User size={16} />
                                </div>
                                <span className="max-w-[100px] truncate">{user.name || 'Compte'}</span>
                                <ChevronDown size={14} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                                <Link to="/app" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium">Accéder à l'App</Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium border-t border-slate-50">Déconnexion</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors">
                                Connexion
                            </Link>
                            <Link to="/signup" className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-emerald-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                Démarrer
                            </Link>
                        </>
                    )}
                </div>

                <button 
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
         </div>
      </div>

      {/* NAVIGATION BAR : Menu Items */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 hidden lg:block">
          <div className="max-w-7xl mx-auto px-6">
              <nav className="flex items-center gap-8 h-14 text-sm font-medium">
                  
                  {/* Mega Menu: Fonctionnalités */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                      <button className="flex items-center gap-1.5 text-slate-600 group-hover:text-emerald-600 transition-colors font-bold">
                          Fonctionnalités
                          <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-emerald-600" />
                      </button>
                      {/* Dropdown Content */}
                        <div className="mega-menu-content opacity-0 invisible absolute top-full left-0 w-[800px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform translate-y-2 transition-all duration-200 cursor-default grid grid-cols-12 z-50 mt-1">
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

                   {/* Mega Menu: Orientation */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                    <button className="flex items-center gap-1.5 text-slate-600 group-hover:text-emerald-600 transition-colors font-bold">
                        Orientation Post-Bac
                        <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-emerald-600" />
                    </button>
                    <div className="mega-menu-content opacity-0 invisible absolute top-full left-0 w-[900px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform translate-y-2 transition-all duration-200 cursor-default grid grid-cols-3 z-50 mt-1">
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
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-100/50 rounded-full blur-2xl"></div>
                        </div>

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
                                        <p className="text-[10px] text-slate-500">Campus France, Visas.</p>
                                    </div>
                                </Link>
                                <Link to="/destinations/africa" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group/item">
                                    <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-amber-600 transition">Étudier en Afrique</h4>
                                        <p className="text-[10px] text-slate-500">Concours, Écoles.</p>
                                    </div>
                                </Link>
                                <Link to="/destinations/canada" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group/item">
                                    <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-red-600 transition">Canada & International</h4>
                                        <p className="text-[10px] text-slate-500">Bourses, Équivalences.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="col-span-1 p-8">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Lightbulb size={14} /> Conseils Pratiques
                            </div>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/blog/guide-methodologique" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:translate-x-1 transition-all">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                        Lettre de motivation
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/reussir-soutenance" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:translate-x-1 transition-all">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                        Entretien d'admission
                                    </Link>
                                </li>
                            </ul>
                            <Link to="/resources" className="mt-6 block text-center text-xs font-bold text-emerald-600 hover:underline">
                                Voir tous les guides →
                            </Link>
                        </div>
                    </div>
                  </div>

                   {/* Mega Menu: Ressources */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                    <button className="flex items-center gap-1.5 text-slate-600 group-hover:text-emerald-600 transition-colors font-bold">
                        Ressources
                        <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-emerald-600" />
                    </button>
                     <div className="mega-menu-content opacity-0 invisible absolute top-full left-0 w-[500px] bg-white rounded-xl shadow-xl border border-slate-100 p-6 transform translate-y-2 transition-all duration-200 cursor-default z-50 mt-1">
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
                                    <p className="text-[10px] text-slate-500">Normes ISO & Analyses.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                  </div>

                  <Link to="/pricing" className="text-slate-600 hover:text-emerald-600 font-bold transition">Tarifs</Link>
              </nav>
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-6 lg:hidden animate-fade-in flex flex-col h-screen overflow-y-auto">
          
          {/* Mobile Search */}
          <div className="mb-6">
             <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </form>
          </div>

          <nav className="flex flex-col gap-2 text-lg font-medium text-slate-800">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-slate-100">Accueil</Link>
            
            {/* Mobile Accordions (Fonctionnalités, Orientation, Ressources) - Same as before */}
             <div className="border-b border-slate-100 py-4">
               <button onClick={() => setIsFeaturesOpen(!isFeaturesOpen)} className="flex items-center justify-between w-full font-bold text-slate-900">
                Fonctionnalités <ChevronDown size={20} className={`transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
               </button>
               {isFeaturesOpen && (
                 <div className="mt-4 flex flex-col gap-3 pl-2">
                    <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><PenTool size={16} /></div> Rédaction & Plan
                    </Link>
                    <Link to="/jury" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 text-sm text-slate-600 bg-white border border-emerald-100">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Users size={16} /></div> Simulateur Jury
                    </Link>
                    <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Book size={16} /></div> Bibliographe
                    </Link>
                 </div>
               )}
            </div>

            <div className="border-b border-slate-100 py-4">
               <button onClick={() => setIsOrientationOpen(!isOrientationOpen)} className="flex items-center justify-between w-full font-bold text-slate-900">
                Orientation <ChevronDown size={20} className={`transition-transform duration-300 ${isOrientationOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
               </button>
               {isOrientationOpen && (
                 <div className="mt-4 flex flex-col gap-3 pl-2">
                    <Link to="/orientation" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-emerald-600 p-1.5 rounded text-white"><Compass size={16} /></div> Test d'Orientation
                    </Link>
                    <Link to="/destinations/europe" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Globe2 size={16} /></div> Europe
                    </Link>
                    <Link to="/destinations/africa" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-amber-100 p-1.5 rounded text-amber-600"><MapPin size={16} /></div> Afrique
                    </Link>
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
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 rounded-xl hover:bg-emerald-600 shadow-lg">
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