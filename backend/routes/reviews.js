const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");

const router = express.Router();

router.get("/:productId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
});

router.post("/:productId", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    if (!name?.trim() || !comment?.trim()) {
      return res.status(400).json({ message: "Name and review are required" });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Review.create({
      product: product._id,
      name: name.trim(),
      rating: numericRating,
      comment: comment.trim(),
    });

    const ratingTotal = product.rating * product.ratingCount + numericRating;
    product.ratingCount += 1;
    product.rating = Number((ratingTotal / product.ratingCount).toFixed(1));
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
});

module.exports = router;