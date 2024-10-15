const mongoose = require('mongoose');

// Define the schema for a User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Username is required
    email: { type: String, required: true, unique: true }, // Email is required and must be unique
    password: { type: String, required: true }, // Password is required
    role: { 
        type: String, 
        enum: ['customer', 'coach', 'operations'], // Role must be one of these options
        required: true 
    },
    createdAt: { type: Date, default: Date.now } // Default to the current date if not provided
});

// Export the User model to be used in other parts of the app
module.exports = mongoose.model('User', userSchema);
