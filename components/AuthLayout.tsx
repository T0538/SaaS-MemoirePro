
import React from 'react';
import { GraduationCap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop" 
}) => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative z-10">
        <div className="absolute top-8 left-8 lg:left-24">
          <Link to="/" className="flex items-center gap-2 text-slate-900 group">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg group-hover:bg-emerald-600 transition-colors">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-serif font-bold tracking-tight">MémoirePro</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96 animate-fade-in">
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>

          {children}
        </div>
        
        <div className="absolute bottom-6 left-0 w-full text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} MémoirePro AI. Tous droits réservés.
        </div>
      </div>

      {/* Right Side - Image & Testimonial */}
      <div className="hidden lg:block relative flex-1 w-0 overflow-hidden bg-slate-900">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
          src={image}
          alt="Étudiants travaillant"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-emerald-900/40"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-20 text-white z-20">
          <div className="mb-6 text-emerald-400 flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
            <CheckCircle size={16} />
            Validé par 5000+ étudiants
          </div>
          <blockquote className="font-serif text-3xl leading-normal mb-6">
            "Je ne savais pas par où commencer mon mémoire de Master. En 2 heures avec MémoirePro, j'avais un plan validé et mes 10 premières pages."
          </blockquote>
          <div className="flex items-center gap-4">
            <img 
              src="https://randomuser.me/api/portraits/women/44.jpg" 
              alt="User" 
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div>
              <div className="font-bold text-white">Clara M.</div>
              <div className="text-emerald-200 text-sm">Master 2 Droit des Affaires, Sorbonne</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
