"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { CATALOG_PRODUCTS } from "@/lib/catalog";
import { useStore } from "@/context/StoreContext";

export function CartWishlistDrawers() {
  const {
    cart,
    wishlist,
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
    updateQty,
    removeFromCart,
    toggleWishlist,
    addToCart,
    setAskPriceProduct,
  } = useStore();

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.priceInr ?? 0) * item.quantity,
    0
  );

  const wishedProducts = CATALOG_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <>
      {cartOpen && (
        <div className="fixed inset-0 z-[400] flex justify-end bg-obsidian/55 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
            data-lenis-prevent
            className="flex h-full w-full max-w-md flex-col bg-ivory text-obsidian shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-obsidian/10 px-6 py-5">
              <h2 className="font-serif text-2xl">
                Your bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
                className="grid h-10 w-10 place-items-center rounded-full border border-obsidian/15"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-10 w-10 text-obsidian/25" strokeWidth={1.5} />
                  <p className="font-serif text-2xl">Your bag is empty</p>
                  <p className="mt-2 max-w-xs text-xs text-obsidian/65">
                    Add pieces directly to your bag, or request a quotation on showroom designs.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex gap-4 rounded-xl border border-obsidian/10 bg-cream/60 p-3.5"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="font-serif text-lg leading-snug">{product.name}</p>
                          {!product.sku.startsWith("PLACEHOLDER") && (
                            <p className="font-mono text-[10px] text-bronze">SKU {product.sku}</p>
                          )}
                          <p className="tabular-nums mt-1 text-xs font-semibold">
                            ₹{((product.priceInr ?? 0) * quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-obsidian/15">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(product.id, quantity - 1)}
                              className="p-2"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="tabular-nums px-2.5 text-xs">{quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQty(product.id, quantity + 1)}
                              className="p-2"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            aria-label={`Remove ${product.name}`}
                            className="p-2 text-obsidian/55 hover:text-obsidian"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-obsidian/10 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-obsidian/70">Estimated total</span>
                  <span className="tabular-nums text-lg font-semibold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-obsidian text-xs font-semibold text-ivory hover:opacity-90"
                >
                  Proceed to checkout
                </Link>
                <p className="mt-3 text-center text-[11px] text-bronze">
                  Secured by Razorpay · Insured Kolkata delivery
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {wishlistOpen && (
        <div className="fixed inset-0 z-[400] flex justify-end bg-obsidian/55 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Saved Wishlist"
            data-lenis-prevent
            className="flex h-full w-full max-w-md flex-col bg-ivory text-obsidian shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-obsidian/10 px-6 py-5">
              <h2 className="font-serif text-2xl">Wishlist ({wishedProducts.length})</h2>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                aria-label="Close wishlist"
                className="grid h-10 w-10 place-items-center rounded-full border border-obsidian/15"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {wishedProducts.length === 0 ? (
                <p className="py-20 text-center font-serif text-xl text-obsidian/60">
                  No saved pieces yet. Tap the heart icon on any design to save it here.
                </p>
              ) : (
                <ul className="space-y-4">
                  {wishedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex gap-4 rounded-xl border border-obsidian/10 bg-cream/60 p-3.5"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="font-serif text-lg">{product.name}</p>
                          <p className="tabular-nums text-xs text-bronze">
                            {product.priceInr !== null
                              ? `₹${product.priceInr.toLocaleString("en-IN")}`
                              : "Ask for price"}
                          </p>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setWishlistOpen(false);
                              if (product.priceInr !== null) addToCart(product);
                              else setAskPriceProduct(product);
                            }}
                            className="h-9 rounded-full bg-obsidian px-4 text-xs font-medium text-ivory"
                          >
                            {product.priceInr !== null ? "Move to bag" : "Ask for price"}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="h-9 rounded-full border border-obsidian/20 px-4 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
