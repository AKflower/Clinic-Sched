import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ onChange, disabledDates }) => {
  const [date, setDate] = useState(new Date());
  console.log('Test: ',disabledDates);
  const handleChange = (newDate) => {
    setDate(newDate);
    onChange(newDate);
  };

  // Function to determine if a date should be disabled
  const isDateDisabled = ({ date, view }) => {
    if (view === 'month') {
      const day = date.getDay();
      // Disable weekends
    
      // Check if date is in the list of disabled dates
      const dateString = date.toISOString().split('T')[0];
      if (disabledDates && disabledDates.includes(dateString)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <h3 className='d-flex center'>Chọn ngày</h3>
      <Calendar
        onChange={handleChange}
        value={date}
        tileDisabled={isDateDisabled}
      />
    </div>
  );
};

export default CalendarComponent;
