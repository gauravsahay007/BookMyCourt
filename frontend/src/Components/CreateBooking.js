import React, { useState, useEffect } from 'react';
import { getAllCentres } from '../Api/Centre';
import { getAllSports } from '../Api/Sport';
import { getAllCourts } from '../Api/Court';
import { createBooking } from '../Api/Bookings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBooking = () => {
  const [centres, setCentres] = useState([]);
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCentres();
  }, []);

  const fetchCentres = async () => {
    try {
      const data = await getAllCentres();
      setCentres(data);
    } catch (error) {
      console.error('Error fetching centres:', error);
      toast.error('Failed to load centres.');
    }
  };

  const fetchSports = async (centreId) => {
    try {
      const sportsData = await getAllSports(centreId);
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

  const handleCentreChange = (e) => {
    const centreId = e.target.value;
    setSelectedCentre(centreId);
    setSelectedSport('');
    setSelectedCourt('');
    setCourts([]);
    fetchSports(centreId);
  };

  const handleSportChange = (e) => {
    const sportId = e.target.value;
    setSelectedSport(sportId);
    setSelectedCourt('');
    fetchCourts(sportId);
  };

  const handleBookingSubmit = async () => {
    if (!selectedCentre || !selectedSport || !selectedCourt || !bookingDate || !startTime || !endTime) {
      toast.error('All fields are required!');
      return;
    }

    const bookingData = {
      courtId: selectedCourt,
      sportId: selectedSport,
      date: bookingDate,
      timeSlot: {
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
      },
    };

    setLoading(true);
    try {
      await createBooking(bookingData);
      toast.success('Booking created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // Show backend error message in toast
      } else {
        toast.error('Failed to create booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCentre('');
    setSelectedSport('');
    setSelectedCourt('');
    setBookingDate('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Booking</h2>

      <div className="max-w-lg mx-auto bg-white shadow-lg p-8 rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Centre</label>
          <select
            value={selectedCentre}
            onChange={handleCentreChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select a Centre</option>
            {centres.map((centre) => (
              <option key={centre._id} value={centre._id}>
                {centre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Sport</label>
          <select
            value={selectedSport}
            onChange={handleSportChange}
            className="border p-2 w-full rounded"
            disabled={!selectedCentre}
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

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          onClick={handleBookingSubmit}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Creating Booking...' : 'Create Booking'}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateBooking;
