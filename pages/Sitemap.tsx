import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  const links = [
    { section: 'Primary Pages', items: [
      { path: '/', label: 'Home' },
      { path: '/amenities', label: 'Amenities' },
      { path: '/gallery', label: 'Gallery' },
      { path: '/booking', label: 'Booking' },
      { path: '/about', label: 'About Our Park' },
      { path: '/contact', label: 'Contact Us' },
    ]},
    { section: 'Guest Resources', items: [
      { path: '/faq', label: 'Frequently Asked Questions' },
      { path: '/login', label: 'Guest Login / Registration' },
    ]},
  ];

  return (
    <div className="py-20 bg-stone-50 dark:bg-stone-950 transition-colors duration-300 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100 mb-12">Website Sitemap</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {links.map((group, idx) => (
            <div key={idx}>
              <h2 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.3em] mb-6">{group.section}</h2>
              <ul className="space-y-4">
                {group.items.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.path} 
                      className="text-lg text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center group transition-colors"
                    >
                      <i className="fa-solid fa-chevron-right text-[10px] mr-3 opacity-0 group-hover:opacity-100 transition-all"></i>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-20 pt-12 border-t border-stone-200 dark:border-stone-800">
          <p className="text-stone-400 dark:text-stone-600 text-sm italic">
            Mountain View RV Park Sitemap – Helping travelers navigate their way to a better West Texas stay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;