
import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  const links = [
    { section: 'Primary Pages', color: 'emerald', items: [
      { path: '/', label: 'Home Experience' },
      { path: '/amenities', label: 'Premium Amenities' },
      { path: '/gallery', label: 'Vibrant Gallery' },
      { path: '/booking', label: 'Secure Booking' },
      { path: '/about', label: 'Our Heritage' },
      { path: '/contact', label: 'Direct Support' },
    ]},
    { section: 'Guest Resources', color: 'blue', items: [
      { path: '/faq', label: 'Common Queries' },
      { path: '/login', label: 'Guest Dashboard' },
      { path: '/sitemap', label: 'Digital Map' },
    ]},
  ];

  return (
    <div className="py-32 bg-white dark:bg-[#0a0a0c] min-h-screen transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent)]"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 animate-in fade-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white mb-6 tracking-tighter">Digital <span className="vibrant-text">Compass.</span></h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg font-medium">Navigating your way through our desert oasis portal.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {links.map((group, idx) => (
            <div key={idx} className="animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
              <div className="flex items-center space-x-4 mb-10">
                <div className={`w-10 h-1 bg-${group.color}-500 rounded-full`}></div>
                <h2 className={`text-[10px] font-black text-${group.color}-500 uppercase tracking-[0.4em]`}>{group.section}</h2>
              </div>
              
              <ul className="space-y-6">
                {group.items.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center text-xl font-bold text-stone-800 dark:text-stone-200 hover:text-emerald-500 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-white/5 flex items-center justify-center mr-6 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm group-hover:scale-110">
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </div>
                      <span className="tracking-tight">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-40 p-12 border-t border-stone-100 dark:border-white/5 text-center">
          <p className="text-stone-400 dark:text-stone-600 text-[10px] font-black uppercase tracking-[0.3em] italic">
            Mountain View RV Park Sitemap • Ensuring no guest is lost in the digital high desert.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
