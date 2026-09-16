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

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    alt: "Woman in an elegant purple saree",
  },
  {
    src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    alt: "Woman wearing a traditional saree",
  },
  {
    src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
    alt: "Woman in a festive saree look",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    getProducts().then((res) => {
      const products = res.data;
      setFeatured(products.slice(0, 10));
      setCategoryImages(products.reduce((images, product) => {
        if (!images[product.category] && product.images?.[0]) images[product.category] = product.images[0];
        return images;
      }, {}));
    }).catch(() => setError("We could not load the collection. Please try again.")).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const heroTimer = window.setInterval(() => {
      setHeroImageIndex((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => window.clearInterval(heroTimer);
  }, []);

  return (
    <>
      <section className="myntra-banner">
        <div className="myntra-banner__text">
          <span className="myntra-banner__big">For Her</span>
          <span className="myntra-banner__sub">Save up to ₹200</span>
        </div>
        <div className="myntra-banner__coupon">
          <span className="myntra-banner__coupon-label">Offer</span>
          <span className="myntra-banner__coupon-code">PAISLEY25</span>
        </div>
        <div className="myntra-banner__meta">Women-only saree edit | T&amp;C apply</div>
        <div className="myntra-banner__badge">%</div>
      </section>

      <section className="hero hero--myntra">
        <div className="hero__image hero__image--wide">
          <img
            key={HERO_IMAGES[heroImageIndex].src}
            src={HERO_IMAGES[heroImageIndex].src}
            alt={HERO_IMAGES[heroImageIndex].alt}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="hero__promo-card">
          <div className="promo-card__eyebrow">Curated for Her</div>
          <div className="promo-card__title">Luxury Saree Edit</div>
          <div className="promo-card__offer">40-70% Off</div>
          <p className="promo-card__text">Handpicked silks, soft cottons and bridal drapes for every celebration.</p>
          <Link to="/shop" className="promo-card__button">Explore Collection</Link>
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
          {loading ? <LoadingState label="Finding favourites" /> : error ? <div className="empty-state inline-empty">{error}</div> : featured.map((p) => (
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
