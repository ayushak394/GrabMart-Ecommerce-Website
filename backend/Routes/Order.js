const express = require("express");
const router = express.Router();
const Order = require("../Models/Order");
import authenticateToken from "../Middleware/authenticateToken.js"; // Middleware to verify JWT tokens
// CREATE ORDER
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ message: "Order saved", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to save order" });
  }
});

// GET USER ORDERS
router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/stats/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Order.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      totalOrders: stats[0]?.totalOrders || 0,
      totalSpent: stats[0]?.totalSpent || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
