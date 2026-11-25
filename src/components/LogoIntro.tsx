"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";

export function LogoIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("nj_intro_seen");
    if (reduced || seen) {
      setVisible(false);
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      "#nj-intro-mark",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
    )
      .fromTo(
        "#nj-intro-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
        "-=0.3"
      )
      .fromTo(
        "#nj-intro-tag",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.25"
      )
      .to("#nj-intro-shell", {
        opacity: 0,
        yPercent: -5,
        duration: 0.7,
        delay: 0.45,
        ease: "power3.inOut",
        onComplete: () => {
          sessionStorage.setItem("nj_intro_seen", "1");
          setVisible(false);
        },
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="nj-intro-shell"
      role="dialog"
      aria-label="Nandlal Jewellers welcome screen"
      className="fixed inset-0 z-[900] flex flex-col items-center justify-center gap-4 bg-ivory"
    >
      <img
        id="nj-intro-mark"
        src="/images/raw/nand-jew1.png"
        alt="Nandlal Jewellers"
        className="h-auto w-36"
      />
      <div id="nj-intro-rule" className="h-px w-14 bg-antique-gold/70" />
      <p
        id="nj-intro-tag"
        className="font-mono text-[10px] uppercase tracking-[0.24em] text-bronze"
      >
        Kolkata · Est. 6 October 2015
      </p>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem("nj_intro_seen", "1");
          setVisible(false);
        }}
        className="absolute bottom-8 right-8 rounded-full border border-obsidian/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-obsidian/70 transition-opacity hover:opacity-100"
      >
        Skip Intro
      </button>
    </div>
  );
}
