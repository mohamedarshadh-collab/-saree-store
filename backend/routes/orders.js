const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET /api/orders?phone=9876543210  (guest lookup — no login system in this dummy build)
router.get("/", async (req, res) => {
  try {
    const { phone } = req.query;
    const filter = phone ? { "customer.phone": phone } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
});

module.exports = router;
