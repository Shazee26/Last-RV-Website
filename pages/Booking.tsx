
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
      const { data, error } = await supabase.from('bookings').select('check_in, check_out');
      if (error) throw error;
      const dates = new Set<string>();
      data.forEach((booking: any) => {
        const start = new Date(booking.check_in + 'T00:00:00');
        const end = new Date(booking.check_out + 'T00:00:00');
        let current = new Date(start);
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
      const { data, error } = await supabase.from('bookings').select('*').eq('user_id', user.id).order('check_in', { ascending: false });
      if (error) throw error;
      setMyBookings(data || []);
    } catch (err) {
      console.error('Error fetching My Bookings:', err);
    } finally {
      setIsLoadingMyBookings(false);
    }
  };

  useEffect(() => {
    fetchGlobalAvailability();
    fetchMyBookings();
    const channel = supabase.channel('realtime_bookings').on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
      fetchGlobalAvailability();
      fetchMyBookings();
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleCancelBooking = async (id: string | number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      setStatus({ type: 'success', message: 'Reservation cancelled successfully.' });
    } catch (err: any) {
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
    let current = new Date(checkInDate);
    while (current < checkOutDate) {
      if (globalBookedDates.has(current.toISOString().split('T')[0])) {
        setStatus({ type: 'error', message: `One or more dates are already reserved. Please check the calendar.` });
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert([{ ...formData, user_id: user?.id }]);
      if (error) throw error;
      setStatus({ 
        type: 'success', 
        message: "Reservation confirmed! A vibrant confirmation email has been dispatched to your inbox." 
      });
      setFormData({ name: '', email: user?.email || '', check_in: '', check_out: '', rv_size: 'standard', guests: 2, user_id: user?.id || '' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || "Something went wrong." });
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
    <div className="py-20 px-4 min-h-screen bg-white dark:bg-[#0a0a0c] transition-colors duration-500 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-grow space-y-12">
            <div className="bg-white dark:bg-stone-900 p-10 md:p-14 rounded-[4rem] shadow-3xl border border-stone-100 dark:border-white/5 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">New Reservation</h1>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">Secure your desert outpost</p>
                </div>
                <div className="hidden sm:flex items-center space-x-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Real-time Cloud Sync</span>
                </div>
              </div>
              
              {status && (
                <div className={`mb-10 p-6 rounded-3xl flex items-start space-x-5 animate-in fade-in zoom-in duration-300 ${
                  status.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}>
                  <i className={`fa-solid ${status.type === 'success' ? 'fa-envelope-circle-check' : 'fa-triangle-exclamation'} text-xl mt-0.5`}></i>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">{status.type === 'success' ? 'Mission Success' : 'Error Detected'}</p>
                    <p className="text-xs opacity-80 mt-1 font-medium">{status.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Primary Occupant</label>
                    <input type="text" required placeholder="Full Name" className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Digital Address</label>
                    <input type="email" disabled className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 rounded-2xl px-6 py-5 text-sm text-stone-400 cursor-not-allowed italic" value={formData.email} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Arrival Date</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" value={formData.check_in} onChange={(e) => setFormData({...formData, check_in: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Departure Date</label>
                    <input type="date" required min={formData.check_in || new Date().toISOString().split('T')[0]} className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" value={formData.check_out} onChange={(e) => setFormData({...formData, check_out: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Site Specification</label>
                    <select className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:text-white cursor-pointer" value={formData.rv_size} onChange={(e) => setFormData({...formData, rv_size: e.target.value})}>
                      <option value="standard">Standard Back-In (30ft)</option>
                      <option value="large">Large Back-In (45ft)</option>
                      <option value="premium">Premium Pull-Through</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Guest Payload</label>
                    <input type="number" min="1" max="10" className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white" value={formData.guests} onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})} />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full vibrant-gradient text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-3xl shadow-emerald-500/30 flex items-center justify-center space-x-4">
                  {isSubmitting ? <><i className="fa-solid fa-spinner animate-spin"></i><span>Locking Transmission...</span></> : <><i className="fa-solid fa-check-circle"></i><span>Confirm Reservation</span></>}
                </button>
              </form>
            </div>

            <div className="bg-stone-50 dark:bg-white/5 p-10 md:p-14 rounded-[4rem] border border-stone-100 dark:border-white/5 animate-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter">My Outposts</h2>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-2">Active reservation management</p>
                </div>
              </div>

              {isLoadingMyBookings ? (
                <div className="space-y-8">
                  {[1, 2].map(i => <div key={i} className="h-32 bg-stone-200 dark:bg-stone-800 rounded-[2.5rem] animate-pulse"></div>)}
                </div>
              ) : myBookings.length > 0 ? (
                <div className="space-y-8">
                  {myBookings.map((b) => (
                    <div key={b.id} className="group p-8 rounded-[2.5rem] bg-white dark:bg-stone-900 border border-stone-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="flex items-center space-x-8">
                        <div className="w-20 h-20 vibrant-gradient text-white rounded-[1.8rem] flex flex-col items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{new Date(b.check_in + 'T00:00:00').toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-3xl font-black mt-2 leading-none">{new Date(b.check_in + 'T00:00:00').getDate()}</span>
                        </div>
                        <div>
                          <p className="font-black text-stone-900 dark:text-white text-2xl tracking-tight mb-2">RV Site Reserve</p>
                          <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                            <span className="flex items-center"><i className="fa-solid fa-calendar mr-2 text-emerald-500"></i>{new Date(b.check_in + 'T00:00:00').toLocaleDateString()} — {new Date(b.check_out + 'T00:00:00').toLocaleDateString()}</span>
                            <span className="flex items-center"><i className="fa-solid fa-caravan mr-2 text-emerald-500"></i>{getRvSizeLabel(b.rv_size)}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => b.id && handleCancelBooking(b.id)} className="bg-rose-500/10 text-rose-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Abort Trip</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-4 border-dashed border-stone-100 dark:border-stone-800 rounded-[4rem]">
                  <i className="fa-solid fa-ghost text-stone-200 dark:text-stone-800 text-6xl mb-6"></i>
                  <p className="text-stone-400 font-black uppercase tracking-widest text-xs">No active expeditions found</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[420px] space-y-10">
            <AvailabilityCalendar bookedDates={globalBookedDates} isLoading={isLoadingGlobal} />
            <div className="bg-stone-900 p-12 rounded-[4rem] text-white relative overflow-hidden group shadow-3xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000">
                <i className="fa-solid fa-mountain-sun text-[10rem]"></i>
              </div>
              <h3 className="text-2xl font-black mb-10 tracking-tight vibrant-text">Season Access</h3>
              <div className="space-y-8 font-bold">
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                   <span className="text-stone-500 text-xs uppercase tracking-widest">Nightly Stop</span>
                   <span className="text-3xl tracking-tighter">$45.00</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                   <span className="text-stone-500 text-xs uppercase tracking-widest">Weekly Pass</span>
                   <span className="text-3xl tracking-tighter text-blue-400">$275.00</span>
                </div>
                <div className="flex justify-between items-end pb-6">
                   <span className="text-stone-500 text-xs uppercase tracking-widest">Monthly Stay</span>
                   <span className="text-3xl tracking-tighter text-emerald-400">$750.00</span>
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
