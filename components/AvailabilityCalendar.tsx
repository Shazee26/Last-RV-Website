
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/database';

const AvailabilityCalendar: React.FC = () => {
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase.from('bookings').select('check_in, check_out');
      if (error) return;

      const dates = new Set<string>();
      data.forEach((booking: any) => {
        let current = new Date(booking.check_in);
        const end = new Date(booking.check_out);
        while (current <= end) {
          dates.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
      });
      setBookedDates(dates);
    };

    fetchBookings();
  }, []);

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

  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="h-12 border border-stone-50"></div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isBooked = bookedDates.has(dateStr);
    days.push(
      <div 
        key={d} 
        className={`h-12 flex items-center justify-center text-sm font-medium border border-stone-100 transition-colors relative group
          ${isBooked ? 'bg-amber-50 text-amber-700' : 'bg-white text-stone-700 hover:bg-emerald-50'}
        `}
      >
        {d}
        {isBooked && (
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-stone-800 text-lg">{monthName} {year}</h4>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <i className="fa-solid fa-chevron-left text-stone-400"></i>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <i className="fa-solid fa-chevron-right text-stone-400"></i>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-stone-100 rounded-xl overflow-hidden border border-stone-100">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="bg-stone-50 text-[10px] font-bold text-stone-400 p-2 text-center uppercase tracking-widest">{day}</div>
        ))}
        {days}
      </div>

      <div className="mt-6 flex items-center space-x-6 text-xs font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white border border-stone-200 rounded-sm"></div>
          <span className="text-stone-500">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-sm"></div>
          <span className="text-amber-700">Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
