const Centre = require('../models/Centre'); // Import the Centre model

// Middleware to get a centre by ID and attach it to req.params
const getCentreById = async (req, res, next) => {
    const { centreId } = req.params;

    try {
        const centre = await Centre.findById(centreId).populate('sports'); // Optionally populate sports details
        if (!centre) {
            return res.status(404).json({ message: 'Centre not found.' });
        }
        req.params.centreInfo = centre; // Attach centre info to req.params
        next(); // Proceed to next middleware or controller
    } catch (error) {
        console.error('Error fetching centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to add a new centre
const addCentre = async (req, res) => {
    const { name, location, contactInfo } = req.body;

    // Check for required fields
    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required.' });
    }

    try {
        const newCentre = new Centre({
            name,
            location,
            contactInfo,
        });

        // Save the new centre to the database
        const savedCentre = await newCentre.save();
        res.status(201).json(savedCentre); // Return success response
    } catch (error) {
        console.error('Error adding centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get all centres
const getAllCentres = async (req, res) => {
    try {
        const centres = await Centre.find().populate('sports'); // Optionally populate sports details
        res.json(centres); // Return all centres
    } catch (error) {
        console.error('Error fetching centres:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to update a centre
const updateCentre = async (req, res) => {
    const { centreId } = req.params;
    const { name, location, contactInfo } = req.body;

    try {
        // Update the centre by ID and return the updated document
        const updatedCentre = await Centre.findByIdAndUpdate(centreId, {
            name,
            location,
            contactInfo,
        }, { new: true });

        if (!updatedCentre) {
            return res.status(404).json({ message: 'Centre not found.' });
        }

        res.json(updatedCentre); // Return the updated centre
    } catch (error) {
        console.error('Error updating centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to delete a centre
const deleteCentre = async (req, res) => {
    const { centreId } = req.params;

    try {
        // Delete the centre by ID
        const deletedCentre = await Centre.findByIdAndDelete(centreId);
        if (!deletedCentre) {
            return res.status(404).json({ message: 'Centre not found.' });
        }
        res.json({ message: 'Centre deleted successfully.' });
    } catch (error) {
        console.error('Error deleting centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = {
    addCentre,
    getAllCentres,
    getCentreById,
    updateCentre,
    deleteCentre,
};
