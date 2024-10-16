// models/Court.js
const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Court name
  sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true }, // Reference to sport
  centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true }, // Reference to centre
  availability: { type: [String], default: [] }, // Availability time slots
});

module.exports = mongoose.model('Court', courtSchema);
