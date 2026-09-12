import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const fallbackImage = "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Sambhalpuri_Saree_%28Blue%29.jpg/960px-Sambhalpuri_Saree_%28Blue%29.jpg";
  const wishlisted = isWishlisted(product._id);

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card__img">
        <img
          src={product.images?.[0] || fallbackImage}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            if (event.currentTarget.src !== fallbackImage) event.currentTarget.src = fallbackImage;
          }}
        />
        <button
          type="button"
          className={`wishlist-toggle${wishlisted ? " is-active" : ""}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
        {product.discountPercent > 0 && (
          <span className="badge-off">{product.discountPercent}% OFF</span>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__cat">{product.category}</div>
        <div className="product-card__name">{product.name}</div>
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
