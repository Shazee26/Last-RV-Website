
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div>
            <h1 className="text-5xl font-bold text-stone-800 mb-8">Get In Touch</h1>
            <p className="text-stone-500 text-lg mb-12 leading-relaxed">
              Have questions about our hookups, local attractions, or extended stay rates? We're here to help. Contact us using the form or the direct details below.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot text-emerald-700 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 mb-1">Our Location</h4>
                  <p className="text-stone-500">123 Sunset Way, Van Horn, TX 79855</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-phone text-emerald-700 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 mb-1">Phone Number</h4>
                  <p className="text-stone-500">(432) 555-0123</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-envelope text-emerald-700 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 mb-1">Email Support</h4>
                  <p className="text-stone-500">reservations@mtnviewrv.com</p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-white border border-stone-200 rounded-3xl shadow-sm">
              <h3 className="font-bold text-stone-800 mb-4">Office Hours</h3>
              <div className="flex justify-between text-sm text-stone-500 mb-2">
                <span>Mon - Sat</span>
                <span>8:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Sunday</span>
                <span>10:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Form and Map Placeholder */}
          <div className="space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100">
              <h3 className="text-2xl font-bold text-stone-800 mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
                  <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
                  <input type="email" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>
                <button type="button" onClick={() => alert('Message Sent!')} className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg">
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Mock Map */}
            <div className="h-64 bg-stone-300 rounded-3xl overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1000/600')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <i className="fa-solid fa-location-pin text-rose-600 text-5xl drop-shadow-lg animate-bounce"></i>
                <div className="bg-white px-4 py-1 rounded-full text-xs font-bold text-stone-800 shadow-md">Van Horn, TX</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
