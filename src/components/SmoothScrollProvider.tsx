"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/context/StoreContext";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const {
    cartOpen,
    wishlistOpen,
    authOpen,
    searchOpen,
    customOrderOpen,
    askPriceProduct,
    quickViewProduct,
  } = useStore();

  const lenisRef = useRef<Lenis | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const anyModalOpen =
    cartOpen ||
    wishlistOpen ||
    authOpen ||
    searchOpen ||
    customOrderOpen ||
    Boolean(askPriceProduct) ||
    Boolean(quickViewProduct);

  // Stop Lenis cleanly whenever a blocking modal or drawer is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (anyModalOpen) lenis.stop();
    else lenis.start();
  }, [anyModalOpen]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarseTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    // Keep touch scrolling native on mobile so Android scrolling feels immediate and never laggy
    let tick: ((time: number) => void) | null = null;
    if (!isCoarseTouch) {
      const lenis = new Lenis({ autoRaf: false, anchors: true, duration: 1.15 });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // Soft custom cursor on desktop fine pointers only
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let cursorRaf = 0;
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = "1";
      }
    };

    if (finePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
      const loopCursor = () => {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        }
        cursorRaf = requestAnimationFrame(loopCursor);
      };
      cursorRaf = requestAnimationFrame(loopCursor);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      if (tick) gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      if (finePointer) {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(cursorRaf);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3.5px] -mt-[3.5px] hidden h-[7px] w-[7px] rounded-full bg-antique-gold opacity-0 transition-opacity duration-300 md:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] -ml-[17px] -mt-[17px] hidden h-[34px] w-[34px] rounded-full border border-antique-gold/50 opacity-0 transition-opacity duration-300 md:block"
      />
      {children}
    </>
  );
}
