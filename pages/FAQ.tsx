
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What are your check-in and check-out times?",
      answer: "Check-in begins at 1:00 PM and check-out is by 11:00 AM. If you need a late check-out or early arrival, please contact our office in advance. We do our best to accommodate based on site availability."
    },
    {
      question: "Do you offer full hookups for big rigs?",
      answer: "Yes! We have premium pull-through sites designed specifically for larger RVs and big rigs. All sites include 30/50 amp electrical service, water, and sewer connections."
    },
    {
      question: "Is the Wi-Fi strong enough for remote work?",
      answer: "Absolutely. We pride ourselves on having professional-grade, high-speed Wi-Fi throughout the park. Many of our guests work remotely during their stay with us."
    },
    {
      question: "Are pets allowed at Mountain View?",
      answer: "We are extremely pet-friendly! We even have a fenced-in dog run area. We only ask that pets remain on a leash when in the common areas and that owners clean up after their companions."
    },
    {
      question: "What attractions are nearby in Van Horn?",
      answer: "We are centrally located! Guadalupe Mountains National Park is about an hour north, and the McDonald Observatory is a short drive away. Locally, you can enjoy mountain hiking and incredible stargazing right from your site."
    },
    {
      question: "Do I need a reservation or can I walk in?",
      answer: "While we do accept walk-ins if space is available, we highly recommend booking in advance, especially during the busy spring and fall travel seasons. You can reserve your spot easily through our online booking system."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="py-32 bg-white dark:bg-[#0a0a0c] transition-colors duration-500 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="vibrant-text text-[10px] font-black uppercase tracking-[0.5em] block mb-4">Support & Logistics</span>
          <h1 className="text-6xl font-black text-stone-900 dark:text-white mb-6 tracking-tighter">Guest Info.</h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg font-medium leading-relaxed">Everything you need for a perfect high-desert expedition.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-[#111114] border-2 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-sm ${
                activeIndex === index ? 'border-emerald-500/50 shadow-xl shadow-emerald-500/5' : 'border-stone-100 dark:border-white/5'
              }`}
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full text-left px-10 py-8 flex justify-between items-center focus:outline-none"
              >
                <span className={`font-black tracking-tight text-xl leading-tight transition-colors ${activeIndex === index ? 'text-emerald-500' : 'text-stone-800 dark:text-stone-200'}`}>{faq.question}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeIndex === index ? 'bg-emerald-500 text-white rotate-180' : 'bg-stone-50 dark:bg-white/5 text-stone-400'}`}>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </button>
              
              <div 
                className={`px-10 transition-all duration-500 ease-in-out overflow-hidden ${
                  activeIndex === index ? 'max-h-96 pb-10 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="w-12 h-1 bg-emerald-500/20 rounded-full mb-6"></div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 p-12 md:p-20 bg-stone-950 rounded-[4rem] text-white text-center relative overflow-hidden shadow-3xl border border-white/5 group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
             <i className="fa-solid fa-comments text-[15rem] rotate-12"></i>
          </div>
          <h3 className="text-4xl font-black mb-6 relative z-10 tracking-tight">Need More <span className="vibrant-text">Clarity?</span></h3>
          <p className="text-stone-400 mb-12 relative z-10 max-w-lg mx-auto font-medium">Our vibrant AI Concierge is available 24/7 to provide real-time local intelligence and park info.</p>
          <button 
            onClick={() => {
              const chatBtn = document.querySelector('[aria-label="Toggle AI Concierge"]') as HTMLButtonElement;
              if (chatBtn) chatBtn.click();
            }}
            className="vibrant-gradient text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-110 active:scale-95 transition-all shadow-2xl relative z-10"
          >
            Summon AI Concierge
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
