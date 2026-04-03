const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../Routes/ChatController");
import authenticateToken from "../Middleware/authenticateToken"; // Middleware to verify JWT tokens

router.post("/chat", authenticateToken, chatWithAI);

module.exports = router;