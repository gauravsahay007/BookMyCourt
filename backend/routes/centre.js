const express = require('express');
const { 
    addCentre, 
    getAllCentres, 
    getCentreById, 
    updateCentre, 
    deleteCentre 
} = require("../controllers/centre"); // Ensure this path is correct
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth'); // Auth middlewares
const { getUserById } = require("../controllers/user"); // Middleware to get user by ID
const router = express.Router();

// Middleware to extract user details from userId in the URL
router.param("userId", getUserById);
router.param("centreId", getCentreById);

// Route to add a new centre (admin only)
router.post('/centre/add/:userId', isSignedIn, isAuthenticated, isAdmin, addCentre);

// Route to get all centres
router.get('/centres', getAllCentres);

// Route to update a centre (admin only)
router.put('/centre/update/:centreId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCentre);

// Route to delete a centre (admin only)
router.delete('/centre/remove/:centreId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteCentre);

// Ensure this is the last line
module.exports = router;
