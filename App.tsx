import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Domain, ThesisProject, WizardStep, Chapter } from './types';
import { SetupStep } from './components/SetupStep';
import { OutlineReview } from './components/OutlineReview';
import { DraftingBoard } from './components/DraftingBoard';
import { generateThesisOutline, parseImportedOutline } from './services/geminiService';
import { LandingPage } from './pages/LandingPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { JurySimulatorPage } from './pages/JurySimulatorPage';
import { OrientationPage } from './pages/OrientationPage';
import { JobsPage } from './pages/JobsPage';
import { CoachingPage } from './pages/CoachingPage';
import { DestinationPage } from './pages/DestinationPage';
import { FilierePage } from './pages/FilierePage';
import { TopicIdeasPage } from './pages/TopicIdeasPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GraduationCap } from 'lucide-react';

// Composant Layout pour les pages marketing
const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Protection de route (Auth uniquement)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = localStorage.getItem('memoirepro_user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Protection de route (Premium uniquement)
const PremiumRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = localStorage.getItem('memoirepro_user');
  const license = localStorage.getItem('memoirepro_license');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (license !== 'premium') {
      return <Navigate to="/pricing" replace />;
  }
  
  return <>{children}</>;
};

// L'application principale (l'outil)
const ToolApp = () => {
  const [step, setStep] = useState<WizardStep>('setup');
  const [project, setProject] = useState<ThesisProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // PERSISTENCE: Charger le projet au démarrage
  useEffect(() => {
      const savedProject = localStorage.getItem('memoirepro_project');
      const savedStep = localStorage.getItem('memoirepro_step') as WizardStep;
      
      if (savedProject) {
          try {
              const parsed = JSON.parse(savedProject);
              // Restaurer les dates
              parsed.createdAt = new Date(parsed.createdAt);
              parsed.updatedAt = new Date(parsed.updatedAt);
              setProject(parsed);
              setStep(savedStep || 'drafting');
          } catch(e) {
              console.error("Error loading saved project", e);
          }
      }
  }, []);

  // PERSISTENCE: Sauvegarder à chaque changement
  useEffect(() => {
      if (project) {
          localStorage.setItem('memoirepro_project', JSON.stringify(project));
          localStorage.setItem('memoirepro_step', step);
      }
  }, [project, step]);

  // CHECK LICENCE POUR NOUVEAU PROJET
  const handleSetupComplete = async (data: { title: string; domain: Domain; context: string; importedOutline?: string }) => {
    setLoading(true);
    try {
      let chapters: Chapter[] = [];

      if (data.importedOutline) {
        // MODE IMPORT : On parse le texte fourni par l'utilisateur
        chapters = parseImportedOutline(data.importedOutline);
      } else {
        // MODE WIZARD : On génère avec l'IA
        chapters = await generateThesisOutline(data.title, data.domain, data.context);
      }
      
      const newProject: ThesisProject = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        domain: data.domain,
        context: data.context,
        chapters: chapters,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setProject(newProject);
      setStep('outline');
    } catch (error) {
      alert("Erreur lors de la génération ou de l'importation. Vérifiez vos données.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutlineConfirmed = (finalChapters: Chapter[]) => {
    if (project) {
      setProject({ ...project, chapters: finalChapters });
      setStep('drafting');
    }
  };

  const handleResetProject = () => {
      // Check credits for a NEW project if one already exists
      const credits = parseInt(localStorage.getItem('memoirepro_credits') || '0');
      
      if (project && credits <= 0) {
          if(confirm("Attention : Vous avez déjà un mémoire en cours. Pour en créer un second (nouveau sujet), vous devez acquérir une nouvelle licence (3$). Aller au paiement ?")) {
              window.location.href = '/#/pricing';
          }
          return;
      }

      if(confirm("Attention : Cela va effacer votre mémoire actuel pour en commencer un nouveau. Voulez-vous continuer ?")) {
          setProject(null);
          setStep('setup');
          localStorage.removeItem('memoirepro_project');
          localStorage.removeItem('memoirepro_step');
          // Consume credit
          if (credits > 0) {
              localStorage.setItem('memoirepro_credits', (credits - 1).toString());
          }
      }
  }

  // Si on est en mode rédaction, on affiche l'éditeur plein écran sans layout marketing
  if (step === 'drafting' && project) {
      return <DraftingBoard project={project} onUpdateProject={(p) => setProject(p)} />;
  }

  // Sinon, on affiche le wizard avec un header minimaliste
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <nav className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-900 cursor-pointer select-none" onClick={() => {
                const newCount = clickCount + 1;
                setClickCount(newCount);
                if (newCount >= 7) {
                    localStorage.setItem('memoirepro_license', 'premium');
                    alert("⚡ GOD MODE ACTIVATED ⚡\nPremium Unlocked.");
                    setClickCount(0);
                    window.location.reload();
                }
            }}>
              <div className="bg-blue-900 text-white p-2 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <span className="text-xl font-serif font-bold tracking-tight block leading-none">Nexia</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Espace Étudiant</span>
              </div>
            </div>
            <div className="flex gap-4">
                {project && (
                    <button onClick={handleResetProject} className="text-sm font-medium text-red-500 hover:text-red-700 transition">
                        Nouveau Projet
                    </button>
                )}
                <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">
                Quitter
                </Link>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col justify-center py-12">
            {step === 'setup' && (
                <div className="max-w-6xl mx-auto px-6 w-full">
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
                            Nouveau Projet
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Configurez les paramètres de votre mémoire pour initialiser l'IA.
                        </p>
                    </div>
                    <SetupStep onComplete={handleSetupComplete} isLoading={loading} />
                </div>
            )}

            {step === 'outline' && project && (
                <div className="max-w-5xl mx-auto px-6 w-full">
                    <OutlineReview 
                        chapters={project.chapters} 
                        onConfirm={handleOutlineConfirmed}
                        onRegenerate={() => {
                            // Si on régénère, on relance la génération IA standard
                            handleSetupComplete({ 
                                title: project.title, 
                                domain: project.domain, 
                                context: project.context 
                            })
                        }}
                    />
                </div>
            )}
        </div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MarketingLayout><LandingPage /></MarketingLayout>} />
        <Route path="/resources" element={<MarketingLayout><ResourcesPage /></MarketingLayout>} />
        <Route path="/blog/:slug" element={<MarketingLayout><BlogPostPage /></MarketingLayout>} />
        <Route path="/pricing" element={<MarketingLayout><PricingPage /></MarketingLayout>} />
        <Route path="/contact" element={<MarketingLayout><ContactPage /></MarketingLayout>} />
        <Route path="/checkout" element={<MarketingLayout><CheckoutPage /></MarketingLayout>} />
        <Route path="/success" element={<MarketingLayout><SuccessPage /></MarketingLayout>} />
        
        {/* Authentication Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Public Feature Routes */}
        <Route path="/orientation" element={<MarketingLayout><OrientationPage /></MarketingLayout>} />
        <Route path="/jobs" element={<MarketingLayout><JobsPage /></MarketingLayout>} />
        <Route path="/coaching" element={<MarketingLayout><CoachingPage /></MarketingLayout>} />
            <Route path="/topic-ideas" element={<TopicIdeasPage />} />
            <Route path="/destinations/:slug" element={<MarketingLayout><DestinationPage /></MarketingLayout>} />
        <Route path="/filieres/:slug" element={<MarketingLayout><FilierePage /></MarketingLayout>} />

        {/* Protected App Routes */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <ToolApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/jury" 
          element={
            <PremiumRoute>
              <JurySimulatorPage />
            </PremiumRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;