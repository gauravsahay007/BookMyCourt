const Court = require('../models/Court'); // Import the Court model
const Sport = require('../models/Sport'); // Import the Sport model if needed


// Controller function to add a new court
const addCourt = async (req, res) => {
  const { name, sportId, centre, availability } = req.body;

  // Validate required fields
  if (!name || !sportId || !centre) {
    return res.status(400).json({ message: 'Name, Sport ID, and Centre ID are required.' });
  }

  try {
    const newCourt = new Court({
      name,
      sportId,
      centre,
      availability: availability || [], // Default to an empty array if not provided
    });
    const savedCourt = await newCourt.save();   
    res.status(201).json(savedCourt); // Return success response
  } catch (error) {
    console.error('Error adding court:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Controller function to get all courts
const getAllCourts = async (req, res) => {
    try {
        const courts = await Court.find().populate('sportId'); // Populate sport details if needed
        res.json(courts); // Return all courts
    } catch (error) {
        console.error('Error fetching courts:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get a court by ID
const getCourtById = async (req, res) => {
    const { courtId } = req.params;

    try {
        const court = await Court.findById(courtId).populate('sportId'); // Populate sport details if needed
        if (!court) {
            return res.status(404).json({ message: 'Court not found.' });
        }
        res.json(court); // Return the court if found
    } catch (error) {
        console.error('Error fetching court:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to update a court
const updateCourt = async (req, res) => {
    const { courtId } = req.params;
    const { name, sportId, availability } = req.body;

    try {
        // Update the court by ID and return the updated document
        const updatedCourt = await Court.findByIdAndUpdate(courtId, {
            name,
            sportId,
            availability
        }, { new: true });

        if (!updatedCourt) {
            return res.status(404).json({ message: 'Court not found.' });
        }

        res.json(updatedCourt); // Return the updated court
    } catch (error) {
        console.error('Error updating court:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to delete a court
const deleteCourt = async (req, res) => {
    const { courtId } = req.params;

    try {
        // Delete the court by ID
        const deletedCourt = await Court.findByIdAndDelete(courtId);
        if (!deletedCourt) {
            return res.status(404).json({ message: 'Court not found.' });
        }
        res.json({ message: 'Court deleted successfully.' });
    } catch (error) {
        console.error('Error deleting court:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = {
    addCourt,
    getAllCourts,
    getCourtById,
    updateCourt,
    deleteCourt,
};
