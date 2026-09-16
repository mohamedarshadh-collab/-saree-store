import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, getReviews, submitReview } from "../api/api";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import LoadingState from "../components/LoadingState.jsx";
import CompleteLook from "../components/CompleteLook.jsx";
import CustomizeSaree from "../components/CustomizeSaree.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [productError, setProductError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setProductError("");
    getProduct(id).then((res) => setProduct(res.data)).catch(() => setProductError("This saree could not be loaded. Please return to the shop and try again."));
    getReviews(id).then((res) => setReviews(res.data)).catch(() => setReviews([]));
    setAdded(false);
  }, [id]);

  if (productError) return <div className="empty-state">{productError}</div>;
  if (!product) return <LoadingState label="Loading saree" />;

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  const handleReviewChange = (event) => {
    setReviewForm({ ...reviewForm, [event.target.name]: event.target.value });
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError("");
    setReviewSent(false);
    setReviewSubmitting(true);
    try {
      const { data } = await submitReview(product._id, reviewForm);
      setReviews([data, ...reviews]);
      setProduct({
        ...product,
        ratingCount: product.ratingCount + 1,
        rating: Number(((product.rating * product.ratingCount + Number(reviewForm.rating)) / (product.ratingCount + 1)).toFixed(1)),
      });
      setReviewForm({ name: "", rating: 5, comment: "" });
      setReviewSent(true);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Could not submit your review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <section className="pdp">
      <div className="pdp__gallery">
        <div className="pdp__thumbs">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.name} ${i + 1}`}
              onClick={() => setActiveImg(i)}
              style={{ borderColor: i === activeImg ? "var(--wine)" : undefined }}
            />
          ))}
        </div>
        <div className="pdp__main-img">
          <img src={product.images[activeImg]} alt={product.name} />
        </div>
      </div>

      <div className="pdp__info">
        <div className="product-card__cat">{product.category}</div>
        <h1>{product.name}</h1>
        <div className="pdp__meta">
          {product.rating}★ ({product.ratingCount} ratings) · SKU {product.sku}
        </div>
        <div className="pdp__price">
          <span>₹{product.price.toLocaleString("en-IN")}</span>
          <span className="mrp">₹{product.mrp.toLocaleString("en-IN")}</span>
          <span className="discount">{product.discountPercent}% off</span>
        </div>
        <p className="pdp__desc">{product.description}</p>

        <table className="spec-table">
          <tbody>
            <tr><td>Fabric</td><td>{product.fabric}</td></tr>
            <tr><td>Colour</td><td>{product.color}</td></tr>
            <tr><td>Blouse piece</td><td>{product.blouseIncluded ? "Included, unstitched" : "Not included"}</td></tr>
            <tr><td>Availability</td><td>{product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}</td></tr>
          </tbody>
        </table>

        <div className="pdp__actions">
          <button
            className={`btn btn--wishlist${isWishlisted(product._id) ? " is-active" : ""}`}
            onClick={() => toggleWishlist(product)}
          >
            {isWishlisted(product._id) ? "♥ Saved" : "♡ Wishlist"}
          </button>
          <button className="btn btn--outline" onClick={handleAdd}>
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
          <button className="btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>

      <CompleteLook product={product} />
      <CustomizeSaree product={product} />

      <section className="product-reviews" aria-labelledby="reviews-heading">
        <div className="product-reviews__head">
          <div>
            <div className="hero__eyebrow">Customer feedback</div>
            <h2 id="reviews-heading">Ratings &amp; Reviews</h2>
          </div>
          <button className="btn btn--outline" type="button" onClick={() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" })}>
            Write a review
          </button>
        </div>

        <div className="review-summary">
          <div className="review-summary__score"><strong>{Number(product.rating || 0).toFixed(1)}</strong><span>★</span><small>{product.ratingCount || 0} ratings</small></div>
          <div className="review-summary__bars">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((review) => review.rating === star).length;
              const width = reviews.length ? `${(count / reviews.length) * 100}%` : "0%";
              return <div className="rating-bar" key={star}><span>{star} ★</span><div><i style={{ width }} /></div><small>{count}</small></div>;
            })}
          </div>
        </div>

        <div className="review-layout">
          <div className="review-list">
            {reviews.length === 0 ? <p className="review-empty">Be the first to review this saree.</p> : reviews.map((review) => (
              <article className="review-item" key={review._id}>
                <div className="review-item__top"><strong>{review.name}</strong><span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></div>
                <p>{review.comment}</p>
                <small>{review.verified ? "Verified buyer · " : ""}{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</small>
              </article>
            ))}
          </div>

          <form className="review-form" id="review-form" onSubmit={handleReviewSubmit}>
            <h3>Write a review</h3>
            <label>Your name<input name="name" value={reviewForm.name} onChange={handleReviewChange} maxLength="60" required /></label>
            <label>Your rating<select name="rating" value={reviewForm.rating} onChange={handleReviewChange}><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Terrible</option></select></label>
            <label>Your review<textarea name="comment" value={reviewForm.comment} onChange={handleReviewChange} rows="4" maxLength="500" required /></label>
            {reviewError && <p className="review-form__error">{reviewError}</p>}
            {reviewSent && <p className="review-form__success">Thanks for sharing your experience.</p>}
            <button className="btn" type="submit" disabled={reviewSubmitting}>{reviewSubmitting ? "Submitting..." : "Submit review"}</button>
          </form>
        </div>
      </section>
    </section>
  );
}
