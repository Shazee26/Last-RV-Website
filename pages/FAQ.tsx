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

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-stone-50 dark:bg-stone-950 transition-colors duration-300 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-[0.4em] block mb-4">Resources</span>
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100 mb-6">Common Questions</h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg">Everything you need to know about your stay at Mountain View RV Park.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-stone-800 dark:text-stone-200 text-lg leading-tight">{faq.question}</span>
                <i className={`fa-solid ${activeIndex === index ? 'fa-minus' : 'fa-plus'} text-emerald-700 dark:text-emerald-400 transition-transform`}></i>
              </button>
              
              <div 
                className={`px-8 transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-emerald-900 rounded-[3rem] text-white text-center relative overflow-hidden shadow-2xl">
          <i className="fa-solid fa-comments absolute -top-10 -right-10 text-white/5 text-[12rem] rotate-12"></i>
          <h3 className="text-2xl font-bold mb-4 relative z-10">Still have questions?</h3>
          <p className="text-emerald-100 mb-8 relative z-10">Our friendly AI Concierge is available 24/7 to help you with local tips and park info.</p>
          <button 
            onClick={() => {
              const chatBtn = document.querySelector('[aria-label="Toggle AI Concierge"]') as HTMLButtonElement;
              if (chatBtn) chatBtn.click();
            }}
            className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all relative z-10"
          >
            Chat with Concierge
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;