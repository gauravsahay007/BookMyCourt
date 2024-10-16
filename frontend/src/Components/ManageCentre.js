import React, { useState, useEffect } from 'react';
import { getCentreDetails, updateCentre } from '../Api/Centre'; // API calls for centre management
import ManageSports from './ManageSport'; // ManageSports component
import ManageCourts from './ManageCourts'; // ManageCourts component

const ManageCentre = () => {
  const [centre, setCentre] = useState({ name: '', location: '', sports: [] }); // Centre state
  const [editing, setEditing] = useState(false); // Edit mode state
  const LOCAL_centreId = localStorage.getItem('centreId'); // Retrieve centreId from localStorage

  // Fetch the centre details when the component mounts
  useEffect(() => {
    if (LOCAL_centreId) {
      fetchCentreDetails(LOCAL_centreId);
    }
  }, [LOCAL_centreId]); // Add LOCAL_centreId as dependency to ensure it runs correctly

  useEffect(() => {
    if (LOCAL_centreId) {
      fetchCentreDetails(LOCAL_centreId);
    }
  }, []);

  // Function to fetch centre details
  const fetchCentreDetails = async (centreId) => {
    try {
      const data = await getCentreDetails(centreId); // API call to get centre details
      setCentre(data); // Set the fetched data to state
      console.log('Centre Details:', data); // Log data for debugging
    } catch (error) {
      console.error('Error fetching centre details:', error); // Error handling
    }
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCentre((prev) => ({ ...prev, [name]: value })); // Update the state with form data
  };

  // Handle the update of centre details
  const handleUpdateCentre = async () => {
    try {
      await updateCentre(LOCAL_centreId, centre); // API call to update the centre
      setEditing(false); // Exit edit mode
      fetchCentreDetails(LOCAL_centreId); // Refresh centre details
    } catch (error) {
      console.error('Error updating centre:', error); // Error handling
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Manage Centre</h2>

      {/* Centre Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Centre Details</h3>
        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={centre.name}
              onChange={handleInputChange}
              placeholder="Centre Name"
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              name="location"
              value={centre.location}
              onChange={handleInputChange}
              placeholder="Centre Location"
              className="border p-2 w-full rounded"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleUpdateCentre}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Name:</strong> {centre.name}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Location:</strong> {centre.location}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit Centre
            </button>
          </>
        )}
      </div>

      {/* Manage Sports Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Manage Sports</h3>
        <div className="bg-white shadow-md rounded-lg p-6">
          <ManageSports /> {/* Integrating the ManageSports component */}
        </div>
      </div>

      {/* Manage Courts Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Manage Courts</h3>
        <div className="bg-white shadow-md rounded-lg p-6">
          <ManageCourts /> {/* Integrating the ManageCourts component */}
        </div>
      </div>
    </div>
  );
};

export default ManageCentre;
