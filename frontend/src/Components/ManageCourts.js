import React, { useState, useEffect } from 'react';
import { getCourts, addCourt, updateCourt, deleteCourt } from '../Api/Court'; // Assuming these API methods exist

const ManageCourts = () => {
  const [courts, setCourts] = useState([]);
  const [newCourtName, setNewCourtName] = useState('');
  const [editCourtId, setEditCourtId] = useState(null);
  const [editCourtName, setEditCourtName] = useState('');

  // Fetch all courts when the component loads
  useEffect(() => {
    const fetchCourts = async () => {
      const data = await getCourts(); // Fetch courts from the API
      setCourts(data || []); // Ensure courts is always an array, even if data is null
    };
    fetchCourts();
  }, []);

  // Handle adding a new court
  const handleAddCourt = async () => {
    if (newCourtName.trim()) {
      try {
        console.log("Adding court:", newCourtName); // Log the court name before API call

        const newCourt = await addCourt({ name: newCourtName });
        console.log("Court added:", newCourt); // Log the added court returned by the API

        // Update courts list with the new court
        setCourts([...courts, newCourt]); 
        setNewCourtName(''); // Clear the input field
      } catch (error) {
        console.error("Error adding court:", error); // Log any error from the API
      }
    }
  };

  // Handle deleting a court
  const handleDeleteCourt = async (courtId) => {
    try {
      await deleteCourt(courtId);
      setCourts(courts.filter((court) => court && court._id !== courtId)); // Ensure court is not null
    } catch (error) {
      console.error("Error deleting court:", error); // Log any error from the API
    }
  };

  // Handle editing a court
  const handleEditCourt = async () => {
    if (editCourtName.trim()) {
      try {
        const updatedCourt = await updateCourt(editCourtId, { name: editCourtName });
        setCourts(
          courts.map((court) => court && court._id === editCourtId ? updatedCourt : court)
        ); // Update the edited court
        setEditCourtId(null); // Exit edit mode
        setEditCourtName(''); // Clear the edit input field
      } catch (error) {
        console.error("Error updating court:", error); // Log any error from the API
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Courts</h2>

      {/* Add New Court */}
      <div className="mb-4">
        <input
          type="text"
          value={newCourtName}
          onChange={(e) => setNewCourtName(e.target.value)}
          placeholder="Enter new court name"
          className="p-2 border rounded-lg mr-2"
        />
        <button
          onClick={handleAddCourt}
          className="p-2 bg-blue-500 text-white rounded-lg"
          disabled={!newCourtName.trim()} // Disable if no name entered
        >
          Add Court
        </button>
      </div>

      {/* Display message if no courts are available */}
      {courts.length === 0 ? (
        <p className="text-gray-600">No courts available. Add a new court above.</p>
      ) : (
        /* Courts List */
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Court ID</th>
              <th className="border border-gray-300 p-2">Court Name</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) =>
              court ? ( // Add a null check for each court before rendering it
                <tr key={court._id}>
                  <td className="border border-gray-300 p-2">{court._id}</td>
                  <td className="border border-gray-300 p-2">
                    {editCourtId === court._id ? (
                      <input
                        type="text"
                        value={editCourtName}
                        onChange={(e) => setEditCourtName(e.target.value)}
                        className="p-2 border rounded-lg"
                      />
                    ) : (
                      court.name
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {editCourtId === court._id ? (
                      <button
                        onClick={handleEditCourt}
                        className="p-2 bg-green-500 text-white rounded-lg mr-2"
                        disabled={!editCourtName.trim()} // Disable if no name entered
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditCourtId(court._id);
                          setEditCourtName(court.name);
                        }}
                        className="p-2 bg-yellow-500 text-white rounded-lg mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCourt(court._id)}
                      className="p-2 bg-red-500 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ) : null // Skip rendering if court is null
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCourts;
