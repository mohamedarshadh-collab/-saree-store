import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createRazorpayOrder, verifyPayment } from "../api/api";

const COD_CHARGE = 100;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const total = subtotal + (paymentMethod === "COD" ? COD_CHARGE : 0);
  const amountDueNow = paymentMethod === "COD" ? COD_CHARGE : total;

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const isFormValid = () =>
    customer.name && customer.phone && customer.address && customer.city && customer.state && customer.pincode;

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    if (!isFormValid()) {
      setError("Please fill in all delivery details.");
      return;
    }
    if (items.length === 0) return;

    setPlacing(true);
    try {
      const cartItems = items.map((i) => ({ productId: i.productId, qty: i.qty, customization: i.customization }));

      // 1) Create a Razorpay order on our backend (full amount for ONLINE,
      //    just the ₹100 advance for COD)
      const { data: rpOrder } = await createRazorpayOrder({ items: cartItems, paymentMethod });

      // 2) Open Razorpay's checkout widget (supports UPI, cards, netbanking, wallets)
      const options = {
        key: rpOrder.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: "Paisley & Pallu",
        description:
          paymentMethod === "COD" ? "COD advance payment (₹100)" : "Saree order payment",
        order_id: rpOrder.razorpayOrderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#6e1423" },
        handler: async function (response) {
          try {
            const { data } = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cartItems,
              paymentMethod,
              customer,
            });
            clearCart();
            navigate(`/order-success/${data.order._id}`, {
              state: { message: data.message },
            });
          } catch (err) {
            setError("Payment could not be verified. Please contact support.");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to start payment. Please refresh your cart and try again."
      );
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="empty-state">Your cart is empty. Add sarees before checking out.</div>;
  }

  return (
    <section className="checkout-layout">
      <form onSubmit={handlePayment}>
        <h2 style={{ marginBottom: 18 }}>Delivery Details</h2>
        <div className="form-grid">
          <div>
            <label>Full Name</label>
            <input name="name" value={customer.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone Number</label>
            <input name="phone" value={customer.phone} onChange={handleChange} required />
          </div>
          <div className="full">
            <label>Email (optional)</label>
            <input name="email" type="email" value={customer.email} onChange={handleChange} />
          </div>
          <div className="full">
            <label>Address</label>
            <textarea name="address" rows="2" value={customer.address} onChange={handleChange} required />
          </div>
          <div>
            <label>City</label>
            <input name="city" value={customer.city} onChange={handleChange} required />
          </div>
          <div>
            <label>State</label>
            <input name="state" value={customer.state} onChange={handleChange} required />
          </div>
          <div>
            <label>Pincode</label>
            <input name="pincode" value={customer.pincode} onChange={handleChange} required />
          </div>
        </div>

        <h2 style={{ margin: "26px 0 6px" }}>Payment Method</h2>
        <div className="payment-options">
          <label className={`payment-option ${paymentMethod === "ONLINE" ? "selected" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            <div>
              <strong>Pay Online (Razorpay)</strong>
              <small>UPI, Cards, Netbanking &amp; Wallets — pay full amount now</small>
            </div>
          </label>
          <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <div>
              <strong>Cash on Delivery (+₹{COD_CHARGE})</strong>
              <small>
                Pay a ₹{COD_CHARGE} advance online now to confirm the order; pay the rest (₹
                {subtotal.toLocaleString("en-IN")}) in cash on delivery.
              </small>
            </div>
          </label>
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}

        <button className="btn" type="submit" disabled={placing} style={{ width: "100%" }}>
          {placing
            ? "Processing..."
            : paymentMethod === "COD"
            ? `Pay ₹${COD_CHARGE} Advance & Place Order`
            : `Pay ₹${total.toLocaleString("en-IN")}`}
        </button>
      </form>

      <div className="summary-card">
        <h3 style={{ marginBottom: 14 }}>Order Summary</h3>
        {items.map((i) => (
          <div className="summary-row" key={i.productId}>
            <span>{i.name} × {i.qty}</span>
            <span>₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
          </div>
        ))}
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {paymentMethod === "COD" && (
          <div className="summary-row">
            <span>COD charge</span>
            <span>₹{COD_CHARGE}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
        <div className="tracking-note">Payable now: ₹{amountDueNow.toLocaleString("en-IN")}</div>
      </div>
    </section>
  );
}
