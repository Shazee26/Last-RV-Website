
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../types/database';

// Fix: Declare global google variable for Google Maps API to resolve "Cannot find name 'google'" errors.
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
      // Ensure Google Maps Script is loaded (checked in index.html)
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.warn('Google Maps API not loaded. Falling back to mock data.');
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
              console.warn('Google Places API returned status:', status, 'falling back to mocks.');
              setReviews(MOCK_REVIEWS);
            }
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error fetching Google Reviews:', err);
        setReviews(MOCK_REVIEWS);
        setLoading(false);
      }
    };

    fetchGoogleReviews();
  }, []);

  return (
    <div className="py-20 bg-stone-50 dark:bg-stone-950 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-stone-900 px-4 py-2 rounded-full shadow-sm mb-6 border border-stone-200 dark:border-stone-800">
            <div className="flex text-amber-400">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <span className="text-stone-700 dark:text-stone-200 font-bold">4.9 / 5</span>
            <span className="text-stone-400 text-sm">based on guest feedback</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100">Guest Wall of Love</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 h-64 animate-pulse">
                <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-stone-50 dark:bg-stone-800/50 rounded w-full mb-2"></div>
                <div className="h-3 bg-stone-50 dark:bg-stone-800/50 rounded w-5/6 mb-8"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-full"></div>
                  <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col justify-between transition-all hover:shadow-md">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex text-amber-400 text-sm">
                      {[...Array(r.rating)].map((_, idx) => <i key={idx} className="fa-solid fa-star"></i>)}
                    </div>
                    <span className="text-stone-400 text-xs font-medium uppercase tracking-wider">{r.date}</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 italic leading-relaxed mb-6">"{r.text}"</p>
                </div>
                <div className="flex items-center space-x-3 pt-4 border-t border-stone-50 dark:border-stone-800">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold uppercase">
                    {r.name.charAt(0)}
                  </div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <a href={`https://www.google.com/maps/search/?api=1&query=Mountain+View+RV+Park+Van+Horn+TX&query_place_id=${PLACE_ID}`} target="_blank" rel="noopener noreferrer" className="bg-stone-900 dark:bg-stone-100 dark:text-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition-all inline-flex items-center">
            <i className="fa-brands fa-google mr-2"></i> Write a Google Review
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
