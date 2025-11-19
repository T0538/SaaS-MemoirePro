
import React, { useState, useEffect, useRef } from 'react';
import { JuryPersona, JuryMessage, Domain } from '../types';
import { interactWithJury } from '../services/geminiService';
import { User, MessageSquare, Send, ShieldAlert, Mic, Award, ArrowLeft, BarChart3 } from 'lucide-react';
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
  }, [messages]);

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
          content: `Bonjour. Nous sommes réunis pour votre soutenance sur "${topic}". Je suis ${selectedPersona.name}, ${selectedPersona.role}. Vous pouvez commencer par vous présenter brièvement.`
        }
      ]);
      setIsLoading(false);
    }, 1000);
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
    <div className="h-[100dvh] bg-slate-50 flex flex-col overflow-hidden">
      
      {/* Header Simple */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 flex items-center justify-between shrink-0">
        <Link to="/app" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm">
          <ArrowLeft size={18} />
          <span className="hidden md:inline">Retour à l'éditeur</span>
        </Link>
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg">
             <Award size={18} />
          </div>
          <span className="text-sm md:text-base">Grand Oral Simulator</span>
        </div>
        <div className="w-10 md:w-24"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        
        {step === 'setup' ? (
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 max-w-2xl w-full animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2 text-center">Configurez votre Jury</h1>
              <p className="text-slate-500 text-center mb-8 text-sm md:text-base">Choisissez qui va vous interroger aujourd'hui.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sujet de soutenance</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Ex: L'impact de l'IA sur le management..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Choisissez votre juré</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {JURY_PERSONAS.map(persona => (
                      <button
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona)}
                        className={`p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden ${selectedPersona.id === persona.id ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className="mb-3 relative flex md:block justify-center">
                          <img 
                            src={persona.avatar} 
                            alt={persona.name} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 md:right-auto md:left-10 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm shadow-sm border border-slate-100">
                            {persona.tone === 'Strict' ? '🎓' : persona.tone === 'Technique' ? '💼' : '🤔'}
                          </div>
                        </div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors text-center md:text-left">{persona.name}</div>
                        <div className="text-xs text-slate-500 mb-2 font-medium text-center md:text-left">{persona.role}</div>
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-3 text-center md:text-left hidden md:block">{persona.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleStart}
                  disabled={!topic}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Entrer dans l'arène <ShieldAlert size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-6 p-0 md:p-6 h-full overflow-hidden">
            
            {/* Chat Area */}
            <div className="flex-1 bg-white md:rounded-2xl shadow-none md:shadow-lg border-t md:border border-slate-200 flex flex-col overflow-hidden h-full">
              
              {/* Mobile Compact Header Score */}
              <div className="md:hidden bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs font-medium">
                 <span>Jury: {selectedPersona.name}</span>
                 <span className={`${currentScore < 50 ? 'text-red-400' : 'text-emerald-400'}`}>Score: {currentScore}%</span>
              </div>

              {/* Top Bar Persona (Desktop) */}
              <div className="hidden md:flex p-4 border-b border-slate-100 bg-slate-50 items-center gap-4">
                <img 
                  src={selectedPersona.avatar} 
                  alt={selectedPersona.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                />
                <div>
                  <h3 className="font-bold text-slate-900">{selectedPersona.name}</h3>
                  <p className="text-xs text-slate-500">{selectedPersona.role} • <span className="text-amber-600">{selectedPersona.tone}</span></p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#FDFDFD]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm flex gap-3 ${
                      msg.sender === 'user' 
                        ? 'bg-slate-900 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                    }`}>
                      {msg.sender === 'jury' && (
                         <img 
                           src={selectedPersona.avatar} 
                           className="w-8 h-8 rounded-full object-cover border border-slate-100 hidden sm:block" 
                           alt="Jury"
                         />
                      )}
                      <div>
                        {msg.content}
                        {msg.critique && (
                          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 italic flex items-start gap-2">
                             <MessageSquare size={12} className="mt-0.5" />
                             Feedback: "{msg.critique}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex justify-start">
                     <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                        <img src={selectedPersona.avatar} className="w-6 h-6 rounded-full object-cover" alt="Thinking" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex gap-3 shrink-0">
                <input 
                  type="text"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm md:text-base"
                  placeholder="Votre réponse..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  autoFocus
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !currentInput.trim()}
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

            {/* Sidebar Stats (Desktop Only) */}
            <div className="hidden md:flex w-72 flex-col gap-4">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart3 size={14} />
                    Score de Conviction
                  </h3>
                  
                  <div className="relative w-32 h-32 mx-auto mb-4">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                        <circle 
                          cx="64" cy="64" r="60" 
                          stroke={currentScore > 70 ? '#10B981' : currentScore > 40 ? '#F59E0B' : '#EF4444'} 
                          strokeWidth="8" 
                          fill="none" 
                          strokeDasharray={377} 
                          strokeDashoffset={377 - (377 * currentScore) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-slate-900">{currentScore}%</span>
                     </div>
                  </div>
                  <p className="text-center text-xs text-slate-500">
                    {currentScore > 70 ? "Le jury est convaincu." : currentScore > 40 ? "Le jury est sceptique." : "Attention, vous perdez le jury."}
                  </p>
               </div>

               <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex-1 relative overflow-hidden min-h-[200px]">
                  <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                    <Award size={100} />
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-4">Conseils Pro</h3>
                  <ul className="space-y-4 text-sm text-indigo-200">
                    <li className="flex gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                      Faites des phrases courtes.
                    </li>
                    <li className="flex gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                      Ne lisez pas vos notes.
                    </li>
                    <li className="flex gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                      Avouez si vous ne savez pas, plutôt que d'inventer.
                    </li>
                  </ul>
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};
