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

const Donation = mongoose.model("Donation", donationSchema);

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
    console.log("Recieved data:",req.body);
    const { donorName, foodType, quantity, pickupWindow, location, contact, notes } = req.body;

    if (!donorName || !foodType || !quantity || !pickupWindow || !location || !contact) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const donation = new Donation({
      donorName,
      foodType,
      quantity,
      pickupWindow,
      location,
      contact,
      notes
    });

    await donation.save();

    res.status(201).json({
      message: "Donation saved successfully",
      donation
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving donation",
      error: error.message
    });
  }
});

app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching donations",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});