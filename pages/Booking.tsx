
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Booking as BookingType } from '../types/database';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

const Booking: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState<Omit<BookingType, 'id' | 'created_at'>>({
    name: '',
    email: user?.email || '',
    check_in: '',
    check_out: '',
    rv_size: 'standard',
    guests: 2,
    user_id: user?.id || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [myBookings, setMyBookings] = useState<BookingType[]>([]);
  const [isLoadingMyBookings, setIsLoadingMyBookings] = useState(true);

  const fetchMyBookings = async () => {
    if (!user) return;
    setIsLoadingMyBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('check_in', { ascending: false });

      if (error) throw error;
      setMyBookings(data || []);
    } catch (err) {
      console.error('Error fetching my bookings:', err);
    } finally {
      setIsLoadingMyBookings(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    
    try {
      // Basic validation for dates
      if (new Date(formData.check_in) >= new Date(formData.check_out)) {
        throw new Error("Check-out date must be after check-in date.");
      }

      const payload = { 
        ...formData, 
        user_id: user?.id || null 
      };

      const { error } = await supabase
        .from('bookings')
        .insert([payload]);

      if (error) throw error;

      setStatus({ 
        type: 'success', 
        message: "Howdy! Your reservation request was sent. We'll send a confirmation email shortly." 
      });
      
      setFormData({ 
        name: '', 
        email: user?.email || '', 
        check_in: '', 
        check_out: '', 
        rv_size: 'standard', 
        guests: 2, 
        user_id: user?.id || '' 
      });
      
      setRefreshKey(prev => prev + 1); // Trigger calendar refresh
      fetchMyBookings(); // Refresh user list
    } catch (err: any) {
      console.error('Booking Error:', err);
      setStatus({ 
        type: 'error', 
        message: err.message || "Something went wrong. Please call us at (432) 555-0123." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 px-4 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-grow space-y-8">
            {/* Booking Form Card */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100">
              <div className="flex items-center space-x-3 mb-2">
                <i className="fa-solid fa-caravan text-emerald-600 text-2xl"></i>
                <h1 className="text-4xl font-bold text-stone-800 tracking-tight">New Reservation</h1>
              </div>
              <p className="text-stone-500 mb-10">Choose your dates and rig size to join us in Van Horn.</p>
              
              {status && (
                <div className={`mb-8 p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
                }`}>
                  <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                  <p className="text-sm font-medium">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Guest Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Jane Smith"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-stone-300"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Email (Account)</label>
                    <input 
                      type="email" 
                      disabled
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 outline-none text-stone-500 cursor-not-allowed italic"
                      value={formData.email}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Check-In</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.check_in}
                      onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Check-Out</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.check_out}
                      onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">RV Class/Size</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.rv_size}
                      onChange={(e) => setFormData({...formData, rv_size: e.target.value})}
                    >
                      <option value="standard">Standard (up to 30ft)</option>
                      <option value="large">Large (30ft - 45ft)</option>
                      <option value="premium">Premium Pull-Through</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Number of Guests</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-xl hover:shadow-emerald-900/10 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      <span>Send Reservation Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* My Bookings List Card */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-stone-800 flex items-center">
                  <i className="fa-solid fa-bookmark mr-3 text-emerald-600 text-lg"></i>
                  Your Reservation History
                </h2>
                <button onClick={fetchMyBookings} className="text-stone-400 hover:text-emerald-600 transition-colors">
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
              </div>

              {isLoadingMyBookings ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-stone-50 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : myBookings.length > 0 ? (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-white transition-all hover:shadow-md group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex flex-col items-center justify-center">
                          <span className="text-[10px] font-bold uppercase leading-none">{new Date(b.check_in).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-lg font-bold leading-none mt-1">{new Date(b.check_in).getDate()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-stone-800">{b.name}</p>
                          <p className="text-xs text-stone-400 font-medium">
                            {new Date(b.check_in).toLocaleDateString()} — {new Date(b.check_out).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end space-x-6">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{b.rv_size}</p>
                          <p className="text-xs text-stone-500">{b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                          Reviewing
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-stone-100 rounded-3xl">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-calendar-day text-stone-200 text-2xl"></i>
                  </div>
                  <p className="text-stone-400 font-medium">Your stay history will appear here.</p>
                  <p className="text-stone-300 text-xs mt-1">Book your first desert adventure above!</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-96 space-y-8">
            <AvailabilityCalendar refreshKey={refreshKey} />
            
            <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <i className="fa-solid fa-certificate absolute -top-4 -right-4 text-white/5 text-8xl transform rotate-12 group-hover:rotate-45 transition-transform duration-700"></i>
              <h3 className="text-xl font-bold mb-6 relative z-10">Transparent Pricing</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-stone-400 text-sm">Daily Rate</span>
                  <span className="font-bold">$45.00</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-stone-400 text-sm">Weekly Rate</span>
                  <span className="font-bold">$275.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 text-sm">Monthly Rate</span>
                  <span className="font-bold text-emerald-400">$750.00</span>
                </div>
              </div>
              <p className="mt-8 text-[10px] text-stone-500 italic leading-relaxed">
                * Rates include full hookups (30/50 amp), high-speed Wi-Fi, and access to all park facilities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h4 className="font-bold text-stone-800 mb-4">Questions?</h4>
              <p className="text-sm text-stone-500 mb-6">Our on-site team is available 24/7 for urgent arrivals.</p>
              <a href="tel:4325550123" className="flex items-center space-x-3 text-emerald-700 font-bold hover:scale-105 transition-transform origin-left">
                <i className="fa-solid fa-phone-volume"></i>
                <span>(432) 555-0123</span>
              </a>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Booking;
