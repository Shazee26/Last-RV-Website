
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AvailabilityCalendarProps {
  refreshKey?: number;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ refreshKey = 0 }) => {
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('bookings').select('check_in, check_out');
    if (error) {
      console.error('Error fetching calendar data:', error);
      setIsLoading(false);
      return;
    }

    const dates = new Set<string>();
    data.forEach((booking: any) => {
      // Use local date parts to avoid UTC shifting issues
      const start = new Date(booking.check_in + 'T00:00:00');
      const end = new Date(booking.check_out + 'T00:00:00');
      let current = new Date(start);
      
      while (current <= end) {
        dates.add(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    setBookedDates(dates);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [refreshKey]);

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

  // Padding for previous month
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="h-12 border border-stone-50"></div>);
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isBooked = bookedDates.has(dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div 
        key={d} 
        className={`h-12 flex items-center justify-center text-sm font-medium border border-stone-100 transition-colors relative group
          ${isBooked ? 'bg-amber-50 text-amber-700' : 'bg-white text-stone-700 hover:bg-emerald-50'}
          ${isToday ? 'ring-1 ring-inset ring-emerald-500' : ''}
        `}
      >
        <span className={isToday ? 'text-emerald-700 font-bold' : ''}>{d}</span>
        {isBooked && (
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <i className="fa-solid fa-spinner animate-spin text-emerald-600"></i>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-stone-800 text-lg">{monthName} {year}</h4>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-emerald-700">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-emerald-700">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-stone-100 rounded-xl overflow-hidden border border-stone-100">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="bg-stone-50 text-[10px] font-bold text-stone-400 p-2 text-center uppercase tracking-widest">{day}</div>
        ))}
        {days}
      </div>

      <div className="mt-6 flex items-center space-x-6 text-[10px] font-bold uppercase tracking-wider">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white border border-stone-200 rounded-sm shadow-sm"></div>
          <span className="text-stone-400">Open</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-sm shadow-sm"></div>
          <span className="text-amber-600">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
