"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { LiveRateTicker } from "./LiveRateTicker";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RING_FRAMES = [
  "/images/cutouts/hero_ring_main.webp",
  "/images/cutouts/hero_ring_angle2.webp",
  "/images/cutouts/hero_ring_angle3.webp",
];

const WORDMARK_LETTERS = ["N", "A", "N", "D", "L", "A", "L"];

export function HeroSection() {
  const runwayRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const ringTravelRef = useRef<HTMLDivElement>(null);
  const ringTiltRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);
  const topHeadlineRef = useRef<HTMLDivElement>(null);
  const frontHeadlineRef = useRef<HTMLDivElement>(null);

  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    const glbPath = process.env.NEXT_PUBLIC_HERO_GLB_PATH || "/models/hero.glb";
    fetch(glbPath, { method: "HEAD" }).catch(() => {
      // Multi-angle real photo sequence stays active
    });
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions || {};
          if (reduceMotion) return;

          gsap.fromTo(
            ".nj-wm-char",
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.05,
              stagger: 0.045,
              ease: "power3.out",
              delay: 0.12,
            }
          );

          gsap.fromTo(
            ".nj-split-word",
            { yPercent: 108, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.14,
              ease: "power3.out",
              delay: 0.28,
            }
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: runwayRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              onUpdate: (self) => {
                const idx = Math.min(
                  RING_FRAMES.length - 1,
                  Math.floor(self.progress * RING_FRAMES.length)
                );
                setFrameIdx(idx);
              },
            },
          });

          tl.fromTo(
            ringTravelRef.current,
            {
              xPercent: isMobile ? 16 : 22,
              yPercent: 0,
              scale: isMobile ? 0.96 : 0.94,
              rotation: 5,
            },
            {
              xPercent: isMobile ? -34 : -42,
              yPercent: -6,
              scale: isMobile ? 1.08 : 1.14,
              rotation: -9,
              ease: "none",
            },
            0
          )
            .fromTo(
              wordmarkRef.current,
              { xPercent: -6, opacity: 0.11 },
              { xPercent: 12, opacity: 0.04, ease: "none" },
              0
            )
            .to(
              topHeadlineRef.current,
              { xPercent: 10, yPercent: -14, opacity: 0.35, ease: "none" },
              0
            )
            .to(
              frontHeadlineRef.current,
              { xPercent: -14, yPercent: 12, opacity: 0.4, ease: "none" },
              0
            )
            .fromTo(
              shadowRef.current,
              { xPercent: isMobile ? 18 : 24, scaleX: 0.92, opacity: 0.28 },
              { xPercent: isMobile ? -30 : -38, scaleX: 1.28, opacity: 0.14, ease: "none" },
              0
            )
            .fromTo(
              glintRef.current,
              { xPercent: -120, opacity: 0 },
              { xPercent: 220, opacity: 0.65, ease: "none" },
              0
            );

          if (ringTiltRef.current) {
            const rxTo = gsap.quickTo(ringTiltRef.current, "rotationX", {
              duration: 0.45,
              ease: "power3.out",
            });
            const ryTo = gsap.quickTo(ringTiltRef.current, "rotationY", {
              duration: 0.45,
              ease: "power3.out",
            });

            const handlePointer = (clientX: number, clientY: number) => {
              const nx = (clientX / window.innerWidth - 0.5) * 2;
              const ny = (clientY / window.innerHeight - 0.5) * 2;
              rxTo(-ny * 9);
              ryTo(nx * 11);
            };

            const onMouse = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
            const onTouch = (e: TouchEvent) => {
              if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
            };
            const onReset = () => {
              rxTo(0);
              ryTo(0);
            };

            window.addEventListener("mousemove", onMouse, { passive: true });
            window.addEventListener("touchmove", onTouch, { passive: true });
            window.addEventListener("mouseleave", onReset);
            return () => {
              window.removeEventListener("mousemove", onMouse);
              window.removeEventListener("touchmove", onTouch);
              window.removeEventListener("mouseleave", onReset);
            };
          }
        }
      );

      return () => mm.revert();
    },
    { scope: runwayRef }
  );

  return (
    <section
      ref={runwayRef}
      id="hero"
      aria-label="Nandlal Jewellers Exhibition Hero"
      className="relative h-[165svh] w-full bg-ivory text-obsidian"
    >
      <div
        className="sticky top-0 flex h-[100svh] w-full flex-col justify-between overflow-hidden px-5 pb-7 pt-24 sm:px-8 lg:px-14"
        style={{ perspective: "1200px" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-20 bottom-6 hidden border-x border-obsidian/[0.05] lg:block lg:inset-x-14"
        />

        {/* Monumental N A N D L A L Wordmark */}
        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[14%] z-[1] flex select-none justify-between px-3 font-hero text-[15.5vw] font-extrabold leading-[0.82] tracking-[-0.04em] text-obsidian/[0.09] will-change-transform sm:top-[11%] sm:px-8"
        >
          {WORDMARK_LETTERS.map((ch, idx) => (
            <span key={idx} className="overflow-hidden">
              <span className="nj-wm-char inline-block">{ch}</span>
            </span>
          ))}
        </div>

        {/* Top Editorial Row */}
        <div className="relative z-[4] flex items-start justify-between gap-4">
          <span className="inline-flex items-center rounded-full border border-antique-gold/30 bg-antique-gold/10 px-3.5 py-1 text-[11px] font-medium text-antique-gold">
            Kolkata · Est. 6 October 2015
          </span>
          <LiveRateTicker variant="hero" />
        </div>

        {/* Center 3D Layered Stage — Pure Sculptural Jewellery (No Price/SKU Tag) */}
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div
            ref={topHeadlineRef}
            className="pointer-events-none relative z-[4] -mb-8 self-start will-change-transform sm:-mb-14 lg:ml-6"
          >
            <h1 className="font-hero text-[clamp(2.8rem,9vw,7.4rem)] font-bold leading-[0.92] tracking-[-0.045em] text-obsidian">
              <span className="block overflow-hidden pb-1">
                <span className="nj-split-word block">An heirloom</span>
              </span>
            </h1>
          </div>

          <div
            ref={ringTravelRef}
            className="relative z-[6] my-1 w-[min(560px,86vw)] will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={ringTiltRef}
              className="relative w-full will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link
                href="/product/gents-ring-fa7bdh"
                aria-label="Inspect Nandlal Jewellers 22K Rose Gold Ring"
                className="block"
              >
                <div className="relative aspect-[815/415] w-full overflow-visible">
                  {RING_FRAMES.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={
                        i === 0
                          ? "Nandlal Jewellers 22K Rose Gold Criss-Cross Ring"
                          : ""
                      }
                      aria-hidden={i !== frameIdx}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      className={`absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-200 ${
                        i === frameIdx ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light"
                  >
                    <div
                      ref={glintRef}
                      className="h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-ivory/90 to-transparent will-change-transform"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div
            ref={shadowRef}
            aria-hidden="true"
            className="pointer-events-none relative z-[3] -mt-2 h-6 w-[min(420px,66vw)] rounded-full bg-obsidian/20 blur-xl will-change-transform"
          />

          <div
            ref={frontHeadlineRef}
            className="pointer-events-none relative z-[8] -mt-5 self-end text-right will-change-transform sm:-mt-10 lg:mr-6"
          >
            <p className="font-serif text-[clamp(2.6rem,8.4vw,6.8rem)] font-normal leading-[0.95] tracking-[-0.02em] text-obsidian">
              <span className="block overflow-hidden pb-1">
                <span className="nj-split-word block">in the making.</span>
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Editorial Bar */}
        <div className="relative z-[9] flex flex-col items-start justify-between gap-4 border-t border-obsidian/10 pt-4 sm:flex-row sm:items-end">
          <p className="max-w-sm text-sm leading-relaxed text-obsidian/75">
            BIS-hallmarked 22K gold and certified diamonds crafted in Burrabazar, Kolkata. Scroll to inspect the piece in motion.
          </p>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
            <a
              href="#showcase"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-obsidian px-6 text-xs font-semibold text-ivory transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              <span>Explore collection</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <span className="tabular-nums font-mono text-[11px] text-bronze">
              Angle 0{frameIdx + 1} / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
