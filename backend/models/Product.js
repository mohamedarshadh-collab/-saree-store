const mongoose = require("mongoose");

const CATEGORIES = [
  "Pattu Sarees",
  "Fancy Sarees",
  "Georgette Sarees",
  "Party Wear Sarees",
  "Cotton Sarees",
  "Others",
];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    fabric: { type: String, default: "" },
    color: { type: String, default: "" },
    blouseIncluded: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 },
    ratingCount: { type: Number, default: 0 },
    stock: { type: Number, default: 25 },
    sku: { type: String, unique: true },
  },
  { timestamps: true }
);

productSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model("Product", productSchema);
