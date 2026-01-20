
import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          {/* Vibrant Vivid Overlays */}
          <div className="absolute inset-0 bg-stone-900/20"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/60 via-transparent to-purple-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdfcfb] dark:to-[#0a0a0c]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8 animate-in slide-in-from-top-8 duration-1000">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">West Texas Luxury Frontier</span>
          </div>
          
          <h1 className="text-6xl md:text-[10rem] text-white font-black mb-10 tracking-tighter leading-[0.8] drop-shadow-2xl">
            Pure <br/>
            <span className="vibrant-text">Horizon</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-100 mb-14 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
            Experience Van Horn's most vibrant RV oasis. Premium sites designed for those who seek uncompromised nature and modern comfort.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <Link to="/booking" className="vibrant-gradient w-full sm:w-auto text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 flex items-center justify-center space-x-3">
              <span>Start Your Journey</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link to="/amenities" className="w-full sm:w-auto bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border border-white/30 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center">
              Our Amenities
            </Link>
          </div>
        </div>
      </section>

      {/* Weather Section - Vibrant Card Styles */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div>
              <h2 className="text-5xl font-black text-stone-900 dark:text-white mb-6 tracking-tight">The Sky <span className="text-emerald-500">Is Calling.</span></h2>
              <p className="text-stone-500 dark:text-stone-400 text-lg font-medium">Real-time desert perspective for your upcoming stay.</p>
            </div>
            <div className="mt-8 md:mt-0 flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              <i className="fa-solid fa-cloud-sun"></i>
              <span>High Desert Plateau • 4,000 ft</span>
            </div>
          </div>
          <WeatherWidget />
        </div>
      </section>

      {/* Reviews Section - Dynamic Color Accents */}
      <section className="py-32 px-4 bg-gradient-to-b from-stone-50 to-white dark:from-[#0c0c0e] dark:to-[#0a0a0c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="vibrant-text text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Guest Testimonials</span>
            <h2 className="text-5xl font-black text-stone-900 dark:text-white tracking-tight">Shared Memories.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-[#111114] p-12 rounded-[3rem] shadow-sm border border-stone-100 dark:border-white/5 transition-all hover:shadow-2xl hover:scale-[1.02] group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 ${i === 1 ? 'text-emerald-500' : i === 2 ? 'text-blue-500' : 'text-purple-500'}`}>
                  <i className="fa-solid fa-quote-right text-[10rem]"></i>
                </div>
                
                <div className="flex text-emerald-400 mb-8 space-x-1">
                  {[...Array(5)].map((_, s) => <i key={s} className="fa-solid fa-star text-xs"></i>)}
                </div>
                <p className="text-stone-700 dark:text-stone-300 font-medium mb-10 leading-relaxed text-lg">
                  "{i === 1 ? "The cleanest RV park we've stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again." : 
                   i === 2 ? "Quiet, friendly staff, and great Wi-Fi. It's the perfect spot to rest after a long day of driving through West Texas." : 
                   "Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis."}"
                </p>
                <div className="flex items-center">
                  <div className={`w-14 h-14 rounded-2xl p-1 bg-gradient-to-br mr-4 shadow-lg ${i === 1 ? 'from-emerald-400 to-emerald-600' : i === 2 ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'}`}>
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-stone-900 dark:text-white tracking-tight">{i === 1 ? 'Sarah Jenkins' : i === 2 ? 'Michael Thorne' : 'Linda & Rob'}</h4>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Highlight - Vivid Grayscale to Color */}
      <section className="bg-black py-40 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-12 md:mb-0">
            <h2 className="text-6xl font-black mb-6 tracking-tighter">Life in <span className="vibrant-text">Color.</span></h2>
            <p className="text-stone-500 text-lg max-w-md font-medium">A visual diary of our park community and desert landscapes.</p>
          </div>
          <Link to="/gallery" className="group bg-white text-black px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center space-x-3">
            <span>Explore The Wall</span>
            <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </Link>
        </div>
        
        <div className="flex space-x-8 px-6 overflow-x-auto pb-12 no-scrollbar scroll-smooth">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-80 h-[32rem] rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.05] relative group border border-white/5">
              <img src={`https://picsum.photos/seed/vivid-park-${i}/800/1200`} alt="Gallery" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex items-end">
                <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[8px] border border-emerald-400/30">Vivid Desert Snapshot</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA - Neon Nature Gradient */}
      <section className="py-40 px-6 relative overflow-hidden bg-emerald-950">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-blue-500/10 rounded-full blur-[150px] -ml-80 -mb-80"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 text-white">
          <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center mx-auto mb-12 border border-white/10 shadow-2xl animate-bounce">
            <i className="fa-solid fa-caravan text-4xl text-emerald-400"></i>
          </div>
          <h2 className="text-6xl md:text-[7rem] font-black mb-10 tracking-tighter leading-none">The Desert <br/> Awaits.</h2>
          <p className="text-xl md:text-2xl mb-16 text-emerald-100 font-medium leading-relaxed max-w-3xl mx-auto opacity-80">
            Book your sanctuary in the mountains. Experience legendary West Texas hospitality with premium facilities and the best Wi-Fi in the region.
          </p>
          <Link to="/booking" className="vibrant-gradient text-white px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/40 transform inline-flex items-center space-x-4">
            <span>Secure Your Site</span>
            <i className="fa-solid fa-calendar-check"></i>
          </Link>
          <div className="mt-12 flex justify-center items-center space-x-6">
             <div className="flex items-center space-x-2">
                <i className="fa-solid fa-circle-check text-emerald-400"></i>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200/50">Instant Confirmation</span>
             </div>
             <div className="flex items-center space-x-2">
                <i className="fa-solid fa-circle-check text-emerald-400"></i>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200/50">Flexible Cancellation</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
