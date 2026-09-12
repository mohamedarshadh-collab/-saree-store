const express = require("express");
const axios = require("axios");
const router = express.Router();
const Order = require("../models/Order");

const DELIVERY_BASE_URL = process.env.DELIVERY_API_BASE_URL;
const DELIVERY_API_KEY = process.env.DELIVERY_API_KEY;
const LIVE_MODE = Boolean(DELIVERY_BASE_URL && DELIVERY_API_KEY);

// Ordered stages a real shipment moves through — used both by the mock
// simulator and to normalise whatever delivery.com's real API returns.
const STAGES = [
  "ORDER_PLACED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/**
 * createShipment(order)
 * Called right after payment is confirmed. Registers the shipment with
 * delivery.com and returns the initial tracking info to store on the order.
 *
 * LIVE MODE: once the client supplies DELIVERY_API_BASE_URL + DELIVERY_API_KEY
 * in backend/.env, this calls the real delivery.com "create shipment" endpoint.
 * Adjust the request/response shape below to match their actual API docs.
 *
 * MOCK MODE (default, no keys set): generates a fake tracking id and lets
 * getLiveStatus() simulate progress based on elapsed time, so the Orders
 * page still shows believable live tracking during development.
 */
async function createShipment(order) {
  if (LIVE_MODE) {
    try {
      const { data } = await axios.post(
        `${DELIVERY_BASE_URL}/shipments`,
        {
          reference_id: order._id.toString(),
          receiver: {
            name: order.customer.name,
            phone: order.customer.phone,
            address: order.customer.address,
            city: order.customer.city,
            state: order.customer.state,
            pincode: order.customer.pincode,
          },
          items: order.items.map((i) => ({ name: i.name, qty: i.qty })),
        },
        { headers: { Authorization: `Bearer ${DELIVERY_API_KEY}` } }
      );

      return {
        courierPartner: "delivery.com",
        trackingId: data.tracking_id,
        currentStatus: data.status || "ORDER_PLACED",
        currentLocation: data.current_location || "",
        estimatedDelivery: data.eta ? new Date(data.eta) : undefined,
        isMock: false,
        history: [{ status: "ORDER_PLACED", location: "Warehouse", timestamp: new Date() }],
        lastUpdated: new Date(),
      };
    } catch (err) {
      console.error("delivery.com createShipment failed, falling back to mock:", err.message);
      // fall through to mock below
    }
  }

  // ---- MOCK shipment (used until the real delivery.com keys are added) ----
  const trackingId = `DLV${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;
  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // +4 days
  return {
    courierPartner: "delivery.com",
    trackingId,
    currentStatus: "ORDER_PLACED",
    currentLocation: "Seller warehouse, Chennai",
    estimatedDelivery,
    isMock: true,
    history: [{ status: "ORDER_PLACED", location: "Seller warehouse, Chennai", timestamp: new Date() }],
    lastUpdated: new Date(),
  };
}

/**
 * getLiveStatus(order)
 * Returns the current tracking snapshot for an order.
 * LIVE MODE: polls delivery.com's "get shipment status" endpoint.
 * MOCK MODE: derives a believable stage from how long ago the order was placed,
 * so the Orders page appears to progress in real time without a real courier.
 */
async function getLiveStatus(order) {
  if (LIVE_MODE && !order.tracking.isMock) {
    try {
      const { data } = await axios.get(
        `${DELIVERY_BASE_URL}/shipments/${order.tracking.trackingId}`,
        { headers: { Authorization: `Bearer ${DELIVERY_API_KEY}` } }
      );
      return {
        currentStatus: data.status,
        currentLocation: data.current_location,
        history: data.history || order.tracking.history,
        lastUpdated: new Date(),
      };
    } catch (err) {
      console.error("delivery.com getLiveStatus failed:", err.message);
      return order.tracking;
    }
  }

  // ---- MOCK progression ----
  const hoursSinceOrder = (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60);
  // Roughly: placed -> picked up (3h) -> in transit (12h) -> out for delivery (72h) -> delivered (96h)
  const thresholds = [0, 3, 12, 72, 96];
  let stageIndex = 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (hoursSinceOrder >= thresholds[i]) {
      stageIndex = i;
      break;
    }
  }
  const currentStatus = STAGES[stageIndex];
  const locations = [
    "Seller warehouse, Chennai",
    "Chennai sorting hub",
    "In transit to destination city",
    `Out for delivery near ${order.customer.city}`,
    `Delivered at ${order.customer.address}`,
  ];

  const history = STAGES.slice(0, stageIndex + 1).map((status, i) => ({
    status,
    location: locations[i],
    timestamp: new Date(order.createdAt.getTime() + thresholds[i] * 60 * 60 * 1000),
  }));

  return {
    currentStatus,
    currentLocation: locations[stageIndex],
    history,
    lastUpdated: new Date(),
  };
}

// GET /api/tracking/:orderId  -> live tracking snapshot for the Orders page
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const liveStatus = await getLiveStatus(order);
    order.tracking = { ...order.tracking.toObject(), ...liveStatus };

    // Keep order status roughly in sync with tracking stage
    const map = {
      ORDER_PLACED: "CONFIRMED",
      PICKED_UP: "SHIPPED",
      IN_TRANSIT: "SHIPPED",
      OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
      DELIVERED: "DELIVERED",
    };
    if (map[liveStatus.currentStatus]) order.orderStatus = map[liveStatus.currentStatus];

    await order.save();
    res.json(order.tracking);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tracking", error: err.message });
  }
});

module.exports = router;
module.exports.createShipment = createShipment;
module.exports.getLiveStatus = getLiveStatus;
