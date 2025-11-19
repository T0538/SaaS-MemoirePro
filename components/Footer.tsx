import React from 'react';
import { GraduationCap, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <GraduationCap size={24} className="text-indigo-400" />
              </div>
              <span className="text-xl font-serif font-bold">MémoirePro</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              La première plateforme d'assistance rédactionnelle académique couplée à une IA éthique, conçue pour l'excellence des étudiants en Licence Pro et Master.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition"><Linkedin size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-indigo-300">Plateforme</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/app" className="hover:text-white transition">L'éditeur (App)</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Tarifs Étudiants</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Offre Écoles</Link></li>
              <li><Link to="/" className="hover:text-white transition">Témoignages</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-indigo-300">Ressources</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/resources" className="hover:text-white transition">Blog Conseils</Link></li>
              <li><Link to="/blog/structure-memoire-qhse" className="hover:text-white transition">Guide de rédaction</Link></li>
              <li><Link to="/resources" className="hover:text-white transition">Base de connaissances</Link></li>
              <li><Link to="/blog/bibliographie-apa" className="hover:text-white transition">Outils de citation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-indigo-300">Légal</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition">Conditions Générales</Link></li>
              <li><Link to="/" className="hover:text-white transition">Politique de confidentialité</Link></li>
              <li><Link to="/" className="hover:text-white transition">Mentions Légales</Link></li>
              <li><Link to="/" className="hover:text-white transition">Charte Éthique IA</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MémoirePro AI. Tous droits réservés. Fait avec passion pour l'éducation.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Paris</span>
            <span>Lyon</span>
            <span>Bordeaux</span>
          </div>
        </div>
      </div>
    </footer>
  );
};