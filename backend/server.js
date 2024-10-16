const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json()); // For parsing application/json

// Routes
const authRoutes = require("./routes/auth");
const sportRoutes = require("./routes/sport");
const userRoutes = require("./routes/user");
const centreRoutes = require("./routes/centre");
const courtRoutes = require("./routes/court");
const bookingRoutes = require("./routes/booking");
// Use routes
app.use("/api", authRoutes);
app.use("/api", sportRoutes);
app.use("/api", userRoutes);
app.use("/api", centreRoutes);
app.use("/api",courtRoutes);
app.use("/api",bookingRoutes);


// Connect to MongoDB
mongoose.connect(process.env.DATABASE)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
