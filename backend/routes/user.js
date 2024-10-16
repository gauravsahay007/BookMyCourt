const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin, isSignedIn } = require("../controllers/auth");
const { getAllusers, getUser, getUserById, updateUser ,registerCentre,getRegisteredCentre,getUserBookings} = require("../controllers/user");

// Middleware to get user by ID
router.param("userId", getUserById);

// Route to get a specific user
router.get("/user/:userId", isSignedIn, isAuthenticated, isAdmin, getUser);

// Route to get all users (No userId parameter needed here)
router.get("/users", isSignedIn, isAuthenticated, isAdmin, getAllusers);
 
// Route to update a user
router.put("/user/:userId", isSignedIn, isAuthenticated, isAdmin, updateUser);

// Route to register centre
router.put("/registerCentre/:userId", registerCentre);

// Route to get the registered centre for a specific user
router.get(
    "/user/:userId/registered-centre", 
    isSignedIn, 
    isAuthenticated, 
    getRegisteredCentre
);

router.get('/user/:userId/bookings', isSignedIn, isAuthenticated, getUserBookings);

module.exports = router;
