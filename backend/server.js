//connecting string: mongodb+srv://shintreaditya05:aditya@123@contractfarming.xwsme.mongodb.net/
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt"; // To hash passwords
import fs from "fs";

import { fileURLToPath } from "url"; // Add this import
import { User, Farmer, Buyer } from "./models/models.js";

const app = express();
const PORT = process.env.PORT || 3000;
const uri =
  "mongodb+srv://shintreaditya05:aditya%40123@contractfarming.xwsme.mongodb.net/ContractFarming";

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware to allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  dbName: "ContractFarming", // Database
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const uploadPath = path.join(
  "D:",
  "StudyMaterial",
  "SIH2024",
  "EWProject",
  "uploads"
);
console.log(uploadPath); // Check if this points to the correct uploads folder

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // file name format
  },
});

const upload = multer({ storage: storage });

// Define your upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

app.post("/signup", async (req, res) => {
  console.log(req.body); // Log the incoming request body
  const { username, password, role } = req.body;

  // Check if the body contains all the necessary fields
  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const user = new User({ username, password, role });
    await user.save();

    if (role === "buyer") {
      await Buyer.create({ username });
    } else if (role === "farmer") {
      await Farmer.create({ username });
    }
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err); // Log the error
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User doesn't exist. Please Sign Up first" });
    }

    if (password != user.password) {
      return res.status(404).json({ message: "Incorrect Password" });
    }

    let userDetails = {};

    res
      .status(200)
      .json({ message: "Login Successful", user: { ...user._doc } });
  } catch (err) {
    console.log("Server Error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post(
  "/sendfarmerprofile",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "farmImage1", maxCount: 1 },
    { name: "farmImage2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { username, name, contact, location, experience, personalInfo } =
        req.body;
      console.log("Received data:", req.body);

      // Only check for required fields like 'username', 'name', etc.
      if (!username || !name || !contact || !location || !experience) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Handle file uploads (optional)
      const profileImage = req.files["profileImage"]
        ? req.files["profileImage"][0].path
        : null;
      const farmImage1 = req.files["farmImage1"]
        ? req.files["farmImage1"][0].path
        : null;
      const farmImage2 = req.files["farmImage2"]
        ? req.files["farmImage2"][0].path
        : null;

      // Update farmer profile with optional fields
      const updatedFarmer = await Farmer.findOneAndUpdate(
        { username: username },
        {
          $set: {
            name: name,
            contact: contact,
            location: location,
            experience: experience,
            personalInfo: personalInfo || "", // Allow empty value for personalInfo
            profileImage: profileImage || "", // Allow null if not provided
            farmImage1: farmImage1 || "", // Allow null if not provided
            farmImage2: farmImage2 || "", // Allow null if not provided
          },
        },
        { new: true }
      );

      if (updatedFarmer) {
        return res.status(200).json({
          message: "Farmer profile updated successfully",
          farmer: updatedFarmer,
        });
      } else {
        return res.status(404).json({ message: "Farmer not found" });
      }
    } catch (error) {
      console.error("Error in /sendfarmerprofile:", error); // Log the error for debugging
      return res.status(500).json({
        message: "Error updating farmer profile",
        error: error.message,
      });
    }
  }
);

app.get("/getfarmerprofile", async (req, res) => {
  const { username } = req.query;
  try {
    const farmer = await Farmer.findOne({ username: username });
    if (!farmer) {
      return res.status(400).send("Farmer Not Found");
    }

    // Assuming the image path is stored in farmer.profileImage
    if (farmer.profileImage) {
      farmer.profileImage = `http://localhost:3000/${farmer.profileImage}`;
    }

    res.json(farmer);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

app.use("/uploads", express.static(path.join(uploadPath)));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
