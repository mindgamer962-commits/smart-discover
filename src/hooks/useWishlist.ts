import { useState, useEffect } from "react";

const WISHLIST_KEY = "affiliate_marketplace_wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(WISHLIST_KEY);
  };

  return { wishlist, toggleWishlist, isWishlisted, clearWishlist };
}
