"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { VERIFIED_CATEGORIES } from "@/lib/catalog";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EDITORIAL_CHAPTERS = [
  {
    name: "Rings",
    meta: "22K Gold, Engagement, Couple, Navratan",
    image: "/images/raw/prod_845_main.jpg",
    note: "Featuring the 22K Rose Gold Criss-Cross Ring (SKU FA7BDH, ₹63,785).",
  },
  {
    name: "Earrings",
    meta: "Studs, Jhumkas, Chandbali, Sui Dhaaga",
    image: "/images/raw/Downloader-3.png",
    note: "Antique temple chandbali jhumkas and sculpted diamond drops.",
  },
  {
    name: "Bangles & Bracelets",
    meta: "Gold Bangles, Diamond Bangles, Mangalsutra Bracelets",
    image: "/images/raw/ar-3.png",
    note: "Engraved gold bangles and diamond-studded wristwear.",
  },
  {
    name: "Necklaces & Pendants",
    meta: "Gold Chains, Floral Pendants, Mangalsutras",
    image: "/images/raw/dl.png",
    note: "Everyday and festive pendants crafted in hallmarked gold.",
  },
  {
    name: "Chains & Men's Wear",
    meta: "Herringbone Chains, Figaro Bracelets",
    image: "/images/raw/ar-1.png",
    note: "Classic gold chains and bracelets from our Burrabazar showroom.",
  },
];

/**
 * Animation #7: Neo Museum-inspired rounded-top obsidian curtain + scroll-synced
 * and tappable exhibition gallery with cross-blur/scale piece transitions.
 */
export function CollectionsEditorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const manualOverrideRef = useRef(false);
  const [active, setActive] = useState(0);
  const current = EDITORIAL_CHAPTERS[active];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Curtain heading rise
        gsap.fromTo(
          ".nj-exhibit-rise",
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );

        // Scroll-synced chapter progression (user tap overrides cleanly)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 35%",
          end: "bottom 65%",
          onUpdate: (self) => {
            if (manualOverrideRef.current) return;
            const nextIdx = Math.min(
              EDITORIAL_CHAPTERS.length - 1,
              Math.floor(self.progress * EDITORIAL_CHAPTERS.length)
            );
            setActive(nextIdx);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const selectChapter = (idx: number) => {
    manualOverrideRef.current = true;
    setActive(idx);
  };

  return (
    <section
      ref={sectionRef}
      id="collections"
      aria-label="Jewellery Exhibition"
      className="relative z-[12] -mt-8 rounded-t-[32px] border-t border-champagne/20 bg-obsidian px-6 py-24 text-ivory sm:rounded-t-[48px] lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="nj-exhibit-rise max-w-xl">
            <p className="mb-3 text-sm font-medium text-champagne">Exhibition gallery</p>
            <h2 className="font-serif text-4xl font-normal leading-tight md:text-5xl">
              Five featured galleries across eleven showroom categories
            </h2>
          </div>
          <p className="nj-exhibit-rise max-w-md text-sm leading-relaxed text-ivory/75">
            Scroll or tap any discipline below to inspect pieces from our Burrabazar showroom. Chains, pendants, coins & bars, idols, silver items, and kids items are also available on enquiry.
          </p>
        </div>

        {/* Neo Museum Split Exhibition Panel */}
        <div className="grid items-center gap-10 border-t border-ivory/15 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="overflow-hidden rounded-2xl border border-ivory/15 bg-charcoal p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-obsidian">
              {EDITORIAL_CHAPTERS.map((chap, idx) => (
                <img
                  key={chap.name}
                  src={chap.image}
                  alt={`Nandlal Jewellers ${chap.name}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    idx === active
                      ? "scale-100 opacity-100 blur-0"
                      : "pointer-events-none scale-[1.04] opacity-0 blur-[3px]"
                  }`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 px-1">
              <p className="text-sm text-ivory/80">{current.note}</p>
              <span className="tabular-nums shrink-0 font-mono text-xs text-champagne">
                0{active + 1} / 0{EDITORIAL_CHAPTERS.length}
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <ul className="divide-y divide-ivory/15 border-b border-ivory/15">
              {EDITORIAL_CHAPTERS.map((chap, idx) => (
                <li key={chap.name}>
                  <button
                    type="button"
                    onMouseEnter={() => selectChapter(idx)}
                    onFocus={() => selectChapter(idx)}
                    onClick={() => selectChapter(idx)}
                    className={`flex min-h-[68px] w-full items-center justify-between py-4 text-left transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      idx === active
                        ? "translate-x-2 text-ivory"
                        : "text-ivory/50 hover:translate-x-1 hover:text-ivory/85"
                    }`}
                  >
                    <div>
                      <span className="block font-serif text-2xl sm:text-3xl">{chap.name}</span>
                      <span className="mt-1 block text-xs text-ivory/60">{chap.meta}</span>
                    </div>
                    <ArrowUpRight
                      className={`h-5 w-5 shrink-0 transition-[opacity,transform] duration-300 ${
                        idx === active
                          ? "translate-x-0 text-champagne opacity-100"
                          : "-translate-x-2 opacity-0"
                      }`}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              {VERIFIED_CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="rounded-lg border border-ivory/15 px-3 py-1.5 text-xs text-ivory/75"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
