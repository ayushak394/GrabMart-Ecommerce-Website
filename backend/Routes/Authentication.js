const express = require("express");
const bcrypt = require("bcryptjs"); // Library for securely hashing passwords
const jwt = require("jsonwebtoken"); // Creating and Verifying JWT tokens
const User = require("../Models/UserSchema"); // Refers to the Mongoose model for the User collection
const router = express.Router(); // Used to define routes like /register/login etc.
router.post("/register", async (req, res) => {
  // defines post route for registering a new user
  const { username, email, password } = req.body; // extraction of elements from request body
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // using bcrypt password is hashed and algo is applied 10 times(higher the number more the processing power, lower the number less secure but faster)
    const newUser = new User({ username, email, password: hashedPassword }); // new user object created using User model
    await newUser.save(); // to save user to database

    res.status(201).send("User registered successfully!");
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyValue.username) {
        return res.status(400).send({ error: "Username already exists" });
      } else if (error.keyValue.email) {
        return res.status(400).send({ error: "Email already exists" });
      }
    }
    res.status(500).send({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  // defines post route for registering a new user
  const { username, password } = req.body; // extraction of elements from request body

  try {
    const user = await User.findOne({ username }); // find user by username
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/update-password", async (req, res) => {
  // defines post route for updating password for an existing user
  const { email, newPassword } = req.body; // extraction of elements from request body

  try {
    const user = await User.findOne({ email }); // find user by email
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
