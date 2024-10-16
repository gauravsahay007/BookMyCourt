import React, { useState, useEffect } from 'react';
import { getAllSports, addSport, updateSport, deleteSport } from '../Api/Sport'; // Import API calls

const ManageSports = () => {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState({ name: '', description: '', image: '', centre: '' });
  const [editing, setEditing] = useState(null);
  const LOCAL_centreId = localStorage.getItem('centreId'); // Retrieve centreId from localStorage

  // Fetch sports for the specific centre on component mount
  useEffect(() => {
    if (LOCAL_centreId) {
      setNewSport((prev) => ({ ...prev, centre: LOCAL_centreId })); // Initialize newSport with centreId
      fetchSports(LOCAL_centreId); 
    }
  }, []);

  const fetchSports = async (centreId) => {
    try {
      const data = await getAllSports(centreId); // Fetch sports for the given centreId
      setSports(data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSport((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSport = async () => {
    try {
      await addSport(newSport); // Add new sport
      setNewSport((prev) => ({ name: '', description: '', image: '', centre: prev.centre })); // Reset form, retain centreId
      fetchSports(newSport.centre); // Refresh the sports list
    } catch (error) {
      console.error('Error adding sport:', error);
    }
  };

  const handleUpdateSport = async (id) => {
    try {
      await updateSport(id, newSport); // Update sport details
      fetchSports(newSport.centre); // Refresh the sports list
      setEditing(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating sport:', error);
    }
  };

  const handleDeleteSport = async (id) => {
    try {
      await deleteSport(id); // Delete the sport
      fetchSports(newSport.centre); // Refresh the sports list
    } catch (error) {
      console.error('Error deleting sport:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Sports</h2>

      {/* Add New Sport */}
      <div className="mb-6">
        <h3 className="text-xl mb-2">Add New Sport</h3>
        <input
          type="text"
          name="name"
          placeholder="Sport Name"
          value={newSport.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newSport.description}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newSport.image}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddSport} className="bg-blue-500 text-white p-2 rounded">
          Add Sport
        </button>
      </div>

      {/* List of Sports - Grid Layout */}
      <h3 className="text-xl mb-2">Sports List</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sports.map((sport) => (
          <div key={sport._id} className="border p-4 rounded shadow-md">
            {editing === sport._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={newSport.name}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
                <button
                  onClick={() => handleUpdateSport(sport._id)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Save
                </button>
                <button onClick={() => setEditing(null)} className="bg-red-500 text-white p-2 rounded">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <img src={sport.image} alt={sport.name} className="h-32 w-full object-cover mb-2 rounded" />
                <h4 className="text-lg font-semibold mb-2">{sport.name}</h4>
                <p className="text-sm mb-2">{sport.description}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => setEditing(sport._id)}
                    className="bg-yellow-500 text-white p-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSport(sport._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSports;
