
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GalleryImage } from '../types/database';

// Curated collection reflecting the specific visuals provided by the user (Sunsets, Park Signs, RV setups)
const FEATURED_IMAGES: GalleryImage[] = [
  {
    url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=2070&auto=format&fit=crop',
    title: 'Van Horn Arched Entrance',
    category: 'Facilities'
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    title: 'Iconic Yellow RV Sign',
    category: 'Facilities'
  },
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop',
    title: 'Purple Desert Twilight',
    category: 'Sunsets'
  },
  {
    url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop',
    title: 'Jayco Row - Morning Light',
    category: 'RVs'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop',
    title: 'Sierra Blanca Vista',
    category: 'Scenery'
  },
  {
    url: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?q=80&w=2070&auto=format&fit=crop',
    title: 'Moon Over the Park',
    category: 'Scenery'
  },
  {
    url: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?q=80&w=2070&auto=format&fit=crop',
    title: 'Camper Van Twilight',
    category: 'RVs'
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
    title: 'West Texas Highway Glow',
    category: 'Sunsets'
  },
  {
    url: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=2070&auto=format&fit=crop',
    title: 'Mirror View: Arrival',
    category: 'Scenery'
  },
  {
    url: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2070&auto=format&fit=crop',
    title: 'Van Horn Silhouette',
    category: 'Sunsets'
  },
  {
    url: 'https://images.unsplash.com/photo-1509316785289-025f5d846b35?q=80&w=2070&auto=format&fit=crop',
    title: 'Desert Flora at Dusk',
    category: 'Scenery'
  },
  {
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2070&auto=format&fit=crop',
    title: 'High Plains Horizon',
    category: 'Scenery'
  },
  {
    url: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=2070&auto=format&fit=crop',
    title: 'Starlit RV Setup',
    category: 'RVs'
  },
  {
    url: 'https://images.unsplash.com/photo-1511516412963-801b050c92aa?q=80&w=2070&auto=format&fit=crop',
    title: 'Laundry & Common Area',
    category: 'Facilities'
  },
  {
    url: 'https://images.unsplash.com/photo-1568249091761-05705353086a?q=80&w=2070&auto=format&fit=crop',
    title: 'Pink Sky Morning',
    category: 'Sunsets'
  },
  {
    url: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=2070&auto=format&fit=crop',
    title: 'Dusk Over Site 14',
    category: 'RVs'
  }
];

const Gallery: React.FC = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("All");
  
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Scenery");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const categories = ["All", "Scenery", "Facilities", "Sunsets", "RVs"];
  const uploadableCategories = ["Scenery", "Facilities", "Sunsets", "RVs"];

  const fetchGallery = async (isManualRefresh = false) => {
    if (!isManualRefresh) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const dbImages = data || [];
      // Newest user-uploaded images first, followed by our large featured collection
      setImages([...dbImages, ...FEATURED_IMAGES]);
    } catch (err) {
      console.error('Gallery fetch error:', err);
      setImages(FEATURED_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!uploadTitle) {
        setUploadTitle(file.name.split('.')[0].replace(/[-_]/g, ' '));
      }
      setStatus(null);
    } else {
      setStatus({ type: 'error', message: 'Please select a valid image file.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [uploadTitle]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;
    
    setUploading(true);
    setStatus(null);

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const filePath = `uploads/${user.id}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{ 
          url: publicUrl, 
          title: uploadTitle || 'Untitled Guest Photo', 
          category: uploadCategory,
          user_id: user.id 
        }]);

      if (dbError) throw dbError;

      setUploadTitle("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setStatus({ 
        type: 'success', 
        message: 'Successfully shared! Your photo is now featured in the gallery.' 
      });
      
      // Refresh the image list immediately to include the new upload
      await fetchGallery(true);
      
      setTimeout(() => setStatus(null), 6000);
    } catch (err: any) {
      console.error('Full Upload Process Error:', err);
      setStatus({ type: 'error', message: 'Upload failed: ' + err.message });
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
        <div className="text-center mb-16 max-w-2xl mx-auto animate-in fade-in duration-1000">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Mountain View Chronicles</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Park Gallery</h1>
          <p className="text-stone-400 text-lg leading-relaxed">
            A collective of memories from our desert oasis. Discover the breathtaking landscapes and unique spirit of Van Horn.
          </p>
        </div>

        {user ? (
          <div className="max-w-2xl mx-auto mb-24 p-8 bg-stone-800/40 backdrop-blur-xl rounded-[3rem] border border-stone-700 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-xl flex items-center">
                <i className="fa-solid fa-cloud-arrow-up mr-3 text-emerald-500"></i>
                Post a Memory
              </h4>
              <div className="flex items-center space-x-2 bg-stone-900/50 px-3 py-1.5 rounded-full border border-stone-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Connected</span>
              </div>
            </div>

            {status && (
              <div className={`mb-8 p-5 rounded-2xl flex items-center space-x-4 text-sm animate-in fade-in zoom-in duration-300 ${
                status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check text-lg' : 'fa-circle-exclamation text-lg'}`}></i>
                <span className="font-medium">{status.message}</span>
              </div>
            )}
            
            <form onSubmit={handleUpload} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Image Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sierra Blanca Peak"
                    className="w-full bg-stone-900 border border-stone-700 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-stone-700"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Classification</label>
                  <div className="flex flex-wrap gap-2">
                    {uploadableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setUploadCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                          uploadCategory === cat 
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                            : 'bg-stone-900 border-stone-700 text-stone-500 hover:border-stone-500 hover:text-stone-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Select Image</label>
                {!previewUrl ? (
                  <label className={`flex flex-col items-center justify-center w-full h-56 transition bg-stone-900/50 border-2 border-stone-700 border-dashed rounded-[2.5rem] cursor-pointer hover:border-emerald-500/50 hover:bg-stone-900 transition-all group ${uploading ? 'opacity-50 cursor-not-allowed' : ''} ${isDragging ? 'border-emerald-500 bg-stone-900 ring-4 ring-emerald-500/10' : ''}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center mb-4 text-stone-600 group-hover:text-emerald-500 transition-colors shadow-inner">
                        <i className="fa-solid fa-camera text-xl"></i>
                      </div>
                      <p className="text-sm text-stone-400 font-bold">{isDragging ? 'Release to Upload' : 'Click or drag photo'}</p>
                      <p className="text-[10px] text-stone-600 mt-2 uppercase tracking-widest">Max file size: 10MB</p>
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
                  <div className="relative rounded-[2.5rem] overflow-hidden h-56 border border-stone-700 group ring-4 ring-emerald-500/20 animate-in zoom-in duration-300">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button 
                        type="button"
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center text-white hover:bg-rose-700 transition-all shadow-2xl scale-90 group-hover:scale-100 transform active:scale-95"
                      >
                        <i className="fa-solid fa-trash-can text-xl"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={uploading || !selectedFile}
                className="w-full bg-emerald-600 text-white py-5 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-20 disabled:grayscale flex items-center justify-center space-x-3 transform active:scale-[0.98]"
              >
                {uploading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane text-[10px]"></i>
                    <span>Publish Memory</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-24 text-center p-12 rounded-[3rem] border border-stone-800 bg-stone-900/30">
             <i className="fa-solid fa-lock text-stone-700 text-4xl mb-6"></i>
             <h3 className="text-xl font-bold text-stone-400 mb-4">Share Your Own Photos</h3>
             <p className="text-stone-600 mb-8 max-w-xs mx-auto text-sm leading-relaxed">Join our community to upload your desert highlights and help others find the perfect spot.</p>
             <a href="#/login" className="inline-flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-300 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all">
                <span>Login to Share</span>
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
             </a>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-20 animate-in fade-in duration-1000 delay-300">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setFilter(cat)}
              className={`px-10 py-4 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all border-2 ${
                filter === cat 
                  ? 'bg-white text-stone-900 border-white shadow-[0_15px_30px_rgba(255,255,255,0.15)] scale-105' 
                  : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-stone-800/40 rounded-[3rem] h-[32rem] animate-pulse border border-stone-700/50 shadow-inner"></div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 space-y-12">
            {filteredImages.map((img, idx) => (
              <div key={img.id || idx} className="break-inside-avoid relative group rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:ring-4 hover:ring-emerald-500/30 animate-in fade-in zoom-in duration-500">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-12 flex flex-col justify-end">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 block">{img.category}</span>
                    <h5 className="text-3xl font-bold text-white leading-tight drop-shadow-2xl">{img.title}</h5>
                    <div className="w-16 h-1 bg-emerald-500 mt-6 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 delay-100"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-48 bg-stone-800/20 rounded-[5rem] border-2 border-dashed border-stone-800 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl border border-stone-800">
              <i className="fa-solid fa-camera-rotate text-4xl text-stone-700"></i>
            </div>
            <h3 className="text-4xl font-bold text-stone-600 tracking-tight">Gallery is quiet for now</h3>
            <p className="text-stone-700 mt-4 max-w-sm mx-auto text-lg leading-relaxed">Be the pioneer and share the first moment in this category!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
