import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const CalendarComponent = ({onChange}) => {
    const [date, setDate] = useState(new Date());

    const handleChange = (newDate) => {
      setDate(newDate);
      onChange(newDate)
    };
    
    return (
      <div>
        <h3 className='d-flex center'>Chọn ngày</h3>
        <Calendar
          onChange={handleChange}
          value={date}
        />
        <div>
        
        </div>
       
      </div>
    );
  };
  
  export default CalendarComponent;
  