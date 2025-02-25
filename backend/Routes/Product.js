const express = require("express");
const Product = require("../Models/ProductSchema");
const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

module.exports = router;
