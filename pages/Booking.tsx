
import React, { useState } from 'react';

const Booking: React.FC = () => {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    rvSize: 'standard',
    guests: 2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Booking inquiry sent! Our team will contact you shortly to confirm availability.");
  };

  return (
    <div className="py-20 px-4 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Reservation Form */}
          <div className="flex-grow bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100 h-fit">
            <h1 className="text-4xl font-bold text-stone-800 mb-2">Check Availability</h1>
            <p className="text-stone-500 mb-10">Select your dates to see our current openings.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Check-In</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Check-Out</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">RV Size/Type</label>
                  <select 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.rvSize}
                    onChange={(e) => setFormData({...formData, rvSize: e.target.value})}
                  >
                    <option value="standard">Standard (up to 30ft)</option>
                    <option value="large">Large (30ft - 45ft)</option>
                    <option value="premium">Premium/Pull-Through</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Number of Guests</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="8" 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-lg">
                Submit Reservation Request
              </button>
            </form>
            
            <p className="mt-8 text-xs text-stone-400 text-center leading-relaxed">
              * Note: Submitting this form does not guarantee a reservation. Our staff will review your request and contact you via email or phone within 24 hours.
            </p>
          </div>

          {/* Pricing/Sidebar */}
          <div className="w-full lg:w-96 space-y-6">
            <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Rates & Discounts</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Daily Rate</span>
                  <span className="font-bold">$45.00</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Weekly Rate</span>
                  <span className="font-bold">$275.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rate</span>
                  <span className="font-bold">$750.00</span>
                </div>
              </div>
              <div className="mt-8 bg-white/10 p-4 rounded-xl">
                <p className="text-sm">
                  <i className="fa-solid fa-certificate text-amber-400 mr-2"></i>
                  We offer 10% off for Good Sam, Military, and AAA members.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
              <h3 className="text-stone-800 font-bold mb-4">Need Help?</h3>
              <p className="text-stone-500 text-sm mb-6">If you have specific questions or need a last-minute same-day booking, give us a call.</p>
              <a href="tel:4325550123" className="flex items-center space-x-3 text-emerald-700 font-bold hover:underline">
                <i className="fa-solid fa-phone"></i>
                <span>(432) 555-0123</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;
