import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Image as ImageIcon, Mic, Bot } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      tekst: 'Hei! Jeg er din AI-assistent. Trenger du hjelp med å formulere oppdraget, finne riktig prisklasse, eller har du spørsmål om tjenesten?',
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

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mock response after 1s
    setTimeout(() => {
      let aiResponseText = 'Det skal jeg hjelpe deg med! Jeg ser på ledige oppdrag og tjenester som kan passe for deg nå. Er det en spesiell kategori du ser etter?';
      
      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes('hage') || lowerText.includes('klipp')) {
        aiResponseText = 'Herlig! Hagearbeid er superpopulært her. Du kan legge ut oppdraget ditt direkte med et estimert budsjett, eller se ledige hagehjelpere i nærheten på et blunk!';
      } else if (lowerText.includes('flytt') || lowerText.includes('bære')) {
        aiResponseText = 'Flyttehjelp kan vi ordne! For et standard flytteoppdrag over 2-3 timer er en timepris på 200-300 kr eller en fastpris på 1000-1500 kr en kjempefin retningslinje.';
      } else if (lowerText.includes('vask') || lowerText.includes('rengjør')) {
        aiResponseText = 'Skjønner, rengjøring er veldig etterspurt. Du kan enkelt filtrere på "Vasking" i katalogen vår, eller be meg hjelpe deg å generere en perfekt stillingsbeskrivelse.';
      } else if (lowerText.includes('hjelp') && lowerText.includes('beskrivelse')) {
        aiResponseText = 'Selvfølgelig! Fortell meg kort hva du trenger: f.eks. "klippe gress" eller "montere skap", så skal jeg generere en proff og fristende tittel og beskrivelse for deg.';
      } else if (lowerText.includes('pris') || lowerText.includes('koster')) {
        aiResponseText = 'Prisene varierer, men typiske småjobber som hagearbeid og vasking ligger på rundt 200–400 kr per time eller en fastsatt sum (f.eks. 800 kr for gressklipp).';
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        tekst: aiResponseText,
        tid: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
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
                onClick={() => handleSuggestionClick('Formuler en oppdragsbeskrivelse')}
                className="text-xs font-medium py-1.5 px-3 bg-gray-100 hover:bg-[#005cbd]/5 hover:text-[#005cbd] rounded-full text-gray-600 transition-colors shrink-0"
              >
                Hjelp meg med beskrivelsen
              </button>
              <button 
                onClick={() => handleSuggestionClick('Hva koster hagearbeid pr time?')}
                className="text-xs font-medium py-1.5 px-3 bg-gray-100 hover:bg-[#005cbd]/5 hover:text-[#005cbd] rounded-full text-gray-600 transition-colors shrink-0"
              >
                Hva koster hagearbeid?
              </button>
              <button 
                onClick={() => handleSuggestionClick('Slik sikrer dere trygg betaling')}
                className="text-xs font-medium py-1.5 px-3 bg-gray-100 hover:bg-[#005cbd]/5 hover:text-[#005cbd] rounded-full text-gray-600 transition-colors shrink-0"
              >
                Hvordan betaler jeg?
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
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#005cbd] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative overflow-visible"
        aria-label="AI-hjelper"
      >
        <MessageSquare size={24} className="group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
          1
        </span>
      </button>
    </div>
  );
}
