const express = require('express');
const { 
    addCourt, 
    getAllCourts, 
    getCourtById, 
    updateCourt, 
    deleteCourt 
} = require('../controllers/court'); // Adjust the path as necessary
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth'); // Auth middlewares
const {getUserById} = require("../controllers/user");
const router = express.Router();

// Middleware to extract user details from userId in the URL
router.param("userId", getUserById);
router.param("courtId", getCourtById);

// Route to add a new court (admin only)
router.post('/court/add/:userId', isSignedIn, isAuthenticated, isAdmin, addCourt);

// Route to get all courts
router.get('/courts', getAllCourts);

// Route to update a court (admin only)
router.put('/court/update/:courtId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCourt);

// Route to delete a court (admin only)
router.delete('/court/remove/:courtId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteCourt);

// Ensure this is the last line
module.exports = router;


