// ../Api/Sport.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND; // Ensure your backend URL is set in environment variables

// Helper function to get userId and token from local storage
const getAuthHeaders = () => {
  const jwt = JSON.parse(localStorage.getItem('jwt'));
  const userId = jwt?.user?._id;
  const token = jwt?.token;

  if (!userId || !token) {
    throw new Error('User ID or token not found in local storage.');
  }

  return { userId, token };
};

// Function to get all sports
export const getAllSports = async (centreId) => {
  try {
    const { token, userId } = getAuthHeaders();
    
    const response = await axios.post(
      `${API_URL}/api/sports/getAll/${userId}`,  // API URL with userId as part of the path
      { centreId },  // Sending centreId in the payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response);

    return response.data;
  } catch (error) {
    console.error('Error fetching sports for the centre:', error);
    throw error;
  }
};

// Function to add a new sport
export const addSport = async (sportData) => {
  try {
    const { userId, token } = getAuthHeaders();

    const response = await axios.post(
      `${API_URL}/api/sport/add/${userId}`,
      sportData, // Send sport data along with centreId in the payload
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding sport:', error);
    throw error;
  }
};

// Function to update a sport
export const updateSport = async (sportId, sportData) => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.put(`${API_URL}/api/sport/update/${sportId}/${userId}`, sportData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating sport:', error);
    throw error;
  }
};

// Function to delete a sport
export const deleteSport = async (sportId) => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.delete(`${API_URL}/api/sport/remove/${sportId}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting sport:', error);
    throw error;
  }
};
