import React from 'react';
import { Check, GraduationCap, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Investissez dans votre réussite</h1>
          <p className="text-slate-500 text-lg">
            Des tarifs adaptés au budget étudiant. Parce que l'excellence ne devrait pas être un luxe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">Découverte</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-4xl font-serif font-bold text-slate-900">0 $</span>
                <span className="text-slate-500 ml-2">/mois</span>
              </div>
              <p className="text-sm text-slate-500 mt-4">Pour structurer ses idées.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Check size={18} className="text-slate-400" /> Génération du plan détaillé
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Check size={18} className="text-slate-400" /> Analyse du sujet
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Check size={18} className="text-slate-400" /> Accès au Blog
              </li>
            </ul>
            <Link to="/app" className="w-full py-3 px-6 rounded-xl border border-slate-200 text-slate-700 font-semibold text-center hover:bg-slate-50 transition">
              Commencer
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Recommandé
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Étudiant Pro</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-4xl font-serif font-bold text-white">3 $</span>
                <span className="text-slate-400 ml-2">/mémoire</span>
              </div>
              <p className="text-sm text-slate-400 mt-4">Tout pour rédiger et valider.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check size={18} className="text-emerald-400" /> <strong>Rédaction illimitée</strong> (IA Flash)
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check size={18} className="text-emerald-400" /> Humanisation du texte v2.5
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check size={18} className="text-emerald-400" /> Export Word & Markdown
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check size={18} className="text-emerald-400" /> Expertise QHSE & Technique
              </li>
            </ul>
            <Link to="/checkout" className="w-full py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold text-center hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/50">
              Choisir cette offre
            </Link>
          </div>

          {/* School Tier */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
             <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">École / Univ</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-4xl font-serif font-bold text-slate-900">Sur devis</span>
              </div>
              <p className="text-sm text-slate-500 mt-4">Pour équiper une promotion.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Check size={18} className="text-indigo-500" /> Licences multiples
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Check size={18} className="text-indigo-500" /> Tableau de bord suivi tuteur
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Check size={18} className="text-indigo-500" /> Détection anti-plagiat intégrée
              </li>
            </ul>
            <Link to="/contact" className="w-full py-3 px-6 rounded-xl border border-slate-200 text-slate-700 font-semibold text-center hover:bg-slate-50 transition block">
              Contacter les ventes
            </Link>
          </div>

        </div>

        <div className="mt-20 text-center">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                <Zap size={16} />
                Paiement unique, pas d'abonnement caché. Satisfait ou remboursé sous 14 jours.
            </p>
        </div>
      </div>
    </div>
  );
};