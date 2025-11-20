import React, { useState } from 'react';
import { analyzeOrientationProfile } from '../services/geminiService';
import { Compass, ArrowRight, MapPin, BookOpen, Heart, Star, CheckCircle, Loader2, Sparkles, GraduationCap, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrientationPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    bacSeries: '',
    favorites: [] as string[],
    hobbies: '',
    dream: '',
    location: ''
  });

  const handleNext = () => setStep(step + 1);

  const toggleFavorite = (subject: string) => {
    if (formData.favorites.includes(subject)) {
      setFormData({ ...formData, favorites: formData.favorites.filter(s => s !== subject) });
    } else {
      if (formData.favorites.length < 3) {
        setFormData({ ...formData, favorites: [...formData.favorites, subject] });
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const analysis = await analyzeOrientationProfile(formData);
      setResult(analysis);
      setStep(5); // Result step
    } catch (e) {
      alert("Erreur lors de l'analyse. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEPS COMPONENTS
  const renderStep = () => {
    switch(step) {
      case 0: // BAC / SÉRIE
        return (
          <div className="animate-fade-in max-w-2xl mx-auto">
             <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Quel est ton profil scolaire ?</h2>
             <div className="grid grid-cols-1 gap-4">
                {['Bac Général (Spécialités)', 'Bac Technologique (STMG, STI2D...)', 'Bac Pro', 'Études Supérieures (Réorientation)'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFormData({...formData, bacSeries: opt}); handleNext(); }}
                    className="p-6 text-left rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group shadow-sm hover:shadow-md"
                  >
                    <span className="font-bold text-lg text-slate-700 group-hover:text-emerald-700">{opt}</span>
                  </button>
                ))}
             </div>
          </div>
        );

      case 1: // MATIÈRES
        const subjects = ['Maths', 'Physique/Chimie', 'SVT/Bio', 'Français/Philo', 'Langues', 'Histoire-Géo', 'SES/Éco', 'Informatique', 'Arts', 'Sport'];
        return (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Tes matières préférées ?</h2>
            <p className="text-slate-500 mb-8 text-lg">Sélectionnes-en jusqu'à 3.</p>
            <div className="flex flex-wrap gap-4 mb-10">
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => toggleFavorite(sub)}
                  className={`px-6 py-3 rounded-full text-base font-bold transition-all ${
                    formData.favorites.includes(sub) 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            <button onClick={handleNext} disabled={formData.favorites.length === 0} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl disabled:opacity-50 text-lg">
              Suivant
            </button>
          </div>
        );

      case 2: // HOBBIES
        return (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Qu'aimes-tu faire en dehors ?</h2>
            <textarea 
              className="w-full p-6 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none min-h-[180px] text-lg leading-relaxed"
              placeholder="Ex: Jeux vidéo, Dessin, aider les autres, réparer des trucs, coder, lire..."
              value={formData.hobbies}
              onChange={e => setFormData({...formData, hobbies: e.target.value})}
            />
            <button onClick={handleNext} disabled={!formData.hobbies} className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-xl disabled:opacity-50 text-lg">
              Suivant
            </button>
          </div>
        );

      case 3: // ZONE GÉO
        return (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Où souhaites-tu étudier ?</h2>
            <div className="grid grid-cols-1 gap-5">
              {[
                { label: 'En France / Europe', icon: '🇪🇺' },
                { label: 'Au Sénégal / Afrique de l\'Ouest', icon: '🌍' },
                { label: 'Au Maroc / Maghreb', icon: '🇲🇦' },
                { label: 'Au Canada / Amérique du Nord', icon: '🇨🇦' },
                { label: 'Peu importe, je veux la meilleure formation', icon: '✈️' }
              ].map(opt => (
                <button 
                  key={opt.label}
                  onClick={() => { setFormData({...formData, location: opt.label}); handleNext(); }}
                  className="p-6 flex items-center gap-6 text-left rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <span className="font-bold text-xl text-slate-700 group-hover:text-emerald-800">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

       case 4: // RÊVE (Final)
        return (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Ton job de rêve (même vague) ?</h2>
            <p className="text-slate-500 mb-8 text-lg">Ou ce qui te motive dans la vie (ex: Gagner de l'argent, Être utile, Créer...).</p>
            <textarea 
              className="w-full p-6 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none min-h-[180px] text-lg leading-relaxed"
              placeholder="Je veux être mon propre patron, ou travailler dans la santé..."
              value={formData.dream}
              onChange={e => setFormData({...formData, dream: e.target.value})}
            />
            <button 
              onClick={handleSubmit} 
              disabled={!formData.dream || isLoading} 
              className="w-full mt-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-70 flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-200 text-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Révéler mon avenir
            </button>
          </div>
        );
      
      case 5: // RÉSULTAT - FULL WIDTH DESIGN
        if (!result) return null;
        return (
          <div className="animate-fade-in w-full">
             
             {/* Archetype Header */}
             <div className="text-center mb-16 max-w-4xl mx-auto">
                <div className="inline-block px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                  Analyse de ton profil
                </div>
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                  {result.archetype}
                </h2>
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 relative">
                   <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-medium">
                     {result.analysis}
                   </p>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <Star size={24} fill="white" />
                   </div>
                </div>
             </div>

             {/* Recommendations Cards - Spaced Out */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                {result.recommendations.map((rec: any, idx: number) => (
                   <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-100 transition-all group relative flex flex-col h-full">
                      
                      {/* Top Gradient Bar */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                      
                      {/* Header */}
                      <div className="mb-6">
                         <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-900 font-serif font-bold text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                            {idx + 1}
                         </div>
                         <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">
                           {rec.title}
                         </h3>
                         <p className="text-base text-slate-600 leading-7 mb-6">
                           {rec.description}
                         </p>
                      </div>
                      
                      {/* Divider */}
                      <div className="mt-auto pt-6 border-t border-slate-100 space-y-6">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                               <GraduationCap size={20} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Écoles / Formations</p>
                               <p className="text-sm font-medium text-slate-800 leading-relaxed">{rec.schools}</p>
                            </div>
                         </div>

                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                               <Briefcase size={20} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Métiers cibles</p>
                               <p className="text-sm font-medium text-slate-800 leading-relaxed">{rec.jobs}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>

             {/* Call to Action Footer */}
             <div className="bg-emerald-950 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-3xl mx-auto">
                   <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ton avenir commence maintenant.</h3>
                   <p className="text-emerald-100 text-lg md:text-xl mb-10 leading-relaxed">
                      Une fois ta filière choisie, MémoirePro t'accompagnera de ta première année jusqu'au diplôme final pour t'assurer l'excellence académique.
                   </p>
                   <Link to="/signup" className="inline-block px-10 py-5 bg-white text-emerald-900 font-bold rounded-full transition-all hover:bg-emerald-50 shadow-lg transform hover:-translate-y-1 text-lg">
                      Créer mon compte étudiant gratuit
                   </Link>
                </div>
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
             </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Simple */}
      <div className="bg-white border-b border-slate-200 py-5 px-6 sticky top-0 z-50">
         <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 font-serif font-bold text-slate-900">
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                  <Compass size={22} />
               </div>
               <span className="text-xl">Orientation IA</span>
            </Link>
            {step < 5 && (
               <div className="text-sm font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
                  Étape {step + 1} / 5
               </div>
            )}
         </div>
      </div>

      {/* Main Container with Dynamic Width */}
      <div className={`mx-auto px-6 py-12 md:py-20 transition-all duration-500 ${step === 5 ? 'max-w-7xl' : 'max-w-3xl'}`}>
         {renderStep()}
      </div>
    </div>
  );
};