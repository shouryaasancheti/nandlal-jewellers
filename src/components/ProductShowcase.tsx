"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { CATALOG_PRODUCTS } from "@/lib/catalog";
import { useStore } from "@/context/StoreContext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CATEGORY_FILTERS = ["All", "Rings", "Earrings", "Bangles & Bracelets"] as const;
const METAL_FILTERS = ["All", "Gold", "Diamond"] as const;

/**
 * Animation #8: 3D Portfolio-style staggered bottom-up rising product cards
 * with differential column scroll parallax on desktop.
 */
export function ProductShowcase() {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct, setAskPriceProduct } = useStore();
  const [category, setCategory] = useState<string>("All");
  const [metal, setMetal] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    let list = CATALOG_PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (metal !== "All" && p.metal !== metal) return false;
      return true;
    });
    if (sortBy === "price-asc") {
      list = [...list].sort(
        (a, b) => (a.priceInr ?? Number.MAX_SAFE_INTEGER) - (b.priceInr ?? Number.MAX_SAFE_INTEGER)
      );
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => (b.priceInr ?? -1) - (a.priceInr ?? -1));
    }
    return list;
  }, [category, metal, sortBy]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 1024px)",
        },
        (context) => {
          const { reduceMotion, isDesktop } = context.conditions || {};
          if (reduceMotion) return;

          // Staggered bottom-up entrance for product cards
          gsap.fromTo(
            ".nj-prod-card",
            { y: 64, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
              },
            }
          );

          // Subtle multi-column differential scroll speeds on desktop (3D Portfolio depth)
          if (isDesktop) {
            gsap.to(".nj-col-mid", {
              y: -28,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
            gsap.to(".nj-col-side", {
              y: -10,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          }
        }
      );
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [category, metal, sortBy] }
  );

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-label="Catalogue Showcase"
      className="relative z-[14] rounded-t-[32px] bg-ivory px-6 py-24 text-obsidian sm:rounded-t-[48px] lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-antique-gold">Showroom catalogue</p>
            <h2 className="font-serif text-4xl font-normal md:text-5xl">
              Signature pieces &amp; new arrivals
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`h-11 rounded-full border px-4 text-xs font-medium transition-colors duration-200 ${
                    category === cat
                      ? "border-obsidian bg-obsidian text-ivory"
                      : "border-obsidian/15 bg-transparent text-obsidian/80 hover:border-obsidian/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              aria-label="Filter by metal"
              value={metal}
              onChange={(e) => setMetal(e.target.value)}
              className="h-11 rounded-full border border-obsidian/15 bg-cream px-4 text-xs font-medium text-obsidian"
            >
              {METAL_FILTERS.map((m) => (
                <option key={m} value={m}>
                  Metal: {m}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort pieces"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
              className="h-11 rounded-full border border-obsidian/15 bg-cream px-4 text-xs font-medium text-obsidian"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-obsidian/10 bg-cream/60 p-12 text-center">
            <p className="font-serif text-2xl">No pieces match this filter</p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setMetal("All");
              }}
              className="mt-5 h-11 rounded-full bg-obsidian px-6 text-xs font-semibold text-ivory"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, idx) => {
              const wished = wishlist.includes(product.id);
              const colClass = idx % 3 === 1 ? "nj-col-mid" : "nj-col-side";
              return (
                <article
                  key={product.id}
                  className={`nj-prod-card ${colClass} group flex flex-col overflow-hidden rounded-2xl border border-obsidian/10 bg-cream/55 p-3 will-change-transform transition-[border-color] duration-300 hover:border-obsidian/25`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist">
                    <Link href={`/product/${product.slug}`} className="block h-full w-full">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                    </Link>

                    <div className="absolute right-3 top-3 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                        className={`grid h-11 w-11 place-items-center rounded-full border backdrop-blur-md transition-colors duration-200 ${
                          wished
                            ? "border-antique-gold bg-antique-gold text-ivory"
                            : "border-obsidian/15 bg-ivory/90 text-obsidian hover:bg-ivory"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        aria-label={`Quick view ${product.name}`}
                        className="grid h-11 w-11 place-items-center rounded-full border border-obsidian/15 bg-ivory/90 text-obsidian backdrop-blur-md transition-colors duration-200 hover:bg-ivory"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between px-2 pb-2 pt-5">
                    <div>
                      <p className="text-xs text-bronze">
                        {product.metal}
                        {product.purity !== "Ask for purity" ? `, ${product.purity}` : ""}
                        {product.stone ? `, ${product.stone}` : ""}
                      </p>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="mt-1 font-serif text-2xl font-medium text-obsidian transition-colors duration-200 group-hover:text-antique-gold">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="tabular-nums mt-2 text-sm font-semibold text-obsidian">
                        {product.priceInr !== null
                          ? `₹${product.priceInr.toLocaleString("en-IN")}`
                          : "Ask for price"}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2 border-t border-obsidian/10 pt-4">
                      {product.priceInr !== null ? (
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-obsidian px-4 text-xs font-semibold text-ivory transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97]"
                        >
                          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                          Add to bag
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAskPriceProduct(product)}
                          className="h-11 flex-1 rounded-full bg-obsidian px-4 text-xs font-semibold text-ivory transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97]"
                        >
                          Ask for price
                        </button>
                      )}
                      <Link
                        href={`/product/${product.slug}`}
                        className="inline-flex h-11 items-center rounded-full border border-obsidian/20 px-4 text-xs font-medium text-obsidian transition-colors duration-200 hover:border-obsidian"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
