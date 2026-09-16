const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    qty: Number,
    customization: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const trackingEventSchema = new mongoose.Schema(
  {
    status: String,
    location: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ["ONLINE", "COD"], required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    razorpayOrderId: { type: String, unique: true, sparse: true },
    razorpayPaymentId: String,
    razorpaySignature: String,

    subtotal: { type: Number, required: true },
    codCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },

    tracking: {
      courierPartner: { type: String, default: "delivery.com" },
      trackingId: { type: String },
      currentStatus: { type: String, default: "ORDER_PLACED" },
      currentLocation: { type: String, default: "" },
      estimatedDelivery: { type: Date },
      isMock: { type: Boolean, default: true },
      history: { type: [trackingEventSchema], default: [] },
      lastUpdated: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
