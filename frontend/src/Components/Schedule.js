import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import { getBookingsForDate } from '../Api/Bookings'; // Assuming this API exists
import { format } from 'date-fns'; // For formatting date

const Schedule = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date

  // Fetch bookings whenever the selectedDate changes
  useEffect(() => {
    const fetchBookings = async () => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd'); // Format date for API
      const data = await getBookingsForDate(formattedDate);
      setBookings(data);
    };

    fetchBookings();
  }, [selectedDate]);

  // Render the schedule grid
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Schedule</h2>

      {/* Date Picker */}
      <div className="flex mb-4 items-center">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)} // Update selected date
          dateFormat="dd MMM yyyy"
          className="p-2 border rounded-lg"
        />
        <button className="ml-4 p-2 bg-gray-200 rounded-lg">Swimming</button>
        <button className="ml-2 p-2 bg-gray-200 rounded-lg">Badminton</button>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-6 gap-4">
        {/* Time Slots */}
        <div className="col-span-1">4 AM</div>
        <div className="col-span-1">Court 1</div>
        <div className="col-span-1">Court 2</div>
        <div className="col-span-1">Court 3</div>
        <div className="col-span-1">Court 4</div>
        <div className="col-span-1">Court 5</div>

        {/* Render bookings */}
        {bookings.map((booking) => (
          <div key={booking.id} className={`col-span-1 bg-${getBookingColor(booking.status)} p-2 rounded-lg`}>
            {booking.userName}
            <div>{booking.status}</div>
            <div>{booking.items} items</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get background color for booking status
const getBookingColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'green-200';
    case 'Pending Payment':
      return 'red-200';
    case 'Coaching':
      return 'blue-200';
    case 'Blocked':
      return 'gray-200';
    default:
      return 'yellow-200';
  }
};

export default Schedule;
