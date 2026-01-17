
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
      // Extra safety check to ensure text is always a string
      const textResponse = typeof botResponse === 'string' ? botResponse : String(botResponse);
      setMessages(prev => [...prev, { role: 'bot', text: textResponse }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having a bit of trouble connecting to the desert air. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] mb-4 rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-hat-cowboy text-xl"></i>
              <span className="font-semibold">Van Horn Concierge</span>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close Chat" className="hover:text-stone-200">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white text-stone-700 shadow-sm border border-stone-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-stone-100">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-stone-100 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-grow bg-stone-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label="Send Message"
              className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Concierge"
        className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:bg-emerald-800 transition-all hover:scale-105 active:scale-95"
      >
        <i className={`fa-solid ${isOpen ? 'fa-comments' : 'fa-hat-cowboy'} text-2xl`}></i>
      </button>
    </div>
  );
};

export default AIConcierge;
