const Centre = require('../models/Centre'); // Import Centre model
const User = require('../models/User'); // Import User model

// Middleware to get a centre by ID and attach it to req.centreInfo
exports.getCentreById = async (req, res, next) => {
    const { centreId } = req.params;

    try {
        const centre = await Centre.findById(centreId).populate('sports'); // Optionally populate sports
        if (!centre) {
            return res.status(404).json({ message: 'Centre not found.' });
        }
        req.centreInfo = centre; // Attach centre info to req
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error('Error fetching centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to add a new centre and register it for the user
exports.addCentre = async (req, res) => {
    const { name, location, contactInfo } = req.body;
    const userId = req.profile._id; // Extract user ID from profile (populated by middleware)

    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required.' });
    }

    try {
        const newCentre = new Centre({ name, location, contactInfo });
        const savedCentre = await newCentre.save();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.registeredCentre = savedCentre._id;
        await user.save(); // Save updated user

        res.status(201).json({
            message: 'Centre registered successfully!',
            centre: savedCentre,
            user,
        });
    } catch (error) {
        console.error('Error adding centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get all centres
exports.getAllCentres = async (req, res) => {
    try {
        const centres = await Centre.find().populate('sports'); // Populate sports if needed
        res.json(centres); // Return all centres
    } catch (error) {
        console.error('Error fetching centres:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

exports.getEveryCentre = async (req, res) => {
    try {
        const centres = await Centre.find({}, '_id name location contactInfo'); // Include _id and specific fields
        res.json(centres); // Return centres with basic details and IDs
    } catch (error) {
        console.error('Error fetching every centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get centre details by ID
exports.getCentreDetails = async (req, res) => {
    const { centreId } = req.params;

    try {
        const centre = await Centre.findById(centreId).populate('sports'); // Optionally populate sports
        if (!centre) {
            return res.status(404).json({ message: 'Centre not found.' });
        }
        res.json(centre); // Return centre details
    } catch (error) {
        console.error('Error fetching centre details:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to update a centre
exports.updateCentre = async (req, res) => {
    const { centreId } = req.params;
    const { name, location, contactInfo } = req.body;

    try {
        const updatedCentre = await Centre.findByIdAndUpdate(
            centreId,
            { name, location, contactInfo },
            { new: true } // Return the updated document
        );

        if (!updatedCentre) {
            return res.status(404).json({ message: 'Centre not found.' });
        }

        res.json(updatedCentre); // Return updated centre
    } catch (error) {
        console.error('Error updating centre:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to delete a centre
exports.deleteCentre = async (req, res) => {
    const { centreId } = req.params;

    try {
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
