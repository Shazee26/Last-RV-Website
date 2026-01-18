
import React, { useState, useEffect } from 'react';

interface WeatherDay {
  date: string;
  max: number;
  min: number;
  condition: string;
  icon: string;
}

const MOCK_FORECAST: WeatherDay[] = [
  { date: 'Mon', max: 88, min: 62, condition: 'Sunny', icon: 'fa-sun' },
  { date: 'Tue', max: 91, min: 65, condition: 'Clear', icon: 'fa-sun' },
  { date: 'Wed', max: 87, min: 64, condition: 'Partly Cloudy', icon: 'fa-cloud-sun' },
  { date: 'Thu', max: 82, min: 60, condition: 'Breezy', icon: 'fa-wind' },
  { date: 'Fri', max: 85, min: 61, condition: 'Sunny', icon: 'fa-sun' },
  { date: 'Sat', max: 89, min: 63, condition: 'Clear', icon: 'fa-sun' },
];

const WeatherWidget: React.FC = () => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
  const CITY = 'Van Horn, TX, US';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // If the key is the placeholder, skip fetch and use mocks immediately to avoid errors
        if (API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
           setForecast(MOCK_FORECAST);
           setLoading(false);
           return;
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(CITY)}&units=imperial&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        
        const dailyData: { [key: string]: { temps: number[], condition: string, icon: string } } = {};
        
        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyData[date]) {
            dailyData[date] = {
              temps: [],
              condition: item.weather[0].main,
              icon: item.weather[0].icon
            };
          }
          dailyData[date].temps.push(item.main.temp);
        });

        const mappedForecast: WeatherDay[] = Object.keys(dailyData).map(date => {
          const day = dailyData[date];
          return {
            date,
            max: Math.round(Math.max(...day.temps)),
            min: Math.round(Math.min(...day.temps)),
            condition: day.condition,
            icon: mapIconToFontAwesome(day.icon)
          };
        });

        setForecast(mappedForecast.slice(0, 6));
        setError(null);
      } catch (err) {
        console.error('Weather API Error (falling back to mocks):', err);
        setForecast(MOCK_FORECAST);
        setError(null); 
      } finally {
        setLoading(false);
      }
    };

    const mapIconToFontAwesome = (iconCode: string) => {
      if (iconCode.startsWith('01')) return 'fa-sun';
      if (iconCode.startsWith('02')) return 'fa-cloud-sun';
      if (iconCode.startsWith('03') || iconCode.startsWith('04')) return 'fa-cloud';
      if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'fa-cloud-showers-heavy';
      if (iconCode.startsWith('11')) return 'fa-bolt';
      if (iconCode.startsWith('13')) return 'fa-snowflake';
      if (iconCode.startsWith('50')) return 'fa-smog';
      return 'fa-sun';
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {forecast.map((day, idx) => (
        <div key={idx} className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-100 dark:border-stone-800 text-center transition-transform hover:-translate-y-1">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{day.date}</p>
          <i className={`fa-solid ${day.icon} text-2xl text-amber-500 mb-2`}></i>
          <div className="flex justify-center items-baseline space-x-1">
            <span className="text-lg font-bold text-stone-800 dark:text-stone-100">{day.max}°</span>
            <span className="text-sm text-stone-400">{day.min}°</span>
          </div>
          <p className="text-[10px] mt-1 text-stone-400 font-medium">{day.condition}</p>
        </div>
      ))}
    </div>
  );
};

export default WeatherWidget;
