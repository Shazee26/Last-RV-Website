
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GalleryImage } from '../types/database';

const Gallery: React.FC = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Scenery", "Facilities", "Sunsets", "RVs"];

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{ 
          url: publicUrl, 
          title: file.name.split('.')[0], 
          category: filter === 'All' ? 'Scenery' : filter,
          user_id: user?.id 
        }]);

      if (dbError) throw dbError;

      fetchGallery();
      alert('Photo uploaded successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredImages = filter === "All" 
    ? images 
    : images.filter(img => img.category === filter);
  
  return (
    <div className="py-20 bg-stone-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Visual Tour</h1>
          <p className="text-stone-400">Explore landscapes and moments captured at Mountain View.</p>
        </div>

        {user && (
          <div className="max-w-xl mx-auto mb-16 p-6 bg-stone-800 rounded-3xl border border-stone-700">
            <h4 className="font-bold mb-4 flex items-center">
              <i className="fa-solid fa-cloud-arrow-up mr-2 text-emerald-500"></i>
              Add New Photo
            </h4>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center justify-center w-full h-32 px-4 transition bg-stone-900 border-2 border-stone-700 border-dashed rounded-2xl appearance-none cursor-pointer hover:border-emerald-500 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <i className="fa-solid fa-file-image text-emerald-500"></i>
                  <span className="font-medium text-stone-400">
                    {uploading ? 'Uploading...' : 'Choose a file or drop it here'}
                  </span>
                </span>
                <input 
                  type="file" 
                  disabled={uploading} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
              </label>
              <p className="text-[10px] text-stone-500 text-center">Images will be tagged with your current filter: {filter}</p>
            </div>
          </div>
        )}

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
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-stone-800 rounded-2xl h-80 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((img, idx) => (
              <div key={img.id || idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
                <img src={img.url} alt={img.title} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-6 flex items-end">
                  <div>
                    <p className="text-white font-bold">{img.title}</p>
                    <p className="text-emerald-400 text-xs uppercase tracking-widest mt-1">{img.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
