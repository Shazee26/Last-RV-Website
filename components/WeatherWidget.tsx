
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

  const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
  const CITY = 'Van Horn, TX, US';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        if (API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
           setForecast(MOCK_FORECAST);
           setLoading(false);
           return;
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(CITY)}&units=imperial&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        const dailyData: { [key: string]: { temps: number[], condition: string, icon: string } } = {};
        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyData[date]) {
            dailyData[date] = { temps: [], condition: item.weather[0].main, icon: item.weather[0].icon };
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
      } catch (err) {
        setForecast(MOCK_FORECAST);
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
      return 'fa-sun';
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-xl h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
      {forecast.map((day, idx) => (
        <div key={idx} className="group bg-white dark:bg-[#111114] p-8 rounded-[2.5rem] shadow-sm border border-stone-100 dark:border-white/5 text-center transition-all hover:shadow-2xl hover:scale-105 hover:border-emerald-500/30">
          <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-6">{day.date}</p>
          <div className="mb-6 transform group-hover:scale-125 transition-transform duration-500">
             <i className={`fa-solid ${day.icon} text-4xl ${day.icon === 'fa-sun' ? 'text-orange-500' : 'text-blue-400'} drop-shadow-vibrant`}></i>
          </div>
          <div className="flex justify-center items-baseline space-x-2">
            <span className="text-3xl font-black text-stone-900 dark:text-white tracking-tighter">{day.max}°</span>
            <span className="text-sm font-bold text-stone-400">{day.min}°</span>
          </div>
          <p className="text-[8px] mt-4 text-emerald-500 font-black uppercase tracking-widest">{day.condition}</p>
        </div>
      ))}
    </div>
  );
};

export default WeatherWidget;
