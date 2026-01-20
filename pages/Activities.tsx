
import React from 'react';

const Activities: React.FC = () => {
  const categories = [
    {
      id: 'hiking',
      title: 'High Desert Hiking',
      subtitle: 'Guadalupe Peak & Beyond',
      icon: 'fa-person-hiking',
      color: 'emerald',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop',
      items: [
        { name: 'Guadalupe Peak Trail', desc: 'The highest point in Texas. An 8.5-mile round trip with breathtaking views.' },
        { name: 'McKittrick Canyon', desc: 'Famous for its vibrant fall colors and unique desert flora.' },
        { name: 'Red Bluff Draw', desc: 'A local secret for a quiet morning walk with mountain vistas.' }
      ]
    },
    {
      id: 'stargazing',
      title: 'Bortle-1 Stargazing',
      subtitle: 'Pure Cosmic Clarity',
      icon: 'fa-user-astronaut',
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=2070&auto=format&fit=crop',
      items: [
        { name: 'McDonald Observatory', desc: 'World-renowned research facility offering incredible star parties.' },
        { name: 'Guadalupe Sky Trail', desc: 'Perfect for amateur astronomers looking for dark sky photography.' },
        { name: 'Park Starlight Row', desc: 'Enjoy the Milky Way directly from your RV site every night.' }
      ]
    },
    {
      id: 'dining',
      title: 'Local Flavors',
      subtitle: 'Van Horn & Frontier Eats',
      icon: 'fa-utensils',
      color: 'purple',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
      items: [
        { name: 'Chuy’s Restaurant', desc: 'A historic staple famous for authentic Tex-Mex and legendary hospitality.' },
        { name: 'Van Horn Cattle Co.', desc: 'The best steaks in the region. A must-visit for a vibrant dinner.' },
        { name: 'Frontier Market', desc: 'Perfect for gathering local ingredients and snacks for your hikes.' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const maps: any = {
      emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20',
      blue: 'from-blue-400 to-blue-600 shadow-blue-500/20',
      purple: 'from-purple-400 to-purple-600 shadow-purple-500/20',
    };
    return maps[color] || maps.emerald;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] relative overflow-hidden transition-colors duration-500 py-32">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 animate-in fade-in duration-1000">
          <span className="vibrant-text text-[10px] font-black uppercase tracking-[0.5em] block mb-4">West Texas Expeditions</span>
          <h1 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white mb-6 tracking-tighter">Desert <span className="vibrant-text">Venture.</span></h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-2xl mx-auto font-medium">Explore the high plateau. From the highest peak in Texas to the clearest stars in the world.</p>
        </div>

        <div className="space-y-40">
          {categories.map((cat, idx) => (
            <div key={cat.id} className={`flex flex-col lg:flex-row gap-20 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full animate-in slide-in-from-bottom-8 duration-1000">
                <div className="relative group">
                  <div className={`absolute -inset-4 bg-gradient-to-br ${getColorClasses(cat.color)} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity rounded-[4rem]`}></div>
                  <div className="aspect-[16/10] rounded-[3.5rem] overflow-hidden shadow-2xl relative border-8 border-white dark:border-stone-900 transform group-hover:scale-[1.02] transition-transform duration-700">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8">
                       <div className={`w-14 h-14 bg-gradient-to-br ${getColorClasses(cat.color)} text-white rounded-2xl flex items-center justify-center shadow-xl`}>
                         <i className={`fa-solid ${cat.icon} text-2xl`}></i>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-10 animate-in fade-in duration-1000 delay-200">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 block ${cat.color === 'emerald' ? 'text-emerald-500' : cat.color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`}>
                    {cat.subtitle}
                  </span>
                  <h2 className="text-5xl font-black text-stone-900 dark:text-white tracking-tight">{cat.title}</h2>
                </div>
                
                <div className="space-y-8">
                  {cat.items.map((item, iIdx) => (
                    <div key={iIdx} className="group flex items-start space-x-6">
                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full bg-${cat.color}-500 group-hover:scale-150 transition-transform`}></div>
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800 dark:text-stone-200 text-lg tracking-tight mb-2 group-hover:text-emerald-500 transition-colors">{item.name}</h4>
                        <p className="text-stone-500 dark:text-stone-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-8">
                  <button className="vibrant-gradient text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                    Get Trail Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Highlight */}
        <div className="mt-40 bg-stone-900 p-12 md:p-24 rounded-[4rem] text-white text-center relative overflow-hidden shadow-3xl border border-white/5">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
           <div className="relative z-10">
             <h3 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Experience the <span className="vibrant-text">Wild Frontier.</span></h3>
             <p className="text-stone-400 max-w-xl mx-auto font-medium text-lg leading-relaxed mb-12">Van Horn is perfectly positioned at the crossroads of Texas beauty. Let our AI Concierge plan your perfect day trip.</p>
             <button 
               onClick={() => {
                 const chatBtn = document.querySelector('[aria-label="Toggle AI Concierge"]') as HTMLButtonElement;
                 if (chatBtn) chatBtn.click();
               }}
               className="bg-white text-stone-950 px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:vibrant-gradient hover:text-white transition-all shadow-2xl"
             >
               Plan Your Expedition
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
