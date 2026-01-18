
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

  // Dynamic SEO Page Titles
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
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <nav className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <i className="fa-solid fa-mountain-sun text-emerald-700 dark:text-emerald-500 text-4xl"></i>
              <span className="font-bold text-2xl tracking-tight text-stone-800 dark:text-stone-100">Mountain View RV</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <div id="google_translate_element" className="mr-2"></div>
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 ${
                    location.pathname === link.path ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                aria-label="Toggle Dark Mode"
              >
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>

              <div className="h-4 w-px bg-stone-200 dark:bg-stone-700"></div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-stone-400 font-medium truncate max-w-[100px]">Hi, {user.email?.split('@')[0]}</span>
                  <button onClick={signOut} className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-rose-600 transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-bold text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400">
                  Login
                </Link>
              )}
            </div>

            <Link
              to="/booking"
              className="hidden md:block bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition-all shadow-md"
            >
              Book Now
            </Link>

            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-stone-600 dark:text-stone-300">
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-stone-600 dark:text-stone-300 hover:text-emerald-700 focus:outline-none"
              >
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium ${
                    location.pathname === link.path 
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' 
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-3 border-t border-stone-100 dark:border-stone-800">
                <div id="google_translate_element_mobile"></div>
              </div>
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-emerald-700 dark:text-emerald-400"
                >
                  Login / Sign Up
                </Link>
              )}
              {user && (
                <button
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-rose-600"
                >
                  Logout
                </button>
              )}
              <Link
                to="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-emerald-700 text-white px-6 py-3 rounded-lg text-base font-semibold"
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

      <footer className="bg-stone-900 dark:bg-black text-stone-300 py-12 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4 text-white">
              <i className="fa-solid fa-mountain-sun text-emerald-500 text-3xl"></i>
              <span className="font-bold text-2xl tracking-tight">Mountain View RV</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Your peaceful desert oasis in the heart of Van Horn, Texas.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-emerald-400">Home</Link></li>
              <li><Link to="/amenities" className="hover:text-emerald-400">Amenities</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400">FAQ</Link></li>
              <li><Link to="/booking" className="hover:text-emerald-400">Book A Spot</Link></li>
              <li><Link to="/sitemap" className="hover:text-emerald-400">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>810 Frontage Rd, Van Horn, TX 79855</li>
              <li>(432) 283-0005</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-700 transition-colors">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-700 transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Mountain View RV Park. Optimized for SEO & Search.</p>
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
