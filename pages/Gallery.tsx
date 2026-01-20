
import React, { useEffect, useState } from 'react';
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
  
  // Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Scenery");
  const [uploadCheckIn, setUploadCheckIn] = useState("");
  const [uploadCheckOut, setUploadCheckOut] = useState("");
  const [submissionMode, setSubmissionMode] = useState<'file' | 'link'>('file');
  const [externalUrl, setExternalUrl] = useState("");
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
      setImages([...(data || []), ...FEATURED_IMAGES]);
    } catch (err: any) {
      console.error('Gallery fetch error:', err);
      setImages(FEATURED_IMAGES);
    } finally {
      if (!isManualRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (file: File) => {
    setStatus(null);
    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select an image file.' });
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (!uploadTitle) setUploadTitle(file.name.split('.')[0].replace(/[-_]/g, ' '));
  };

  const handleUrlChange = (url: string) => {
    setExternalUrl(url);
    if (!url) {
      setPreviewUrl(null);
      return;
    }
    // Basic regex for visual feedback, but let the browser try to render it anyway
    if (url.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i) || url.includes('supabase.co')) {
      setPreviewUrl(url);
    } else {
      // Still set preview but it might fail, which is handled by img onError
      setPreviewUrl(url);
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
        // Simple validation
        if (!externalUrl.startsWith('http')) {
          throw new Error("Please provide a valid URL starting with http or https.");
        }
        finalUrl = externalUrl;
      } else {
        throw new Error("Please select a file or provide an external image link.");
      }

      const { data: inserted, error: dbError } = await supabase
        .from('gallery_images')
        .insert([{ 
          url: finalUrl, 
          title: uploadTitle || 'Guest Memory', 
          category: uploadCategory,
          check_in: uploadCheckIn || null,
          check_out: uploadCheckOut || null,
          user_id: user.id 
        }])
        .select();

      if (dbError) throw dbError;

      // Optimistic update
      if (inserted && inserted[0]) {
        setImages(prev => [inserted[0], ...prev]);
      }

      // Cleanup
      setUploadTitle("");
      setUploadCheckIn("");
      setUploadCheckOut("");
      setExternalUrl("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setFilter("All");
      setStatus({ type: 'success', message: 'Your memory has been pinned to our wall!' });
      
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setStatus({ type: 'error', message: err.message || 'Failed to share memory.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-20 bg-stone-900 text-white min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] block mb-4">Park Chronicles</span>
          <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter">Guest Gallery</h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every snapshot tells a story of the high desert. Share your journey or browse our community memories.
          </p>
        </div>

        {/* Upload Form (Visible only to logged-in users) */}
        {user ? (
          <div className="max-w-3xl mx-auto mb-24 p-10 bg-stone-800/40 backdrop-blur-2xl rounded-[3rem] border border-stone-700 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <i className="fa-solid fa-camera-retro text-[10rem] rotate-12"></i>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
              <div>
                <h4 className="font-bold text-2xl flex items-center">
                  <i className="fa-solid fa-plus-circle mr-3 text-emerald-500"></i>
                  Pin a Memory
                </h4>
                <p className="text-stone-500 text-xs mt-1 font-medium">Contribute to our community wall</p>
              </div>
              <div className="flex bg-stone-950/50 p-1.5 rounded-2xl border border-stone-700 shadow-inner">
                <button 
                  onClick={() => { setSubmissionMode('file'); setPreviewUrl(null); }}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${submissionMode === 'file' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                >
                  <i className="fa-solid fa-file-arrow-up mr-2"></i> File Upload
                </button>
                <button 
                  onClick={() => { setSubmissionMode('link'); setPreviewUrl(null); }}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${submissionMode === 'link' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                >
                  <i className="fa-solid fa-link mr-2"></i> External Link
                </button>
              </div>
            </div>

            {status && (
              <div className={`mb-8 p-5 rounded-2xl flex items-center space-x-4 text-sm animate-in zoom-in duration-300 border ${
                status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-lg`}></i>
                <span className="font-medium">{status.message}</span>
              </div>
            )}
            
            <form onSubmit={handleUpload} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest">Memory Caption</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sierra Blanca Twilight"
                    className="w-full bg-stone-900/50 border border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-stone-700"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full bg-stone-900/50 border border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                  >
                    {uploadableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest">Arrival Date <span className="text-stone-700 ml-1">(Optional)</span></label>
                  <input 
                    type="date"
                    className="w-full bg-stone-900/50 border border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white"
                    value={uploadCheckIn}
                    onChange={(e) => setUploadCheckIn(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest">Departure Date <span className="text-stone-700 ml-1">(Optional)</span></label>
                  <input 
                    type="date"
                    className="w-full bg-stone-900/50 border border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white"
                    value={uploadCheckOut}
                    onChange={(e) => setUploadCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {submissionMode === 'file' ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]); }}
                >
                  {!previewUrl ? (
                    <label className={`flex flex-col items-center justify-center w-full h-56 transition bg-stone-950/20 border-2 border-stone-700 border-dashed rounded-[2.5rem] cursor-pointer hover:border-emerald-500 hover:bg-stone-900/40 group ${isDragging ? 'border-emerald-500 bg-stone-900' : ''}`}>
                      <i className="fa-solid fa-cloud-arrow-up text-3xl text-stone-700 group-hover:text-emerald-500 mb-4 transition-colors"></i>
                      <p className="text-sm text-stone-400 font-bold tracking-tight">Drop memory or click to browse</p>
                      <p className="text-[9px] text-stone-600 mt-2 uppercase font-black tracking-[0.2em]">Max size: 10MB</p>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileChange(e.target.files[0])} />
                    </label>
                  ) : (
                    <div className="relative rounded-[2.5rem] overflow-hidden h-56 border border-stone-700 group ring-4 ring-emerald-500/10">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
                      <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <div className="flex flex-col items-center">
                          <i className="fa-solid fa-trash-can text-3xl mb-2"></i>
                          <span className="text-[10px] font-black uppercase tracking-widest">Remove File</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest">External Image Link</label>
                    <div className="relative">
                      <i className="fa-solid fa-link absolute left-6 top-1/2 -translate-y-1/2 text-stone-600"></i>
                      <input 
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/photo-123..."
                        className="w-full bg-stone-900/50 border border-stone-700 rounded-2xl pl-14 pr-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-stone-700"
                        value={externalUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                      />
                    </div>
                  </div>
                  {previewUrl && (
                    <div className="relative rounded-[2.5rem] overflow-hidden h-56 border border-stone-700 group ring-4 ring-emerald-500/10 animate-in zoom-in duration-500">
                      <img 
                        src={previewUrl} 
                        alt="Link Preview" 
                        className="w-full h-full object-cover" 
                        onError={() => setStatus({ type: 'error', message: 'Unable to preview this link. Please check if it is a direct image URL.' })}
                      />
                      <div className="absolute top-6 right-6 bg-stone-950/90 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                        URL Preview
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={uploading || (!selectedFile && !externalUrl)}
                className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-20 flex items-center justify-center space-x-3 transform active:scale-[0.98]"
              >
                {uploading ? (
                  <><i className="fa-solid fa-spinner animate-spin"></i><span>Processing Memory...</span></>
                ) : (
                  <><i className="fa-solid fa-paper-plane"></i><span>Share with the Community</span></>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-xl mx-auto mb-24 text-center p-16 rounded-[3rem] border border-stone-800 bg-stone-950/30 backdrop-blur-sm relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <i className="fa-solid fa-lock text-stone-800 text-5xl mb-8 transform group-hover:scale-110 transition-transform"></i>
             <h3 className="text-2xl font-bold text-stone-300 mb-4">Become a Contributor</h3>
             <p className="text-stone-500 mb-10 text-sm leading-relaxed max-w-xs mx-auto font-medium">Log in to upload your own high-desert photography or link external memories to our gallery.</p>
             <a href="#/login" className="inline-flex items-center space-x-3 bg-white text-stone-950 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-500 hover:text-white shadow-xl">
                <span>Sign In to Participate</span>
                <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i>
             </a>
          </div>
        )}

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-20 animate-in fade-in duration-1000 delay-300">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`px-10 py-3.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all border-2 ${
                filter === cat 
                  ? 'bg-white text-stone-950 border-white shadow-2xl shadow-white/10' 
                  : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-stone-800/20 rounded-[3rem] h-96 animate-pulse border border-stone-800/30"></div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-10 space-y-10">
            {images.filter(img => filter === "All" || img.category === filter).map((img, idx) => (
              <div 
                key={img.id || idx} 
                className="break-inside-avoid relative group rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-emerald-500/10 animate-in fade-in zoom-in duration-700"
              >
                <div className="aspect-square bg-stone-800 overflow-hidden">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                    loading="lazy" 
                  />
                </div>
                
                {/* Overlay Metadata */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-10 flex flex-col justify-end">
                   <div className="flex justify-between items-end mb-3">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                       {img.category}
                     </span>
                     {(img.check_in || img.check_out) && (
                       <span className="text-[8px] font-black text-stone-400 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-stone-700/50 uppercase tracking-widest">
                         {img.check_in ? new Date(img.check_in + 'T00:00:00').toLocaleDateString() : '...'} Trip
                       </span>
                     )}
                   </div>
                   <h5 className="text-2xl font-bold text-white tracking-tight leading-tight mb-2">{img.title}</h5>
                   <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Community Contributor</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!loading && images.filter(img => filter === "All" || img.category === filter).length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-stone-800 rounded-[4rem]">
             <i className="fa-solid fa-mountain-sun text-stone-800 text-6xl mb-6"></i>
             <p className="text-stone-600 font-bold tracking-widest uppercase text-sm">No memories found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
