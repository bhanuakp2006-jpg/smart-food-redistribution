const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Increase body parser limits for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

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
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  contact: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  quantityValue: {
    type: Number,
    required: true
  },
  quantityUnit: {
    type: String,
    enum: ['kg', 'litres', 'units'],
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  contact: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: null
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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

// Get all available donations
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find({ isAvailable: true })
      .populate('donorId', 'name email location contact')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.log("Fetch error:", error);
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
});

// Get user's own donations (for donors)
app.get("/api/donations/donor/:userId", async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.log("Fetch error:", error);
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
});

// Get nearby donations for NGO/Delivery partners (within 5km)
app.get("/api/donations/nearby/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const NEARBY_RADIUS_KM = 5;
    const lat = user.location.latitude;
    const lon = user.location.longitude;

    // Calculate approximate lat/lon for 5km radius
    const latDelta = NEARBY_RADIUS_KM / 111; // 1 degree latitude ≈ 111km
    const lonDelta = NEARBY_RADIUS_KM / (111 * Math.cos(lat * Math.PI / 180));

    const nearbyDonations = await Donation.find({
      isAvailable: true,
      $and: [
        { 'location.latitude': { $gte: lat - latDelta, $lte: lat + latDelta } },
        { 'location.longitude': { $gte: lon - lonDelta, $lte: lon + lonDelta } }
      ]
    })
      .populate('donorId', 'name email location contact')
      .sort({ createdAt: -1 });

    const otherDonations = await Donation.find({
      isAvailable: true,
      $or: [
        { 'location.latitude': { $lt: lat - latDelta } },
        { 'location.latitude': { $gt: lat + latDelta } },
        { 'location.longitude': { $lt: lon - lonDelta } },
        { 'location.longitude': { $gt: lon + lonDelta } }
      ]
    })
      .populate('donorId', 'name email location contact')
      .sort({ createdAt: -1 });

    res.json({ nearby: nearbyDonations, other: otherDonations });
  } catch (error) {
    console.log("Fetch error:", error);
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
});

// Create new donation
app.post("/api/donations", async (req, res) => {
  try {
    console.log("Received donation data:", req.body);
    const { donorId, donorName, foodType, quantityValue, quantityUnit, pickupDate, pickupTime, location, contact, notes, image } = req.body;

    if (!donorId || !donorName || !foodType || !quantityValue || !quantityUnit || !pickupDate || !pickupTime || !location || !contact) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    if (!location.latitude || !location.longitude || !location.address) {
      return res.status(400).json({ message: "Location must include latitude, longitude, and address." });
    }

    const donation = new Donation({
      donorId,
      donorName,
      foodType,
      quantityValue: Number(quantityValue),
      quantityUnit,
      pickupDate: new Date(pickupDate),
      pickupTime,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      },
      contact,
      notes,
      image: image || null,
      isAvailable: true
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

// Claim donation (for NGO/Delivery partners)
app.put("/api/donations/:donationId/claim", async (req, res) => {
  try {
    const { userId } = req.body;
    
    const donation = await Donation.findByIdAndUpdate(
      req.params.donationId,
      { 
        isAvailable: false,
        claimedBy: userId
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({
      message: "Donation claimed successfully",
      donation
    });
  } catch (error) {
    console.log("Error claiming donation:", error);
    res.status(500).json({
      message: "Error claiming donation",
      error: error.message
    });
  }
});

// User Registration Endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    console.log("Registration request:", req.body);
    const { name, email, password, userType, location, contact } = req.body;

    // Validation
    if (!name || !email || !password || !userType || !location) {
      return res.status(400).json({ message: "Please fill all required fields including location." });
    }

    if (!location.latitude || !location.longitude || !location.address) {
      return res.status(400).json({ message: "Location must include latitude, longitude, and address." });
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
      userType,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      },
      contact: contact || ''
    });

    await newUser.save();
    console.log("User registered successfully:", newUser);

    res.status(201).json({
      message: "Account created successfully",
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        userType: newUser.userType,
        location: newUser.location
      }
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
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        userType: user.userType,
        location: user.location
      }
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