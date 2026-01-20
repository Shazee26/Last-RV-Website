
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Amenities from './pages/Amenities';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Sitemap from './pages/Sitemap';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AIConcierge from './components/AIConcierge';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      '/': 'Home – Mountain View RV Park Van Horn',
      '/amenities': 'Premium Amenities – Wi-Fi, Full Hookups, Showers',
      '/gallery': 'Photo Gallery – Desert Views & Guest Memories',
      '/booking': 'Book Your Stay – Reserve RV Sites Online',
      '/about': 'Our Story – West Texas Hospitality Since 2009',
      '/contact': 'Contact Us – Get Directions to Van Horn, TX',
      '/faq': 'Frequently Asked Questions – Park Info & Policies',
      '/sitemap': 'Sitemap – Mountain View RV Park Navigation',
      '/login': 'Login – Guest Portal',
    };
    document.title = routeTitles[location.pathname] || 'Mountain View RV Park – Van Horn, TX';
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/amenities', label: 'Amenities' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/booking', label: 'Booking' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden">
      <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <i className="fa-solid fa-mountain-sun text-white text-2xl"></i>
              </div>
              <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-cyan-400">Mountain View</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <div id="google_translate_element"></div>
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-black uppercase tracking-widest transition-all hover:scale-105 ${
                    location.pathname === link.path 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                aria-label="Toggle Dark Mode"
              >
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>

              <div className="h-4 w-px bg-stone-200 dark:bg-white/10"></div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 dark:text-emerald-400 truncate max-w-[100px]">Hi, {user.email?.split('@')[0]}</span>
                  <button onClick={signOut} className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-rose-500 transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 transition-colors">
                  Login
                </Link>
              )}
              
              <Link
                to="/booking"
                className="vibrant-gradient text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
              >
                Book Now
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-300">
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-300"
              >
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu with vibrant background */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border-t border-stone-100 dark:border-white/5 animate-in slide-in-from-top-4 duration-300">
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-4 rounded-2xl text-lg font-bold tracking-tight transition-all ${
                    location.pathname === link.path 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-stone-100 dark:border-white/5">
                {user ? (
                   <button onClick={signOut} className="w-full text-left px-4 py-4 rounded-2xl text-rose-500 font-bold">Logout</button>
                ) : (
                   <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-2xl text-emerald-600 font-bold">Login / Sign Up</Link>
                )}
              </div>
              <Link
                to="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center vibrant-gradient text-white px-6 py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-stone-950 text-white pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-mountain-sun text-white"></i>
              </div>
              <span className="font-black text-xl tracking-tighter">Mountain View</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-500 font-medium">
              Your vibrant desert oasis in the heart of Van Horn, Texas. Premium sites, high-speed Wi-Fi, and the best mountain sunsets in the West.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="text-stone-500 hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/amenities" className="text-stone-500 hover:text-emerald-400 transition-colors">Amenities</Link></li>
              <li><Link to="/gallery" className="text-stone-500 hover:text-emerald-400 transition-colors">Gallery</Link></li>
              <li><Link to="/booking" className="text-stone-500 hover:text-emerald-400 transition-colors">Book Stay</Link></li>
              <li><Link to="/sitemap" className="text-stone-500 hover:text-emerald-400 transition-colors">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Reach Out</h4>
            <ul className="space-y-4 text-sm font-bold text-stone-500">
              <li className="flex items-center"><i className="fa-solid fa-location-dot mr-3 text-emerald-500"></i> Van Horn, TX 79855</li>
              <li className="flex items-center"><i className="fa-solid fa-phone mr-3 text-emerald-500"></i> (432) 283-0005</li>
              <li className="flex items-center"><i className="fa-solid fa-envelope mr-3 text-emerald-500"></i> hello@mtnviewrv.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Community</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all text-stone-400 hover:text-white">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all text-stone-400 hover:text-white">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all text-stone-400 hover:text-white">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-600">
          <p>&copy; {new Date().getFullYear()} Mountain View RV Park. Crafted for Pioneers.</p>
          <Link to="/sitemap" className="mt-4 md:mt-0 hover:text-white transition-colors">Sitemap Navigation</Link>
        </div>
      </footer>
      
      <AIConcierge />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
