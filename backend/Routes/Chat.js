const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../Routes/ChatController");
const authenticateToken = require("../Middleware/authenticateToken.js"); // Middleware to verify JWT tokens

router.post("/chat", authenticateToken, chatWithAI);

module.exports = router;