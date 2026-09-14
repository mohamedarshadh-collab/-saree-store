import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Orders from "./pages/Orders.jsx";
import Wishlist from "./pages/Wishlist.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      <footer className="footer">
        <div className="footer-main">
          <div>
            <div className="footer-brand">Paisley &amp; Pallu</div>
            <p>Handpicked sarees for every occasion — from everyday cotton to bridal silk, curated with care and delivered across India.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/shop?category=Pattu%20Sarees">Pattu Sarees</Link>
            <Link to="/shop?category=Georgette%20Sarees">Georgette Sarees</Link>
            <Link to="/shop?category=Party%20Wear%20Sarees">Party Wear Sarees</Link>
            <Link to="/shop">All Sarees</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link to="/orders">Track My Order</Link>
            <span>Shipping &amp; Returns</span>
            <span>Size Guide</span>
            <span>Contact Us</span>
          </div>
          <div>
            <h4>Stay in Touch</h4>
            <p>Get first access to new arrivals and festive offers.</p>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Paisley &amp; Pallu — Sarees, delivered with care.
        </div>
      </footer>
    </>
  );
}