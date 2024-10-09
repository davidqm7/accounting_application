import React, { useState, useEffect } from 'react';
import './Calandar.css';

const Calandar = () => {
  // Initialize state for date, year, month, and calendar content
  const [date, setDate] = useState(new Date());
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const [calendarDates, setCalendarDates] = useState([]);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Function to generate the calendar
  const manipulate = () => {
    const dayone = new Date(year, month, 1).getDay();
    const lastdate = new Date(year, month + 1, 0).getDate();
    const dayend = new Date(year, month, lastdate).getDay();
    const monthlastdate = new Date(year, month, 0).getDate();
    
    let lit = [];

    // Add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
      lit.push(<li key={`prev-${i}`} className="inactive">{monthlastdate - i + 1}</li>);
    }

    // Add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {
      const isToday = i === date.getDate() && month === date.getMonth() && year === date.getFullYear();
      lit.push(<li key={i} className={isToday ? 'active' : ''}>{i}</li>);
    }

    // Add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
      lit.push(<li key={`next-${i}`} className="inactive">{i - dayend + 1}</li>);
    }

    setCalendarDates(lit);
  };

  // useEffect to run when year, month, or date changes
  useEffect(() => {
    manipulate();
  }, [year, month, date]);

  const handlePrevNext = (direction) => {
    const newMonth = direction === 'prev' ? month - 1 : month + 1;
    if (newMonth < 0 || newMonth > 11) {
      const newDate = new Date(year, newMonth, date.getDate());
      setDate(newDate);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    } else {
      setMonth(newMonth);
    }
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <p className="calendar-current-date">{months[month]} {year}</p>
        <div className="calendar-navigation">
          <span
            id="calendar-prev"
            className="material-symbols-rounded"
            onClick={() => handlePrevNext('prev')}
          >
            L
          </span>
          <span
            id="calendar-next"
            className="material-symbols-rounded"
            onClick={() => handlePrevNext('next')}
          >
            R
          </span>
        </div>
      </header>

      <div className="calendar-body">
        <ul className="calendar-weekdays">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className="calendar-dates">
          {calendarDates}
        </ul>
      </div>
    </div>
  );
};

export default Calandar;
