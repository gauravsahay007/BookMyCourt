// ../Api/Booking.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND; // Backend URL from environment variables


// Helper function to get token and userId from localStorage
const getAuthHeaders = () => {
  const jwt = JSON.parse(localStorage.getItem('jwt'));
  const userId = jwt?.user?._id;
  const token = jwt?.token;

  if (!userId || !token) {
    throw new Error('User ID or token not found in local storage.');
  }

  return { userId, token };
};

// Function to add a new booking
// Function to add a new booking
export const createBooking = async ({ courtId, sportId, date, timeSlot }) => {
  try {
    const { userId, token } = getAuthHeaders();

    // Construct payload with required fields
    const payload = {
      userId, // Include userId in the payload
      courtId,
      sportId,
      date,
      timeSlot, // Ensure timeSlot includes start and end time in the correct format
    };

    const response = await axios.post(
      `${API_URL}/api/booking/add/${userId}`, // Endpoint URL
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
};

// Function to get all bookings
export const getAllBookings = async () => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.get(
      `${API_URL}/api/booking/getAll/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Function to get bookings by centre, sport, and date
export const getBookingsByCentreSportAndDate = async (criteria) => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.get(
      `${API_URL}/api/booking/get/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: criteria, // Send centreId, sportId, and date as query parameters
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings by criteria:', error);
    throw error;
  }
};



// Function to update a booking
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.put(
      `${API_URL}/api/booking/edit/${bookingId}/${userId}`,
      bookingData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Function to delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.delete(
      `${API_URL}/api/booking/remove/${bookingId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const getBookingsForDate = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/api/booking/getBydate`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings for date:', error);
    throw error;
  }
};