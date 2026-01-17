
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Booking as BookingType } from '../types/database';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

const Booking: React.FC = () => {
  const { user } = useAuth();
  const [globalBookedDates, setGlobalBookedDates] = useState<Set<string>>(new Set());
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(true);
  
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

  // Fetch ALL bookings for the calendar
  const fetchGlobalAvailability = async () => {
    setIsLoadingGlobal(true);
    try {
      const { data, error } = await supabase.from('bookings').select('check_in, check_out');
      if (error) throw error;

      const dates = new Set<string>();
      data.forEach((booking: any) => {
        const start = new Date(booking.check_in + 'T00:00:00');
        const end = new Date(booking.check_out + 'T00:00:00');
        let current = new Date(start);
        while (current <= end) {
          dates.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
      });
      setGlobalBookedDates(dates);
    } catch (err) {
      console.error('Error fetching global availability:', err);
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  // Fetch only the logged-in user's bookings
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
      console.error('Error fetching personal history:', err);
    } finally {
      setIsLoadingMyBookings(false);
    }
  };

  useEffect(() => {
    fetchGlobalAvailability();
    fetchMyBookings();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    
    try {
      const checkInDate = new Date(formData.check_in + 'T00:00:00');
      const checkOutDate = new Date(formData.check_out + 'T00:00:00');

      if (checkInDate >= checkOutDate) {
        throw new Error("Check-out date must be after check-in date.");
      }

      // Final collision check
      let current = new Date(checkInDate);
      while (current <= checkOutDate) {
        if (globalBookedDates.has(current.toISOString().split('T')[0])) {
          throw new Error("Oops! One or more of those dates just got booked. Please check the calendar.");
        }
        current.setDate(current.getDate() + 1);
      }

      const { error } = await supabase
        .from('bookings')
        .insert([{ ...formData, user_id: user?.id }]);

      if (error) throw error;

      setStatus({ 
        type: 'success', 
        message: "Howdy! Your reservation request was successful. Check your email for details." 
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
      
      // Refresh both views
      await Promise.all([fetchGlobalAvailability(), fetchMyBookings()]);
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        message: err.message || "Reservation failed. Please try again or call (432) 555-0123." 
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
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-caravan text-xl"></i>
                </div>
                <h1 className="text-4xl font-bold text-stone-800 tracking-tight">Reserve Your Site</h1>
              </div>
              <p className="text-stone-500 mb-10 max-w-xl">Join us in the high desert. Please check the calendar for live availability before picking your dates.</p>
              
              {status && (
                <div className={`mb-8 p-5 rounded-2xl flex items-start space-x-4 animate-in fade-in slide-in-from-top-4 duration-500 ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
                }`}>
                  <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} mt-1`}></i>
                  <div>
                    <p className="font-bold text-sm">{status.type === 'success' ? 'Stay Confirmed' : 'Booking Issue'}</p>
                    <p className="text-xs opacity-80 mt-1">{status.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Primary Guest Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Sarah West"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-stone-300"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Account Email</label>
                    <input 
                      type="email" 
                      disabled
                      className="w-full bg-stone-100 border border-stone-200 rounded-2xl px-5 py-4 text-stone-400 cursor-not-allowed italic"
                      value={formData.email}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Check-In Date</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.check_in}
                      onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Check-Out Date</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.check_out}
                      onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">RV Type & Length</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                      value={formData.rv_size}
                      onChange={(e) => setFormData({...formData, rv_size: e.target.value})}
                    >
                      <option value="standard">Standard Back-In (up to 30ft)</option>
                      <option value="large">Large Back-In (30ft - 45ft)</option>
                      <option value="premium">Premium Pull-Through (All Sizes)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Number of Guests</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="8"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center space-x-3 group"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Confirming Dates...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check text-xs group-hover:scale-125 transition-transform"></i>
                      <span>Book My Desert Sanctuary</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-stone-800 flex items-center">
                  <i className="fa-solid fa-clock-rotate-left mr-4 text-emerald-600"></i>
                  My Stays
                </h2>
                <button onClick={fetchMyBookings} className="text-stone-300 hover:text-emerald-600 transition-colors">
                  <i className="fa-solid fa-rotate-right text-sm"></i>
                </button>
              </div>

              {isLoadingMyBookings ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-stone-50 rounded-3xl animate-pulse border border-stone-100"></div>)}
                </div>
              ) : myBookings.length > 0 ? (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[1.5rem] border border-stone-100 bg-stone-50/30 hover:bg-white transition-all hover:shadow-lg group">
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                          <span className="text-[10px] font-black uppercase leading-none">{new Date(b.check_in).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-black leading-none mt-1">{new Date(b.check_in).getDate() + 1}</span>
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 leading-tight">Mountain Escape</p>
                          <p className="text-[11px] text-stone-400 font-medium mt-1">
                            {new Date(b.check_in).toLocaleDateString()} — {new Date(b.check_out).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-0 flex items-center justify-between sm:justify-end space-x-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest">{b.rv_size}</p>
                          <p className="text-[11px] text-stone-500 mt-0.5">{b.guests} Guests</p>
                        </div>
                        <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-[2.5rem]">
                  <i className="fa-solid fa-van-shuttle text-stone-200 text-4xl mb-4"></i>
                  <p className="text-stone-400 font-bold">No reservations found yet.</p>
                  <p className="text-stone-300 text-[11px] mt-1">Pick your dates and join the adventure!</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[420px] space-y-8">
            <AvailabilityCalendar bookedDates={globalBookedDates} isLoading={isLoadingGlobal} />
            
            <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <i className="fa-solid fa-sun absolute -bottom-10 -right-10 text-white/5 text-[12rem] transform group-hover:rotate-90 transition-transform duration-1000"></i>
              <h3 className="text-2xl font-bold mb-8 relative z-10">West Texas Value</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block mb-1">Standard Rate</span>
                    <span className="text-stone-400 text-sm">Nightly Site Fee</span>
                  </div>
                  <span className="font-bold text-2xl">$45.00</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block mb-1">Weekly Special</span>
                    <span className="text-stone-400 text-sm">7 Days / 6 Nights</span>
                  </div>
                  <span className="font-bold text-2xl">$275.00</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest block mb-1">Monthly Oasis</span>
                    <span className="text-stone-400 text-sm">Extended Stays</span>
                  </div>
                  <span className="font-bold text-2xl text-emerald-400">$750.00</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-sm">
              <h4 className="font-bold text-stone-800 text-lg mb-4">Need Help?</h4>
              <p className="text-sm text-stone-500 leading-relaxed mb-8">Our local team in Van Horn can assist with group bookings or specific site requests.</p>
              <a href="tel:4325550123" className="flex items-center space-x-4 bg-stone-50 p-4 rounded-2xl hover:bg-emerald-50 transition-colors group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-phone-volume"></i>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Direct Line</p>
                  <p className="font-bold text-stone-800">(432) 555-0123</p>
                </div>
              </a>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Booking;
