
import React from 'react';

const Gallery: React.FC = () => {
  const categories = ["All", "Scenery", "Facilities", "Sunsets", "RVs"];
  
  return (
    <div className="py-20 bg-stone-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Visual Tour</h1>
          <p className="text-stone-400">Explore the landscapes and facilities of Mountain View RV Park.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, i) => (
            <button key={i} className={`px-6 py-2 rounded-full text-sm font-semibold border ${
              i === 0 ? 'bg-white text-stone-900 border-white' : 'border-stone-700 text-stone-400 hover:border-stone-500'
            } transition-all`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
              <img 
                src={`https://picsum.photos/seed/gallery${i}/${i % 2 === 0 ? '600/800' : '600/400'}`} 
                alt={`Gallery ${i}`} 
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div>
                  <p className="text-white font-bold">Mountain Horizon #{i}</p>
                  <p className="text-stone-300 text-xs uppercase tracking-widest mt-1">Guest Capture</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
