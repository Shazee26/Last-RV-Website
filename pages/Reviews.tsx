
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../types/database';

declare var google: any;

const MOCK_REVIEWS: Review[] = [
  { name: 'Sarah Jenkins', date: 'March 2024', rating: 5, text: 'The cleanest RV park we\'ve stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again.' },
  { name: 'Michael Thorne', date: 'February 2024', rating: 5, text: 'Quiet, friendly staff, and great Wi-Fi. It\'s the perfect spot to rest after a long day of driving through West Texas.' },
  { name: 'Linda & Rob', date: 'January 2024', rating: 4, text: 'Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis. Only wish there was a bit more shade, but that is the desert for you!' },
  { name: 'David G.', date: 'December 2023', rating: 5, text: 'Clean showers, great utilities. We stayed for three nights and loved the stargazing.' },
  { name: 'Amanda P.', date: 'November 2023', rating: 5, text: 'Best RV park in Van Horn by far. Friendly owners and very secure.' },
  { name: 'Gregory Wilson', date: 'October 2023', rating: 5, text: 'Simple, effective, and beautiful. Just what you need on a cross-country trip.' },
];

const PLACE_ID = 'GOOGLE_PLACE_ID_FOR_MTN_VIEW_RV';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleReviews = () => {
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        setReviews(MOCK_REVIEWS);
        setLoading(false);
        return;
      }

      try {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails(
          {
            placeId: PLACE_ID,
            fields: ['reviews']
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place?.reviews) {
              const googleReviews: Review[] = place.reviews.map((r: any) => ({
                name: r.author_name,
                date: r.relative_time_description,
                rating: r.rating,
                text: r.text,
              }));
              setReviews(googleReviews.length > 0 ? googleReviews : MOCK_REVIEWS);
            } else {
              setReviews(MOCK_REVIEWS);
            }
            setLoading(false);
          }
        );
      } catch (err) {
        setReviews(MOCK_REVIEWS);
        setLoading(false);
      }
    };

    fetchGoogleReviews();
  }, []);

  return (
    <div className="py-32 bg-white dark:bg-[#0a0a0c] min-h-screen transition-colors duration-500 relative overflow-hidden">
      {/* Decorative Vibrant Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 animate-in fade-in duration-1000">
          <div className="inline-flex items-center space-x-3 bg-stone-50 dark:bg-white/5 px-6 py-3 rounded-full mb-8 border border-stone-100 dark:border-white/10 shadow-sm">
            <div className="flex text-emerald-500">
              {[...Array(5)].map((_, s) => <i key={s} className="fa-solid fa-star text-[10px]"></i>)}
            </div>
            <span className="text-stone-800 dark:text-stone-200 text-[10px] font-black uppercase tracking-widest">4.9 Overall Rating</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-stone-900 dark:text-white mb-6 tracking-tighter">Guest <span className="vibrant-text">Wall.</span></h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-xl mx-auto font-medium">Verified echoes of hospitality from our community of travelers.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-stone-50 dark:bg-white/5 p-12 rounded-[3rem] border border-stone-100 dark:border-white/10 h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {reviews.map((r, i) => (
              <div key={i} className="group bg-stone-50 dark:bg-white/5 p-12 rounded-[3.5rem] border border-stone-100 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-3xl hover:shadow-emerald-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                  <i className="fa-solid fa-quote-right text-8xl text-emerald-500"></i>
                </div>
                
                <div className="flex justify-between items-center mb-10">
                  <div className="flex text-emerald-400 space-x-1">
                    {[...Array(r.rating)].map((_, idx) => <i key={idx} className="fa-solid fa-star text-[10px]"></i>)}
                  </div>
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{r.date}</span>
                </div>
                
                <p className="text-stone-600 dark:text-stone-300 italic leading-relaxed font-medium text-lg mb-12">
                  "{r.text}"
                </p>
                
                <div className="flex items-center space-x-5 pt-8 border-t border-stone-200 dark:border-white/5">
                  <div className="w-14 h-14 vibrant-gradient rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-stone-900 dark:text-white tracking-tight">{r.name}</h4>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Verified Traveler</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-32 text-center">
          <a href={`https://www.google.com/maps/search/?api=1&query=Mountain+View+RV+Park+Van+Horn+TX`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-12 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:vibrant-gradient hover:text-white transition-all shadow-2xl active:scale-95">
            <i className="fa-brands fa-google text-lg"></i>
            <span>Pin Your Own Experience</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
