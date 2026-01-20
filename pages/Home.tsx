
import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

const Home: React.FC = () => {
  return (
    <div className="page-transition">
      {/* Immersive Hero Section */}
      <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-brand-dark">
          <img 
            src="https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=2070&auto=format&fit=crop" 
            alt="Desert Vista" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-transparent to-brand-dark/40"></div>
          
          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-brand-primary/10 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[50rem] h-[50rem] bg-brand-secondary/10 rounded-full blur-[200px] animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-7xl pt-24">
          <div className="inline-flex items-center space-x-4 bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-3 rounded-2xl mb-12 animate-in slide-in-from-top-12 duration-1000">
            <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
            <span className="text-white text-[10px] font-black uppercase tracking-[0.5em]">The Ultimate West Texas Escape</span>
          </div>
          
          <h1 className="text-[5.5rem] md:text-[13rem] text-white font-black mb-12 tracking-tighter leading-[0.75] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            Pure <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-primary via-white to-brand-secondary">Horizon.</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-stone-200/80 mb-16 max-w-3xl mx-auto font-medium leading-tight tracking-tight drop-shadow-lg">
            Experience the fusion of prehistoric beauty and modern luxury in the heart of Van Horn.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <Link to="/booking" className="vibrant-gradient w-full sm:w-auto text-white px-16 py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-vibrant hover:scale-105 active:scale-95 flex items-center justify-center group">
              <span>Reserve Your Outpost</span>
              <i className="fa-solid fa-arrow-right ml-4 group-hover:translate-x-2 transition-transform"></i>
            </Link>
            <Link to="/amenities" className="w-full sm:w-auto bg-white/5 backdrop-blur-3xl hover:bg-white/10 text-white border border-white/20 px-16 py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center">
              Explore Amenities
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <i className="fa-solid fa-chevron-down text-white text-xl"></i>
        </div>
      </section>

      {/* Atmospheric Weather Section */}
      <section className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-brand-primary text-[10px] font-black uppercase tracking-[0.5em] block mb-6">Real-Time Intelligence</span>
              <h2 className="text-6xl md:text-7xl font-black text-stone-900 dark:text-white mb-8 tracking-tighter leading-none">The Sky <br/><span className="text-stone-300 dark:text-stone-700">Is Calling.</span></h2>
              <p className="text-stone-500 dark:text-stone-400 text-xl font-medium leading-relaxed">Prepare for the high plateau experience. 4,000 ft of pure desert atmosphere.</p>
            </div>
            <div className="bg-stone-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-stone-100 dark:border-white/5 flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                <i className="fa-solid fa-wind text-2xl text-brand-primary"></i>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1">Elevation</span>
                <span className="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">4,000 FT</span>
              </div>
            </div>
          </div>
          <WeatherWidget />
        </div>
      </section>

      {/* Guest Chronicles Section */}
      <section className="py-40 px-6 bg-stone-50 dark:bg-[#0c0c0e] transition-colors duration-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <span className="text-brand-primary text-[10px] font-black uppercase tracking-[0.5em] block mb-6">Chronicles of the Frontier</span>
            <h2 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white tracking-tighter">Verified Stories.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group glass p-16 rounded-[4rem] hover:shadow-vibrant transition-all duration-700 hover:-translate-y-4 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.03] text-brand-primary">
                  <i className="fa-solid fa-quote-right text-[15rem]"></i>
                </div>
                
                <div className="flex text-brand-primary mb-10 space-x-1">
                  {[...Array(5)].map((_, s) => <i key={s} className="fa-solid fa-star text-[10px]"></i>)}
                </div>
                <p className="text-stone-700 dark:text-stone-300 font-medium mb-12 leading-relaxed text-xl tracking-tight">
                  "{i === 1 ? "The cleanest RV park we've stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again." : 
                   i === 2 ? "Quiet, friendly staff, and great Wi-Fi. It's the perfect spot to rest after a long day of driving through West Texas." : 
                   "Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis."}"
                </p>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-br from-brand-primary to-brand-secondary mr-6 shadow-lg group-hover:rotate-6 transition-transform">
                    <img src={`https://picsum.photos/seed/user${i}/120/120`} alt="User" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-stone-900 dark:text-white text-lg tracking-tight">{i === 1 ? 'Sarah Jenkins' : i === 2 ? 'Michael Thorne' : 'Linda & Rob'}</h4>
                    <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.2em]">Desert Pioneer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Journey Section */}
      <section className="bg-brand-dark py-40 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-8 mb-32 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl">
            <h2 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter leading-none">Life in <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">High Definition.</span></h2>
            <p className="text-stone-500 text-2xl font-medium tracking-tight">A curated visual diary of the park community.</p>
          </div>
          <Link to="/gallery" className="group bg-white text-brand-dark px-16 py-8 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:vibrant-gradient hover:text-white transition-all shadow-vibrant flex items-center">
            <span>Enter Gallery</span>
            <i className="fa-solid fa-arrow-right ml-4 group-hover:translate-x-2 transition-transform"></i>
          </Link>
        </div>
        
        <div className="flex space-x-12 px-8 overflow-x-auto pb-12 no-scrollbar scroll-smooth">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-96 h-[35rem] rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-1000 hover:scale-[1.05] relative group border border-white/5">
              <img src={`https://picsum.photos/seed/vivid-park-${i}/800/1200`} alt="Gallery" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-12 flex items-end">
                <span className="bg-brand-primary text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[9px] border border-white/20 backdrop-blur-md">Vivid Frontier Frame</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Epic Final Call-to-Action */}
      <section className="py-60 px-6 relative overflow-hidden bg-brand-dark">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-brand-primary/10 rounded-full blur-[180px] -mr-80 -mt-80 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[70rem] h-[70rem] bg-brand-secondary/10 rounded-full blur-[200px] -ml-96 -mb-96 animate-pulse-slow"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 text-white">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-16 shadow-vibrant animate-float">
            <i className="fa-solid fa-caravan text-4xl text-white"></i>
          </div>
          <h2 className="text-7xl md:text-[10rem] font-black mb-16 tracking-tighter leading-[0.8] drop-shadow-2xl">The Desert <br/><span className="text-brand-primary">Awaits.</span></h2>
          <p className="text-2xl md:text-3xl mb-24 text-stone-300 font-medium leading-tight max-w-4xl mx-auto tracking-tight">
            Book your sanctuary in the mountains. Experience legendary West Texas hospitality with premium facilities and high-speed satellite connectivity.
          </p>
          
          <div className="flex flex-col items-center gap-12">
            <Link to="/booking" className="vibrant-gradient text-white px-20 py-10 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:scale-110 active:scale-95 transition-all shadow-vibrant transform inline-flex items-center">
              <span>Secure Your Position</span>
              <i className="fa-solid fa-calendar-check ml-6 text-lg"></i>
            </Link>
            
            <div className="flex flex-wrap justify-center items-center gap-12 pt-12">
              <div className="flex items-center space-x-3 group">
                <i className="fa-solid fa-circle-check text-brand-primary text-xl group-hover:scale-125 transition-transform"></i>
                <span className="text-[11px] font-black uppercase tracking-widest text-stone-500 group-hover:text-stone-300 transition-colors">Instant Lock</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <i className="fa-solid fa-circle-check text-brand-primary text-xl group-hover:scale-125 transition-transform"></i>
                <span className="text-[11px] font-black uppercase tracking-widest text-stone-500 group-hover:text-stone-300 transition-colors">Flex Cancel</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
