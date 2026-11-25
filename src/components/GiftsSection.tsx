"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Verified live-site Gifts Collection tiles from nandlaljewellers.com.
 * Motion preserved identically.
 */
const GIFT_TILES = [
  {
    title: "For her",
    subtitle: "Gold, diamond, rings, earrings, and everyday wear",
    image: "/images/raw/gift-img1.png",
  },
  {
    title: "For him",
    subtitle: "Rings, chains, bracelets, and gold jewellery",
    image: "/images/raw/gift2.png",
  },
  {
    title: "For kids",
    subtitle: "Kids items, baby birth, and birthday gifts",
    image: "/images/raw/gift3.png",
  },
  {
    title: "For occasions",
    subtitle: "Wedding, engagement, anniversary, and festive gifts, coins, and idols",
    image: "/images/raw/gift4.png",
  },
];

export function GiftsSection() {
  const { setCustomOrderOpen } = useStore();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".nj-gift-card",
          { y: 68, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          ".nj-gift-photo",
          { clipPath: "inset(14% 0% 0% 0%)", scale: 1.08 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.05,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="gifts"
      aria-label="Gifts Collection"
      className="border-t border-champagne/15 bg-obsidian px-6 py-24 text-ivory lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-champagne">Gifts collection</p>
            <h2 className="font-serif text-4xl font-normal md:text-5xl">
              Find a gift that&apos;s unique and special
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCustomOrderOpen(true)}
            className="inline-flex h-12 items-center gap-2 self-start rounded-full border border-champagne/40 px-6 text-xs font-medium text-champagne transition-colors duration-200 hover:bg-champagne hover:text-obsidian active:scale-[0.97]"
          >
            <span>Request custom order</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GIFT_TILES.map((tile) => (
            <div
              key={tile.title}
              className="nj-gift-card group overflow-hidden rounded-2xl border border-ivory/15 bg-charcoal p-3 will-change-transform"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-obsidian">
                <img
                  src={tile.image}
                  alt={`Nandlal Jewellers Gifts — ${tile.title}`}
                  className="nj-gift-photo h-full w-full object-cover will-change-transform"
                />
              </div>
              <div className="px-2 pb-2 pt-4">
                <h3 className="font-serif text-2xl">{tile.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/75">{tile.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
