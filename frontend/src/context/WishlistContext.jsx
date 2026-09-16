import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("saree_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      localStorage.removeItem("saree_wishlist");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("saree_wishlist", JSON.stringify(items));
  }, [items]);

  const isWishlisted = (productId) => items.some((item) => item._id === productId);

  const toggleWishlist = (product) => {
    setItems((current) => {
      if (current.some((item) => item._id === product._id)) {
        return current.filter((item) => item._id !== product._id);
      }
      return [...current, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setItems((current) => current.filter((item) => item._id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{ items, wishlistCount: items.length, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
