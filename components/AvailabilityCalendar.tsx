
import React, { useState } from 'react';

interface AvailabilityCalendarProps {
  bookedDates: Set<string>;
  isLoading?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ bookedDates, isLoading = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const days = [];
  const totalDays = daysInMonth(month, year);
  const startOffset = firstDayOfMonth(month, year);

  // Previous month padding
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="h-14 border border-stone-50 dark:border-stone-900 bg-stone-50/30 dark:bg-stone-900/10"></div>);
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isBooked = bookedDates.has(dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div 
        key={d} 
        className={`h-14 flex flex-col items-center justify-center text-sm font-medium border border-stone-100 dark:border-stone-800 transition-all relative
          ${isBooked 
            ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed' 
            : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-default'}
          ${isToday ? 'ring-2 ring-inset ring-emerald-500/50 dark:ring-emerald-400/30' : ''}
        `}
      >
        <span className={`${isToday ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''} z-10`}>{d}</span>
        {isBooked && (
          <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-20 pointer-events-none">
            <div className="w-full h-px bg-stone-900 dark:bg-white rotate-45"></div>
            <div className="w-full h-px bg-stone-900 dark:bg-white -rotate-45"></div>
          </div>
        )}
        {isBooked && (
          <span className="text-[8px] font-black uppercase tracking-tighter mt-1 opacity-60 z-10">Occupied</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden relative transition-colors duration-300">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-stone-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <i className="fa-solid fa-spinner animate-spin text-emerald-600 dark:text-emerald-400 text-xl"></i>
            <span className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">Updating Availability...</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="font-bold text-stone-800 dark:text-stone-100 text-xl tracking-tight">{monthName}</h4>
          <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest">{year}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-full transition-colors text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400">
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-full transition-colors text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-stone-100 dark:bg-stone-800 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-inner">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-stone-50/50 dark:bg-stone-900/50 text-[9px] font-black text-stone-400 dark:text-stone-500 py-4 text-center uppercase tracking-[0.2em]">{day}</div>
        ))}
        {days}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6 text-[9px] font-black uppercase tracking-widest">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-sm"></div>
          <span className="text-stone-500 dark:text-stone-400">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-sm relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-stone-900 dark:bg-white rotate-45"></div>
          </div>
          <span className="text-stone-400 dark:text-stone-500">Reserved</span>
        </div>
        <div className="flex items-center space-x-2 sm:ml-auto">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-emerald-700 dark:text-emerald-400">Live Sync</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
