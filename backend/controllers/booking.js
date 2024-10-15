const Booking = require('../models/Booking'); // Import the Booking model
const User = require('../models/User'); // Import the User model if needed
const Court = require('../models/Court'); // Import the Court model if needed
const Sport = require('../models/Sport'); // Import the Sport model if needed

// Controller function to add a new booking
const addBooking = async (req, res) => {
    const { userId, courtId, sportId, date, timeSlot } = req.body;

    // Validate required fields
    if (!userId || !courtId || !sportId || !date || !timeSlot) {
        return res.status(400).json({ message: 'User ID, Court ID, Sport ID, date, and time slot are required.' });
    }

    try {
        // Check if the court is available for the given date and time slot
        const existingBooking = await Booking.findOne({
            courtId,
            date,
            'timeSlot.startTime': timeSlot.startTime,
            'timeSlot.endTime': timeSlot.endTime,
        });

        // Return error if the time slot is already booked
        if (existingBooking) {
            return res.status(400).json({ message: 'The selected time slot is already booked.' });
        }

        // Create a new booking
        const newBooking = new Booking({
            userId,
            courtId,
            sportId,
            date,
            timeSlot,
        });

        // Save the new booking to the database
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking); // Return success response
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId courtId sportId'); // Populate related fields
        res.json(bookings); // Return all bookings
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get a booking by ID
const getBookingById = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId).populate('userId courtId sportId'); // Populate related fields
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.json(booking); // Return the booking if found
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to update a booking
const updateBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { courtId, sportId, date, timeSlot, status } = req.body;

    try {
        // Update booking by ID
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
            courtId,
            sportId,
            date,
            timeSlot,
            status,
        }, { new: true }); // Return the updated document

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.json(updatedBooking); // Return the updated booking
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to delete a booking
const deleteBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Delete booking by ID
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = {
    addBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
};
