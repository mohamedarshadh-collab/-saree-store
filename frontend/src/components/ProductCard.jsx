import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card__img">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        {product.rating >= 4.6 && <span className="badge-bestseller">Bestseller</span>}
        {product.discountPercent > 0 && (
          <span className="badge-off">{product.discountPercent}% OFF</span>
        )}
        <button
          className={`wishlist-btn ${wishlisted ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-card__body">
        <div className="product-card__cat">{product.category}</div>
        <div className="product-card__name">{product.name}</div>
        <div className="rating-row">
          ★ {product.rating} <span>({product.ratingCount})</span>
        </div>
        <div className="price-row">
          <span className="price">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="mrp">₹{product.mrp.toLocaleString("en-IN")}</span>
          {product.discountPercent > 0 && (
            <span className="discount">{product.discountPercent}% off</span>
          )}
        </div>
      </div>
    </Link>
  );
}