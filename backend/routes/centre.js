// routes/centre.js
const express = require('express');
const {
    addCentre,
    getAllCentres,
    getCentreById,
    getCentreDetails,
    updateCentre,
    deleteCentre,
    getEveryCentre,
} = require('../controllers/centre');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

const router = express.Router();
 
// Middleware to extract user and centre details
router.param('userId', getUserById);
router.param('centreId', getCentreById);

// Routes for centre management
router.post('/centre/add/:userId', isSignedIn, isAuthenticated, isAdmin, addCentre);
router.get('/centres', getAllCentres);
router.get('/centre/:centreId', getCentreDetails); // New route to fetch centre details
router.get('/allCentre',getEveryCentre);
router.put('/centre/update/:centreId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCentre);
router.delete('/centre/remove/:centreId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteCentre);

module.exports = router;
