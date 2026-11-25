"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface MockUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mode: "PLACEHOLDER_MOCK" | "LIVE_LARAVEL";
}

interface StoreContextValue {
  heroTheme: "light" | "dark";
  toggleHeroTheme: () => void;
  cart: CartItem[];
  wishlist: string[];
  user: MockUser | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setUser: (u: MockUser | null) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (v: boolean) => void;
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  customOrderOpen: boolean;
  setCustomOrderOpen: (v: boolean) => void;
  askPriceProduct: Product | null;
  setAskPriceProduct: (p: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [heroTheme, setHeroTheme] = useState<"light" | "dark">("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<MockUser | null>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [customOrderOpen, setCustomOrderOpen] = useState(false);
  const [askPriceProduct, setAskPriceProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("nj_cart");
      const savedWish = localStorage.getItem("nj_wishlist");
      const savedUser = localStorage.getItem("nj_user");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWish) setWishlist(JSON.parse(savedWish));
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      // Ignore corrupt localStorage entries
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("nj_cart", JSON.stringify(cart));
      localStorage.setItem("nj_wishlist", JSON.stringify(wishlist));
      if (user) localStorage.setItem("nj_user", JSON.stringify(user));
      else localStorage.removeItem("nj_user");
    } catch {
      // Ignore storage quota errors
    }
  }, [cart, wishlist, user]);

  useEffect(() => {
    document.documentElement.setAttribute("data-hero-theme", heroTheme);
  }, [heroTheme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const toggleHeroTheme = () => {
    setHeroTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const addToCart = (product: Product) => {
    if (product.priceInr === null) {
      setAskPriceProduct(product);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to your bag.`);
    setCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? "Removed from wishlist." : "Saved to wishlist.");
      return next;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        heroTheme,
        toggleHeroTheme,
        cart,
        wishlist,
        user,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        setUser,
        cartOpen,
        setCartOpen,
        wishlistOpen,
        setWishlistOpen,
        authOpen,
        setAuthOpen,
        searchOpen,
        setSearchOpen,
        customOrderOpen,
        setCustomOrderOpen,
        askPriceProduct,
        setAskPriceProduct,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[1100] -translate-x-1/2 rounded-full border border-champagne/40 bg-obsidian/95 px-5 py-2.5 text-xs tracking-wide text-ivory shadow-xl backdrop-blur-md"
        >
          {toastMessage}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
