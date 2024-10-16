const Sport = require('../models/Sport'); // Import the Sport model
const Centre = require('../models/Centre'); // Import the Centre model

// Middleware to get a sport by ID and attach it to req.params
const getSportById = async (req, res, next) => {
    const { sportId } = req.params;

    try {
        const sport = await Sport.findById(sportId).populate('centre'); // Populate related centre details
        if (!sport) {
            return res.status(404).json({ message: 'Sport not found.' });
        }
        req.params.sportInfo = sport; // Attach sport info to req.params
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error fetching sport:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to add a new sport
const addSport = async (req, res) => {
    const { name, description, centre, image } = req.body;

    // Validate required fields
    if (!name || !centre) {
        return res.status(400).json({ message: 'Name and Centre ID are required.' });
    }

    try {
        // Create a new sport with the initial centreId
        const newSport = new Sport({
            name,
            description,
            centre,
            image,
            centres: [centre], // Initialize the centres array with the given centreId
        });

        const savedSport = await newSport.save();

        // Add the new sport to the related Centre's sports array
        await Centre.findByIdAndUpdate(
            centre,
            { $addToSet: { sports: savedSport._id } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        res.status(201).json(savedSport); // Return success response
    } catch (error) {
        console.error('Error adding sport:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get all sports for a specific centre
const getAllSports = async (req, res) => {
    const { centreId } = req.body;  // Extract centreId from the request body

    if (!centreId) {
        return res.status(400).json({ message: 'Centre ID is required to fetch sports.' });
    }

    try {
        const sports = await Sport.find({ centres: centreId }).populate('centre'); // Find sports by centreId
        res.json(sports); // Return the list of sports
    } catch (error) {
        console.error('Error fetching sports:', error);
        res.status(500).json({ message: 'Failed to fetch sports.' });
    }
};

// Controller function to update a sport
const updateSport = async (req, res) => {
    const { sportId } = req.params;
    const { name, description, centre, image } = req.body;

    try {
        const updatedSport = await Sport.findByIdAndUpdate(
            sportId,
            { name, description, centre, image },
            { new: true }
        );

        if (!updatedSport) {
            return res.status(404).json({ message: 'Sport not found.' });
        }

        res.json(updatedSport); // Return the updated sport
    } catch (error) {
        console.error('Error updating sport:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to delete a sport
const deleteSport = async (req, res) => {
    const { sportId } = req.params;

    try {
        const deletedSport = await Sport.findByIdAndDelete(sportId);
        if (!deletedSport) {
            return res.status(404).json({ message: 'Sport not found.' });
        }
        res.json({ message: 'Sport deleted successfully.' });
    } catch (error) {
        console.error('Error deleting sport:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = {
    addSport,
    getAllSports,
    getSportById,
    updateSport,
    deleteSport,
};
