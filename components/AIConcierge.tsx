
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
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-[#0c0c0e] w-80 sm:w-[400px] h-[600px] mb-6 rounded-[2.5rem] shadow-2xl border border-stone-100 dark:border-white/5 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="vibrant-gradient p-8 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <i className="fa-solid fa-hat-cowboy text-8xl rotate-12"></i>
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <i className="fa-solid fa-hat-cowboy text-2xl"></i>
              </div>
              <div>
                <span className="font-black text-sm uppercase tracking-widest block">Van Horn Concierge</span>
                <span className="text-[10px] font-bold text-white/60">Ready to assist • 24/7</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close Chat" className="relative z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center">
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-stone-50 dark:bg-[#0a0a0c]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm leading-relaxed font-medium ${
                  m.role === 'user' 
                    ? 'vibrant-gradient text-white rounded-br-none shadow-xl shadow-emerald-500/10' 
                    : 'bg-white dark:bg-[#111114] text-stone-800 dark:text-stone-200 shadow-sm border border-stone-100 dark:border-white/5 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#111114] p-5 rounded-[1.8rem] rounded-bl-none border border-stone-100 dark:border-white/5 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-[#0c0c0e] border-t border-stone-100 dark:border-white/5 flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-grow bg-stone-100 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all outline-none dark:text-white"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-14 h-14 rounded-2xl vibrant-gradient text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-30"
            >
              <i className="fa-solid fa-paper-plane text-lg"></i>
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[2rem] vibrant-gradient text-white flex items-center justify-center shadow-2xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-stone-900"
      >
        <i className={`fa-solid ${isOpen ? 'fa-comments' : 'fa-hat-cowboy'} text-2xl`}></i>
      </button>
    </div>
  );
};

export default AIConcierge;
