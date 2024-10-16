const API_URL = process.env.REACT_APP_BACKEND; // Set your backend URL in .env

// Function to get all courts
export const getCourts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/courts`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data; // return the courts data
    } else {
      throw new Error(data.error || 'Failed to fetch courts');
    }
  } catch (error) {
    console.error('Error fetching courts:', error);
    return []; // Return an empty array on error
  }
};

// Function to add a new court
export const addCourt = async (court) => {
  try {
    const jwt = JSON.parse(localStorage.getItem("jwt")); // Correctly access the JWT
    if (!jwt) throw new Error("User not authenticated"); // Check for JWT presence
    const response = await fetch(`${API_URL}/api/court/add/${jwt.user._id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt.token}` // Use the token for authentication
      },
      body: JSON.stringify(court), // court should have fields like {name: 'Court Name'}
    });
    const data = await response.json();
    if (response.ok) {
      return data; // return the newly created court
    } else {
      throw new Error(data.error || 'Failed to add court');
    }
  } catch (error) {
    console.error('Error adding court:', error);
    return null;
  }
};

// Function to update a court
export const updateCourt = async (courtId, updatedData) => {
  try {
    const jwt = JSON.parse(localStorage.getItem("jwt")); // Correctly access the JWT
    if (!jwt) throw new Error("User not authenticated"); // Check for JWT presence
    const response = await fetch(`${API_URL}/api/courts/${courtId}/${jwt.user._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData), // {name: 'Updated Court Name'}
    });
    const data = await response.json();
    if (response.ok) {
      return data; // return the updated court
    } else {
      throw new Error(data.error || 'Failed to update court');
    }
  } catch (error) {
    console.error('Error updating court:', error);
    return null;
  }
};

// Function to delete a court
export const deleteCourt = async (courtId) => {
  try {
    const jwt = JSON.parse(localStorage.getItem("jwt")); // Correctly access the JWT
    if (!jwt) throw new Error("User not authenticated"); // Check for JWT presence
    const response = await fetch(`${API_URL}/api/courts/${courtId}/${jwt.user._id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return true; // Successfully deleted
    } else {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete court');
    }
  } catch (error) {
    console.error('Error deleting court:', error);
    return false;
  }
};
