import React, { useState } from 'react';
import { GraduationCap, ChevronDown, Sparkles, FileText, Users, Award, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-slate-900 group z-50 relative">
          <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
            <GraduationCap size={24} />
          </div>
          <div>
            <span className="text-xl font-serif font-bold tracking-tight block leading-none">MémoirePro</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Intelligence Académique</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">Accueil</Link>
          
          {/* Mega Menu Trigger */}
          <div className="relative group mega-menu-group py-6">
            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
              Ressources & Conseils
              <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            {/* Mega Menu Content */}
            <div className="mega-menu-content opacity-0 invisible absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 gap-6 transform translate-y-2 transition-all duration-200 cursor-default">
              
              <div className="col-span-2 mb-2 border-b border-slate-100 pb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Centre d'excellence</p>
              </div>

              <Link to="/blog/guide-methodologique" className="flex items-start gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors group/item">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Guide Méthodologique</h4>
                  <p className="text-xs text-slate-500 mt-1">Comment structurer un mémoire de A à Z.</p>
                </div>
              </Link>

              <Link to="/blog/structure-memoire-qhse" className="flex items-start gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors group/item">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Spécial QHSE</h4>
                  <p className="text-xs text-slate-500 mt-1">Normes ISO, Document Unique & Analyses.</p>
                </div>
              </Link>

              <Link to="/blog/reussir-soutenance" className="flex items-start gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors group/item">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Préparation Soutenance</h4>
                  <p className="text-xs text-slate-500 mt-1">Slides, posture et gestion des questions.</p>
                </div>
              </Link>

               <Link to="/blog/exemples-memoires" className="flex items-start gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-colors group/item">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Exemples de Mémoires</h4>
                  <p className="text-xs text-slate-500 mt-1">Consultez des mémoires validés.</p>
                </div>
              </Link>
            </div>
          </div>

          <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">Tarifs</Link>
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/app" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
            Démarrer la rédaction
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="md:hidden p-2 text-slate-600 z-50 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-6 md:hidden animate-fade-in flex flex-col h-screen overflow-y-auto">
          <nav className="flex flex-col gap-6 text-lg font-medium text-slate-800">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Accueil</Link>
            
            <div>
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center justify-between w-full border-b border-slate-100 pb-4"
              >
                Ressources
                <ChevronDown size={20} className={`transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="pl-4 pt-4 flex flex-col gap-4 text-base text-slate-600">
                  <Link to="/blog/guide-methodologique" onClick={() => setIsMobileMenuOpen(false)}>Guide Méthodologique</Link>
                  <Link to="/blog/structure-memoire-qhse" onClick={() => setIsMobileMenuOpen(false)}>Spécial QHSE</Link>
                  <Link to="/blog/reussir-soutenance" onClick={() => setIsMobileMenuOpen(false)}>Soutenance</Link>
                  <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)} className="text-indigo-600 font-bold">Tout voir →</Link>
                </div>
              )}
            </div>

            <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Tarifs</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Contact</Link>
          </nav>

          <div className="mt-8">
            <Link to="/app" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white transition-all duration-200 bg-slate-900 rounded-xl hover:bg-indigo-600 shadow-lg">
              Démarrer la rédaction
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};