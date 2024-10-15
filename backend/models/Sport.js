const mongoose = require('mongoose');

// Define the schema for a Sport model
const sportSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Sport name is required and must be unique
    description: { type: String, default: '' }, // Optional description field
    centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre' }, // Reference to the related Centre model
    image: { type: String, default: '' }, // Optional field for an image URL
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the sport was created
});

// Export the Sport model to be used elsewhere in the application
module.exports = mongoose.model('Sport', sportSchema);
