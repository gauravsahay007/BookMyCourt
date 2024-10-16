import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../Api/user'; // Import the API function
import { toast } from 'react-toastify';

const UserSchedule = () => {
  const [bookings, setBookings] = useState([]); // Store user bookings
  const [loading, setLoading] = useState(true); // Loading state

  const userId = JSON.parse(localStorage.getItem('jwt'))?.user?._id; // Retrieve userId from localStorage
  const token = JSON.parse(localStorage.getItem('jwt'))?.token; // Retrieve JWT token from localStorage

  // Fetch user bookings on component mount
  useEffect(() => {
    const fetchUserBookings = async () => {
      setLoading(true);
      try {
        const data = await getUserBookings(userId, token); // Fetch bookings for the user
        console.log('Bookings:', data); // Log bookings for debugging

        setBookings(data || []); // Store bookings in state
      } catch (error) {
        toast.error(error.message || 'Failed to fetch user bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [userId, token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">My Bookings</h2>

      {loading ? (
        <div>Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 bg-white shadow rounded-lg"
            >
              <h3 className="font-semibold text-lg">
                Court: {booking.courtId.name}
              </h3>
              <p>
                Time: {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
              </p>
              <p>Booking ID: {booking._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSchedule;
