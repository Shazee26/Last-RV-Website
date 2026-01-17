
import React, { useState, useEffect } from 'react';

interface WeatherDay {
  date: string;
  max: number;
  min: number;
  condition: string;
  icon: string;
}

const WeatherWidget: React.FC = () => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch for Van Horn, TX
    const getMockForecast = () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const conditions = ['Sunny', 'Partly Cloudy', 'Clear Skies', 'Light Breeze'];
      const icons = ['fa-sun', 'fa-cloud-sun', 'fa-wind', 'fa-sun'];
      
      const mockData: WeatherDay[] = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
          date: days[d.getDay()],
          max: 82 + Math.floor(Math.random() * 10),
          min: 45 + Math.floor(Math.random() * 8),
          condition: conditions[i % conditions.length],
          icon: icons[i % icons.length],
        };
      });
      
      setTimeout(() => {
        setForecast(mockData);
        setLoading(false);
      }, 800);
    };

    getMockForecast();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
      {forecast.map((day, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 text-center transition-transform hover:-translate-y-1">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{day.date}</p>
          <i className={`fa-solid ${day.icon} text-2xl text-amber-500 mb-2`}></i>
          <div className="flex justify-center items-baseline space-x-1">
            <span className="text-lg font-bold text-stone-800">{day.max}°</span>
            <span className="text-sm text-stone-400">{day.min}°</span>
          </div>
          <p className="text-[10px] mt-1 text-stone-400 font-medium">{day.condition}</p>
        </div>
      ))}
    </div>
  );
};

export default WeatherWidget;
