import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-dom-confetti'; // On simule juste l'effet visuel, pas besoin de la lib pour l'exemple

export const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 animate-fade-in">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-emerald-200 shadow-lg">
          <CheckCircle size={48} />
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Paiement Confirmé !</h1>
        <p className="text-slate-500 mb-8 text-lg leading-relaxed">
          Félicitations ! Votre licence <strong>Étudiant Pro</strong> est active. Vous avez maintenant accès à la génération illimitée et aux exports Word.
        </p>
        
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Prochaines étapes :</h4>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ Un reçu a été envoyé par email.</li>
                <li className="flex items-center gap-2">✓ Votre compte est débloqué.</li>
                <li className="flex items-center gap-2">✓ Vous pouvez reprendre votre rédaction.</li>
            </ul>
        </div>

        <Link to="/app" className="block w-full py-4 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition shadow-lg flex items-center justify-center gap-2 group">
          Accéder à mon espace
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </Link>
      </div>
    </div>
  );
};