const User = require("../models/User"); // Import the User model
const Booking = require("../models/Booking")
// Middleware to get user by ID
exports.getUserById = (req, res, next, id) => {
    User.findById(id).then((user) => {
        if (!user) {
            return res.status(404).json({
                error: "Oops...There is no user with this ID in the database."
            });
        }
        req.profile = user; // Attach the found user to the request object
        next(); // Proceed to the next middleware or route handler
    }).catch((err) => {
        return res.status(400).json({
            error: "Error fetching user data."
        });
    });
};

// Controller to get user information without sensitive data
exports.getUser = (req, res) => {
    req.profile.salt = undefined; // Remove sensitive data before sending response
    req.profile.encry_password = undefined;
    return res.json(req.profile); // Return the sanitized user profile
};

// Controller to update user information
exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id }, // Find user by ID
        { $set: req.body }, // Update with new data from the request body
        { new: true, useFindAndModify: false } // Return the updated document
    ).then((user) => {
        if (!user) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        user.salt = undefined; // Remove sensitive data before sending response
        user.encry_password = undefined;
        res.json(user); // Return the updated user
    }).catch((err) => {
        return res.status(400).json({
            error: "You are not authorized to update this user."
        });
    });
};

// Controller to get all users
exports.getAllusers = (req, res) => {
    User.find().then((users) => {
        res.json({ users }); // Return the list of all users
    }).catch((err) => {
        res.status(400).json({
            error: "No users found."
        });
    });
};

exports.registerCentre = async (req, res) => {
    const { userId } = req.profile._id; // Get userId from route params
    const { centreId } = req.body; // Get centreId from request body

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Update the registeredCentre field with the new centreId
        user.registeredCentre = centreId;

        // Save the updated user document
        await user.save();

        // Return the updated user instance
        return res.json({ message: "Centre registered successfully", user });
    } catch (error) {
        console.error("Error registering centre:", error);
        return res.status(500).json({ error: "Error registering centre." });
    }
};
// Controller to get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.profile._id })
            .populate('courtId sportId') // Populate related fields for better response
            .sort({ date: 1, 'timeSlot.startTime': 1 }); // Sort by date and time slot

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user." });
        }

        res.json({ bookings }); // Return the list of bookings
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ error: "Error fetching user bookings." });
    }
};
// Controller to get registeredCentre for a user
exports.getRegisteredCentre = async (req, res) => {
    try {
        // Fetch the user by ID and populate the registeredCentre field with its details
        const user = await User.findById(req.profile._id).populate('registeredCentre');

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the user has a registeredCentre
        if (!user.registeredCentre) {
            return res.status(404).json({ error: "No registered centre found for this user." });
        }

        // Return the populated registeredCentre details
        res.json({ registeredCentre: user.registeredCentre });
    } catch (error) {
        console.error("Error fetching registered centre:", error);
        res.status(500).json({ error: "Error fetching registered centre." });
    }
};
