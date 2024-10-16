import axios from 'axios';
const API_URL = process.env.REACT_APP_BACKEND;

// Helper function to get token and user ID from localStorage
const getAuthDetails = () => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  if (!jwt || !jwt.token || !jwt.user) {
    throw new Error("User is not authenticated.");
  }
  return { token: jwt.token, userId: jwt.user._id };
};

// Function to register a centre for a user
export const registerCentreForUser = async (centreId) => {
  try {
    const { token, userId } = getAuthDetails(); // Get token and user ID

    // Send the PUT request with the centreId in the body and the token in the headers
    const response = await axios.put(
      `${API_URL}/api/registerCentre/${userId}`,
      { centreId }, // Payload with centreId
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      }
    );

    return response.data; // Return the response data from the server
  } catch (error) {
    console.error("Error registering centre:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

// Function to get the registered centre for a user
export const getUserRegisteredCentre = async (userId) => {
  try {
    const { token } = getAuthDetails(); // Get token only

    // Send a GET request to fetch the registered centre
    const response = await axios.get(
      `${API_URL}/api/user/${userId}/registered-centre`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      }
    );

    return response.data; // Return the data from the server response
  } catch (error) {
    console.error("Error fetching registered centre:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

// Function to fetch user bookings from the backend
export const getUserBookings = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/user/${userId}/bookings`, // API endpoint
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the JWT token for authentication
        },
      }
    );
    return response.data.bookings; // Return the list of bookings
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};
