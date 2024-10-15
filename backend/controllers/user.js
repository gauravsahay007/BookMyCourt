const User = require("../models/User"); // Import the User model

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
