
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Amenities from './pages/Amenities';
import Booking from './pages/Booking';
import Reviews from './pages/Reviews';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AIConcierge from './components/AIConcierge';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/amenities', label: 'Amenities' },
    { path: '/booking', label: 'Booking' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <i className="fa-solid fa-mountain-sun text-emerald-700 text-3xl"></i>
              <span className="font-bold text-xl tracking-tight text-stone-800">Mountain View RV</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                    location.pathname === link.path ? 'text-emerald-700' : 'text-stone-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-4 w-px bg-stone-200"></div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-stone-400 font-medium truncate max-w-[100px]">Hi, {user.email?.split('@')[0]}</span>
                  <button onClick={signOut} className="text-xs font-bold text-stone-600 hover:text-rose-600 transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-bold text-emerald-700 hover:text-emerald-800">
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

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-stone-600 hover:text-emerald-700 focus:outline-none"
              >
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium ${
                    location.pathname === link.path 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-emerald-700"
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

      <footer className="bg-stone-900 text-stone-300 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4 text-white">
              <i className="fa-solid fa-mountain-sun text-emerald-500 text-2xl"></i>
              <span className="font-bold text-xl tracking-tight">Mountain View RV</span>
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
              <li><Link to="/booking" className="hover:text-emerald-400">Book A Spot</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Van Horn, TX 79855</li>
              <li>(432) 555-0123</li>
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
          &copy; {new Date().getFullYear()} Mountain View RV Park.
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
            <Route path="/about" element={<About />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
