import React, { useEffect, useState } from "react";
import { getOrders, getTracking } from "../api/api";

const STAGES = [
  { key: "ORDER_PLACED", label: "Order Placed" },
  { key: "PICKED_UP", label: "Picked Up" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

function TrackingTimeline({ order }) {
  const [tracking, setTracking] = useState(order.tracking);
  const [loading, setLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setTrackingError("");
    try {
      const { data } = await getTracking(order._id);
      setTracking(data);
    } catch {
      setTrackingError("Tracking is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 20000); // poll delivery.com every 20s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order._id]);

  const activeIndex = STAGES.findIndex((s) => s.key === tracking?.currentStatus);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          Tracking ID: <strong>{tracking?.trackingId}</strong> via {tracking?.courierPartner}
          {tracking?.isMock && <span className="mock-flag">SIMULATED</span>}
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          style={{ border: "none", background: "none", color: "var(--wine)", fontSize: 13, fontWeight: 600 }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {trackingError && <p className="tracking-error">{trackingError}</p>}

      <div className="tracking-timeline">
        {STAGES.map((s, i) => (
          <div key={s.key} className={`tracking-step ${i <= activeIndex ? "done" : ""}`}>
            <div className="tracking-step__dot" />
            {s.label}
          </div>
        ))}
      </div>

      <div className="tracking-note">
        Currently at: <strong>{tracking?.currentLocation}</strong>
        {tracking?.estimatedDelivery && (
          <> · Estimated delivery: {new Date(tracking.estimatedDelivery).toLocaleDateString("en-IN")}</>
        )}
      </div>
    </div>
  );
}

export default function Orders() {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await getOrders(phone.trim());
      setOrders(data);
      setSearched(true);
    } catch {
      setError("We could not find orders right now. Please try again.");
    }
  };

  return (
    <section className="section">
      <h2 style={{ marginBottom: 18 }}>My Orders</h2>
      <form className="orders-search" onSubmit={handleSearch} style={{ display: "flex", gap: 10, maxWidth: 400, marginBottom: 30 }}>
        <input
          placeholder="Enter phone number used while ordering"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginBottom: 0 }}
          required
        />
        <button className="btn" type="submit">Find Orders</button>
      </form>

      {error && <p className="review-form__error">{error}</p>}

      {searched && orders.length === 0 && (
        <div className="empty-state">No orders found for this phone number.</div>
      )}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-card__head">
            <div>
              <div style={{ fontWeight: 700 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")} ·{" "}
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"} ·{" "}
                Total ₹{order.totalAmount.toLocaleString("en-IN")}
              </div>
            </div>
            <span className="status-pill">{order.orderStatus.replace(/_/g, " ")}</span>
          </div>

          {order.items.map((item) => (
            <div key={item.name} style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 4 }}>
              {item.name} × {item.qty} — ₹{(item.price * item.qty).toLocaleString("en-IN")}
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <TrackingTimeline order={order} />
          </div>
        </div>
      ))}
    </section>
  );
}
