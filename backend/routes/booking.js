const express = require('express');
const { 
    addBooking, 
    getAllBookings, 
    getBookingById, 
    updateBooking, 
    deleteBooking 
} = require('../controllers/booking'); // Adjust the path as necessary
const { isSignedIn, isAuthenticated } = require('../controllers/auth'); // Auth middlewares
const { getUserById } = require('../controllers/user'); // Middleware to get user details
const router = express.Router();

// Middleware to extract user details from userId in the URL
router.param("userId", getUserById);
router.param("bookingId", getBookingById);

// Route to add a new booking (user only)
router.post('/booking/add/:userId', isSignedIn, isAuthenticated, addBooking);

// Route to get all bookings (user only)
router.get('/booking/getAll/:userId', isSignedIn, isAuthenticated, getAllBookings);

// Route to update a booking (user only)
router.put('/booking/update/:bookingId/:userId', isSignedIn, isAuthenticated, updateBooking);

// Route to delete a booking (user only)
router.delete('/booking/remove/:bookingId/:userId', isSignedIn, isAuthenticated, deleteBooking);

// Ensure this is the last line
module.exports = router;
