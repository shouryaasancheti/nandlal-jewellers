"use client";

import React from "react";
import { Heart, MessageCircle, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { STORE_INFO } from "@/lib/catalog";
import { useStore } from "@/context/StoreContext";
import { ProductViewer360 } from "./ProductViewer360";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist, setAskPriceProduct, setCustomOrderOpen } = useStore();
  const wished = wishlist.includes(product.id);
  const hasRealSku = !product.sku.startsWith("PLACEHOLDER");

  const whatsappText = encodeURIComponent(
    `Hello Nandlal Jewellers, I would like to enquire about ${product.name}${
      hasRealSku ? ` (SKU: ${product.sku})` : ""
    }.`
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
      <ProductViewer360 images={product.images} alt={product.name} />

      <div className="flex flex-col justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2.5 text-xs text-bronze">
            <span>{product.category}</span>
            {hasRealSku && (
              <>
                <span aria-hidden="true">/</span>
                <span className="font-mono text-obsidian">SKU {product.sku}</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-4xl font-normal md:text-5xl">{product.name}</h1>

          <p className="tabular-nums mt-4 text-2xl font-semibold text-obsidian">
            {product.priceInr !== null
              ? `₹${product.priceInr.toLocaleString("en-IN")}`
              : "Ask for price"}
          </p>
          {product.priceInr !== null && (
            <p className="mt-1 text-xs text-obsidian/65">Inclusive of all taxes</p>
          )}

          <p className="mt-5 text-sm leading-relaxed text-obsidian/75">
            {product.priceInr !== null
              ? "Crafted in BIS-hallmarked 22K gold and inspected for purity at our Burrabazar, Kolkata showroom."
              : "Available for private viewing and custom sizing at our Burrabazar, Kolkata showroom. Contact our concierge for current weight, purity options, and today's rate."}
          </p>

          {/* Specifications */}
          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-obsidian/12 py-5 text-sm">
            <div>
              <dt className="text-xs text-bronze">Metal</dt>
              <dd className="mt-1 font-medium text-obsidian">
                {product.metal} ({product.metalColour})
              </dd>
            </div>
            <div>
              <dt className="text-xs text-bronze">Purity</dt>
              <dd className="mt-1 font-medium text-obsidian">
                {product.purity === "Ask for purity" ? "Available on request" : product.purity}
              </dd>
            </div>
            {product.grossWeightGrams && (
              <div>
                <dt className="text-xs text-bronze">Gross &amp; net weight</dt>
                <dd className="tabular-nums mt-1 font-medium text-obsidian">
                  {product.grossWeightGrams.toFixed(3)} g
                </dd>
              </div>
            )}
            {product.dimensions && (
              <div>
                <dt className="text-xs text-bronze">Dimensions</dt>
                <dd className="tabular-nums mt-1 font-medium text-obsidian">{product.dimensions}</dd>
              </div>
            )}
          </dl>

          {/* Verified Price Breakup */}
          {product.priceBreakup && (
            <div className="mt-5 rounded-2xl border border-obsidian/10 bg-cream/60 p-5">
              <p className="mb-3 text-xs font-semibold text-antique-gold">Price breakup</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-obsidian/70">Metal cost</span>
                  <span className="tabular-nums font-mono">
                    ₹{product.priceBreakup.metalCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian/70">Making charges</span>
                  <span className="tabular-nums font-mono">
                    ₹{product.priceBreakup.makingCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian/70">GST</span>
                  <span className="tabular-nums font-mono">
                    ₹{product.priceBreakup.gst.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-obsidian/10 pt-2 font-semibold">
                  <span>Total (inclusive)</span>
                  <span className="tabular-nums font-mono">
                    ₹{product.priceBreakup.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-wrap gap-3">
            {product.priceInr !== null ? (
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-obsidian px-6 text-sm font-semibold text-ivory transition-opacity duration-200 hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                Add to bag
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAskPriceProduct(product)}
                className="h-12 flex-1 rounded-full bg-obsidian px-6 text-sm font-semibold text-ivory transition-opacity duration-200 hover:opacity-90"
              >
                Ask for price
              </button>
            )}

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-obsidian/20 px-5 text-sm font-medium text-obsidian transition-colors duration-200 hover:border-obsidian"
            >
              <Heart
                className={`h-4 w-4 ${wished ? "fill-antique-gold text-antique-gold" : ""}`}
                strokeWidth={1.5}
              />
              {wished ? "Saved" : "Wishlist"}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCustomOrderOpen(true)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-obsidian/20 px-5 text-xs font-medium text-obsidian transition-colors duration-200 hover:border-obsidian"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.5} />
              Customize this piece
            </button>
            <a
              href={`https://wa.me/+919830026688?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-antique-gold/50 px-5 text-xs font-medium text-antique-gold transition-colors duration-200 hover:bg-antique-gold hover:text-ivory"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              WhatsApp concierge
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-5 text-xs text-obsidian/70">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-antique-gold" strokeWidth={1.5} />
              BIS Hallmarked &amp; Certified
            </span>
            <span>7-day Kolkata showroom exchange</span>
            <span>{STORE_INFO.brandName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
