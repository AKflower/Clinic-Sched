import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ onChange, disabledDates, appointmentDates, onDateClick }) => {
  const [date, setDate] = useState(new Date());
  console.log('Test: ', disabledDates, appointmentDates);

  const handleChange = (newDate) => {
    const dateString = newDate.toISOString().split('T')[0];
    if (isDateMarked(newDate)) {
      onDateClick(dateString);
    } else {
      setDate(newDate);
      onChange(newDate);
    }
  };

  // Function to determine if a date should be marked as disabled
  const isDateMarked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return disabledDates && disabledDates.includes(dateString);
  };

  // Function to determine if a date has an appointment
  const isDateWithAppointment = (date) => {
    // console.log('check: ',appointmentDates)
    const dateString = date.toISOString().split('T')[0];
    return appointmentDates && appointmentDates.includes(dateString);
  };

  // Function to add custom content to the tiles
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (isDateMarked(date)) {
        return 'date-off';
      }
      if (isDateWithAppointment(date)) {
        return 'date-appointment';
      }
    }
    return null;
  };

  return (
    <div>
      <h3 className="d-flex center">Chọn ngày</h3>
      <Calendar
        onChange={handleChange}
        value={date}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default CalendarComponent;