
import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Desert Sunset Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          {/* Layered overlays for depth and readability */}
          <div className="absolute inset-0 bg-stone-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/20 to-stone-900/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.5em] mb-6 block drop-shadow-md animate-in slide-in-from-top-4 duration-1000">
            West Texas Frontier
          </span>
          <h1 className="text-5xl md:text-8xl text-white font-bold mb-8 drop-shadow-2xl tracking-tight leading-[0.9]">
            Find Peace in the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">Mountains</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-100 mb-12 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
            Experience the untamed beauty of Van Horn. Breathtaking high-desert sunsets and premium full-hookup sites designed for the modern traveler.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/booking" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-full font-bold transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2">
              <span>Reserve Your Spot</span>
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </Link>
            <Link to="/amenities" className="w-full sm:w-auto bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border border-white/30 px-10 py-5 rounded-full font-bold transition-all shadow-xl flex items-center justify-center">
              Explore Amenities
            </Link>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 animate-bounce hidden md:block">
          <i className="fa-solid fa-chevron-down text-xl"></i>
        </div>
      </section>

      {/* Weather Section */}
      <section className="py-24 px-4 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-4xl font-bold text-stone-800 mb-4">Plan Your Journey</h2>
              <p className="text-stone-500 text-lg">Live 7-day weather perspective for Van Horn, TX</p>
            </div>
            <div className="flex items-center space-x-2 text-emerald-700 font-bold bg-emerald-50 px-4 py-2 rounded-full text-sm">
              <i className="fa-solid fa-location-crosshairs"></i>
              <span>High Desert Plateau</span>
            </div>
          </div>
          <WeatherWidget />
        </div>
      </section>

      {/* Featured Reviews Excerpt */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Guest Experiences</h2>
            <div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full mb-6"></div>
            <p className="text-stone-500 text-lg">Join hundreds of travelers who call us their favorite Texas stop.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 transition-all hover:shadow-2xl hover:-translate-y-2 group">
                <div className="flex text-amber-400 mb-6 text-sm">
                  {[...Array(5)].map((_, s) => <i key={s} className="fa-solid fa-star"></i>)}
                </div>
                <p className="text-stone-600 italic mb-8 leading-relaxed text-lg">
                  "{i === 1 ? "The cleanest RV park we've stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again." : 
                   i === 2 ? "Quiet, friendly staff, and great Wi-Fi. It's the perfect spot to rest after a long day of driving through West Texas." : 
                   "Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis."}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 overflow-hidden mr-4 ring-2 ring-stone-50 group-hover:ring-emerald-100 transition-all">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">{i === 1 ? 'Sarah Jenkins' : i === 2 ? 'Michael Thorne' : 'Linda & Rob'}</h4>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Verified Traveler</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="bg-stone-900 py-32 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-8 md:mb-0">
            <h2 className="text-5xl font-bold mb-6">Life at the Park</h2>
            <p className="text-stone-400 text-lg max-w-md">Real moments captured by our community of desert explorers.</p>
          </div>
          <Link to="/gallery" className="group bg-white text-stone-900 px-10 py-4 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-xl flex items-center space-x-3">
            <span>View Full Gallery</span>
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
        <div className="flex space-x-6 px-4 overflow-x-auto pb-12 no-scrollbar scroll-smooth">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 h-96 sm:w-96 sm:h-[30rem] rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] relative group">
              <img src={`https://picsum.photos/seed/park-gallery-${i}/800/1000`} alt="Gallery" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex items-end">
                <span className="text-emerald-400 font-black uppercase tracking-widest text-xs">Park Highlight</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-emerald-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/50 rounded-full blur-[120px] -ml-48 -mb-48"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/20">
            <i className="fa-solid fa-caravan text-3xl"></i>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Your desert oasis is waiting.</h2>
          <p className="text-xl mb-12 text-emerald-100 font-light leading-relaxed max-w-2xl mx-auto">
            Experience the legendary West Texas hospitality. Our sites fill up fast during the migration seasons—reserve your peace of mind today.
          </p>
          <Link to="/booking" className="inline-flex items-center space-x-4 bg-white text-emerald-800 px-12 py-5 rounded-full font-bold text-lg hover:bg-stone-100 transition-all shadow-2xl hover:shadow-emerald-900/40 transform hover:-translate-y-1">
            <span>Book Your Stay</span>
            <i className="fa-solid fa-calendar-check"></i>
          </Link>
          <p className="mt-8 text-emerald-200/60 text-sm font-medium">No credit card required for availability check</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
