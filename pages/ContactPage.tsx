import React, { useState } from 'react';
import { Mail, Building, User, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration Netlify Forms
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const myForm = e.currentTarget;
    const formData = new FormData(myForm);

    // Envoi des données à Netlify via fetch
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        setIsLoading(false);
        setIsSubmitted(true);
      })
      .catch((error) => {
        alert("Erreur lors de l'envoi. Veuillez réessayer.");
        setIsLoading(false);
      });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Message envoyé !</h2>
          <p className="text-slate-500 mb-8">
            Merci de votre intérêt pour MémoirePro Éducation. Notre équipe commerciale vous recontactera sous 24h avec une proposition adaptée à votre établissement.
          </p>
          <Link to="/" className="block w-full py-3 px-6 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-20 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Informations */}
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6">Équipez votre promotion</h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Offrez à vos étudiants l'outil qui structure leur pensée et garantit des mémoires de qualité professionnelle. 
              Bénéficiez de tarifs dégressifs pour les écoles, universités et centres de formation.
            </p>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                   <Building size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Offre Établissement</h3>
                  <p className="text-sm text-slate-500">Déploiement centralisé, facturation unique, onboarding inclus.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                   <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Suivi Pédagogique</h3>
                  <p className="text-sm text-slate-500">Interface tuteur pour suivre l'avancement des étudiants.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
               <p className="text-slate-600 italic mb-4">"Nous avons équipé nos 45 étudiants de Licence Pro QHSE avec MémoirePro. La qualité des rendus a spectaculairement augmenté, et le plagiat a disparu."</p>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                 <div>
                   <p className="text-sm font-bold text-slate-900">Marc D.</p>
                   <p className="text-xs text-slate-400">Responsable Pédagogique IUT Lyon</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Formulaire Netlify */}
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-slate-200">
            <form 
              name="contact" 
              method="POST" 
              data-netlify="true" 
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Champ caché obligatoire pour Netlify */}
              <input type="hidden" name="form-name" value="contact" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prénom</label>
                  <input required type="text" name="prenom" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom</label>
                  <input required type="text" name="nom" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="email" name="email" placeholder="nom@ecole.fr" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Établissement / Entreprise</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" name="etablissement" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea required name="message" rows={4} placeholder="Nombre d'étudiants, besoins spécifiques..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? 'Envoi en cours...' : (
                  <>Envoyer la demande <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};