'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface CalendarProps {
  month?: Date;
  onMonthChange?: (date: Date) => void;
  onDateSelect?: (date: Date) => void;
  selected?: Date | Date[];
  className?: string;
}

export const Calendar = ({
  month = new Date(),
  onMonthChange,
  onDateSelect,
  selected,
  className,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(month);
  
  const handlePreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
    onMonthChange?.(previousMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
    onMonthChange?.(nextMonth);
  };
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isSelected = Array.isArray(selected)
        ? selected.some(d => d.toDateString() === date.toDateString())
        : selected?.toDateString() === date.toDateString();
      
      days.push(
        <button
          key={i}
          type="button"
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            isSelected
              ? 'bg-primary-500 text-white'
              : 'hover:bg-neutral-100'
          }`}
          onClick={() => onDateSelect?.(date)}
        >
          {i}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className={`p-3 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="h-10 w-10 flex items-center justify-center text-sm font-medium text-neutral-500">
            {day.charAt(0)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};
