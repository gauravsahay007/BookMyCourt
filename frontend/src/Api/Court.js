// ../Api/Court.js
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

// Function to add a new court
export const addCourt = async (courtData) => {
  try {
    const { user, token } = JSON.parse(localStorage.getItem('jwt'));
    const userId = user._id;
    const response = await axios.post(
      `${API_URL}/api/court/add/${userId}`,
      courtData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error adding court:', error);
    throw error;
  }
};

// Function to get all courts
export const getAllCourts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/courts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courts:', error);
    throw error;
  }
};

// Function to update a court
export const updateCourt = async (courtId, courtData) => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.put(
      `${API_URL}/api/court/update/${courtId}/${userId}`,
      courtData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating court:', error);
    throw error;
  }
};

// Function to delete a court
export const deleteCourt = async (courtId) => {
  try {
    const { userId, token } = getAuthHeaders();
    const response = await axios.delete(
      `${API_URL}/api/court/remove/${courtId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting court:', error);
    throw error;
  }
};
