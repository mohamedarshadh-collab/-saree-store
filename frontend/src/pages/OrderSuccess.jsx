import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getOrder } from "../api/api";

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data));
  }, [id]);

  return (
    <div className="empty-state">
      <h2 style={{ color: "var(--success)" }}>
        {location.state?.message || "Payment accepted"} ✓
      </h2>
      <p>Your order has been placed successfully.</p>
      {order && (
        <p style={{ marginTop: 10 }}>
          Order ID: <strong>{order._id}</strong> · Tracking ID:{" "}
          <strong>{order.tracking?.trackingId}</strong>
        </p>
      )}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
        <Link to={`/orders`} className="btn">
          View My Orders
        </Link>
        <Link to="/shop" className="btn btn--outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
