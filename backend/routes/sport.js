const express = require('express');
const {
    addSport,
    getAllSports,
    getSportById,
    updateSport,
    deleteSport,
} = require('../controllers/sport'); // Ensure the path is correct
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require("../controllers/user");
const router = express.Router();
router.param("userId",getUserById);
router.param("sportId",getSportById)

router.post('/sport/add/:userId', isSignedIn, isAuthenticated, isAdmin, addSport);
router.post('/sports/getAll/:userId',isSignedIn, isAuthenticated, getAllSports);
router.put('/sport/update/:sportId/:userId', isSignedIn, isAuthenticated, isAdmin, updateSport);
router.delete('/sport/remove/:sportId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteSport);

module.exports = router;
