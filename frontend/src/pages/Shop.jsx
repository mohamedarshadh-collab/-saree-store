import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard.jsx";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts({ category, search }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [category, search]);

  const title = search ? `Search results for "${search}"` : category === "All" ? "All Sarees" : category;

  return (
    <section className="section">
      <div className="section__head">
        <h2>{title}</h2>
        <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>
          {products.length} sarees
        </span>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-img" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          {search ? `No sarees found for "${search}". Try another keyword.` : "No sarees found in this category yet."}
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}