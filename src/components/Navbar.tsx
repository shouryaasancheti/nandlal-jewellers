"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const NAV_LINKS = [
  { label: "Collections", href: "/#collections" },
  { label: "Catalogue", href: "/#showcase" },
  { label: "Gifts", href: "/#gifts" },
  { label: "Story", href: "/#story" },
  { label: "Showroom", href: "/#store" },
];

export function Navbar() {
  const {
    heroTheme,
    toggleHeroTheme,
    cart,
    wishlist,
    user,
    setCartOpen,
    setWishlistOpen,
    setAuthOpen,
    setSearchOpen,
    setCustomOrderOpen,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const bagCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isLightHeader = scrolled || heroTheme === "light";

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[200] border-b transition-[background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "border-obsidian/15 bg-ivory/95 text-obsidian shadow-sm backdrop-blur-md"
            : heroTheme === "dark"
            ? "border-transparent bg-transparent text-ivory"
            : "border-transparent bg-transparent text-obsidian"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="flex min-h-[44px] items-center"
            aria-label="Nandlal Jewellers Home"
          >
            <img
              src="/images/raw/nand-jew1.png"
              alt="Nandlal Jewellers"
              className={`h-8 w-auto ${
                !isLightHeader ? "rounded-md bg-ivory px-2 py-0.5" : ""
              }`}
            />
          </Link>

          <nav aria-label="Primary Navigation" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="py-2 text-sm font-medium opacity-80 transition-opacity duration-300 hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleHeroTheme}
              aria-label="Switch hero light or dark theme"
              className={`hidden h-11 w-11 items-center justify-center rounded-full border transition-opacity duration-300 hover:opacity-75 sm:inline-flex ${
                isLightHeader
                  ? "border-obsidian/20 text-obsidian"
                  : "border-ivory/25 text-ivory"
              }`}
            >
              {heroTheme === "light" ? (
                <Moon className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Sun className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search jewellery"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity duration-300 hover:opacity-75 ${
                isLightHeader
                  ? "border-obsidian/20 text-obsidian"
                  : "border-ivory/25 text-ivory"
              }`}
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              aria-label={`Saved wishlist (${wishlist.length})`}
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity duration-300 hover:opacity-75 ${
                isLightHeader
                  ? "border-obsidian/20 text-obsidian"
                  : "border-ivory/25 text-ivory"
              }`}
            >
              <Heart className="h-4 w-4" strokeWidth={1.75} />
              {wishlist.length > 0 && (
                <span className="tabular-nums absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-antique-gold px-1 text-[10px] font-medium text-ivory">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => (user ? (window.location.href = "/account") : setAuthOpen(true))}
              aria-label={user ? "Your account" : "Sign in"}
              className={`hidden h-11 w-11 items-center justify-center rounded-full border transition-opacity duration-300 hover:opacity-75 sm:inline-flex ${
                isLightHeader
                  ? "border-obsidian/20 text-obsidian"
                  : "border-ivory/25 text-ivory"
              }`}
            >
              <User className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping bag (${bagCount})`}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-[transform,opacity] duration-300 hover:opacity-90 active:scale-[0.98] ${
                isLightHeader
                  ? "bg-obsidian text-ivory"
                  : "bg-ivory text-obsidian"
              }`}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              <span className="tabular-nums">Bag ({bagCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${
                isLightHeader
                  ? "border-obsidian/20 text-obsidian"
                  : "border-ivory/25 text-ivory"
              }`}
            >
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Navigation Panel */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-obsidian px-6 py-6 text-ivory"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-champagne">Nandlal Jewellers</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label="Mobile links">
            <ul className="space-y-2">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 font-serif text-4xl text-ivory transition-colors duration-300 hover:text-champagne"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-ivory/15 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setAuthOpen(true);
              }}
              className="h-12 flex-1 rounded-full border border-ivory/30 px-5 text-sm font-medium text-ivory"
            >
              {user ? `Account (${user.firstName})` : "Sign in with OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setCustomOrderOpen(true);
              }}
              className="h-12 flex-1 rounded-full bg-champagne px-5 text-sm font-semibold text-obsidian"
            >
              Request custom piece
            </button>
          </div>
        </div>
      )}
    </>
  );
}
