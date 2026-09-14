import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const CATEGORIES = [
  "Pattu Sarees",
  "Fancy Sarees",
  "Georgette Sarees",
  "Party Wear Sarees",
  "Cotton Sarees",
  "Others",
];

export default function Navbar() {
  const { totalQty } = useCart();
  const { wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="announce-bar">
        ✦ Free shipping on prepaid orders &nbsp;·&nbsp; Cash on Delivery available &nbsp;·&nbsp; Handpicked sarees, delivered with care ✦
      </div>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar__top">
          <Link to="/" className="brand">
            <span className="brand-mark">P</span>
            Paisley &amp; <span style={{ color: "var(--gold)" }}>Pallu</span>
          </Link>
          <nav className="navbar__actions">
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">
              Wishlist
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart">
              Cart
              {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
            </Link>
          </nav>
        </div>
        <nav className="navbar__categories">
          <NavLink to="/shop" end>
            All Sarees
          </NavLink>
          {CATEGORIES.map((c) => (
            <NavLink key={c} to={`/shop?category=${encodeURIComponent(c)}`}>
              {c}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}