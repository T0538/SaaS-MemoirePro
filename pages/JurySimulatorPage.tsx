
import React, { useState, useEffect, useRef } from 'react';
import { JuryPersona, JuryMessage, Domain } from '../types';
import { interactWithJury } from '../services/geminiService';
import { User, MessageSquare, Send, ShieldAlert, Mic, Award, ArrowLeft, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

// PERSONAS PRÉDÉFINIS
const JURY_PERSONAS: JuryPersona[] = [
  {
    id: '1',
    name: 'Dr. Martin',
    role: 'Directeur de Recherche',
    description: 'Académique pur. Il chasse les imprécisions théoriques et les fautes de méthodologie.',
    tone: 'Strict',
    avatar: '👨‍🏫'
  },
  {
    id: '2',
    name: 'Mme. Lefebvre',
    role: 'Experte Terrain',
    description: 'Professionnelle du secteur. Elle se fiche de la théorie, elle veut du concret et du ROI.',
    tone: 'Technique',
    avatar: '👩‍💼'
  },
  {
    id: '3',
    name: 'M. Dubois',
    role: 'Le Candide',
    description: 'Il pose des questions "bêtes" qui sont souvent les plus pièges. Teste votre clarté.',
    tone: 'Bienveillant',
    avatar: '👴'
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Header Simple */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <Link to="/app" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium">
          <ArrowLeft size={20} />
          Retour à l'éditeur
        </Link>
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
             <Award size={20} />
          </div>
          <span>Grand Oral Simulator</span>
        </div>
        <div className="w-24"></div> {/* Spacer */}
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 flex flex-col">
        
        {step === 'setup' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 max-w-2xl w-full animate-fade-in">
              <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2 text-center">Configurez votre Jury</h1>
              <p className="text-slate-500 text-center mb-8">Choisissez qui va vous interroger aujourd'hui.</p>

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
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPersona.id === persona.id ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className="text-3xl mb-2">{persona.avatar}</div>
                        <div className="font-bold text-slate-900 text-sm">{persona.name}</div>
                        <div className="text-xs text-slate-500 mb-2">{persona.role}</div>
                        <p className="text-[10px] text-slate-400 leading-tight">{persona.description}</p>
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
          <div className="flex-1 flex gap-6 h-[calc(100vh-140px)]">
            
            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
              {/* Top Bar Persona */}
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-slate-200">
                  {selectedPersona.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedPersona.name}</h3>
                  <p className="text-xs text-slate-500">{selectedPersona.role} • <span className="text-amber-600">{selectedPersona.tone}</span></p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDFDFD]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-slate-900 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                    }`}>
                      {msg.content}
                      {msg.critique && (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 italic flex items-start gap-2">
                           <MessageSquare size={12} className="mt-0.5" />
                           Feedback interne: "{msg.critique}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex justify-start">
                     <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
                <input 
                  type="text"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
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
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="w-72 hidden md:flex flex-col gap-4">
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

               <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg flex-1 relative overflow-hidden">
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
