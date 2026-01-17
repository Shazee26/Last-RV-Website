
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-bold text-stone-800 mb-8">Our Story</h1>
            <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
              <p>
                Mountain View RV Park was born out of a love for the expansive beauty of the West Texas desert. For years, we've provided travelers with a clean, peaceful, and professional home away from home.
              </p>
              <p>
                Located in the historic town of Van Horn, we pride ourselves on being more than just a place to park. We are a gateway to adventure, positioned perfectly between major national parks and cosmic wonders like the McDonald Observatory.
              </p>
              <p>
                Our team is dedicated to your comfort. Whether you're passing through on your way to the coast or settling in for a week of exploration, we ensure that every guest experiences true southern hospitality.
              </p>
            </div>
            <div className="mt-10 flex items-center space-x-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-700">15+</p>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Years of Service</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-700">50+</p>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Spacious Sites</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-700">4.8</p>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/owners/800/1000" alt="Mountain View Staff" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl hidden lg:block">
              <p className="text-emerald-700 font-serif text-2xl mb-2">"A desert gem."</p>
              <p className="text-stone-500 text-sm">— Travel Weekly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
