import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add a few beautiful sarees to get started.</p>
        <Link to="/shop" className="btn" style={{ marginTop: 16 }}>
          Browse Sarees
        </Link>
      </div>
    );
  }

  return (
    <section className="cart-layout">
      <div>
        <h2 style={{ marginBottom: 20 }}>Shopping Cart</h2>
        {items.map((item) => (
          <div className="cart-item" key={item.cartItemId || item.productId}>
            <img src={item.image} alt={item.name} />
            <div>
              <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700 }}>
                {item.category}
              </div>
              <div style={{ fontWeight: 600, margin: "4px 0 8px" }}>{item.name}</div>
              {item.customization && <div className="cart-item__customization">Customized · {item.customization.variant}{item.customization.giftWrap ? " · Gift wrapped" : ""}{item.customization.expressDelivery ? " · Express" : ""}</div>}
              <div className="qty-control">
                <button onClick={() => updateQty(item.cartItemId || item.productId, item.qty - 1)}>−</button>
                <span style={{ padding: "0 10px" }}>{item.qty}</span>
                <button onClick={() => updateQty(item.cartItemId || item.productId, item.qty + 1)}>+</button>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </div>
              <button
                onClick={() => removeFromCart(item.cartItemId || item.productId)}
                style={{ border: "none", background: "none", color: "var(--danger)", fontSize: 13 }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-card">
        <h3 style={{ marginBottom: 14 }}>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <button className="btn" style={{ width: "100%", marginTop: 16 }} onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
}
