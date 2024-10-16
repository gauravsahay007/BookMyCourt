// ../Api/Centre.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND; // Ensure you have your backend URL set in the environment variables
// Function to add a centre
export const getAllCentres = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/allCentre`);
    return response.data; // Return the data
  } catch (error) {
    console.error('Error fetching centres:', error);
    throw error;
  }
};

export const addCentre = async (centreData) => {
  try {
    // Extract userId from local storage
    const userId = JSON.parse(localStorage.getItem("jwt"))?.user?._id; // Adjust this path based on your JWT structure

    if (!userId) {
      throw new Error("User ID not found in local storage.");
    }

    // Extract the token from local storage
    const token = JSON.parse(localStorage.getItem("jwt"))?.token; // Adjust this path based on your JWT structure

    // Construct the API URL
    const apiUrl = `${API_URL}/api/centre/add/${userId}`;

    // Send a POST request to add the centre with authorization header
    const response = await axios.post(apiUrl, centreData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    // Check if the response contains the centre ID and store it in local storage
 
      localStorage.setItem('centreId', response.data._id); // Store centre ID in local storage


    return response; // Return the response for further handling
  } catch (error) {
    console.error("Error adding centre:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};


export const getCentreDetails = async (centreId) => {
  try {
    const response = await axios.get(`${API_URL}/api/centre/${centreId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching centre details:', error);
    throw error;
  }
};

export const updateCentre = async (centreId, centreData) => {
  try {
    const token = JSON.parse(localStorage.getItem("jwt"))?.token; 
    const userId = JSON.parse(localStorage.getItem("jwt"))?.user?._id;
    const response = await axios.put(`${API_URL}/api/centre/update/${centreId}/${userId}`, centreData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating centre:', error);
    throw error;
  }
};

