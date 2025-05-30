const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const User = require("../Models/UserSchema");
const Feedback = require("../Models/Feedback");

const router = express.Router();

// Configure Cloudinary with your env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pics", // folder name inside your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // optional resizing
  },
});

const upload = multer({ storage });

router.post(
  "/uploadProfilePic/:userId",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      // Cloudinary URL of the uploaded image
      const profilePicUrl = req.file.path;

      // Update user profilepic field with Cloudinary URL
      const user = await User.findByIdAndUpdate(
        userId,
        { profilepic: profilePicUrl },
        { new: true }
      );

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ message: "Profile Pic Updated", profilePic: user.profilepic });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading image" });
    }
  }
);

// The rest of your routes remain unchanged...

router.get("/getProfilePic/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilepic)
      return res.status(404).json({ error: "No profile picture found " });
    res.json({ profilePic: user.profilepic });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving image" });
  }
});

router.get("/getUsername/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Error fetching username" });
  }
});

router.get("/getEmail/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Error fetching email" });
  }
});

router.post("/submitFeedback", async (req, res) => {
  const { feedback } = req.body;
  if (!feedback) {
    return res.status(400).json({ message: "Feedback is required." });
  }

  try {
    const newFeedback = new Feedback({ feedback });
    await newFeedback.save();
    return res
      .status(201)
      .json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error saving feedback: ", error);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
