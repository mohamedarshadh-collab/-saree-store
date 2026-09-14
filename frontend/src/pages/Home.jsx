import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard.jsx";
import LoadingState from "../components/LoadingState.jsx";

const CATEGORY_SWATCH = {
  "Pattu Sarees": "#6e1423",
  "Fancy Sarees": "#b8873b",
  "Georgette Sarees": "#7a8f5f",
  "Party Wear Sarees": "#3f2d54",
  "Cotton Sarees": "#c98a4b",
  Others: "#2f5a6b",
};

const whatsappMessage = encodeURIComponent("Hi, I need help choosing a saree.");
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
const whatsappHref = whatsappNumber
  ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${whatsappMessage}`
  : `https://wa.me/?text=${whatsappMessage}`;

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((res) => {
      const products = res.data;
      setFeatured(products.slice(0, 10));
      setCategoryImages(products.reduce((images, product) => {
        if (!images[product.category] && product.images?.[0]) images[product.category] = product.images[0];
        return images;
      }, {}));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <div className="hero__eyebrow">Handpicked for the season</div>
          <h1>Six yards of grace, made unforgettable.</h1>
          <p>
            Discover heirloom-worthy pattu, luminous silks and effortless cottons
            chosen for every celebration and everyday ritual.
          </p>
          <Button component={Link} to="/shop" variant="contained" color="secondary">
            Shop Now <span aria-hidden="true">→</span>
          </Button>
          <div className="hero__note"><span>30+ styles</span><span>Easy returns</span><span>COD available</span></div>
        </div>
        <div className="hero__image">
          <img
            src="https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Sambhalpuri_Saree_%28Blue%29.jpg/960px-Sambhalpuri_Saree_%28Blue%29.jpg"
            alt="Featured saree"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero__image-label"><span>01</span><strong>The blue edit</strong></div>
        </div>
      </section>

      <section className="cat-strip">
        <h2>Shop by Category</h2>
        <div className="cat-grid">
          {Object.entries(CATEGORY_SWATCH).map(([cat, color]) => (
            <Link
              key={cat}
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="cat-card"
            >
              <div className="cat-card__swatch" style={{ background: color }}>
                {categoryImages[cat] && <img src={categoryImages[cat]} alt={`${cat} collection`} loading="lazy" />}
              </div>
              <span>{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="trust-strip" aria-label="Shopping benefits">
        <div className="trust-item">
          <span className="trust-item__icon" aria-hidden="true">✦</span>
          <div><strong>Handpicked collections</strong><span>Thoughtful sarees for every mood</span></div>
        </div>
        <div className="trust-item">
          <span className="trust-item__icon" aria-hidden="true">◇</span>
          <div><strong>Quality fabrics</strong><span>Details chosen to last beyond a season</span></div>
        </div>
        <div className="trust-item">
          <span className="trust-item__icon" aria-hidden="true">✓</span>
          <div><strong>Easy, secure checkout</strong><span>Pay online or choose cash on delivery</span></div>
        </div>
      </section>

      <section className="promise-band">
        <div>
          <div className="hero__eyebrow">A saree worth remembering</div>
          <h2>Made for the compliments you will keep.</h2>
          <p>From first glance to the last pleat, find a drape that feels distinctly yours.</p>
        </div>
        <div className="promise-band__actions">
          <Button component={Link} to="/wishlist" variant="contained" color="secondary">Build Your Wishlist</Button>
          <Button component="a" className="whatsapp-btn" href={whatsappHref} target="_blank" rel="noreferrer">
            <span aria-hidden="true">◌</span> Need help choosing a saree?
          </Button>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Trending Now</h2>
          <Button component={Link} to="/shop" variant="outlined" color="primary">
            View All
          </Button>
        </div>
        <div className="product-grid">
          {loading ? <LoadingState label="Finding favourites" /> : featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section className="reviews-section">
        <div className="section__head">
          <div>
            <div className="hero__eyebrow">Loved by saree lovers</div>
            <h2>Little notes from our community</h2>
          </div>
          <span className="review-score">4.8 <span>★</span></span>
        </div>
        <div className="review-grid">
          <blockquote><p>“The pattu saree looked even richer in person. The border detail is beautiful.”</p><cite>Priya S. <span>Verified shopper</span></cite></blockquote>
          <blockquote><p>“Such an easy experience. I saved a few favourites first and came back to order.”</p><cite>Ananya R. <span>Verified shopper</span></cite></blockquote>
          <blockquote><p>“The cotton collection is exactly what I wanted for everyday elegance.”</p><cite>Meera K. <span>Verified shopper</span></cite></blockquote>
        </div>
      </section>
    </>
  );
}
