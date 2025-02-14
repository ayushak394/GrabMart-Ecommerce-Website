const express = require("express");
const multer = require("multer"); // middleware for handling file uploads
const User = require("../Models/UserSchema");
const Feedback = require("../Models/Feedback");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  // stores files on the servers disk
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save the images to the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // helps create a unique filename by using the timestamp and the file extension
  },
});

const upload = multer({ storage }); // an instance of multer congifured to use the above settings

router.post(
  "/uploadProfilePic/:userId",
  upload.single("profilePic"),
  async (req, res) => {
    // upload single allows only one file with field name profilePic(name for incoming file from frontend)
    try {
      const userId = req.params.userId;
      const imagePath = `/uploads/${req.file.filename}`; // path to access the image

      const user = await User.findByIdAndUpdate(
        userId,
        { profilepic: imagePath },
        { new: true }
      );

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ message: "Profile Pic Updated", profilePic: user.profilepic });
    } catch (error) {
      res.status(505).json({ error: "Error uploading image" });
    }
  }
);

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
