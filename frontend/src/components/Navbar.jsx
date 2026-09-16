import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const CATEGORIES = [
  { label: "Silk Sarees", value: "Pattu Sarees" },
  { label: "Bridal", value: "Fancy Sarees" },
  { label: "Festive", value: "Party Wear Sarees" },
  { label: "Cotton", value: "Cotton Sarees" },
  { label: "Designer", value: "Fancy Sarees" },
  { label: "New In", value: "Others" },
];

export default function Navbar() {
  const { totalQty } = useCart();
  const { wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    setMenuOpen(false);

    if (!trimmed) {
      navigate("/shop");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar__top">
          <Link to="/" className="brand" aria-label="Paisley and Pallu home">
            <span className="brand-mark">P</span>
          </Link>

          <button
            className="navbar__toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav id="site-navigation" className={`navbar__menu${menuOpen ? " is-open" : ""}`} aria-label="Main categories">
            {CATEGORIES.map(({ label, value }) => (
              <NavLink key={label} to={`/shop?category=${encodeURIComponent(value)}`} className="navbar__menu-link" onClick={() => setMenuOpen(false)}>
                {label}
                {label === "New In" && <span className="new-pill">NEW</span>}
              </NavLink>
            ))}
          </nav>

          <form className="navbar__search-wrap" role="search" onSubmit={handleSearchSubmit}>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="text"
              placeholder="Search for sarees, brands and more"
              aria-label="Search products"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          <nav className="navbar__actions" aria-label="Account actions">
            <Link to="/orders" className="profile-btn" aria-label="My orders">
              <span>◔</span>
              <span>Account</span>
            </Link>
            <Link to="/wishlist" className="action-link">
              <span>♡</span>
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="action-link">
              <span>👜</span>
              <span>Bag</span>
              {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}