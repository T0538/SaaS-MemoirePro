import React, { useState, useEffect } from 'react';
import { GraduationCap, ChevronDown, Sparkles, FileText, Users, Award, Menu, X, LogIn, LogOut, User, PenTool, Calendar, Book, Search, Download, Layout, Compass, MapPin, Globe2, Target, Lightbulb, Briefcase, Code, Scale, Stethoscope, HardHat, Palette, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isOrientationOpen, setIsOrientationOpen] = useState(false);
  const [isFilieresOpen, setIsFilieresOpen] = useState(false);
  const [isCareerOpen, setIsCareerOpen] = useState(false);
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
    <header className="sticky top-0 z-50 transition-all duration-300 font-sans shadow-lg">
      
      {/* TOP BAR : Logo | Search | Auth - FANTASY & HUMANIZED */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 py-4 px-6 text-white relative overflow-hidden">
         
         {/* Decorative Glow */}
         <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse"></div>

         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative z-10">
            
            {/* Logo - Fantaisiste */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-2xl transition-all duration-500 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3">
                    <GraduationCap size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-serif font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 group-hover:to-blue-400 transition-all">Nexia</span>
                </div>
            </Link>

            {/* Search Bar (Desktop Only) - Humanized */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <form onSubmit={handleSearch} className="relative w-full group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 group-hover:text-blue-200 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Rechercher un guide, un outil..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-3 pl-12 pr-6 text-sm text-white placeholder-slate-400/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-slate-800/80 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            {/* Auth & Mobile Toggle */}
            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-3">
                    {user ? (
                        <div className="relative group">
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 text-sm font-bold text-blue-100 hover:text-white bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 px-2 py-1.5 pr-4 rounded-full transition-all shadow-sm hover:shadow-md hover:border-blue-500/30"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                                    <User size={16} />
                                </div>
                                <span className="max-w-[100px] truncate">{user.name || 'Compte'}</span>
                                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50 text-slate-800 origin-top-right">
                                <Link to="/app" className="flex items-center gap-3 px-5 py-3.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors">
                                    <Layout size={16} className="text-blue-400" /> Accéder à l'App
                                </Link>
                                <div className="h-px bg-slate-100 mx-4 my-1"></div>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 text-left px-5 py-3.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                                    <LogOut size={16} /> Déconnexion
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold text-blue-200 hover:text-white px-5 py-2.5 rounded-full hover:bg-slate-800/50 transition-all">
                                Connexion
                            </Link>
                            <Link to="/signup" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:scale-105 transform border border-blue-500/50">
                                Démarrer <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </>
                    )}
                </div>

                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <Menu size={26} />
                </button>
            </div>
         </div>
      </div>

      {/* BOTTOM BAR : Navigation Menu - FANTASY & HUMANIZED DESIGN */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 hidden lg:block shadow-sm sticky top-[80px] z-40">
          <div className="max-w-7xl mx-auto px-6">
              <nav className="flex items-center justify-center gap-2 text-sm font-medium">
                  
                  {/* Mega Menu: Fonctionnalités */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                    <button className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-all px-5 py-4 rounded-full hover:bg-blue-50/50 group-hover:bg-blue-50/80 group-hover:text-blue-700">
                        <span className="tracking-wide font-bold">Fonctionnalités</span>
                        <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-blue-600" />
                    </button>
                    
                    <div className="mega-menu-content opacity-0 invisible absolute top-[calc(100%-0.5rem)] left-1/2 -translate-x-1/2 w-[850px] bg-white rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-100/80 overflow-hidden transform translate-y-4 transition-all duration-300 cursor-default grid grid-cols-12 z-50 ring-1 ring-slate-900/5">
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                        <div className="col-span-7 p-10 relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm shadow-blue-200/50">
                                    <PenTool size={20} />
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-slate-900">Studio de Rédaction</h3>
                                    <p className="text-xs text-slate-500">L'intelligence artificielle au service de votre plume.</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/app" className="group/item p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 relative overflow-hidden bg-slate-50/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform border border-blue-100">
                                            <Layout size={16} />
                                        </div>
                                        <span className="font-bold text-slate-800 group-hover/item:text-blue-700">Générateur de Plan</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-11 leading-relaxed">Structurez 50 pages en 2 min.</p>
                                </Link>
                                <Link to="/topic-ideas" className="group/item p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 relative overflow-hidden bg-slate-50/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white text-amber-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform border border-amber-100">
                                            <Sparkles size={16} />
                                        </div>
                                        <span className="font-bold text-slate-800 group-hover/item:text-amber-700">Idées de Sujets</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-11 leading-relaxed">Trouvez l'inspiration instantanément.</p>
                                </Link>
                                <Link to="/app" className="group/item p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 relative overflow-hidden bg-slate-50/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white text-teal-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform border border-teal-100">
                                            <Search size={16} />
                                        </div>
                                        <span className="font-bold text-slate-800 group-hover/item:text-teal-700">Recherche Sources</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-11 leading-relaxed">Analysez vos PDF et documents.</p>
                                </Link>
                                <Link to="/jury" className="group/item p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 relative overflow-hidden bg-slate-50/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform border border-indigo-100">
                                            <Users size={16} />
                                        </div>
                                        <span className="font-bold text-slate-800 group-hover/item:text-indigo-700">Simulateur Jury</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-11 leading-relaxed">Entraînez-vous à l'oral.</p>
                                </Link>
                            </div>
                        </div>
                        <div className="col-span-5 bg-slate-50/80 p-10 flex flex-col justify-center relative overflow-hidden">
                            {/* Decorative pattern */}
                            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg relative z-10 hover:-translate-y-1 transition-transform duration-300">
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><Award size={18} /></div> 
                                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Passez Premium</span>
                                </h4>
                                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                    Débloquez la puissance de GPT-4o et Claude 3.5 pour une rédaction académique d'excellence sans limites.
                                </p>
                                <Link to="/pricing" className="block w-full py-3 text-center text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/20">
                                    Voir les offres
                                </Link>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Mega Menu: Orientation */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                    <button className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-all px-5 py-4 rounded-full hover:bg-blue-50/50 group-hover:bg-blue-50/80 group-hover:text-blue-700">
                        <span className="tracking-wide font-bold">Orientation</span>
                        <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-blue-600" />
                    </button>
                    <div className="mega-menu-content opacity-0 invisible absolute top-[calc(100%-0.5rem)] left-1/2 -translate-x-1/2 w-[900px] bg-white rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-100/80 overflow-hidden transform translate-y-4 transition-all duration-300 cursor-default grid grid-cols-3 z-50 ring-1 ring-slate-900/5">
                        
                        {/* Column 1: Test IA */}
                        <div className="col-span-1 p-8 border-r border-slate-50 bg-gradient-to-b from-blue-50/30 to-transparent relative overflow-hidden group/col">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400 transform scale-x-0 group-hover/col:scale-x-100 transition-transform duration-500 origin-left"></div>
                            <div className="h-12 w-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover/col:scale-110 transition-transform">
                                <Compass size={24} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Test d'Orientation IA</h3>
                            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                Notre algorithme analyse votre personnalité et vos notes pour vous révéler votre voie idéale.
                            </p>
                            <Link to="/orientation" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 hover:gap-4 transition-all shadow-md shadow-blue-200">
                                Commencer le test <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Column 2: Destinations */}
                        <div className="col-span-1 p-8 border-r border-slate-50">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Globe2 size={14} /> Par Destination
                            </div>
                            <div className="space-y-2">
                                <Link to="/destinations/europe" className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group/item">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-blue-600 transition">Étudier en Europe</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Campus France, Visas.</p>
                                    </div>
                                </Link>
                                <Link to="/destinations/africa" className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group/item">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0 border border-amber-100">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-amber-600 transition">Étudier en Afrique</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Sénégal, Maroc, RCI.</p>
                                    </div>
                                </Link>
                                <Link to="/destinations/canada" className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group/item">
                                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 border border-red-100">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 group-hover/item:text-red-600 transition">Canada & Monde</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Bourses, Équivalences.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Column 3: Conseils */}
                        <div className="col-span-1 p-8">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Lightbulb size={14} /> Conseils Pratiques
                            </div>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/blog/guide-methodologique" className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-blue-600 hover:translate-x-1 transition-all group">
                                        <span className="w-2 h-2 bg-blue-200 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                                        Lettre de motivation
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog/reussir-soutenance" className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-blue-600 hover:translate-x-1 transition-all group">
                                        <span className="w-2 h-2 bg-blue-200 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                                        Entretien d'admission
                                    </Link>
                                </li>
                            </ul>
                            <Link to="/resources" className="mt-8 inline-block text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors border-b border-blue-200 hover:border-blue-600 pb-0.5">
                                Voir tous les guides pratiques
                            </Link>
                        </div>
                    </div>
                  </div>

                   {/* Mega Menu: Filières */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                    <button className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-all px-5 py-4 rounded-full hover:bg-blue-50/50 group-hover:bg-blue-50/80 group-hover:text-blue-700">
                        <span className="tracking-wide font-bold">Filières</span>
                        <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-blue-600" />
                    </button>
                    <div className="mega-menu-content opacity-0 invisible absolute top-[calc(100%-0.5rem)] left-1/2 -translate-x-1/2 w-[850px] bg-white rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-100/80 p-8 transform translate-y-4 transition-all duration-300 cursor-default z-50 ring-1 ring-slate-900/5">
                       <div className="grid grid-cols-4 gap-6">
                          {[
                            { slug: 'informatique', name: 'Informatique', icon: Code, color: 'blue' },
                            { slug: 'gestion', name: 'Gestion & RH', icon: Briefcase, color: 'emerald' },
                            { slug: 'droit', name: 'Droit', icon: Scale, color: 'red' },
                            { slug: 'sante', name: 'Santé', icon: Stethoscope, color: 'teal' },
                            { slug: 'ingenierie', name: 'Ingénierie', icon: HardHat, color: 'orange' },
                            { slug: 'art', name: 'Art & Design', icon: Palette, color: 'purple' },
                            { slug: 'marketing', name: 'Marketing', icon: Award, color: 'pink' },
                            { slug: 'social', name: 'Social', icon: Users, color: 'indigo' }
                          ].map((f) => (
                              <Link key={f.slug} to={`/filieres/${f.slug}`} className="flex flex-col items-center p-6 rounded-2xl hover:bg-slate-50 hover:shadow-md transition-all group/item text-center border border-transparent hover:border-slate-100">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover/item:scale-110 group-hover/item:-rotate-3 bg-${f.color}-50 text-${f.color}-600 shadow-sm`}>
                                     {React.createElement(f.icon, { size: 26 })}
                                  </div>
                                  <span className="text-sm font-bold text-slate-700 group-hover/item:text-blue-600 transition-colors">{f.name}</span>
                              </Link>
                          ))}
                       </div>
                       <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                          <Link to="/orientation" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                             Vous ne savez pas quoi choisir ? <span className="underline decoration-2 decoration-blue-200 hover:decoration-blue-500">Faites le test d'orientation</span>
                          </Link>
                       </div>
                    </div>
                  </div>

                   {/* Mega Menu: Carrière (NEW) */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                    <button className="flex items-center gap-1.5 text-slate-600 hover:text-amber-600 transition-all px-5 py-4 rounded-full hover:bg-amber-50/50 group-hover:bg-amber-50/80 group-hover:text-amber-600">
                        <span className="tracking-wide font-bold">Carrière</span>
                        <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-amber-600" />
                    </button>
                    <div className="mega-menu-content opacity-0 invisible absolute top-[calc(100%-0.5rem)] left-1/2 -translate-x-1/2 w-[650px] bg-white rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-100/80 p-8 transform translate-y-4 transition-all duration-300 cursor-default z-50 ring-1 ring-slate-900/5">
                       <div className="grid grid-cols-2 gap-6">
                          <Link to="/jobs" className="group/card block p-6 rounded-2xl hover:bg-amber-50/50 transition-all border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover/card:opacity-50 transition-opacity"></div>
                              <div className="flex items-center gap-4 mb-3 relative z-10">
                                 <div className="bg-white border border-amber-100 text-amber-600 p-3 rounded-xl shadow-sm group-hover/card:scale-110 transition-transform">
                                    <Briefcase size={24} />
                                 </div>
                                 <h4 className="font-serif font-bold text-lg text-slate-900 group-hover/card:text-amber-700">Trouver un Emploi</h4>
                              </div>
                              <p className="text-sm text-slate-500 leading-relaxed pl-[60px]">Recherche intelligente par IA dans votre région et à l'international.</p>
                          </Link>
                          <Link to="/coaching" className="group/card block p-6 rounded-2xl hover:bg-blue-50/50 transition-all border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover/card:opacity-50 transition-opacity"></div>
                              <div className="flex items-center gap-4 mb-3 relative z-10">
                                 <div className="bg-white border border-blue-100 text-blue-600 p-3 rounded-xl shadow-sm group-hover/card:scale-110 transition-transform">
                                    <Award size={24} />
                                 </div>
                                 <h4 className="font-serif font-bold text-lg text-slate-900 group-hover/card:text-blue-700">Coaching Carrière</h4>
                              </div>
                              <p className="text-sm text-slate-500 leading-relaxed pl-[60px]">Analyse de CV et rédaction de lettre de motivation par IA.</p>
                          </Link>
                       </div>
                    </div>
                  </div>

                   {/* Mega Menu: Ressources */}
                  <div className="relative group mega-menu-group h-full flex items-center">
                    <button className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-all px-5 py-4 rounded-full hover:bg-blue-50/50 group-hover:bg-blue-50/80 group-hover:text-blue-700">
                        <span className="tracking-wide font-bold">Ressources</span>
                        <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-blue-600" />
                    </button>
                     <div className="mega-menu-content opacity-0 invisible absolute top-[calc(100%-0.5rem)] left-1/2 -translate-x-1/2 w-[550px] bg-white rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-100/80 p-8 transform translate-y-4 transition-all duration-300 cursor-default z-50 ring-1 ring-slate-900/5">
                        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Book size={14} /> Bibliothèque</p>
                            <Link to="/resources" className="text-xs font-bold text-blue-600 hover:underline">Voir tout →</Link>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <Link to="/blog/guide-methodologique" className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors group/item border border-transparent hover:border-slate-100">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors shadow-sm">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Guide Méthodologique</h4>
                                    <p className="text-xs text-slate-500">De la problématique à la conclusion.</p>
                                </div>
                            </Link>
                             <Link to="/blog/structure-memoire-qhse" className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors group/item border border-transparent hover:border-slate-100">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors shadow-sm">
                                    <ShieldCheck size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Spécial QHSE</h4>
                                    <p className="text-xs text-slate-500">Normes ISO & Analyses.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                  </div>

                  <Link to="/pricing" className="text-slate-600 hover:text-blue-700 font-bold transition-all px-5 py-4 rounded-full hover:bg-blue-50/50">Tarifs</Link>
              </nav>
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[9999] lg:hidden animate-fade-in flex flex-col h-[100dvh]">
          
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
             <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                    <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-xl font-serif font-bold text-slate-900">Nexia</span>
             </div>
             <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
             >
                <X size={24} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-40 safe-area-bottom">
            {/* Mobile Search */}
            <div className="mb-8">
             <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative group">
                <div className="absolute inset-0 bg-blue-100 rounded-xl blur opacity-20 group-focus-within:opacity-50 transition-opacity"></div>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="Rechercher un guide..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </form>
            </div>

            <nav className="flex flex-col gap-2 text-lg font-medium text-slate-800">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-slate-100 flex items-center justify-between group">
                <span>Accueil</span>
                <ChevronDown size={20} className="-rotate-90 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </Link>
            
            {/* Mobile Accordions */}
             <div className="border-b border-slate-100 py-4">
               <button onClick={() => setIsFeaturesOpen(!isFeaturesOpen)} className="flex items-center justify-between w-full font-bold text-slate-900">
                Fonctionnalités <ChevronDown size={20} className={`transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
               </button>
               {isFeaturesOpen && (
                 <div className="mt-4 flex flex-col gap-3 pl-2">
                    <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Layout size={16} /></div> Générateur de Plan
                    </Link>
                    <Link to="/topic-ideas" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-amber-100 p-1.5 rounded text-amber-600"><Sparkles size={16} /></div> Idées de Sujets
                    </Link>
                    <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-teal-100 p-1.5 rounded text-teal-600"><Search size={16} /></div> Recherche Sources
                    </Link>
                    <Link to="/jury" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-sm text-slate-600 bg-white border border-blue-100">
                        <div className="bg-indigo-100 p-1.5 rounded text-indigo-600"><Users size={16} /></div> Simulateur Jury
                    </Link>
                 </div>
               )}
            </div>

            <div className="border-b border-slate-100 py-4">
               <button onClick={() => setIsOrientationOpen(!isOrientationOpen)} className="flex items-center justify-between w-full font-bold text-slate-900">
                Orientation <ChevronDown size={20} className={`transition-transform duration-300 ${isOrientationOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
               </button>
               {isOrientationOpen && (
                 <div className="mt-4 flex flex-col gap-3 pl-2">
                    <Link to="/orientation" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-blue-600 p-1.5 rounded text-white"><Compass size={16} /></div> Test d'Orientation
                    </Link>
                    <Link to="/destinations/europe" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Globe2 size={16} /></div> Europe
                    </Link>
                    <Link to="/destinations/africa" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-amber-100 p-1.5 rounded text-amber-600"><Globe2 size={16} /></div> Afrique
                    </Link>
                    <Link to="/destinations/canada" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-red-100 p-1.5 rounded text-red-600"><Globe2 size={16} /></div> Canada
                    </Link>
                 </div>
               )}
            </div>

            <div className="border-b border-slate-100 py-4">
               <button onClick={() => setIsFilieresOpen(!isFilieresOpen)} className="flex items-center justify-between w-full font-bold text-slate-900">
                Filières <ChevronDown size={20} className={`transition-transform duration-300 ${isFilieresOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
               </button>
               {isFilieresOpen && (
                 <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                        { slug: 'informatique', name: 'Informatique' },
                        { slug: 'gestion', name: 'Gestion' },
                        { slug: 'droit', name: 'Droit' },
                        { slug: 'sante', name: 'Santé' },
                        { slug: 'marketing', name: 'Marketing' },
                        { slug: 'ingenierie', name: 'Ingénierie' }
                    ].map(f => (
                         <Link key={f.slug} to={`/filieres/${f.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-2 rounded-lg bg-slate-50 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-center border border-slate-100">
                             {f.name}
                         </Link>
                    ))}
                    <Link to="/orientation" onClick={() => setIsMobileMenuOpen(false)} className="col-span-2 text-center text-xs text-blue-600 font-bold mt-2">Voir toutes les filières →</Link>
                 </div>
               )}
            </div>

            <div className="border-b border-slate-100 py-4">
               <button onClick={() => setIsCareerOpen(!isCareerOpen)} className="flex items-center justify-between w-full font-bold text-slate-900">
                Carrière <ChevronDown size={20} className={`transition-transform duration-300 ${isCareerOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
               </button>
               {isCareerOpen && (
                 <div className="mt-4 flex flex-col gap-3 pl-2">
                    <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-amber-100 p-1.5 rounded text-amber-600"><Briefcase size={16} /></div> Trouver un emploi
                    </Link>
                    <Link to="/coaching" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                        <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Award size={16} /></div> Coaching Carrière
                    </Link>
                 </div>
               )}
            </div>

            <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-slate-100">Tarifs</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-slate-100">Contact</Link>
          </nav>
          
          {/* Bottom Actions */}
          <div className="mt-8 space-y-4">
            {user ? (
              <>
                 <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg">
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
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 rounded-xl hover:bg-blue-600 shadow-lg">
                  Créer un compte
                </Link>
              </>
            )}
          </div>
          </div>
      </div>
      )}
    </header>
  );
};