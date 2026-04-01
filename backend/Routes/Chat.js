const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../Routes/ChatController");

router.post("/chat", chatWithAI);

module.exports = router;