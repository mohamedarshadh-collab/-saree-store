import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("saree_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      localStorage.removeItem("saree_cart");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("saree_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1, customization = null, customizedPrice = product.price) => {
    setItems((prev) => {
      const cartItemId = customization ? `${product._id}-${Date.now()}` : product._id;
      const existing = customization
        ? null
        : prev.find((i) => i.productId === product._id && !i.customization);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          cartItemId,
          name: product.name,
          image: product.images?.[0],
          price: customizedPrice,
          category: product.category,
          qty,
          customization,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => ((i.cartItemId || i.productId) === productId ? { ...i, qty } : i)));
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => (i.cartItemId || i.productId) !== productId));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, subtotal, totalQty }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
