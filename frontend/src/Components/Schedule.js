import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getBookingsForDate } from '../Api/Bookings'; // API to get bookings
import { getAllCourts } from '../Api/Court'; // API to get all courts
import { format } from 'date-fns'; // For formatting dates

const Schedule = () => {
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch courts on component mount
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const courtData = await getAllCourts();
        setCourts(courtData);
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };
    fetchCourts();
  }, []);

  // Fetch bookings when the selected date changes
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const data = await getBookingsForDate(formattedDate);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [selectedDate]);

  // Filter the bookings for each court based on time
  const getBookingsForCourt = (courtId) => {
    return bookings.filter((booking) => booking.courtId._id === courtId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center">Schedule</h2>

      {/* Date Picker */}
      <div className="flex justify-center mb-8">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd MMM yyyy"
          className="p-2 border rounded-lg shadow-sm"
        />
      </div>

      {loading ? (
        <div className="text-center text-lg">Loading bookings...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-center">Court</th>
                <th className="border border-gray-300 p-2 text-center">Time Slot</th>
                <th className="border border-gray-300 p-2 text-center">Booking</th>
              </tr>
            </thead>
            <tbody>
              {courts.map((court) => (
                <React.Fragment key={court._id}>
                  {getBookingsForCourt(court._id).map((booking) => (
                    <tr key={booking._id}>
                      <td className="border border-gray-300 p-2 text-center">
                        {court.name}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {`${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`}
                      </td>
                      <td
                        className={`border border-gray-300 p-2 text-center ${
                          getBookingColor(booking.status)
                        }`}
                      >
                        <div>{booking.userId.username}</div>
                      </td>
                    </tr>
                  ))}

                  {/* If no bookings, show a placeholder row */}
                  {getBookingsForCourt(court._id).length === 0 && (
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        {court.name}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">
                        No booking
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Helper function to determine the booking color based on status
const getBookingColor = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-300';
    case 'Coaching':
      return 'bg-blue-300';
    case 'Pending Payment':
      return 'bg-red-300';
    case 'Blocked':
      return 'bg-gray-300';
    default:
      return 'bg-yellow-300';
  }
};

export default Schedule;
