
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../types/database';

const MOCK_REVIEWS: Review[] = [
  { name: 'Sarah Jenkins', date: 'March 2024', rating: 5, text: 'The cleanest RV park we\'ve stayed in! The views of the mountains at sunset are simply unforgettable. Definitely stopping here again.' },
  { name: 'Michael Thorne', date: 'February 2024', rating: 5, text: 'Quiet, friendly staff, and great Wi-Fi. It\'s the perfect spot to rest after a long day of driving through West Texas.' },
  { name: 'Linda & Rob', date: 'January 2024', rating: 4, text: 'Highly recommended. Easy check-in process and the spots are very spacious for big rigs. A true oasis. Only wish there was a bit more shade, but that is the desert for you!' },
  { name: 'David G.', date: 'December 2023', rating: 5, text: 'Clean showers, great utilities. We stayed for three nights and loved the stargazing.' },
  { name: 'Amanda P.', date: 'November 2023', rating: 5, text: 'Best RV park in Van Horn by far. Friendly owners and very secure.' },
  { name: 'Gregory Wilson', date: 'October 2023', rating: 5, text: 'Simple, effective, and beautiful. Just what you need on a cross-country trip.' },
];

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (err) {
        console.warn('Could not fetch reviews from Supabase, using mocks.', err);
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 h-64 animate-pulse">
                <div className="h-4 bg-stone-100 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-stone-50 rounded w-full mb-2"></div>
                <div className="h-3 bg-stone-50 rounded w-5/6 mb-8"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-stone-100 rounded-full"></div>
                  <div className="h-4 bg-stone-100 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between transition-all hover:shadow-md">
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
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold uppercase">
                    {r.name.charAt(0)}
                  </div>
                  <p className="font-bold text-stone-800">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
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
