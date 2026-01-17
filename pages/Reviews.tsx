
import React from 'react';

const Reviews: React.FC = () => {
  const reviews = [
    { name: 'Sarah Jenkins', date: 'March 2024', rating: 5, text: 'The cleanest RV park we\'ve stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again.' },
    { name: 'Michael Thorne', date: 'February 2024', rating: 5, text: 'Quiet, friendly staff, and great Wi-Fi. It\'s the perfect spot to rest after a long day of driving through West Texas.' },
    { name: 'Linda & Rob', date: 'January 2024', rating: 4, text: 'Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis. Only wish there was a bit more shade, but that is the desert for you!' },
    { name: 'David G.', date: 'December 2023', rating: 5, text: 'Clean showers, great utilities. We stayed for three nights and loved the stargazing.' },
    { name: 'Amanda P.', date: 'November 2023', rating: 5, text: 'Best RV park in Van Horn by far. Friendly owners and very secure.' },
    { name: 'Gregory Wilson', date: 'October 2023', rating: 5, text: 'Simple, effective, and beautiful. Just what you need on a cross-country trip.' },
  ];

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-stone-200">
            <div className="flex text-amber-400">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <span className="text-stone-700 font-bold">4.9 / 5</span>
            <span className="text-stone-400">based on 200+ Google Reviews</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-800">Guest Wall of Love</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(r.rating)].map((_, idx) => <i key={idx} className="fa-solid fa-star"></i>)}
                  </div>
                  <span className="text-stone-400 text-xs font-medium uppercase tracking-wider">{r.date}</span>
                </div>
                <p className="text-stone-600 italic leading-relaxed mb-6">"{r.text}"</p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-stone-50">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-bold text-stone-500 uppercase">
                  {r.name.charAt(0)}
                </div>
                <p className="font-bold text-stone-800">{r.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#" className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition-all inline-flex items-center">
            <i className="fa-brands fa-google mr-2"></i> Write a Google Review
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
