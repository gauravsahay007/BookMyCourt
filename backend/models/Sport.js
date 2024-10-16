// models/Sport.js
const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Sport name is required and must be unique
  description: { type: String, default: '' }, // Optional description field
  centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre' }, // Reference to the main Centre model
  image: { type: String, default: '' }, // Optional field for an image URL
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the sport was created

  // New field to store multiple centres linked to this sport
  centres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Centre' }],
});

module.exports = mongoose.model('Sport', sportSchema);
