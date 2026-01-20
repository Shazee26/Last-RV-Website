
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] relative overflow-hidden transition-colors duration-500 py-32">
      {/* Decorative Vibrant Orbs */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mt-64"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-[100px] -mr-32 -mb-32"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="animate-in slide-in-from-left-8 duration-1000">
            <span className="vibrant-text text-[10px] font-black uppercase tracking-[0.4em] block mb-6">Our Legacy</span>
            <h1 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white mb-10 tracking-tighter leading-none">
              Desert <br/>
              <span className="vibrant-text">Spirit.</span>
            </h1>
            
            <div className="space-y-8 text-stone-500 dark:text-stone-400 leading-relaxed text-lg font-medium">
              <p>
                Mountain View RV Park was born out of a love for the expansive beauty of the West Texas desert. For years, we've provided travelers with a clean, peaceful, and professional home away from home.
              </p>
              <p>
                Located in the historic town of Van Horn, we pride ourselves on being more than just a place to park. We are a gateway to adventure, positioned perfectly between major national parks and cosmic wonders like the McDonald Observatory.
              </p>
              <p>
                Our team is dedicated to your comfort. Whether you're passing through on your way to the coast or settling in for a week of exploration, we ensure that every guest experiences true southern hospitality.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-stone-100 dark:border-white/5 pt-12">
              <div>
                <p className="text-4xl font-black text-emerald-500 tracking-tighter">15+</p>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-widest mt-2">Years Active</p>
              </div>
              <div>
                <p className="text-4xl font-black text-blue-500 tracking-tighter">50+</p>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-widest mt-2">Spacious Sites</p>
              </div>
              <div>
                <p className="text-4xl font-black text-purple-500 tracking-tighter">4.9</p>
                <p className="text-[9px] text-stone-400 uppercase font-black tracking-widest mt-2">Avg Rating</p>
              </div>
            </div>
          </div>

          <div className="relative animate-in slide-in-from-right-8 duration-1000">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl border-8 border-white dark:border-stone-900 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1523741543316-bee7af9ad89a?q=80&w=1974&auto=format&fit=crop" alt="Mountain View Staff" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
            </div>
            
            <div className="absolute -bottom-10 -left-10 bg-white dark:bg-stone-900 p-10 rounded-[2.5rem] shadow-2xl border border-stone-100 dark:border-white/5 max-w-xs hidden lg:block transform -rotate-3 group">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
                <i className="fa-solid fa-quote-left text-xl"></i>
              </div>
              <p className="text-stone-800 dark:text-stone-200 font-bold text-xl leading-snug mb-4">"The high desert's most vibrant sanctuary."</p>
              <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">— Frontier Weekly</p>
            </div>

            {/* Neon Accent */}
            <div className="absolute top-1/2 -right-4 w-24 h-24 vibrant-gradient rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
