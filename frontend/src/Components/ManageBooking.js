import React, { useState, useEffect } from 'react';
import { getBookingsByCentreSportAndDate, deleteBooking, updateBooking } from '../Api/Bookings';
import { getAllSports } from '../Api/Sport';
import { getAllCourts } from '../Api/Court';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageBookings = () => {
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const LOCAL_centreId = localStorage.getItem('centreId');

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const sportsData = await getAllSports(LOCAL_centreId);
      setSports(sportsData);
    } catch (error) {
      console.error('Error fetching sports:', error);
      toast.error('Failed to load sports.');
    }
  };

  const fetchCourts = async (sportId) => {
    try {
      const courtsData = await getAllCourts(sportId);
      setCourts(courtsData);
    } catch (error) {
      console.error('Error fetching courts:', error);
      toast.error('Failed to load courts.');
    }
  };

  const fetchBookings = async () => {
    if (!selectedSport || !selectedCourt || !bookingDate) {
      toast.error('Please select a sport, court, and date.');
      return;
    }

    setLoading(true);
    try {
      const criteria = {
        centreId: LOCAL_centreId,
        sportId: selectedSport,
        courtId: selectedCourt,
        date: bookingDate,
      };
      const data = await getBookingsByCentreSportAndDate(criteria);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      toast.success('Booking deleted successfully.');
      fetchBookings(); // Refresh bookings after deletion
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking.');
    }
  };

  const handleUpdateBooking = async () => {
    try {
      const updatedBooking = {
        date: newDate || editingBooking.date,
        timeSlot: {
          startTime: `${newStartTime}:00` || editingBooking.timeSlot.startTime,
          endTime: `${newEndTime}:00` || editingBooking.timeSlot.endTime,
        },
      };
      await updateBooking(editingBooking._id, updatedBooking);
      toast.success('Booking updated successfully.');
      setEditingBooking(null); // Exit edit mode
      fetchBookings(); // Refresh bookings after update
    } catch (error) {
      console.error('Error updating booking:', error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // Show server error message
      } else {
        toast.error('Failed to update booking.');
      }
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setNewDate(booking.date.split('T')[0]); // Set date in 'YYYY-MM-DD' format
    setNewStartTime(booking.timeSlot.startTime.slice(0, 5)); // Set time in 'HH:mm'
    setNewEndTime(booking.timeSlot.endTime.slice(0, 5)); // Set time in 'HH:mm'
  };

  const handleSportChange = (e) => {
    const sportId = e.target.value;
    setSelectedSport(sportId);
    setSelectedCourt('');
    fetchCourts(sportId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Bookings</h2>

      <div className="max-w-lg mx-auto bg-white shadow-lg p-8 rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Sport</label>
          <select
            value={selectedSport}
            onChange={handleSportChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select a Sport</option>
            {sports.map((sport) => (
              <option key={sport._id} value={sport._id}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Court</label>
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="border p-2 w-full rounded"
            disabled={!selectedSport}
          >
            <option value="">Select a Court</option>
            {courts.map((court) => (
              <option key={court._id} value={court._id}>
                {court.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          onClick={fetchBookings}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Loading Bookings...' : 'View Bookings'}
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl mb-4">Bookings List</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">No bookings found for the selected criteria.</p>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="border-b p-4 text-left">Court</th>
                <th className="border-b p-4 text-left">Date</th>
                <th className="border-b p-4 text-left">Time Slot</th>
                <th className="border-b p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="border-b p-4">{booking.courtId.name}</td>
                  <td className="border-b p-4">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="border-b p-4">
                    {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                  </td>
                  <td className="border-b p-4 flex justify-center space-x-2">
                    {editingBooking && editingBooking._id === booking._id ? (
                      <>
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="border p-2 rounded"
                        />
                        <input
                          type="time"
                          value={newStartTime}
                          onChange={(e) => setNewStartTime(e.target.value)}
                          className="border p-2 rounded"
                        />
                        <input
                          type="time"
                          value={newEndTime}
                          onChange={(e) => setNewEndTime(e.target.value)}
                          className="border p-2 rounded"
                        />
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                          onClick={handleUpdateBooking}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                        onClick={() => handleEditBooking(booking)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageBookings;
