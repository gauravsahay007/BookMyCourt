import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCentre } from '../Api/Centre'; // API to add centre
import { registerCentreForUser } from '../Api/user'; // API to register centre for user
import { toast, ToastContainer } from 'react-toastify'; // Toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import { useData } from '../Context/DataProvider';

const RegisterCentre = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to prevent duplicate calls
  const { setState } = useData();
  const navigate = useNavigate(); // Hook to navigate between pages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!name || !location || !contactInfo) {
      toast.error('All fields are required.');
      return;
    }

    // Set loading to prevent multiple submissions
    setLoading(true);

    const centreData = {
      name,
      location,
      contactInfo,
    };

    try {
      // Create a new centre
      const response = await addCentre(centreData);

      if (response.status === 201) {
        const centreId = response.data._id; // Extract the centre ID from the response
        toast.success('Centre registered successfully!');

        // Update the state with the new centre ID
        setState((prevState) => ({
          ...prevState, // Spread the previous state
          centreId: centreId, // Update the centreId field
        }));

        // Navigate to the home page after success
        navigate('/');

      } else {
        toast.error('Failed to register centre. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error('An error occurred while registering the centre.');
    } finally {
      // Re-enable the button after API calls are complete
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Register a Centre</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium">Centre Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Enter centre name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Enter location"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Contact Info:</label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Enter contact information"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-600 text-white rounded px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Centre'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterCentre;
