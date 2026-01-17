
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
  
  // Upload form states
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Scenery");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const categories = ["All", "Scenery", "Facilities", "Sunsets", "RVs"];
  const uploadableCategories = ["Scenery", "Facilities", "Sunsets", "RVs"];

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Auto-fill title if empty
      if (!uploadTitle) {
        setUploadTitle(file.name.split('.')[0].replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;
    
    setUploading(true);

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{ 
          url: publicUrl, 
          title: uploadTitle || selectedFile.name.split('.')[0], 
          category: uploadCategory,
          user_id: user.id 
        }]);

      if (dbError) throw dbError;

      // Reset form
      setUploadTitle("");
      setSelectedFile(null);
      setPreviewUrl(null);
      
      fetchGallery();
      alert('Photo added to the wall! Thanks for sharing your Mountain View memory.');
    } catch (err: any) {
      console.error('Upload Error:', err);
      alert('Upload failed: ' + err.message);
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
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Park Gallery</h1>
          <p className="text-stone-400 text-lg leading-relaxed">
            From golden hour in Van Horn to the cozy setups of our travelers, catch a glimpse of the Mountain View lifestyle.
          </p>
        </div>

        {user && (
          <div className="max-w-2xl mx-auto mb-20 p-8 bg-stone-800/50 backdrop-blur-md rounded-[2.5rem] border border-stone-700 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-xl flex items-center">
                <i className="fa-solid fa-camera-retro mr-3 text-emerald-500"></i>
                Post to the Gallery
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Authenticated Access</span>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Photo Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sunset over Sierra Blanca"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-stone-600"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {uploadableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setUploadCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                          uploadCategory === cat 
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                            : 'bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Image File</label>
                {!previewUrl ? (
                  <label className={`flex flex-col items-center justify-center w-full h-48 transition bg-stone-900/50 border-2 border-stone-700 border-dashed rounded-3xl cursor-pointer hover:border-emerald-500/50 hover:bg-stone-900 transition-all group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fa-solid fa-cloud-arrow-up text-3xl text-stone-600 group-hover:text-emerald-500 mb-3 transition-colors"></i>
                      <p className="text-sm text-stone-500 font-medium">Click to browse your photos</p>
                      <p className="text-[10px] text-stone-600 mt-1 uppercase tracking-tighter">JPG, PNG, WebP up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      disabled={uploading} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </label>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden h-48 border border-stone-700 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="absolute top-4 right-4 w-10 h-10 bg-stone-950/80 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={uploading || !selectedFile}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-upload text-xs"></i>
                    <span>Share with the Community</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all border-2 ${
                filter === cat 
                  ? 'bg-white text-stone-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                  : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-stone-800/50 rounded-3xl h-96 animate-pulse border border-stone-700"></div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredImages.map((img, idx) => (
              <div key={img.id || idx} className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:ring-2 hover:ring-emerald-500/30">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2 block">{img.category}</span>
                    <h5 className="text-xl font-bold text-white leading-tight">{img.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-32 bg-stone-800/20 rounded-[3rem] border-2 border-dashed border-stone-800">
            <i className="fa-solid fa-camera-rotate text-5xl text-stone-800 mb-6"></i>
            <h3 className="text-2xl font-bold text-stone-600">No photos found here yet</h3>
            <p className="text-stone-700 mt-2">Be the first to upload a memory in this category!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
