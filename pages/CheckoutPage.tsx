import React, { useState } from 'react';
import { ShieldCheck, CreditCard, CheckCircle, Lock, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation API Paiement
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Paiement Réussi !</h2>
          <p className="text-slate-500 mb-8 text-lg">
            Bienvenue dans le club Pro. Votre licence est activée. Vous pouvez dès maintenant commencer la rédaction de votre mémoire.
          </p>
          <Link to="/app" className="block w-full py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            Accéder à l'éditeur
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-8 flex items-center gap-2 text-slate-400 text-sm">
            <Link to="/pricing" className="hover:text-slate-600">Tarifs</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Paiement</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-6">Récapitulatif</h3>
              
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">Pack Étudiant Pro</h4>
                    <p className="text-sm text-slate-500">Licence à vie pour 1 mémoire</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600 text-sm">
                    <span>Sous-total</span>
                    <span>8.25 €</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                    <span>TVA (20%)</span>
                    <span>1.65 €</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total TTC</span>
                <span className="font-serif font-bold text-2xl text-indigo-600">9.90 €</span>
              </div>

              <div className="mt-8 bg-slate-50 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-500">
                <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
                <p>Paiement sécurisé SSL 256-bit. Satisfait ou remboursé pendant 14 jours.</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Paiement sécurisé</h2>
                <div className="flex gap-2">
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200"></div>
                    <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200"></div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titulaire de la carte</label>
                    <input type="text" required placeholder="Jean Dupont" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Numéro de carte</label>
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" required placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono" maxLength={19} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiration</label>
                        <input type="text" required placeholder="MM/AA" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-center" maxLength={5} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVC</label>
                        <div className="relative">
                             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                             <input type="text" required placeholder="123" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-center" maxLength={3} />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
                >
                    {isLoading ? 'Traitement...' : (
                        <>
                            <Lock size={18} /> Payer 9.90 €
                        </>
                    )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};