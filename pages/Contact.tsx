
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="py-32 bg-[#fdfcfb] dark:bg-[#0a0a0c] min-h-screen transition-colors duration-500 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-500/5 rounded-full blur-[150px] -mr-64 -mt-64"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          <div className="animate-in slide-in-from-left-8 duration-1000">
            <span className="vibrant-text text-[10px] font-black uppercase tracking-[0.4em] block mb-6">Open Channels</span>
            <h1 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white mb-10 tracking-tighter leading-none">
              Reach <br/>
              <span className="vibrant-text">Out.</span>
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-lg mb-16 leading-relaxed font-medium max-w-md">
              Have questions about our hookups, local attractions, or extended stay rates? We're here to help you navigate the high desert.
            </p>
            
            <div className="space-y-10">
              <div className="flex items-center space-x-8 group">
                <div className="w-16 h-16 bg-white dark:bg-stone-900 border border-stone-100 dark:border-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <i className="fa-solid fa-location-dot text-2xl text-emerald-500 group-hover:text-white"></i>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Our Location</h4>
                  <p className="text-xl font-bold text-stone-800 dark:text-stone-200">Van Horn, TX 79855</p>
                </div>
              </div>

              <div className="flex items-center space-x-8 group">
                <div className="w-16 h-16 bg-white dark:bg-stone-900 border border-stone-100 dark:border-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <i className="fa-solid fa-phone text-2xl text-blue-500 group-hover:text-white"></i>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Phone Line</h4>
                  <p className="text-xl font-bold text-stone-800 dark:text-stone-200">(432) 283-0005</p>
                </div>
              </div>

              <div className="flex items-center space-x-8 group">
                <div className="w-16 h-16 bg-white dark:bg-stone-900 border border-stone-100 dark:border-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <i className="fa-solid fa-envelope text-2xl text-purple-500 group-hover:text-white"></i>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Digital Mail</h4>
                  <p className="text-xl font-bold text-stone-800 dark:text-stone-200">hello@mtnviewrv.com</p>
                </div>
              </div>
            </div>

            <div className="mt-20 p-10 bg-stone-900 dark:bg-white/5 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                 <i className="fa-solid fa-clock text-6xl text-white"></i>
               </div>
               <h3 className="text-white font-black text-lg mb-6 flex items-center">
                 <i className="fa-solid fa-door-open mr-3 text-emerald-500"></i>
                 Office Hours
               </h3>
               <div className="space-y-4">
                 <div className="flex justify-between text-sm font-bold">
                   <span className="text-stone-500">Mon - Sat</span>
                   <span className="text-emerald-400">8:00 AM — 8:00 PM</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold">
                   <span className="text-stone-500">Sunday</span>
                   <span className="text-emerald-400">10:00 AM — 6:00 PM</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="bg-white dark:bg-stone-900 p-12 rounded-[4rem] shadow-3xl border border-stone-100 dark:border-white/10 relative">
              <h3 className="text-3xl font-black text-stone-900 dark:text-white mb-10 tracking-tight">Direct Dispatch</h3>
              <form className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Your Identity</label>
                  <input type="text" placeholder="e.g. Maverick Jones" className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Electronic Address</label>
                  <input type="email" placeholder="maverick@pioneer.com" className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Transmission</label>
                  <textarea rows={4} placeholder="How can we assist your journey?" className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"></textarea>
                </div>
                <button type="button" onClick={() => alert('Transmission received!')} className="w-full vibrant-gradient text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center space-x-3">
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Send Transmission</span>
                </button>
              </form>
            </div>
            
            {/* Map UI */}
            <div className="mt-12 h-64 bg-stone-200 dark:bg-stone-800 rounded-[3rem] overflow-hidden relative shadow-2xl group border border-white/5">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" alt="Map View" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-2000" />
              <div className="absolute inset-0 bg-emerald-900/20"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white dark:bg-stone-900 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <i className="fa-solid fa-location-pin text-emerald-500 text-3xl"></i>
                </div>
                <div className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-xl border border-white/10">
                  Open in Google Maps
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
