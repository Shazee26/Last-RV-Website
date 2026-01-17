
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GalleryImage } from '../types/database';

const MOCK_IMAGES: GalleryImage[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/gallery${i}/${i % 2 === 0 ? '600/800' : '600/400'}`,
  title: `Mountain Horizon #${i + 1}`,
  category: i % 3 === 0 ? 'Scenery' : i % 2 === 0 ? 'Facilities' : 'Sunsets'
}));

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Scenery", "Facilities", "Sunsets", "RVs"];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*');

        if (error) throw error;
        
        if (data && data.length > 0) {
          setImages(data);
        } else {
          setImages(MOCK_IMAGES);
        }
      } catch (err) {
        console.warn('Could not fetch gallery from Supabase, using mocks.', err);
        setImages(MOCK_IMAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = filter === "All" 
    ? images 
    : images.filter(img => img.category === filter);
  
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
            <button 
              key={i} 
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold border transition-all ${
                filter === cat 
                  ? 'bg-white text-stone-900 border-white shadow-lg' 
                  : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-stone-800 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((img) => (
              <div key={img.id} className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                  <div>
                    <p className="text-white font-bold text-lg">{img.title}</p>
                    <p className="text-emerald-400 text-xs uppercase tracking-widest mt-1 font-semibold">{img.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20 text-stone-500">
            <i className="fa-solid fa-image-slash text-4xl mb-4 opacity-20"></i>
            <p>No images found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
