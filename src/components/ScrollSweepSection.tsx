"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Left-to-right scroll-scrubbed editorial exhibition plate featuring the untouched,
 * sharp real Nandlal diamond-studded gold bangles photograph (no rough cutout artifacts).
 */
export function ScrollSweepSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions || {};
          if (reduceMotion) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });

          tl.fromTo(
            plateRef.current,
            {
              xPercent: isMobile ? -22 : -36,
              rotation: -4,
              scale: 0.94,
            },
            {
              xPercent: isMobile ? 22 : 36,
              rotation: 4,
              scale: 1.04,
              ease: "none",
            },
            0
          )
            .fromTo(
              photoRef.current,
              { scale: 1.12 },
              { scale: 1.0, ease: "none" },
              0
            )
            .fromTo(
              ribbonRef.current,
              { xPercent: 18 },
              { xPercent: -18, ease: "none" },
              0
            );
        }
      );
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Handcrafted Diamond Gold Bangles Motion Study"
      className="relative overflow-hidden border-t border-obsidian/10 bg-ivory py-20 text-obsidian sm:py-28"
    >
      <div
        ref={ribbonRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-hero text-[12vw] font-bold tracking-[-0.04em] text-obsidian/[0.05] will-change-transform"
      >
        HALLMARKED 22K · BURRABAZAR · KOLKATA
      </div>

      <div className="relative z-[2] mx-auto flex max-w-6xl flex-col items-center px-6">
        <div
          ref={plateRef}
          className="w-[min(360px,82vw)] will-change-transform"
        >
          <Link
            href="/product/diamond-studded-gold-bangles"
            aria-label="Explore Diamond-Studded Gold Bangles"
            className="block overflow-hidden rounded-2xl border border-obsidian/15 bg-obsidian p-2 shadow-[0_28px_50px_rgba(12,11,10,0.18)]"
          >
            <div className="aspect-[440/366] overflow-hidden rounded-xl bg-charcoal">
              <img
                ref={photoRef}
                src="/images/raw/ar-3.png"
                alt="Nandlal Jewellers Diamond-Studded Gold Bangles"
                className="h-full w-full select-none object-cover will-change-transform"
              />
            </div>
          </Link>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-bronze">
          Diamond-studded gold bangles — crafted with care at Nandlal Jewellers, Kolkata
        </p>
      </div>
    </section>
  );
}
