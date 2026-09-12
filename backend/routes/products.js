const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products?category=Pattu+Sarees&search=silk
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// GET /api/products/categories
router.get("/categories", (req, res) => {
  res.json(Product.CATEGORIES);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
});

module.exports = router;
