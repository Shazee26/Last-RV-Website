
import React from 'react';

const Amenities: React.FC = () => {
  const amenities = [
    { icon: 'fa-bolt', title: '30/50 Amp Power', desc: 'Reliable full-hookup connections for all RV types including big rigs.', color: 'emerald' },
    { icon: 'fa-wifi', title: 'High-Speed Wi-Fi', desc: 'Professional grade connectivity even in the heart of the high desert.', color: 'blue' },
    { icon: 'fa-shower', title: 'Clean Bathrooms', desc: 'Meticulously maintained private showers and climate-controlled facilities.', color: 'cyan' },
    { icon: 'fa-shirt', title: 'Laundry Facility', desc: 'Modern machines open 24/7 with comfortable folding areas.', color: 'indigo' },
    { icon: 'fa-paw', title: 'Pet Friendly', desc: 'Fenced-in dog run and acres of walking space for your furry companions.', color: 'purple' },
    { icon: 'fa-trash-can', title: 'Waste Management', desc: 'Daily trash pickup at your site and convenient dump stations.', color: 'amber' },
  ];

  const getColorClasses = (color: string) => {
    const maps: any = {
      emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20',
      blue: 'from-blue-400 to-blue-600 shadow-blue-500/20',
      cyan: 'from-cyan-400 to-cyan-600 shadow-cyan-500/20',
      indigo: 'from-indigo-400 to-indigo-600 shadow-indigo-500/20',
      purple: 'from-purple-400 to-purple-600 shadow-purple-500/20',
      amber: 'from-amber-400 to-orange-600 shadow-amber-500/20',
    };
    return maps[color] || maps.emerald;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] relative overflow-hidden transition-colors duration-500">
      {/* Decorative Vibrant Orbs */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-1/2 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[120px] -ml-80"></div>
      
      {/* Header */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[4px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0c] via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="w-16 h-1 w-24 bg-emerald-500 mx-auto mb-8 rounded-full"></div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">Desert <span className="vibrant-text">Elite.</span></h1>
          <p className="text-emerald-100 text-xl font-medium max-w-2xl mx-auto opacity-80">World-class amenities meeting the rugged Texas beauty.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-40">
          {amenities.map((item, idx) => (
            <div key={idx} className="group bg-stone-50 dark:bg-white/5 p-12 rounded-[3.5rem] border border-stone-100 dark:border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
              <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(item.color)} text-white rounded-[1.5rem] flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                <i className={`fa-solid ${item.icon} text-3xl`}></i>
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-6 tracking-tight">{item.title}</h3>
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Guidelines section with vibrant typography */}
        <div className="bg-stone-950 p-12 md:p-24 rounded-[4rem] relative overflow-hidden shadow-3xl shadow-emerald-500/10 border border-white/5">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
             <i className="fa-solid fa-scroll text-[15rem] rotate-12"></i>
           </div>
           
           <div className="text-center mb-24 relative z-10">
             <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] block mb-6">Park Philosophy</span>
             <h2 className="text-5xl font-black text-white tracking-tight mb-6 leading-tight">Living in <span className="text-emerald-500">Harmony.</span></h2>
             <p className="text-stone-400 font-medium max-w-xl mx-auto leading-relaxed">Simple guidelines to ensure every guest experiences the peaceful grandeur of our high-desert oasis.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
             <div className="space-y-12">
               <div className="flex items-start space-x-8">
                 <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                   <i className="fa-solid fa-clock text-xl"></i>
                 </div>
                 <div>
                   <h4 className="font-black text-white text-xl mb-4 tracking-tight">Quiet Hours</h4>
                   <p className="text-stone-500 text-sm leading-relaxed font-medium">10:00 PM to 8:00 AM. Desert silence is a luxury. We ask that generators and outdoor noise be kept minimal.</p>
                 </div>
               </div>
               
               <div className="flex items-start space-x-8">
                 <div className="w-14 h-14 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                   <i className="fa-solid fa-paw text-xl"></i>
                 </div>
                 <div>
                   <h4 className="font-black text-white text-xl mb-4 tracking-tight">Pet Etiquette</h4>
                   <p className="text-stone-500 text-sm leading-relaxed font-medium">Leash required (max 6ft). Please utilize our vibrant fenced dog run for off-leash exploration.</p>
                 </div>
               </div>
             </div>

             <div className="space-y-12">
               <div className="flex items-start space-x-8">
                 <div className="w-14 h-14 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                   <i className="fa-solid fa-gauge-high text-xl"></i>
                 </div>
                 <div>
                   <h4 className="font-black text-white text-xl mb-4 tracking-tight">Vibrant Safety</h4>
                   <p className="text-stone-500 text-sm leading-relaxed font-medium">Strict 5 MPH speed limit. We are a family-first park; your slow pace keeps our desert home safe for everyone.</p>
                 </div>
               </div>
               
               <div className="flex items-start space-x-8">
                 <div className="w-14 h-14 bg-orange-500/10 rounded-2xl border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
                   <i className="fa-solid fa-fire-burner text-xl"></i>
                 </div>
                 <div>
                   <h4 className="font-black text-white text-xl mb-4 tracking-tight">High Desert Fires</h4>
                   <p className="text-stone-500 text-sm leading-relaxed font-medium">Propane pits welcome. For the protection of our dry landscape, open wood fires are prohibited at all times.</p>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="mt-24 pt-12 border-t border-white/5 text-center">
             <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Policy sync: Active</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
