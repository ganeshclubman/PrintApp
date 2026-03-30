import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: string;
  facilityName: string;
  memberName: string;
  startTime: string;
  endTime: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  amount: number;
}

const timeSlots = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"
];

const facilities = ["Tennis Court 1", "Tennis Court 2", "Badminton Court", "Swimming Pool", "Banquet Hall"];

export const FacilityBookingCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Mock bookings
    setBookings([
      { id: '1', facilityName: 'Tennis Court 1', memberName: 'John Doe', startTime: '07:00 AM', endTime: '08:00 AM', status: 'Confirmed', amount: 500 },
      { id: '2', facilityName: 'Badminton Court', memberName: 'Jane Smith', startTime: '09:00 AM', endTime: '10:00 AM', status: 'Confirmed', amount: 300 },
      { id: '3', facilityName: 'Tennis Court 2', memberName: 'Robert Brown', startTime: '07:00 AM', endTime: '09:00 AM', status: 'Pending', amount: 1000 },
      { id: '4', facilityName: 'Swimming Pool', memberName: 'Alice Wilson', startTime: '04:00 PM', endTime: '05:00 PM', status: 'Confirmed', amount: 200 },
    ]);
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('events.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time facility availability and member reservations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-4 text-sm font-bold text-slate-700">March 27, 2026</span>
            <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" />
            {t('events.newBooking')}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex">
        {/* Time Sidebar */}
        <div className="w-24 border-r border-slate-100 bg-slate-50/50">
          <div className="h-16 border-b border-slate-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          {timeSlots.map(time => (
            <div key={time} className="h-20 border-b border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
              {time}
            </div>
          ))}
        </div>

        {/* Facility Columns */}
        <div className="flex-1 flex overflow-x-auto no-scrollbar">
          {facilities.map(facility => (
            <div key={facility} className="min-w-[200px] flex-1 border-r border-slate-100 last:border-r-0">
              <div className="h-16 border-b border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center p-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{facility}</span>
                <span className="text-[10px] text-slate-400 font-medium">Available</span>
              </div>
              <div className="relative">
                {timeSlots.map(time => (
                  <div key={time} className="h-20 border-b border-slate-100 group hover:bg-slate-50/50 transition-colors cursor-pointer relative">
                    {/* Render Bookings for this facility and time */}
                    {bookings.filter(b => b.facilityName === facility && b.startTime === time).map(booking => (
                      <div 
                        key={booking.id}
                        className={cn(
                          "absolute inset-x-1 top-1 bottom-1 rounded-lg p-3 shadow-sm z-10 border-l-4",
                          booking.status === 'Confirmed' ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-amber-50 border-amber-500 text-amber-700"
                        )}
                      >
                        <p className="text-[10px] font-black uppercase tracking-tighter truncate">{booking.memberName}</p>
                        <p className="text-[9px] opacity-70 mt-0.5">{booking.startTime} - {booking.endTime}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-bold">{formatCurrency(booking.amount)}</span>
                          <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded bg-white/50">{booking.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
