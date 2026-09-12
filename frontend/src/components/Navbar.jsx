import React from "react";
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

  return (
    <header className="navbar">
      <div className="navbar__top">
        <Link to="/" className="brand">
          Paisley &amp; <span>Pallu</span>
        </Link>
        <nav className="navbar__actions">
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist" className="wishlist-link">
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
  );
}
