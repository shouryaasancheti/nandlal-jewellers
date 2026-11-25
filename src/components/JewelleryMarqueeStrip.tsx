"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ROW_TOP = [
  { src: "/images/raw/prod_845_main.jpg", alt: "22K Rose Gold Ring" },
  { src: "/images/raw/Downloader-3.png", alt: "Antique Temple Chandbali Jhumkas" },
  { src: "/images/raw/ar-3.png", alt: "Diamond-Studded Gold Bangles" },
  { src: "/images/raw/Downloader-2.png", alt: "Gemstone Halo Gold Ring" },
  { src: "/images/raw/ar-1.png", alt: "Gold Herringbone Chain" },
  { src: "/images/raw/prod_845_main.jpg", alt: "22K Rose Gold Ring detail" },
];

const ROW_BOTTOM = [
  { src: "/images/raw/ar-4.png", alt: "Sculpted Floral Diamond Earrings" },
  { src: "/images/raw/ar-2.png", alt: "Rose Gold Couple Bands" },
  { src: "/images/raw/Downloader-4.png", alt: "Engraved Gold Bangles" },
  { src: "/images/raw/dl.png", alt: "Floral Gold Pendant Necklace" },
  { src: "/images/raw/dl4.png", alt: "Men's Gold Figaro Bracelet" },
  { src: "/images/raw/ar-4.png", alt: "Sculpted Floral Diamond Earrings detail" },
];

/**
 * Animation #6: 3D Portfolio-inspired twin opposite-direction scroll-scrubbed photo rows.
 * Row 1 glides RIGHT, Row 2 glides LEFT in lockstep with vertical scroll.
 */
export function JewelleryMarqueeStrip() {
  const wrapRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          row1Ref.current,
          { xPercent: -14 },
          {
            xPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          row2Ref.current,
          { xPercent: 4 },
          {
            xPercent: -16,
            ease: "none",
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  return (
    <section
      ref={wrapRef}
      aria-label="Showroom Craftsmanship Gallery Strip"
      className="overflow-hidden bg-obsidian py-16 text-ivory sm:py-24"
    >
      <div className="space-y-4">
        <div ref={row1Ref} className="flex w-max gap-4 will-change-transform">
          {ROW_TOP.map((item, i) => (
            <div
              key={i}
              className="h-44 w-64 shrink-0 overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal sm:h-56 sm:w-80"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div ref={row2Ref} className="flex w-max gap-4 will-change-transform">
          {ROW_BOTTOM.map((item, i) => (
            <div
              key={i}
              className="h-44 w-64 shrink-0 overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal sm:h-56 sm:w-80"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
