
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
import Activities from './pages/Activities';
import ProtectedRoute from './components/ProtectedRoute';
import AIConcierge from './components/AIConcierge';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      '/activities': 'Local Activities – Hiking, Stargazing & Dining',
    };
    document.title = routeTitles[location.pathname] || 'Mountain View RV Park – Van Horn, TX';
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/amenities', label: 'Amenities' },
    { path: '/activities', label: 'Activities' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/booking', label: 'Booking' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden">
      {/* Precision Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`glass px-8 py-4 rounded-3xl transition-all duration-500 flex justify-between items-center ${scrolled ? 'shadow-soft border-brand-primary/10' : 'border-transparent'}`}>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-vibrant group-hover:rotate-12 transition-all duration-500">
                <i className="fa-solid fa-mountain-sun text-white text-lg"></i>
              </div>
              <span className="font-black text-xl tracking-tighter text-stone-900 dark:text-white">Mountain <span className="text-brand-primary">View</span></span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              <div id="google_translate_element" className="opacity-80 hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center space-x-8 border-x border-stone-100 dark:border-white/5 px-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                      location.pathname === link.path 
                        ? 'text-brand-primary' 
                        : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-brand-primary transition-all duration-300 ${location.pathname === link.path ? 'opacity-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'}`}></span>
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-brand-primary transition-all"
                  aria-label="Toggle Dark Mode"
                >
                  <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>

                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-brand-primary">Hi, {user.email?.split('@')[0]}</span>
                    <button onClick={signOut} className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-rose-500 transition-colors">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-brand-primary transition-colors">
                    Login
                  </Link>
                )}
                
                <Link
                  to="/booking"
                  className="vibrant-gradient text-white px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-vibrant"
                >
                  Reserve Site
                </Link>
              </div>
            </div>

            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-300"
              >
                <div className="space-y-1.5">
                  <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Refined */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[110] bg-brand-light/95 dark:bg-brand-dark/95 backdrop-blur-3xl animate-in fade-in duration-300">
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-16">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                    <i className="fa-solid fa-mountain-sun text-white"></i>
                  </div>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-100 dark:bg-white/5">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4 flex-grow overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-4xl font-black tracking-tighter text-stone-900 dark:text-white hover:text-brand-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-8 border-t border-stone-100 dark:border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center space-x-3 text-stone-500">
                    <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                    <span className="text-xs font-bold">Switch Theme</span>
                  </button>
                  {user && <button onClick={signOut} className="text-xs font-bold text-rose-500">Sign Out</button>}
                </div>
                <Link
                  to="/booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center vibrant-gradient text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-vibrant"
                >
                  Book Your Stay
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-32 lg:pt-0">
        {children}
      </main>

      {/* Modern High-Contrast Footer */}
      <footer className="bg-brand-dark text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-4">
              <Link to="/" className="flex items-center space-x-3 mb-10 group">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shadow-vibrant transition-transform group-hover:scale-110">
                  <i className="fa-solid fa-mountain-sun text-white text-xl"></i>
                </div>
                <span className="font-black text-3xl tracking-tighter">Mountain View</span>
              </Link>
              <p className="text-stone-500 text-lg font-medium leading-relaxed max-w-sm">
                Redefining the West Texas RV experience with a fusion of primitive beauty and modern luxury.
              </p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] mb-10">Explore</h4>
              <ul className="space-y-6 text-sm font-bold">
                <li><Link to="/amenities" className="text-stone-400 hover:text-white transition-colors">Amenities</Link></li>
                <li><Link to="/activities" className="text-stone-400 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/gallery" className="text-stone-400 hover:text-white transition-colors">Gallery</Link></li>
                <li><Link to="/booking" className="text-stone-400 hover:text-white transition-colors">Reservations</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] mb-10">Connect</h4>
              <ul className="space-y-6 text-sm font-bold">
                <li className="flex items-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-brand-primary/20 transition-all">
                    <i className="fa-solid fa-phone text-xs text-brand-primary"></i>
                  </div>
                  <span className="text-stone-400 group-hover:text-white transition-colors">(432) 283-0005</span>
                </li>
                <li className="flex items-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-brand-primary/20 transition-all">
                    <i className="fa-solid fa-envelope text-xs text-brand-primary"></i>
                  </div>
                  <span className="text-stone-400 group-hover:text-white transition-colors">hello@mtnviewrv.com</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] mb-10">Social Sphere</h4>
              <div className="flex space-x-4 mb-8">
                {['facebook-f', 'instagram', 'tiktok', 'youtube'].map((icon) => (
                  <a key={icon} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-brand-primary transition-all duration-500 shadow-xl border border-white/5">
                    <i className={`fa-brands fa-${icon}`}></i>
                  </a>
                ))}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-stone-700">Experience the #MountainViewWay</p>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-700">&copy; {new Date().getFullYear()} MTN VIEW RV</span>
              <div className="h-1 w-1 rounded-full bg-stone-800"></div>
              <Link to="/sitemap" className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-700 hover:text-brand-primary transition-colors">Sitemap</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Van Horn, Texas • Cloud Sync Active</span>
              </div>
            </div>
          </div>
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
            <Route path="/activities" element={<Activities />} />
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
