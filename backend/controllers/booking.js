const Booking = require('../models/Booking'); // Booking model
const Court = require('../models/Court'); // Court model

// Controller function to add a new booking
const addBooking = async (req, res) => {
    console.log("hii");
    const { userId, courtId, sportId, date, timeSlot } = req.body;

    // Validate required fields
    if (!userId || !courtId || !sportId || !date || !timeSlot) {
        return res.status(400).json({ message: 'User ID, Court ID, Sport ID, date, and time slot are required.' });
    }

    try {
        // Check for overlapping bookings (partial or full overlap)
        const existingBooking = await Booking.findOne({
            courtId,
            date,
            $or: [
                { 
                    'timeSlot.startTime': { $lt: timeSlot.endTime, $gte: timeSlot.startTime }
                },
                { 
                    'timeSlot.endTime': { $gt: timeSlot.startTime, $lte: timeSlot.endTime }
                },
                {
                    'timeSlot.startTime': { $lte: timeSlot.startTime },
                    'timeSlot.endTime': { $gte: timeSlot.endTime }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'The selected time slot overlaps with another booking.' });
        }

        const newBooking = new Booking({ userId, courtId, sportId, date, timeSlot });
        const savedBooking = await newBooking.save();

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};
const getBookedCourtsWithTimeSlots = async (req, res) => {
    const { userId } = req.params; // Extract userId from params
    const { centreId, sportId } = req.query; // Centre and sport from query params

    try {
        // Fetch courts belonging to the specified centre and sport
        const courts = await Court.find({ centre: centreId, sportId }).select('_id name');
        const courtIds = courts.map(court => court._id); // Extract court IDs

        // Fetch bookings for the fetched courts
        const bookings = await Booking.find({
            courtId: { $in: courtIds }
        }).populate('courtId userId sportId').sort({ date: 1, 'timeSlot.startTime': 1 });

        // Group bookings by court and date
        const groupedData = courts.map(court => ({
            courtName: court.name,
            bookings: bookings
                .filter(b => b.courtId._id.toString() === court._id.toString())
                .map(b => ({
                    date: b.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                    timeSlot: b.timeSlot,
                    status: b.status,
                    user: b.userId ? b.userId.username : 'N/A',
                })),
        }));

        res.json(groupedData); // Send grouped data as response
    } catch (error) {
        console.error('Error fetching booked courts:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to update a booking
const updateBooking = async (req, res) => {
    console.log("hello");
    const { bookingId } = req.params;
    const { courtId, sportId, date, timeSlot, status } = req.body;
    try {
        // Check for overlapping bookings (excluding the current booking)
        const conflictingBooking = await Booking.findOne({
            _id: { $ne: bookingId }, // Exclude the current booking
            courtId,
            date,
            $or: [
                {
                    // Case 1: New startTime falls within an existing booking
                    'timeSlot.startTime': { $lt: timeSlot.endTime, $gte: timeSlot.startTime }
                },
                {
                    // Case 2: New endTime falls within an existing booking
                    'timeSlot.endTime': { $gt: timeSlot.startTime, $lte: timeSlot.endTime }
                },
                {
                    // Case 3: Existing booking completely overlaps the new time slot
                    'timeSlot.startTime': { $lte: timeSlot.startTime },
                    'timeSlot.endTime': { $gte: timeSlot.endTime }
                }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ message: 'The new time slot overlaps with another booking.' });
        }

        // Proceed to update the booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { courtId, sportId, date, timeSlot, status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.json(updatedBooking); // Return the updated booking
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};


// Controller function to get bookings by centre, sport, and date
const getBookingsByCentreSportAndDate = async (req, res) => {
    const { centreId, sportId, date } = req.query;

    try {
        // Fetch courts belonging to the specified centre and sport
        const courts = await Court.find({ centre: centreId, sportId }).select('_id');
        const courtIds = courts.map(court => court._id);

        const bookings = await Booking.find({
            courtId: { $in: courtIds },
            sportId,
            date
        }).populate('userId courtId sportId');

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get bookings for a specific date
const getBookingsForDate = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Date is required.' });
    }

    // Convert the query date into a proper Date object
    const queryDate = new Date(date);
    
    if (isNaN(queryDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format.' });
    }

    // Create the start and end range for the query date (ensure all times within the date are included)
    const startOfDay = new Date(queryDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setUTCHours(23, 59, 59, 999));

    try {
        const bookings = await Booking.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('userId courtId sportId'); // Populate relevant fields

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for the selected date.' });
        }

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings for date:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};


// Controller function to delete a booking
const deleteBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
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

// Controller function to get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId courtId sportId');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Controller function to get a booking by ID
const getBookingById = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId).populate('userId courtId sportId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = {
    addBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookingsByCentreSportAndDate,
    getBookingsForDate,
    getBookedCourtsWithTimeSlots
};
