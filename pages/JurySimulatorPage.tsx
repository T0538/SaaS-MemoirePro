import React, { useState, useEffect, useRef } from 'react';
import { JuryPersona, JuryMessage, Domain } from '../types';
import { interactWithJury } from '../services/geminiService';
import { User, MessageSquare, Send, ShieldAlert, Mic, Award, ArrowLeft, BarChart3, CheckCircle2, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

// PERSONAS PRÉDÉFINIS AVEC PHOTOS RÉALISTES
const JURY_PERSONAS: JuryPersona[] = [
  {
    id: '1',
    name: 'Pr. Beatrice Kotto',
    role: 'Directrice de Recherche',
    description: 'Académique pure et dure. Elle traque les faiblesses bibliographiques et le manque de rigueur scientifique.',
    tone: 'Strict',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: 'M. Thomas Veran',
    role: 'Directeur Industriel',
    description: 'Pragmatique orienté résultat. Il se fiche de la théorie, il veut savoir si votre solution est rentable et applicable demain.',
    tone: 'Technique',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    name: 'Sarah Lin',
    role: 'Consultante Externe',
    description: 'Pose des questions faussement naïves pour tester votre capacité à vulgariser et à défendre vos choix.',
    tone: 'Bienveillant',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
  }
];

export const JurySimulatorPage: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'simulation'>('setup');
  const [topic, setTopic] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<JuryPersona>(JURY_PERSONAS[0]);
  const [messages, setMessages] = useState<JuryMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(100); // Confiance initiale
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleStart = async () => {
    if (!topic) return;
    setStep('simulation');
    setIsLoading(true);
    
    // Premier message du Jury pour lancer la session
    setTimeout(() => {
      setMessages([
        {
          id: 'init',
          sender: 'jury',
          content: `Bonjour. Ravie de vous entendre aujourd'hui sur le sujet : "${topic}". Je suis ${selectedPersona.name}. Présentez-vous et exposez votre problématique, je vous écoute.`
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMsg: JuryMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: currentInput
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const response = await interactWithJury(newHistory, selectedPersona, topic);
      
      const juryMsg: JuryMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'jury',
        content: response.content,
        score: response.score,
        critique: response.critique
      };

      setMessages([...newHistory, juryMsg]);
      if (response.score) setCurrentScore(response.score);
    } catch (error) {
      alert("Erreur de communication avec le jury.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">
      
      {/* Header Minimaliste */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 flex items-center justify-between shrink-0 z-20">
        <Link to="/app" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
             <ArrowLeft size={16} />
          </div>
          <span className="hidden md:inline">Quitter la simulation</span>
        </Link>
        
        <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Entraînement</span>
            <h1 className="font-serif font-bold text-slate-900 text-sm md:text-base">Grand Oral Simulator</h1>
        </div>

        <div className="w-10 md:w-24 flex justify-end">
             {step === 'simulation' && (
                 <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-slate-600" title="Recommencer">
                     <RefreshCcw size={18} />
                 </button>
             )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col relative">
        
        {step === 'setup' ? (
          // FIX MOBILE: Utilisation de overflow-y-auto et min-h-full pour permettre le scroll si le clavier cache l'input
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-start md:justify-center min-h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-slate-100">
            <div className="w-full max-w-4xl mx-auto animate-fade-in py-10 md:py-0">
              
              <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Configurez votre Jury</h2>
                  <p className="text-slate-600 text-sm md:text-lg max-w-2xl mx-auto">L'IA va incarner un profil spécifique pour tester votre repartie. Choisissez votre opposant.</p>
              </div>

              <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 md:p-12 relative overflow-hidden mb-20 md:mb-0">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                <div className="space-y-8 md:space-y-10">
                  {/* Sujet */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">1</span>
                        Quel est votre sujet de mémoire ?
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 md:px-6 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-base md:text-lg shadow-inner placeholder-slate-400 transition-all"
                      placeholder="Ex: L'impact de l'IA sur le management..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  {/* Personas */}
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">2</span>
                        Qui vous interroge ?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {JURY_PERSONAS.map(persona => (
                        <button
                          key={persona.id}
                          onClick={() => setSelectedPersona(persona)}
                          className={`relative p-4 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 group hover:shadow-lg ${selectedPersona.id === persona.id ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                        >
                          {selectedPersona.id === persona.id && (
                              <div className="absolute top-4 right-4 text-emerald-600">
                                  <CheckCircle2 size={20} fill="#ecfdf5" />
                              </div>
                          )}
                          
                          <div className="mb-3 md:mb-4 relative inline-block">
                            <img 
                              src={persona.avatar} 
                              alt={persona.name} 
                              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-md transition-transform duration-500 ${selectedPersona.id === persona.id ? 'scale-105 ring-4 ring-white' : 'grayscale-[30%] group-hover:grayscale-0'}`}
                            />
                            <div className="absolute -bottom-2 -right-2 bg-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border border-slate-100">
                                {persona.tone}
                            </div>
                          </div>
                          
                          <div className="font-bold text-slate-900 text-base md:text-lg mb-1 group-hover:text-emerald-700 transition-colors">{persona.name}</div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2 md:mb-3">{persona.role}</div>
                          <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-3">{persona.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleStart}
                    disabled={!topic}
                    className="w-full py-4 md:py-5 bg-slate-900 text-white text-lg font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 hover:shadow-emerald-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    Entrer dans l'arène <ShieldAlert size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex h-full max-w-6xl mx-auto w-full md:px-6 md:pb-6">
            
            {/* Chat Container */}
            <div className="flex-1 flex flex-col bg-white md:rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 relative">
              
              {/* Top Bar Simulation */}
              <div className="p-4 md:p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img 
                        src={selectedPersona.avatar} 
                        alt={selectedPersona.name} 
                        className="w-10 h-10 md:w-14 md:h-14 rounded-2xl object-cover border-2 border-white shadow-md" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{selectedPersona.name}</h3>
                        <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wider">{selectedPersona.role}</p>
                    </div>
                </div>

                {/* Score Gauge (Desktop) */}
                <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Crédibilité</p>
                        <p className={`font-bold text-lg ${currentScore > 70 ? 'text-emerald-600' : currentScore > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                            {currentScore}/100
                        </p>
                    </div>
                    <div className="w-12 h-12 relative">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="#E2E8F0" strokeWidth="4" fill="none" />
                            <circle 
                              cx="24" cy="24" r="20" 
                              stroke={currentScore > 70 ? '#10B981' : currentScore > 40 ? '#F59E0B' : '#EF4444'} 
                              strokeWidth="4" 
                              fill="none" 
                              strokeDasharray={125} 
                              strokeDashoffset={125 - (125 * currentScore) / 100}
                              className="transition-all duration-1000 ease-out"
                            />
                         </svg>
                    </div>
                </div>
              </div>

              {/* Score Gauge (Mobile) */}
              <div className="md:hidden absolute top-20 right-4 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-1 rounded-full z-10">
                  <span className={`text-xs font-bold ${currentScore > 70 ? 'text-emerald-600' : 'text-amber-500'}`}>
                      Score: {currentScore}
                  </span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-[#FDFDFD]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[90%] md:max-w-[80%] flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      
                      {/* Avatar (Jury Only) */}
                      {msg.sender === 'jury' && (
                         <img 
                           src={selectedPersona.avatar} 
                           className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm mt-1 hidden sm:block" 
                           alt="Jury"
                         />
                      )}

                      <div className="flex flex-col gap-2">
                          <div className={`p-4 md:p-6 rounded-3xl text-sm md:text-base leading-relaxed shadow-sm relative ${
                            msg.sender === 'user' 
                                ? 'bg-emerald-600 text-white rounded-tr-sm' 
                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm font-serif'
                            }`}>
                            {msg.content}
                          </div>

                          {/* Feedback Collapsible */}
                          {msg.critique && (
                            <div className="self-start ml-2 bg-amber-50 border border-amber-100 text-amber-800 text-xs px-3 py-2 rounded-lg flex items-start gap-2 max-w-md opacity-80 hover:opacity-100 transition-opacity">
                                <MessageSquare size={14} className="mt-0.5 shrink-0" />
                                <span><strong className="uppercase text-[10px] tracking-wide block text-amber-600/70 mb-0.5">Feedback Coach</strong> {msg.critique}</span>
                            </div>
                          )}
                      </div>

                    </div>
                  </div>
                ))}
                
                {isLoading && (
                   <div className="flex justify-start pl-14">
                     <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm w-fit">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area Floating */}
              <div className="p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent sticky bottom-0">
                <div className="relative max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex items-center gap-2">
                    <div className="p-2 text-slate-400">
                        <Mic size={20} className="hover:text-emerald-600 cursor-pointer transition-colors" />
                    </div>
                    <input 
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 px-2 py-2"
                    placeholder="Défendez votre point de vue..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    autoFocus
                    />
                    <button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentInput.trim()}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:scale-95 transform active:scale-95 shadow-lg"
                    >
                    <Send size={18} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-3">
                    Conseil : Soyez concis et structuré. Le jury évalue votre clarté.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};