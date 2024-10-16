import React, { useState, useEffect } from 'react';
import { getAllCourts, addCourt, updateCourt, deleteCourt } from '../Api/Court'; // API for courts
import { getAllSports } from '../Api/Sport'; // API for sports
import { getAllCentres } from '../Api/Centre'; // API for centres

const ManageCourts = () => {
  const [courts, setCourts] = useState([]);
  const [sports, setSports] = useState([]);
  const [centres, setCentres] = useState([]);
  const [newCourt, setNewCourt] = useState({ name: '', sportId: '', centre: '' });
  const [currentCentre, setCurrentCentre] = useState('');
  const [editCourtId, setEditCourtId] = useState(null);
  const [editCourtName, setEditCourtName] = useState('');
  const LOCAL_centreId = localStorage.getItem('centreId'); // Get the centreId from localStorage

  // Fetch data on component mount
  useEffect(() => {
    fetchCourts();
    fetchCentres();
    if (LOCAL_centreId) {
      handleCentreChange({ target: { value: LOCAL_centreId } }); // Auto-select centre from localStorage
    }
  }, []);

  const fetchCourts = async () => {
    try {
      const data = await getAllCourts();
      setCourts(data);
    } catch (error) {
      console.error('Error fetching courts:', error);
    }
  };

  const fetchSports = async (centreId) => {
    try {
      const data = await getAllSports(centreId); // Fetch sports by centreId
      setSports(data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchCentres = async () => {
    try {
      const data = await getAllCentres();
      setCentres(data);
      const selectedCentre = data.find((centre) => centre._id === LOCAL_centreId);
      if (selectedCentre) {
        setCurrentCentre(selectedCentre.name); // Set the current centre name
      }
    } catch (error) {
      console.error('Error fetching centres:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourt((prev) => ({ ...prev, [name]: value }));
  };

  const handleCentreChange = (e) => {
    const centreId = e.target.value;
    setNewCourt((prev) => ({ ...prev, centre: centreId }));
    fetchSports(centreId); // Fetch sports for the selected centre
    const selectedCentre = centres.find((centre) => centre._id === centreId);
    if (selectedCentre) setCurrentCentre(selectedCentre.name); // Set the selected centre name
  };

  const handleAddCourt = async () => {
    try {
      if (!newCourt.name || !newCourt.sportId || !newCourt.centre) {
        alert('All fields are required.');
        return;
      }
      await addCourt(newCourt); // Add the court
      fetchCourts(); // Refresh the courts list
      setNewCourt({ name: '', sportId: '', centre: newCourt.centre }); // Reset form, retain selected centre
    } catch (error) {
      console.error('Error adding court:', error);
    }
  };

  const handleEditCourt = async (id) => {
    try {
      await updateCourt(id, { name: editCourtName });
      fetchCourts(); // Refresh the courts list
      setEditCourtId(null); // Exit edit mode
      setEditCourtName(''); // Clear edit input
    } catch (error) {
      console.error('Error updating court:', error);
    }
  };

  const handleDeleteCourt = async (id) => {
    try {
      await deleteCourt(id);
      fetchCourts(); // Refresh the courts list
    } catch (error) {
      console.error('Error deleting court:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Courts</h2>

      {/* Current Centre Name */}
      <div className="mb-6">
        <p className="text-xl font-semibold">
          Current Centre: <span className="text-gray-700">{currentCentre}</span>
        </p>
      </div>

      {/* Add New Court Form */}
      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={newCourt.name}
          onChange={handleInputChange}
          placeholder="Court Name"
          className="border p-2 mr-2"
        />
        <select
          name="centre"
          value={newCourt.centre}
          onChange={handleCentreChange}
          className="border p-2 mr-2"
        >
          <option value="">Select Centre</option>
          {centres.map((centre) => (
            <option key={centre._id} value={centre._id}>
              {centre.name}
            </option>
          ))}
        </select>
        <select
          name="sportId"
          value={newCourt.sportId}
          onChange={handleInputChange}
          className="border p-2"
        >
          <option value="">Select Sport</option>
          {sports.map((sport) => (
            <option key={sport._id} value={sport._id}>
              {sport.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddCourt}
          className="bg-blue-500 text-white p-2 ml-2 rounded"
          disabled={!newCourt.name || !newCourt.sportId || !newCourt.centre} // Disable if form is incomplete
        >
          Add Court
        </button>
      </div>

      {/* Courts List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <li
            key={court._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition duration-300"
          >
            {editCourtId === court._id ? (
              <>
                <input
                  type="text"
                  value={editCourtName}
                  onChange={(e) => setEditCourtName(e.target.value)}
                  className="border p-2 mb-4 w-full"
                />
                <button
                  onClick={() => handleEditCourt(court._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCourtId(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">{court.name}</h3>
                <p className="text-gray-600">
                  <strong>Sport:</strong> {court.sportId?.name || 'N/A'}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Centre:</strong> {currentCentre || 'N/A'}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setEditCourtId(court._id);
                      setEditCourtName(court.name);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourt(court._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCourts;
