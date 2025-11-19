
import React, { useState } from 'react';
import { ShieldCheck, CreditCard, CheckCircle, Lock, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Appel direct à la fonction Netlify Serverless
      // L'URL relative /.netlify/functions/... fonctionne automatiquement sur le site déployé
      const apiUrl = '/.netlify/functions/create-checkout-session';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirection vers Stripe
      } else {
        console.error("Erreur réponse:", data);
        alert("Erreur lors de l'initialisation du paiement.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Impossible de contacter le serveur de paiement. Vérifiez votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

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
                    <span>2.50 $</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                    <span>TVA (env. 20%)</span>
                    <span>0.50 $</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total TTC</span>
                <span className="font-serif font-bold text-2xl text-indigo-600">3.00 $</span>
              </div>

              <div className="mt-8 bg-slate-50 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-500">
                <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
                <p>Paiement sécurisé par Stripe. Satisfait ou remboursé pendant 14 jours.</p>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 h-full flex flex-col justify-center items-center text-center">
              
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                <Lock size={32} />
              </div>

              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Paiement Sécurisé</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                Vous allez être redirigé vers la plateforme sécurisée de notre partenaire Stripe pour finaliser votre transaction. Aucune donnée bancaire n'est stockée sur nos serveurs.
              </p>

              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full max-w-md py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-70 transform hover:-translate-y-1"
              >
                {isLoading ? (
                    <>Traitement sécurisé...</>
                ) : (
                    <>
                        <CreditCard size={20} />
                        Payer 3.00 $ avec Stripe
                        <ArrowRight size={20} />
                    </>
                )}
              </button>
              
              <div className="mt-8 flex items-center gap-4 opacity-50 grayscale">
                 <span className="font-bold text-slate-400">VISA</span>
                 <span className="font-bold text-slate-400">Mastercard</span>
                 <span className="font-bold text-slate-400">CB</span>
                 <span className="font-bold text-slate-400">Stripe</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
