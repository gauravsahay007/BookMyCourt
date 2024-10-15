const mongoose = require('mongoose');

// Define the schema for a Booking model
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user making the booking
    courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true }, // Reference to the court being booked
    sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true }, // Reference to the sport being played
    date: { type: Date, required: true }, // Date of the booking
    timeSlot: { 
        startTime: { type: String, required: true }, // Start time of the booking
        endTime: { type: String, required: true } // End time of the booking
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'], // Booking status options
        default: 'confirmed' // Default status is 'confirmed'
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp when the booking was created
    updatedAt: { type: Date, default: Date.now } // Timestamp for when the booking was last updated
});

// Middleware to update updatedAt before saving a document
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the Booking model
module.exports = mongoose.model('Booking', bookingSchema);
