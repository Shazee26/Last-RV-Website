
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

  const fetchGlobalAvailability = async () => {
    setIsLoadingGlobal(true);
    try {
      // We query the 'global_availability' view specifically to bypass RLS 
      // and see dates blocked by other users without exposing their personal info.
      const { data, error } = await supabase.from('global_availability' as any).select('*');
      if (error) throw error;

      const dates = new Set<string>();
      data.forEach((booking: any) => {
        const start = new Date(booking.check_in + 'T00:00:00');
        const end = new Date(booking.check_out + 'T00:00:00');
        let current = new Date(start);
        
        // Standard RV park logic: You occupy the night. 
        // The check-out day (morning) is available for someone else's check-in (afternoon).
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
      console.error('Error fetching stay history:', err);
    } finally {
      setIsLoadingMyBookings(false);
    }
  };

  useEffect(() => {
    fetchGlobalAvailability();
    fetchMyBookings();
  }, [user]);

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
      setStatus({ type: 'error', message: `Site is already reserved for ${new Date(collision + 'T00:00:00').toLocaleDateString()}. Please select different dates.` });
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
        message: "Success! We've received your reservation. See you in the desert soon!" 
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
      
      // Refresh both the global calendar and user history
      await Promise.all([fetchGlobalAvailability(), fetchMyBookings()]);
    } catch (err: any) {
      const msg = err?.message || (typeof err === 'string' ? err : "Something went wrong. Please try again or call our office.");
      setStatus({ 
        type: 'error', 
        message: msg 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 px-4 min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-grow space-y-8">
            <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-calendar-plus text-xl"></i>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">New Reservation</h1>
                  <p className="text-sm text-stone-400">Secure your spot in the high desert</p>
                </div>
              </div>
              
              {status && (
                <div className={`mb-8 p-5 rounded-2xl flex items-start space-x-4 animate-in fade-in slide-in-from-top-4 duration-500 ${
                  status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-800'
                }`}>
                  <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} mt-1`}></i>
                  <div>
                    <p className="font-bold text-sm">{status.type === 'success' ? 'Reservation Update' : 'Validation Error'}</p>
                    <p className="text-xs opacity-80 mt-1">{status.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Primary Occupant</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Full legal name"
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-stone-100"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Confirmation Email</label>
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
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">RV Type</label>
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
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Guests</label>
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
                  className="w-full bg-emerald-700 text-white py-5 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-xl hover:shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <><i className="fa-solid fa-spinner animate-spin"></i><span>Processing...</span></>
                  ) : (
                    <><i className="fa-solid fa-check-circle"></i><span>Complete Reservation</span></>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Your Stay History</h2>
                  <p className="text-xs text-stone-400 mt-1">Manage and view your upcoming West Texas trips</p>
                </div>
                <button onClick={fetchMyBookings} aria-label="Refresh bookings" className="text-stone-300 hover:text-emerald-600 transition-colors">
                  <i className="fa-solid fa-arrows-rotate text-sm"></i>
                </button>
              </div>

              {isLoadingMyBookings ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-28 bg-stone-50 dark:bg-stone-800 rounded-3xl animate-pulse"></div>)}
                </div>
              ) : myBookings.length > 0 ? (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div key={b.id} className="p-6 rounded-3xl border border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-950/30 hover:bg-white dark:hover:bg-stone-800 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                          <span className="text-[10px] font-black uppercase leading-none">{new Date(b.check_in + 'T00:00:00').toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-black leading-none mt-1">{new Date(b.check_in + 'T00:00:00').getDate()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 dark:text-stone-100 text-lg">Mountain View Stay</p>
                          <div className="flex items-center space-x-2 text-[11px] text-stone-400 font-medium mt-0.5">
                            <i className="fa-solid fa-calendar-day"></i>
                            <span>{new Date(b.check_in + 'T00:00:00').toLocaleDateString()} — {new Date(b.check_out + 'T00:00:00').toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end space-x-8 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100 dark:border-stone-800">
                        <div className="text-left md:text-right">
                          <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest mb-0.5">Setup Details</p>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 font-bold">{b.rv_size} RV • {b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                        <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 shadow-sm">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-[2.5rem]">
                  <i className="fa-solid fa-map-location-dot text-stone-200 dark:text-stone-800 text-5xl mb-4"></i>
                  <p className="text-stone-400 font-bold">You haven't booked any stays yet.</p>
                  <p className="text-stone-300 dark:text-stone-700 text-[11px] mt-1">Ready to start your desert journey?</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[420px] space-y-8">
            <AvailabilityCalendar bookedDates={globalBookedDates} isLoading={isLoadingGlobal} />
            
            <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <i className="fa-solid fa-mountain absolute -bottom-10 -right-10 text-white/5 text-[15rem] transform rotate-12"></i>
              <h3 className="text-2xl font-bold mb-8 relative z-10">Best Rates in Van Horn</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-stone-400 text-sm">Nightly Site Fee</span>
                  <span className="font-bold text-2xl">$45.00</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-stone-400 text-sm">Weekly Special</span>
                  <span className="font-bold text-2xl">$275.00</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-stone-400 text-sm">Monthly Oasis</span>
                  <span className="font-bold text-2xl text-emerald-400">$750.00</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Booking;
