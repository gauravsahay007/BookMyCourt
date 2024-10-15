// routes/auth.js

const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signup, signin } = require("../controllers/auth");
// Signup Route
router.post("/signup", [
    check("username", "Username should be at least 3 characters").isLength({ min: 3 }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be at least 3 characters").isLength({ min: 3 })
], (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }
    // Call the signup controller function if validation passes
    signup(req, res, next);
});

// Signin Route
router.post("/signin", [
    check("email", "Email is required").isEmail(),
    check("password", "Password field is required").isLength({ min: 1 })
], (req, res, next) => { 
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Call the signin controller function if validation passes
    signin(req, res, next);
});

// Export the router
module.exports = router;
