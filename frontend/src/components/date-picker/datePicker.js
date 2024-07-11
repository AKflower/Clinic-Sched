import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponnet = () => {
    const [selectedDate, setSelectedDate] = useState(null);
  
    return (
      <div>
        <h2>Select a date</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/YYYY"
        />
        {selectedDate && (
          <div>
            <h3>Selected Date: {selectedDate.toLocaleDateString()}</h3>
          </div>
        )}
      </div>
    );
  };
  
  export default DatePickerComponnet;
  