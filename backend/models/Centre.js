const mongoose = require('mongoose');

// Define the schema for a Centre model
const centreSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the centre
    location: { type: String, required: true }, // Location or address of the centre
    contactInfo: { type: String }, // Optional contact information (phone number, email, etc.)
    sports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }], // Array of sports associated with this centre
    createdAt: { type: Date, default: Date.now }, // Default to the current date if not provided
});

// Export the Centre model to be used in other parts of the app
module.exports = mongoose.model('Centre', centreSchema); // Ensure this line is correct
