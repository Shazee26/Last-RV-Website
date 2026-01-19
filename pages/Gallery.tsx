
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GalleryImage } from '../types/database';

const FEATURED_IMAGES: GalleryImage[] = [
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_10.png', title: 'Sierra Blanca Glow', category: 'Scenery' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_11.png', title: 'Desert Peak View', category: 'Scenery' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_15.png', title: 'Van Horn High Plains', category: 'Scenery' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_16.png', title: 'Golden Hour Site', category: 'Sunsets' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_2.png', title: 'Mountain View Arrival', category: 'Facilities' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_26.png', title: 'Dusk Over Site 26', category: 'Sunsets' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_27.png', title: 'Starlit Horizon', category: 'Scenery' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_30.png', title: 'RV Oasis View', category: 'RVs' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_32.png', title: 'Big Rig Friendly Space', category: 'Facilities' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_33.png', title: 'Desert Garden Walk', category: 'Facilities' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_34.png', title: 'Southwestern Twilight', category: 'Sunsets' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_36.png', title: 'Mountain Vista Row', category: 'RVs' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_37.png', title: 'High Desert Silence', category: 'Scenery' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_38.png', title: 'The Lone Peak', category: 'Scenery' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_7.png', title: 'Morning Light Arrival', category: 'Facilities' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_8.png', title: 'Sunset Silhouette', category: 'Sunsets' },
  { url: 'https://uvgnawiblpatnqhjeqmc.supabase.co/storage/v1/object/public/Gallery/AIEnhancer_9.png', title: 'Quiet Desert Road', category: 'Scenery' }
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
  const [submissionMode, setSubmissionMode] = useState<'file' | 'link'>('file');
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const categories = ["All", "Scenery", "Facilities", "Sunsets", "RVs"];
  const uploadableCategories = ["Scenery", "Facilities", "Sunsets", "RVs"];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 400;

  const fetchGallery = async (isManualRefresh = false) => {
    if (!isManualRefresh) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const dbImages = data || [];
      // Combine manual uploads from DB with the specific requested FEATURED_IMAGES
      setImages([...dbImages, ...FEATURED_IMAGES]);
    } catch (err: any) {
      console.error('Gallery fetch error:', err?.message || err);
      if (!isManualRefresh) setImages(FEATURED_IMAGES);
    } finally {
      if (!isManualRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const validateDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img.width >= MIN_WIDTH && img.height >= MIN_HEIGHT);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(false);
      };
    });
  };

  const handleFile = async (file: File) => {
    setStatus(null);
    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setStatus({ type: 'error', message: 'File is too large (Max 10MB).' });
      return;
    }
    const isValid = await validateDimensions(file);
    if (!isValid) {
      setStatus({ type: 'error', message: `Image resolution must be at least ${MIN_WIDTH}x${MIN_HEIGHT}.` });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (!uploadTitle) setUploadTitle(file.name.split('.')[0].replace(/[-_]/g, ' '));
  };

  const handleLinkPreview = (url: string) => {
    setExternalUrl(url);
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/) || url.includes('supabase.co')) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setUploading(true);
    setStatus(null);

    try {
      let finalUrl = "";

      if (submissionMode === 'file' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = `uploads/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);
        finalUrl = publicUrl;
      } else if (submissionMode === 'link' && externalUrl) {
        finalUrl = externalUrl;
      } else {
        throw new Error("Please select a file or provide a valid link.");
      }

      const { data: insertedData, error: dbError } = await supabase
        .from('gallery_images')
        .insert([{ 
          url: finalUrl, 
          title: uploadTitle || 'Guest Memory', 
          category: uploadCategory,
          user_id: user.id 
        }])
        .select();

      if (dbError) throw dbError;

      // Optimistically add the new image to the top of the list immediately
      if (insertedData && insertedData[0]) {
        setImages(prev => [insertedData[0], ...prev]);
      }

      // Reset form and UI state
      setUploadTitle("");
      setExternalUrl("");
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Crucial: Reset filter to "All" so the user definitely sees their new image
      setFilter("All");
      
      setStatus({ type: 'success', message: 'Memory added successfully!' });
      
      // Re-fetch in the background to ensure everything is perfectly in sync
      fetchGallery(true);
      
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      console.error('Gallery upload error:', err?.message || err);
      setStatus({ type: 'error', message: err?.message || 'Operation failed.' });
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
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Mountain View Chronicles</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Park Gallery</h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A collective of memories from our desert oasis. Browse our latest updates and high-desert panoramas.
          </p>
        </div>

        {user ? (
          <div className="max-w-3xl mx-auto mb-24 p-8 bg-stone-800/40 backdrop-blur-xl rounded-[3rem] border border-stone-700 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <h4 className="font-bold text-xl flex items-center">
                <i className="fa-solid fa-camera-retro mr-3 text-emerald-500"></i>
                Pin a Memory
              </h4>
              <div className="flex bg-stone-900/80 p-1 rounded-2xl border border-stone-700">
                <button 
                  onClick={() => { setSubmissionMode('file'); setPreviewUrl(null); }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${submissionMode === 'file' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                >
                  <i className="fa-solid fa-file-arrow-up mr-2"></i> File
                </button>
                <button 
                  onClick={() => { setSubmissionMode('link'); setPreviewUrl(null); }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${submissionMode === 'link' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                >
                  <i className="fa-solid fa-link mr-2"></i> Link
                </button>
              </div>
            </div>

            {status && (
              <div className={`mb-8 p-4 rounded-2xl flex items-center space-x-3 text-sm animate-in zoom-in duration-300 ${
                status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                <span>{status.message}</span>
              </div>
            )}
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Caption</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sunset at Site 12"
                    className="w-full bg-stone-900 border border-stone-700 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Category</label>
                  <select 
                    className="w-full bg-stone-900 border border-stone-700 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                  >
                    {uploadableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {submissionMode === 'file' ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                >
                  {!previewUrl ? (
                    <label className={`flex flex-col items-center justify-center w-full h-48 transition bg-stone-900/50 border-2 border-stone-700 border-dashed rounded-[2rem] cursor-pointer hover:border-emerald-500 group ${isDragging ? 'border-emerald-500 bg-stone-900' : ''}`}>
                      <i className="fa-solid fa-cloud-arrow-up text-2xl text-stone-600 group-hover:text-emerald-500 mb-3"></i>
                      <p className="text-sm text-stone-400 font-bold">Click or drag image file</p>
                      <p className="text-[10px] text-stone-600 mt-1 uppercase tracking-widest">JPG, PNG, WEBP (Max 10MB)</p>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                    </label>
                  ) : (
                    <div className="relative rounded-[2rem] overflow-hidden h-48 border border-stone-700 group ring-4 ring-emerald-500/10">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <i className="fa-solid fa-trash-can text-2xl"></i>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">Image URL</label>
                    <input 
                      type="url"
                      required
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-stone-900 border border-stone-700 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={externalUrl}
                      onChange={(e) => handleLinkPreview(e.target.value)}
                    />
                  </div>
                  {previewUrl && (
                    <div className="relative rounded-[2rem] overflow-hidden h-48 border border-stone-700 animate-in zoom-in duration-300">
                      <img src={previewUrl} alt="Link Preview" className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-stone-950/80 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-400">Preview</div>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={uploading || (!selectedFile && !externalUrl)}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-700 transition-all shadow-xl disabled:opacity-20 flex items-center justify-center space-x-3"
              >
                {uploading ? <><i className="fa-solid fa-spinner animate-spin"></i><span>Processing...</span></> : <><i className="fa-solid fa-paper-plane"></i><span>Post to Gallery</span></>}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-xl mx-auto mb-24 text-center p-12 rounded-[3rem] border border-stone-800 bg-stone-900/30">
             <i className="fa-solid fa-lock text-stone-700 text-4xl mb-6"></i>
             <h3 className="text-xl font-bold text-stone-400 mb-4">Share Your Journey</h3>
             <p className="text-stone-600 mb-8 text-sm leading-relaxed">Login to upload photos or add image links directly to our community wall.</p>
             <a href="#/login" className="inline-flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-300 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all">
                <span>Sign In to Post</span>
             </a>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all border-2 ${filter === cat ? 'bg-white text-stone-900 border-white shadow-xl' : 'border-stone-800 text-stone-500 hover:border-stone-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="bg-stone-800/40 rounded-[3rem] h-96 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredImages.map((img, idx) => (
              <div key={img.id || idx} className="break-inside-avoid relative group rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:ring-2 hover:ring-emerald-500/50 animate-in fade-in zoom-in duration-500">
                <img src={img.url} alt={img.title} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2">{img.category}</span>
                   <h5 className="text-xl font-bold text-white">{img.title}</h5>
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
