
import React from 'react';

const Amenities: React.FC = () => {
  const amenities = [
    { icon: 'fa-bolt', title: '30/50 Amp Power', desc: 'Reliable full-hookup connections for all RV types.' },
    { icon: 'fa-wifi', title: 'High-Speed Wi-Fi', desc: 'Stay connected even in the heart of the desert.' },
    { icon: 'fa-shower', title: 'Clean Bathrooms', desc: 'Meticulously maintained showers and facilities.' },
    { icon: 'fa-shirt', title: 'Laundry Facility', desc: 'Modern machines open 24/7 for your convenience.' },
    { icon: 'fa-paw', title: 'Pet Friendly', desc: 'Fenced-in dog run and plenty of walking space.' },
    { icon: 'fa-trash-can', title: 'Waste Management', desc: 'Convenient trash pickup and dump stations.' },
  ];

  return (
    <div className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-stone-800 mb-6">World-Class Amenities</h1>
          <p className="text-stone-500 text-lg">We provide everything you need for a comfortable and safe stay in West Texas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {amenities.map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <i className={`fa-solid ${item.icon} text-emerald-700 text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">{item.title}</h3>
              <p className="text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-200">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">Park Rules & Conduct</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 flex items-center">
                <i className="fa-solid fa-clock mr-2 text-emerald-600"></i> Quiet Hours
              </h4>
              <p className="text-stone-500">From 10:00 PM to 8:00 AM. Please respect your neighbors' peace.</p>
              
              <h4 className="font-bold text-stone-800 flex items-center mt-6">
                <i className="fa-solid fa-dog mr-2 text-emerald-600"></i> Pet Policy
              </h4>
              <p className="text-stone-500">Pets must be on a leash at all times outside your RV. Please clean up after them immediately.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 flex items-center">
                <i className="fa-solid fa-truck-pickup mr-2 text-emerald-600"></i> Speed Limit
              </h4>
              <p className="text-stone-500">Strict 5 MPH limit throughout the park to ensure safety for all pedestrians and pets.</p>
              
              <h4 className="font-bold text-stone-800 flex items-center mt-6">
                <i className="fa-solid fa-fire mr-2 text-emerald-600"></i> Campfires
              </h4>
              <p className="text-stone-500">Small contained propane fires only. No wood fires allowed due to local drought conditions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
