"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATEMENT =
  "Every ornament crafted in our Burrabazar showroom passes thorough purity checks, BIS hallmarking, and independent certification before it ever reaches your hands.";

export function TaglineReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const words = STATEMENT.split(" ");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nj-reveal-word",
        { opacity: 0.24 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Craftsmanship Standard"
      className="border-t border-obsidian/10 bg-ivory px-6 py-24 text-obsidian sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-[780px]">
        <p className="font-serif text-3xl leading-[1.32] sm:text-4xl lg:text-5xl lg:leading-[1.24]">
          {words.map((word, idx) => (
            <span
              key={idx}
              className="nj-reveal-word mr-[0.26em] inline-block transition-opacity duration-300"
            >
              {word}
            </span>
          ))}
        </p>
        <p className="mt-8 text-sm text-bronze">
          GNJ NandLal Jewellers Private Limited, Kolkata — Established 6 October 2015
        </p>
      </div>
    </section>
  );
}
