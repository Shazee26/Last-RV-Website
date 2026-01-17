
import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image - Using the provided sunset image */}
        <div className="absolute inset-0 bg-[url('hero-sunset.jpg')] bg-cover bg-bottom">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8 animate-in slide-in-from-top-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Now Accepting 2026 Reservations</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl text-white font-bold mb-8 drop-shadow-2xl tracking-tight">
            Find Peace in the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">Mountains</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-100 mb-12 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Experience the raw beauty of West Texas. Breathtaking sunsets, star-filled nights, and spacious hookups await your arrival in Van Horn.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/booking" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-full font-bold transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center">
              Check Availability <i className="fa-solid fa-chevron-right ml-3 text-xs"></i>
            </Link>
            <Link to="/gallery" className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border border-white/30 px-10 py-5 rounded-full font-bold transition-all shadow-xl flex items-center justify-center">
              View Gallery
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <i className="fa-solid fa-chevron-down text-white text-xl"></i>
        </div>
      </section>

      {/* Weather Section */}
      <section className="py-24 px-4 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-stone-800 mb-4 tracking-tight">Plan Your Journey</h2>
              <p className="text-stone-500 max-w-md">Stay ahead of the high desert conditions with our real-time 7-day forecast for Van Horn.</p>
            </div>
            <div className="flex items-center space-x-3 bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100">
              <i className="fa-solid fa-location-crosshairs text-emerald-600"></i>
              <span className="text-sm font-bold text-stone-600 uppercase tracking-widest">Van Horn, TX</span>
            </div>
          </div>
          <WeatherWidget />
        </div>
      </section>

      {/* Featured Reviews Excerpt */}
      <section className="py-24 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4 tracking-tight">Guest Experiences</h2>
            <div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full mb-6"></div>
            <p className="text-stone-500">What our community says about their stay in the desert</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex text-amber-400 mb-6 space-x-1">
                  {[...Array(5)].map((_, star) => <i key={star} className="fa-solid fa-star text-xs"></i>)}
                </div>
                <p className="text-stone-600 italic mb-8 leading-relaxed text-lg">
                  "{i === 1 ? "The cleanest RV park we've stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again." : 
                   i === 2 ? "Quiet, friendly staff, and great Wi-Fi. It's the perfect spot to rest after a long day of driving through West Texas." : 
                   "Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis."}"
                </p>
                <div className="flex items-center pt-6 border-t border-stone-50">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 overflow-hidden mr-4 shadow-inner">
                    <img src={`https://picsum.photos/seed/user${i}/48/48`} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">{i === 1 ? 'Sarah Jenkins' : i === 2 ? 'Michael Thorne' : 'Linda & Rob'}</h4>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">Verified Traveler</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="bg-stone-900 py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 opacity-10">
          <i className="fa-solid fa-mountain-sun text-[20rem]"></i>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mb-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-4">Visual Journey</span>
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Life at the Park</h2>
            <p className="text-stone-400 max-w-md leading-relaxed">Catch a glimpse of the golden hour and the community that makes Mountain View special.</p>
          </div>
          <Link to="/gallery" className="group bg-white text-stone-900 px-10 py-4 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center">
            Explore Full Gallery <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
        
        <div className="flex space-x-6 px-4 overflow-x-auto pb-12 no-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 h-96 sm:w-96 sm:h-[30rem] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] group relative">
              <img src={`https://picsum.photos/seed/park_highlight_${i}/600/800`} alt="Park Life" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="text-sm font-medium tracking-wide">Van Horn, Texas • 2024</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-emerald-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/20">
            <i className="fa-solid fa-van-shuttle text-4xl"></i>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">Your desert sanctuary is waiting.</h2>
          <p className="text-xl mb-12 text-emerald-100 font-light leading-relaxed max-w-2xl mx-auto">
            Spots fill up fast during peak travel seasons. Secure your mountain view and peaceful night's rest today.
          </p>
          <Link to="/booking" className="inline-flex items-center bg-white text-emerald-800 px-12 py-5 rounded-full font-bold text-lg hover:bg-stone-100 transition-all shadow-2xl hover:scale-105 active:scale-95">
            Reserve Your Site <i className="fa-solid fa-calendar-check ml-3"></i>
          </Link>
          <p className="mt-8 text-emerald-300/60 text-xs font-bold uppercase tracking-[0.2em]">Full Hookups • High Speed Wi-Fi • Pet Friendly</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
