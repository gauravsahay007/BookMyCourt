const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin, isSignedIn } = require("../controllers/auth");
const { getAllusers, getUser, getUserById, updateUser } = require("../controllers/user");

// Middleware to get user by ID
router.param("userId", getUserById);

// Route to get a specific user
router.get("/user/:userId", isSignedIn, isAuthenticated, isAdmin, getUser);

// Route to get all users (No userId parameter needed here)
router.get("/users", isSignedIn, isAuthenticated, isAdmin, getAllusers);

// Route to update a user
router.put("/user/:userId", isSignedIn, isAuthenticated, isAdmin, updateUser);

module.exports = router;
