import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Image as ImageIcon, Mic, Bot } from 'lucide-react';
import { ChatMessage, Bruker } from '../types';

interface AIChatWidgetProps {
  currentUser: Bruker | null;
  onReloadOppdrag: () => void;
}

export default function AIChatWidget({ currentUser, onReloadOppdrag }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      tekst: 'Hei! Jeg er din AI-assistent. Trenger du hjelp med å formulere oppdraget, finne riktig prisklasse, eller leter du etter oppdrag eller hjelpere?',
      tid: '17:15'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      tekst: textToSend,
      tid: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
    };

    // Update message state locally first
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    // Call real backend endpoint instead of mock rules
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        melding: textToSend,
        historikk: messages
      })
    })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          tekst: data.response,
          tid: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        onReloadOppdrag(); // Trigger list refresh in case the AI added a job
      } else {
        const errData = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          tekst: `Beklager, jeg fikk en feil: ${errData.error || 'Kunne ikke fullføre forespørselen.'}`,
          tid: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    })
    .catch((err) => {
      console.error('AI request failed:', err);
      const aiMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        tekst: 'Beklager, klarte ikke å koble til serveren. Sjekk internettforbindelsen din.',
        tid: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    })
    .finally(() => {
      setIsTyping(false);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="w-[360px] md:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-[#005cbd] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight font-display">AI Supporter</h4>
                  <span className="text-[10px] text-[#secondary-container] flex items-center gap-1.5 opacity-90 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Aktiv nå
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            {!currentUser ? (
              // Unauthenticated state: display Vipps login prompt
              <div className="flex-grow flex flex-col items-center justify-center p-6 text-center bg-gray-50">
                <div className="w-16 h-16 bg-[#ff5b24]/10 text-[#ff5b24] text-3xl font-bold rounded-full flex items-center justify-center mb-4">
                  v
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1.5 font-display">Logg inn for å prate med AI</h4>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  For å få fullt utbytte av AI-assistenten (søk i databasen og publisering av oppdrag), må du logge inn med din Vipps-profil.
                </p>
                <button
                  onClick={() => { window.location.href = '/api/auth/vipps'; }}
                  className="bg-[#ff5b24] text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-[#e04e1b] transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Logg inn med Vipps
                </button>
              </div>
            ) : (
              // Authenticated state: display chat messenger
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto justify-end' : ''}`}
                    >
                      {m.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-[#005cbd]/10 flex items-center justify-center text-[#005cbd] shrink-0 self-start mt-1">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className={`p-3 rounded-2xl shadow-xs text-sm ${
                        m.sender === 'user' 
                          ? 'bg-[#005cbd] text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-line leading-relaxed">{m.tekst}</p>
                        <span className={`text-[10px] block mt-1 text-right ${
                          m.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                        }`}>
                          {m.tid}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2.5 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-[#005cbd]/10 flex items-center justify-center text-[#005cbd] shrink-0 self-start">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-xs">
                        <div className="flex gap-1 py-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                <div className="p-3 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => handleSuggestionClick('Hjelp meg å definere et gressklipping oppdrag')}
                    className="text-xs font-medium py-1.5 px-3 bg-gray-100 hover:bg-[#005cbd]/5 hover:text-[#005cbd] rounded-full text-gray-600 transition-colors shrink-0"
                  >
                    Hjelp meg med beskrivelsen
                  </button>
                  <button 
                    onClick={() => handleSuggestionClick('Finn ledige hagearbeid oppdrag')}
                    className="text-xs font-medium py-1.5 px-3 bg-gray-100 hover:bg-[#005cbd]/5 hover:text-[#005cbd] rounded-full text-gray-600 transition-colors shrink-0"
                  >
                    Finn hageoppdrag
                  </button>
                  <button 
                    onClick={() => handleSuggestionClick('Vis meg ledige hjelpere')}
                    className="text-xs font-medium py-1.5 px-3 bg-gray-100 hover:bg-[#005cbd]/5 hover:text-[#005cbd] rounded-full text-gray-600 transition-colors shrink-0"
                  >
                    Hvem kan hjelpe meg?
                  </button>
                </div>

                {/* Input area */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="relative flex items-end gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-[#005cbd]/20 focus-within:border-[#005cbd] transition-all">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Beskriv jobben du leter etter, eller still et spørsmål..." 
                      className="flex-grow bg-transparent border-none text-sm placeholder-gray-400 outline-none resize-none h-[24px] max-h-[80px] py-0.5 font-sans leading-relaxed focus:ring-0"
                      rows={1}
                    />
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="text-gray-400 hover:text-[#005cbd] p-1.5 rounded-full hover:bg-white transition-colors" title="Last opp bilde">
                        <ImageIcon size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-[#005cbd] p-1.5 rounded-full hover:bg-white transition-colors" title="Bruk stemmesøk">
                        <Mic size={16} />
                      </button>
                      <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputText.trim()}
                        className={`p-1.5 rounded-xl flex items-center justify-center transition-all ${
                          inputText.trim() 
                            ? 'bg-[#005cbd] text-white hover:opacity-90 active:scale-95' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#005cbd] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative overflow-visible"
        aria-label="AI-hjelper"
      >
        <Bot size={24} className="group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
          1
        </span>
      </button>
    </div>
  );
}
