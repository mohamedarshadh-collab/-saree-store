require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const seedData = require("./seedData");

const run = async () => {
  await connectDB();
  console.log("Clearing existing products...");
  await Product.deleteMany({});
  console.log("Inserting dummy sarees...");
  await Product.insertMany(seedData);
  console.log(`Seeded ${seedData.length} sarees successfully.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
