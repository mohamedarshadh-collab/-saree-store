import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard.jsx";
import LoadingState from "../components/LoadingState.jsx";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts({ category }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [category]);

  return (
    <section className="section">
      <div className="section__head">
        <h2>{category === "All" ? "All Sarees" : category}</h2>
        <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>
          {products.length} sarees
        </span>
      </div>

      {loading ? (
        <LoadingState label="Loading sarees" />
      ) : products.length === 0 ? (
        <div className="empty-state">No sarees found in this category yet.</div>
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
