
import React from 'react';

const Amenities: React.FC = () => {
  const amenities = [
    { icon: 'fa-bolt', title: '30/50 Amp Power', desc: 'Reliable full-hookup connections for all RV types including big rigs.' },
    { icon: 'fa-wifi', title: 'High-Speed Wi-Fi', desc: 'Professional grade connectivity even in the heart of the high desert.' },
    { icon: 'fa-shower', title: 'Clean Bathrooms', desc: 'Meticulously maintained private showers and climate-controlled facilities.' },
    { icon: 'fa-shirt', title: 'Laundry Facility', desc: 'Modern machines open 24/7 with comfortable folding areas.' },
    { icon: 'fa-paw', title: 'Pet Friendly', desc: 'Fenced-in dog run and acres of walking space for your furry companions.' },
    { icon: 'fa-trash-can', title: 'Waste Management', desc: 'Daily trash pickup at your site and convenient dump stations.' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden">
      {/* Background Pattern - Topographic Map style */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/topography.png")` }}></div>
      
      {/* Hero Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Mountain View RV</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">World-Class Comfort</h1>
          <p className="text-stone-200 text-lg md:text-xl font-light max-w-2xl mx-auto">Modern amenities meet the untamed beauty of West Texas.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {amenities.map((item, idx) => (
            <div key={idx} className="group bg-white/80 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${item.icon} text-2xl`}></i>
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-4">{item.title}</h3>
              <p className="text-stone-500 leading-relaxed text-lg font-light">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          {/* Decorative element */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-100 rounded-full opacity-50 blur-2xl"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-100 rounded-full opacity-50 blur-3xl"></div>

          <div className="bg-white/40 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] shadow-xl border border-white/60 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <i className="fa-solid fa-scroll text-9xl"></i>
             </div>
             
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-4xl font-bold text-stone-800 mb-4">Park Guidelines</h2>
              <div className="w-16 h-1.5 bg-emerald-700 mx-auto rounded-full"></div>
              <p className="text-stone-500 mt-6 font-medium">To ensure every guest enjoys the peaceful mountain atmosphere.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-8">
                <div className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center text-emerald-700">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-xl mb-2">Quiet Hours</h4>
                    <p className="text-stone-500 leading-relaxed">10:00 PM to 8:00 AM. We ask that all generators be turned off and outdoor volume kept to a minimum.</p>
                  </div>
                </div>
                
                <div className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center text-emerald-700">
                    <i className="fa-solid fa-paw"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-xl mb-2">Pet Etiquette</h4>
                    <p className="text-stone-500 leading-relaxed">Pets must be on a leash (max 6ft) at all times. Please use the designated dog run area for off-leash play.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center text-emerald-700">
                    <i className="fa-solid fa-gauge-high"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-xl mb-2">Speed Limit</h4>
                    <p className="text-stone-500 leading-relaxed">Strict 5 MPH limit. We are a family and pet friendly park; safety is our top priority for those on foot.</p>
                  </div>
                </div>
                
                <div className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center text-emerald-700">
                    <i className="fa-solid fa-fire-burner"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-xl mb-2">Outdoor Fires</h4>
                    <p className="text-stone-500 leading-relaxed">Propane fire pits are welcome. Due to local West Texas wind and dry conditions, wood fires are prohibited.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-10 border-t border-stone-200/50 text-center">
              <p className="text-stone-400 text-sm italic">Need clarification? Ask our <span className="text-emerald-700 font-bold">AI Concierge</span> below for real-time help.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
