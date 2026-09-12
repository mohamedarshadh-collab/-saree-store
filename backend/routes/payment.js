const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { createShipment } = require("./tracking");
const mongoose = require("mongoose");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const COD_EXTRA_CHARGE = Number(process.env.COD_EXTRA_CHARGE || 100);

// Helper: recompute subtotal server-side from cart items (never trust client price)
async function computeSubtotal(items) {
  let subtotal = 0;
  const verifiedItems = [];
  for (const it of items) {
    if (!it?.productId || !mongoose.isValidObjectId(it.productId)) {
      const error = new Error("Cart contains an invalid product. Please remove it and try again.");
      error.statusCode = 400;
      throw error;
    }
    const product = await Product.findById(it.productId);
    if (!product) {
      const error = new Error("A product in your cart is no longer available. Please refresh your cart.");
      error.statusCode = 400;
      throw error;
    }
    const qty = Number(it.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      const error = new Error("Cart quantity is invalid. Please update your cart and try again.");
      error.statusCode = 400;
      throw error;
    }
    subtotal += product.price * qty;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      qty,
    });
  }
  return { subtotal, verifiedItems };
}

// POST /api/payment/create-order
// body: { items: [{productId, qty}], paymentMethod: 'ONLINE' | 'COD' }
// For ONLINE -> charges full subtotal.
// For COD -> charges only the COD_EXTRA_CHARGE (e.g. ₹100) as an upfront online payment;
// the rest of the total is collected as cash on delivery.
router.post("/create-order", async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: "Cart is empty" });
    if (!['ONLINE', 'COD'].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const { subtotal } = await computeSubtotal(items);

    let amountToChargeNow = subtotal;
    let codCharge = 0;
    if (paymentMethod === "COD") {
      codCharge = COD_EXTRA_CHARGE;
      amountToChargeNow = COD_EXTRA_CHARGE; // only the advance is paid online
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amountToChargeNow * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      subtotal,
      codCharge,
      totalAmount: subtotal + codCharge,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to create Razorpay order" });
  }
});

// POST /api/payment/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature,
//         items, paymentMethod, customer }
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      paymentMethod,
      customer,
    } = req.body;

    // 1) Verify Razorpay signature — this is what actually confirms the payment,
    // e.g. after paying via UPI, card, netbanking, wallet, etc.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ verified: false, message: "Payment verification failed" });
    }

    // 2) Recompute price server-side (never trust client totals)
    const { subtotal, verifiedItems } = await computeSubtotal(items);
    const codCharge = paymentMethod === "COD" ? COD_EXTRA_CHARGE : 0;
    const totalAmount = subtotal + codCharge;

    // 3) Create the order record
    const order = await Order.create({
      items: verifiedItems,
      customer,
      paymentMethod,
      paymentStatus: "PAID", // full amount for ONLINE, ₹100 advance for COD
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      subtotal,
      codCharge,
      totalAmount,
      orderStatus: "CONFIRMED",
    });

    // 4) Hand off to delivery.com (or mock) to create a shipment / tracking id
    const shipment = await createShipment(order);
    order.tracking = { ...order.tracking.toObject(), ...shipment };
    await order.save();

    res.json({
      verified: true,
      message:
        paymentMethod === "COD"
          ? "₹100 advance payment accepted. Remaining amount payable on delivery."
          : "Payment accepted",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment verification error", error: err.message });
  }
});

module.exports = router;
