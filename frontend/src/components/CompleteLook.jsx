import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";

const ACCESSORY_IMAGES = {
  jewellery: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=85",
  potli: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85",
};

export default function CompleteLook({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const accessories = useMemo(() => [
    {
      _id: `${product._id}-blouse`,
      name: `${product.color} Contrast Blouse`,
      category: "Matching blouse",
      price: 899,
      image: product.images?.[1] || product.images?.[0],
    },
    {
      _id: `${product._id}-jewellery`,
      name: "Temple Gold Jewellery Set",
      category: "Jewellery",
      price: 1299,
      image: ACCESSORY_IMAGES.jewellery,
    },
    {
      _id: `${product._id}-potli`,
      name: "Embroidered Silk Potli",
      category: "Potli & accessories",
      price: 699,
      image: ACCESSORY_IMAGES.potli,
    },
  ], [product]);
  const [selectedIds, setSelectedIds] = useState(() => accessories.map((item) => item._id));

  useEffect(() => {
    setSelectedIds(accessories.map((item) => item._id));
    setAdded(false);
  }, [accessories]);

  const selectedAccessories = accessories.filter((item) => selectedIds.includes(item._id));
  const accessoriesTotal = selectedAccessories.reduce((total, item) => total + item.price, 0);
  const lookTotal = product.price + accessoriesTotal;

  const toggleAccessory = (id) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
    setAdded(false);
  };

  const addCompleteLook = () => {
    const customization = {
      variant: "Original shade",
      blouseStyle: "classic",
      jewellery: selectedAccessories
        .filter((item) => item.category === "Jewellery")
        .map(() => "temple-set"),
      accessories: selectedAccessories
        .filter((item) => item.category === "Potli & accessories")
        .map((item) => item._id.endsWith("-potli") ? "silk-potli" : "brocade-clutch"),
      giftWrap: false,
      giftMessage: "",
      expressDelivery: false,
    };
    addToCart(product, 1, customization, lookTotal);
    setAdded(true);
  };

  return (
    <section className="complete-look" aria-labelledby="complete-look-heading">
      <div className="complete-look__intro">
        <div>
          <div className="hero__eyebrow">Curated styling</div>
          <h2 id="complete-look-heading">Complete the Look</h2>
          <p>Finish your drape with considered pieces chosen to complement this saree.</p>
        </div>
        <div className="complete-look__total">
          <small>Complete look total</small>
          <strong>₹{lookTotal.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div className="complete-look__items">
        {accessories.map((item) => {
          const selected = selectedIds.includes(item._id);
          return (
            <article className={`look-item${selected ? " is-selected" : ""}`} key={item._id}>
              <div className="look-item__image"><img src={item.image} alt={item.name} loading="lazy" /></div>
              <div className="look-item__body">
                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <strong>₹{item.price.toLocaleString("en-IN")}</strong>
                <button className="look-item__toggle" type="button" onClick={() => toggleAccessory(item._id)} aria-pressed={selected}>
                  <i aria-hidden="true">{selected ? "✓" : "+"}</i> {selected ? "Added" : "Add"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="complete-look__footer">
        <span>{selectedAccessories.length} of {accessories.length} finishing pieces selected</span>
        <button className="btn" type="button" onClick={addCompleteLook} disabled={selectedAccessories.length === 0}>
          {added ? "Complete Look Added ✓" : "Add Complete Look to Cart"}
        </button>
      </div>
    </section>
  );
}
