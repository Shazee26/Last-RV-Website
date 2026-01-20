
import React, { useState, useRef, useEffect } from 'react';
import { getAIConciergeResponse } from '../services/gemini';

const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Howdy! Welcome to Mountain View. I\'m your Van Horn AI Concierge. Ask me about local attractions, the best time to arrive, or park amenities!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getAIConciergeResponse(userMsg);
      const textResponse = typeof botResponse === 'string' ? botResponse : String(botResponse);
      setMessages(prev => [...prev, { role: 'bot', text: textResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having a bit of trouble connecting to the desert air. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end">
      {isOpen && (
        <div className="glass w-80 sm:w-[420px] h-[650px] mb-6 rounded-[3rem] shadow-2xl border-white/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
          <div className="vibrant-gradient p-10 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <i className="fa-solid fa-hat-cowboy text-9xl rotate-12"></i>
            </div>
            <div className="flex items-center space-x-6 relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-3xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                <i className="fa-solid fa-hat-cowboy text-2xl"></i>
              </div>
              <div>
                <span className="font-black text-lg tracking-tight block">Frontier AI</span>
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
                   <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Active & Ready</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close Chat" className="relative z-10 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 transition-all flex items-center justify-center">
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 bg-stone-50/50 dark:bg-brand-dark/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-6 rounded-[2.5rem] text-sm leading-relaxed font-medium transition-all duration-300 ${
                  m.role === 'user' 
                    ? 'vibrant-gradient text-white rounded-br-none shadow-vibrant' 
                    : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 shadow-soft border border-stone-100 dark:border-white/5 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] rounded-bl-none border border-stone-100 dark:border-white/5 shadow-soft">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-3xl border-t border-stone-100 dark:border-white/5 flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the frontier..."
              className="flex-grow bg-stone-100 dark:bg-white/5 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none dark:text-white"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-16 h-16 rounded-2xl vibrant-gradient text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-vibrant disabled:opacity-30 flex-shrink-0"
            >
              <i className="fa-solid fa-paper-plane text-xl"></i>
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-[2.5rem] vibrant-gradient text-white flex items-center justify-center shadow-vibrant hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-brand-dark"
      >
        <i className={`fa-solid ${isOpen ? 'fa-comments' : 'fa-hat-cowboy'} text-3xl`}></i>
      </button>
    </div>
  );
};

export default AIConcierge;
