// Import necessary packages
import axios from 'axios';
// Function to sign up a user
export const signup = async (userData) => {
  try {
    // Make POST request to backend API
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND}/api/signup`, // Use environment variable for backend URL
      userData,
      {
        headers: {
          'Content-Type': 'application/json', // Set appropriate headers
        },
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors by returning the error message
    return {
      error: error.response ? error.response.data : "Network Error",
    };
  }
};


export const signin = async (userData) => {
    try {
      // Send a POST request to the signin API with the user's credentials
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/signin`, {
        method: 'POST', // Request method
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(userData), // Convert user data to JSON
      });
  
      // Parse the response as JSON
      const data = await response.json();
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        return { error: data };
      }
  
      // Return the successful data
      return data;
    } catch (error) {
      // If there is a network or other issue, catch the error and return it
      return { error: 'Network error. Please try again later.' };
    }
  };

export const authenticate = (data, next) =>{
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt",JSON.stringify(data))
        next();
    }
}

export const isAuthenticated = () => {
    if(typeof window == "undefined"){
        return false
    }
    if(localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"));
        
    }
    else{
        return false    }
}


// Function to sign out the user
export const signout = (next) => {
  if (typeof window !== 'undefined') {
    // Clear JWT from localStorage
    localStorage.removeItem('jwt');
    localStorage.removeItem('centreId');
    
    // Call next function if provided
    next && next();

  }
};
