
import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/vanhorn/1600/900')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-7xl text-white font-bold mb-6 drop-shadow-lg">
            Find Peace in the <span className="text-emerald-400">Mountains</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-100 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to Mountain View RV Park, your premier stopping point in Van Horn, Texas. Breathtaking sunsets and spacious hookups await.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/booking" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:scale-105">
              Check Availability
            </Link>
            <Link to="/amenities" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold transition-all shadow-xl">
              Explore Amenities
            </Link>
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <section className="py-20 px-4 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Plan Your Journey</h2>
            <p className="text-stone-500">Real-time 7-day forecast for Van Horn, TX</p>
          </div>
          <WeatherWidget />
        </div>
      </section>

      {/* Featured Reviews Excerpt */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">Guest Experiences</h2>
            <p className="text-stone-500">What our community says about their stay</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 transition-all hover:shadow-md">
                <div className="flex text-amber-400 mb-4">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-stone-600 italic mb-6 leading-relaxed">
                  "{i === 1 ? "The cleanest RV park we've stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again." : 
                   i === 2 ? "Quiet, friendly staff, and great Wi-Fi. It's the perfect spot to rest after a long day of driving through West Texas." : 
                   "Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis."}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden mr-3">
                    <img src={`https://picsum.photos/seed/user${i}/40/40`} alt="User" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm">{i === 1 ? 'Sarah Jenkins' : i === 2 ? 'Michael Thorne' : 'Linda & Rob'}</h4>
                    <p className="text-xs text-stone-400">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="bg-stone-900 py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-bold mb-4">Life at the Park</h2>
            <p className="text-stone-400 max-w-md">Browse moments captured by our guests and team.</p>
          </div>
          <Link to="/gallery" className="bg-white text-stone-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all">
            View Full Gallery
          </Link>
        </div>
        <div className="flex space-x-4 px-4 overflow-x-auto pb-8 no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-105">
              <img src={`https://picsum.photos/seed/park${i}/400/500`} alt="Gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-emerald-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <i className="fa-solid fa-caravan text-5xl mb-6 opacity-30"></i>
          <h2 className="text-4xl font-bold mb-6">Ready to reserve your spot?</h2>
          <p className="text-xl mb-10 text-emerald-100 font-light leading-relaxed">
            Spaces fill up fast, especially during the peak travel seasons. Secure your peace of mind and your mountain view today.
          </p>
          <Link to="/booking" className="inline-block bg-white text-emerald-800 px-10 py-4 rounded-full font-bold text-lg hover:bg-stone-100 transition-all shadow-xl">
            Book Now <i className="fa-solid fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
