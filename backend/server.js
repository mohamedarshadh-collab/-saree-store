require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");
const trackingRoutes = require("./routes/tracking");
const reviewRoutes = require("./routes/reviews");

const app = express();

const allowedOrigins = [
	process.env.CLIENT_URL,
	...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173", "http://127.0.0.1:5173"]),
].filter(Boolean);

connectDB();

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error("Origin is not allowed by CORS"));
	},
}));
app.use(express.json());

app.get("/", (req, res) => res.send("Saree Store API is running"));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
