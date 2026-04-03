const express = require("express");
const Product = require("../Models/ProductSchema");
const router = express.Router();
import authenticateToken from "../Middleware/authenticateToken";

router.get("/products", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

module.exports = router;
