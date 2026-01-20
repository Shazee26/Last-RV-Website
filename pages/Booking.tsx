
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

  // Fetch ALL bookings to populate the availability calendar for everyone
  const fetchGlobalAvailability = async () => {
    setIsLoadingGlobal(true);
    try {
      // Querying the 'bookings' table directly as requested
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in, check_out');
      
      if (error) throw error;

      const dates = new Set<string>();
      data.forEach((booking: any) => {
        const start = new Date(booking.check_in + 'T00:00:00');
        const end = new Date(booking.check_out + 'T00:00:00');
        let current = new Date(start);
        
        // Site is occupied from check_in until the night BEFORE check_out
        while (current < end) {
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

  // Fetch only the logged-in user's specific bookings
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
      console.error('Error fetching My Bookings:', err);
    } finally {
      setIsLoadingMyBookings(false);
    }
  };

  // REAL-TIME SYNC: Listen for changes on the 'bookings' table
  useEffect(() => {
    fetchGlobalAvailability();
    fetchMyBookings();

    const channel = supabase
      .channel('realtime_bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchGlobalAvailability();
          fetchMyBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCancelBooking = async (id: string | number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      
      setStatus({ type: 'success', message: 'Reservation cancelled successfully.' });
      // Realtime listener will handle the refresh, but we can do it manually for immediate feedback
      await Promise.all([fetchGlobalAvailability(), fetchMyBookings()]);
    } catch (err: any) {
      console.error('Cancellation error:', err);
      setStatus({ type: 'error', message: err.message || 'Failed to cancel reservation.' });
    }
  };

  const validateForm = () => {
    if (!formData.check_in || !formData.check_out) {
      setStatus({ type: 'error', message: 'Please select both check-in and check-out dates.' });
      return false;
    }

    const checkInDate = new Date(formData.check_in + 'T00:00:00');
    const checkOutDate = new Date(formData.check_out + 'T00:00:00');

    if (checkInDate >= checkOutDate) {
      setStatus({ type: 'error', message: "Departure date must be after the arrival date." });
      return false;
    }

    // Check for collisions with existing bookings
    const selectedDates: string[] = [];
    let current = new Date(checkInDate);
    while (current < checkOutDate) {
      selectedDates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    const collision = selectedDates.find(date => globalBookedDates.has(date));
    if (collision) {
      setStatus({ type: 'error', message: `One or more of your selected dates are already reserved. Please check the calendar.` });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{ ...formData, user_id: user?.id }]);

      if (error) throw error;

      setStatus({ 
        type: 'success', 
        message: "Reservation confirmed! Your dates are now locked in real-time." 
      });
      
      // Reset form (keeping user email)
      setFormData({ 
        name: '', 
        email: user?.email || '', 
        check_in: '', 
        check_out: '', 
        rv_size: 'standard', 
        guests: 2, 
        user_id: user?.id || '' 
      });
      
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRvSizeLabel = (size: string) => {
    switch(size) {
      case 'standard': return 'Standard (30ft)';
      case 'large': return 'Large (45ft)';
      case 'premium': return 'Premium Pull-Through';
      default: return size;
    }
  };

  return (
    <div className="py-20 px-4 min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-grow space-y-12">
            {/* New Reservation Form */}
            <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-calendar-plus text-xl"></i>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">New Reservation</h1>
                    <p className="text-sm text-stone-400">Secure your spot in the high desert</p>
                  </div>
                </div>
                {/* Real-time Indicator */}
                <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Live Sync Enabled</span>
                </div>
              </div>
              
              {status && (
                <div className={`mb-8 p-5 rounded-2xl flex items-start space-x-4 animate-in fade-in slide-in-from-top-4 duration-500 ${
                  status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-800'
                }`}>
                  <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} mt-1`}></i>
                  <div>
                    <p className="font-bold text-sm">{status.type === 'success' ? 'Confirmed' : 'Error'}</p>
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
                      placeholder="e.g. John Doe"
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-stone-100"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Account Email</label>
                    <input 
                      type="email" 
                      disabled
                      className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-5 py-4 text-stone-400 cursor-not-allowed italic"
                      value={formData.email}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Arrival Date</label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-stone-100"
                      value={formData.check_in}
                      onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Departure Date</label>
                    <input 
                      type="date" 
                      required 
                      min={formData.check_in || new Date().toISOString().split('T')[0]}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-stone-100"
                      value={formData.check_out}
                      onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">RV Specification</label>
                    <select 
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:text-stone-100"
                      value={formData.rv_size}
                      onChange={(e) => setFormData({...formData, rv_size: e.target.value})}
                    >
                      <option value="standard">Standard Back-In (up to 30ft)</option>
                      <option value="large">Large Back-In (30ft - 45ft)</option>
                      <option value="premium">Premium Pull-Through (Big Rig Friendly)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Guest Count</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-stone-100"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 text-white py-5 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <><i className="fa-solid fa-spinner animate-spin"></i><span>Locking Dates...</span></>
                  ) : (
                    <><i className="fa-solid fa-check-circle"></i><span>Book Your Spot</span></>
                  )}
                </button>
              </form>
            </div>

            {/* My Bookings Section - Accessible Dashboard */}
            <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">My Bookings</h2>
                  <p className="text-xs text-stone-400 mt-1 uppercase font-black tracking-widest">Guest Management Portal</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-stone-400">Status: <span className="text-emerald-500">Authenticated</span></span>
                </div>
              </div>

              {isLoadingMyBookings ? (
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800 animate-pulse flex items-center space-x-4">
                       <div className="w-16 h-16 bg-stone-200 dark:bg-stone-700 rounded-2xl"></div>
                       <div className="flex-grow space-y-2">
                         <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/4"></div>
                         <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-1/2"></div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : myBookings.length > 0 ? (
                <div className="space-y-6">
                  {myBookings.map((b) => (
                    <div key={b.id} className="group p-8 rounded-3xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 hover:bg-white dark:hover:bg-stone-800 transition-all hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10 transition-transform group-hover:scale-105">
                          <span className="text-[10px] font-black uppercase leading-none">{new Date(b.check_in + 'T00:00:00').toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-black leading-none mt-1">{new Date(b.check_in + 'T00:00:00').getDate()}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <p className="font-bold text-stone-800 dark:text-stone-100 text-xl">RV Site Reservation</p>
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full">Confirmed</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-stone-500 dark:text-stone-400 font-medium">
                            <span className="flex items-center"><i className="fa-solid fa-calendar-day mr-2 text-emerald-600"></i>{new Date(b.check_in + 'T00:00:00').toLocaleDateString()} — {new Date(b.check_out + 'T00:00:00').toLocaleDateString()}</span>
                            <span className="flex items-center"><i className="fa-solid fa-caravan mr-2 text-emerald-600"></i>{getRvSizeLabel(b.rv_size)}</span>
                            <span className="flex items-center"><i className="fa-solid fa-users mr-2 text-emerald-600"></i>{b.guests} Guests</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end md:border-l border-stone-200 dark:border-stone-700 md:pl-8">
                        <button 
                          onClick={() => b.id && handleCancelBooking(b.id)}
                          className="w-full md:w-auto px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-stone-900 text-rose-600 border border-stone-200 dark:border-stone-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm"
                        >
                          <i className="fa-solid fa-trash-can mr-2"></i> Cancel Stay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-[3rem] bg-stone-50/20">
                  <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-map-location-dot text-stone-300 dark:text-stone-700 text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-stone-600 dark:text-stone-400 mb-2">No Active Stays</h3>
                  <p className="text-stone-400 dark:text-stone-500 text-sm max-w-xs mx-auto">Your desert adventures will appear here. Reserve a spot to get started!</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[420px] space-y-8">
            {/* Calendar with real-time global availability */}
            <AvailabilityCalendar bookedDates={globalBookedDates} isLoading={isLoadingGlobal} />
            
            <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <i className="fa-solid fa-mountain absolute -bottom-10 -right-10 text-white/5 text-[15rem] transform rotate-12 transition-transform group-hover:rotate-6"></i>
              <h3 className="text-2xl font-bold mb-8 relative z-10 text-emerald-300">Season Rates</h3>
              <div className="space-y-6 relative z-10 font-medium">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-stone-400 text-sm">Nightly Stop</span>
                  <span className="font-bold text-2xl">$45.00</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-stone-400 text-sm">Weekly Pass</span>
                  <span className="font-bold text-2xl">$275.00</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-stone-400 text-sm">Monthly Stay</span>
                  <span className="font-bold text-2xl text-emerald-400">$750.00</span>
                </div>
              </div>
            </div>
            
            <div className="bg-stone-100 dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800">
               <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center">
                 <i className="fa-solid fa-circle-info mr-2 text-emerald-600"></i>
                 Booking Policy
               </h4>
               <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-3 leading-relaxed">
                 <li>• Reservations are confirmed instantly.</li>
                 <li>• Full refund for cancellations made 48 hours prior to arrival.</li>
                 <li>• Check-in: 1:00 PM | Check-out: 11:00 AM.</li>
                 <li>• Self-service portal allows 24/7 management.</li>
               </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Booking;
