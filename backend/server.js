const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  pickupWindow: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['donor', 'ngo', 'delivery'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Donation = mongoose.model("Donation", donationSchema);
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.log("Fetch error:", error);
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
});

app.post("/api/donations", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { donorName, foodType, quantity, pickupWindow, location, contact, notes } = req.body;

    if (!donorName || !foodType || !quantity || !pickupWindow || !location || !contact) {
      console.log("Missing fields. Donator:", donorName, "Food:", foodType, "Qty:", quantity);
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const donation = new Donation({
      donorName,
      foodType,
      quantity: Number(quantity),
      pickupWindow,
      location,
      contact,
      notes
    });

    await donation.save();
    console.log("Donation saved successfully:", donation);

    res.status(201).json({
      message: "Donation saved successfully",
      donation
    });
  } catch (error) {
    console.log("Error saving donation:", error);
    res.status(500).json({
      message: "Error saving donation",
      error: error.message
    });
  }
});

// User Registration Endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    console.log("Registration request:", req.body);
    const { name, email, password, userType } = req.body;

    // Validation
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login instead." });
    }

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password, // In production, hash this with bcrypt
      userType
    });

    await newUser.save();
    console.log("User registered successfully:", newUser);

    res.status(201).json({
      message: "Account created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, userType: newUser.userType }
    });
  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({
      message: "Error creating account",
      error: error.message
    });
  }
});

// User Login Endpoint
app.post("/api/users/login", async (req, res) => {
  try {
    console.log("Login request:", req.body);
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase(), userType });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    console.log("Login successful for user:", user.email);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({
      message: "Error during login",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});