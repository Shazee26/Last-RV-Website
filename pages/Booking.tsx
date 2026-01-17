
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Booking as BookingType } from '../types/database';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

const Booking: React.FC = () => {
  const { user } = useAuth();
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
        .order('check_in', { ascending: true });

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
        message: "Howdy! Your reservation request was sent. A confirmation email is on its way!" 
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
      fetchMyBookings(); // Refresh the list
    } catch (err: any) {
      console.error('Booking Error:', err);
      setStatus({ 
        type: 'error', 
        message: "The stars aren't aligning right now. Please call us at (432) 555-0123 to confirm." 
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
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100">
              <h1 className="text-4xl font-bold text-stone-800 mb-2">New Reservation</h1>
              <p className="text-stone-500 mb-10">Select your dates to request a spot at the park.</p>
              
              {status && (
                <div className={`mb-8 p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-100'
                }`}>
                  <i className={`fa-solid ${status.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                  <p className="text-sm font-medium">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Full Name"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      disabled
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 outline-none text-stone-500 cursor-not-allowed"
                      value={formData.email}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Check-In</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.check_in}
                      onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Check-Out</label>
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
                    <label className="block text-sm font-bold text-stone-700 mb-2">RV Size</label>
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
                    <label className="block text-sm font-bold text-stone-700 mb-2">Number of Guests</label>
                    <input 
                      type="number" 
                      min="1" 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : null}
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>

            {/* My Bookings Section */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100">
              <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center">
                <i className="fa-solid fa-clipboard-list mr-3 text-emerald-600"></i>
                My Bookings
              </h2>
              {isLoadingMyBookings ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-16 bg-stone-50 rounded-xl animate-pulse"></div>)}
                </div>
              ) : myBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-stone-400 text-xs uppercase tracking-wider border-b border-stone-100">
                        <th className="pb-4 font-semibold">Check-In</th>
                        <th className="pb-4 font-semibold">Check-Out</th>
                        <th className="pb-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {myBookings.map((b) => (
                        <tr key={b.id}>
                          <td className="py-4 text-sm text-stone-800 font-medium">{new Date(b.check_in).toLocaleDateString()}</td>
                          <td className="py-4 text-sm text-stone-800 font-medium">{new Date(b.check_out).toLocaleDateString()}</td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-600 border border-amber-100">
                              Pending Review
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-stone-100 rounded-2xl">
                  <i className="fa-solid fa-calendar-xmark text-stone-200 text-3xl mb-3"></i>
                  <p className="text-stone-400 text-sm">You have no booking requests yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96 space-y-6">
            <AvailabilityCalendar />
            
            <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Pricing</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                  <span>Daily Rate</span>
                  <span className="font-bold">$45.00</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                  <span>Weekly Rate</span>
                  <span className="font-bold">$275.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Monthly Rate</span>
                  <span className="font-bold">$750.00</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;
