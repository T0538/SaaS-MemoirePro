
import React from 'react';
import { GraduationCap, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <GraduationCap size={24} className="text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">Nexia</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 opacity-90">
              La première plateforme d'assistance rédactionnelle académique couplée à une IA éthique. Structurez, rédigez et validez votre mémoire d'excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-blue-400 hover:text-white transition-colors transform hover:scale-110"><Linkedin size={20} /></a>
              <a href="#" className="text-blue-400 hover:text-white transition-colors transform hover:scale-110"><Twitter size={20} /></a>
              <a href="#" className="text-blue-400 hover:text-white transition-colors transform hover:scale-110"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Plateforme</h3>
            <ul className="space-y-3 text-sm text-slate-300/80">
              <li><Link to="/login" className="hover:text-white hover:translate-x-1 transition-all inline-block">Se connecter</Link></li>
              <li><Link to="/signup" className="hover:text-white hover:translate-x-1 transition-all inline-block">Créer un compte</Link></li>
              <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tarifs Étudiants</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Offre Écoles</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Ressources</h3>
            <ul className="space-y-3 text-sm text-slate-300/80">
              <li><Link to="/resources" className="hover:text-white hover:translate-x-1 transition-all inline-block">Blog Conseils</Link></li>
              <li><Link to="/blog/structure-memoire-qhse" className="hover:text-white hover:translate-x-1 transition-all inline-block">Guide de rédaction</Link></li>
              <li><Link to="/resources" className="hover:text-white hover:translate-x-1 transition-all inline-block">Base de connaissances</Link></li>
              <li><Link to="/blog/bibliographie-apa" className="hover:text-white hover:translate-x-1 transition-all inline-block">Générateur APA</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-white">Légal</h3>
            <ul className="space-y-3 text-sm text-slate-300/80">
              <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Conditions Générales</Link></li>
              <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Politique de confidentialité</Link></li>
              <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Mentions Légales</Link></li>
              <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Charte Éthique IA</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Nexia AI. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <span>Paris</span>
            <span>Lyon</span>
            <span>Bordeaux</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
