import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <section className="section wishlist-page">
      <div className="section__head">
        <h2>My Wishlist</h2>
        <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>
          {items.length} {items.length === 1 ? "saree" : "sarees"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="empty-state wishlist-empty">
          <div className="wishlist-empty__icon" aria-hidden="true">♡</div>
          <h3>Your wishlist is waiting</h3>
          <p>Save sarees you love and come back to them anytime.</p>
          <Link to="/shop" className="btn">Explore Sarees</Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
