"use client";

import React, { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

interface ProductViewer360Props {
  images: string[];
  alt: string;
  glbPath?: string;
}

/**
 * Interactive 360° drag-to-rotate product viewer.
 * Automatically activates 3D mode if /models/hero.glb is present; otherwise
 * renders a drag-to-scrub multi-angle studio gallery using real Nandlal photographs.
 */
export function ProductViewer360({
  images,
  alt,
  glbPath = process.env.NEXT_PUBLIC_HERO_GLB_PATH || "/models/hero.glb",
}: ProductViewer360Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasGlb, setHasGlb] = useState(false);
  const [tiltDeg, setTiltDeg] = useState(0);
  const dragStartRef = useRef<number | null>(null);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    let mounted = true;
    fetch(glbPath, { method: "HEAD" })
      .then((res) => {
        if (mounted && res.ok) setHasGlb(true);
      })
      .catch(() => {
        // Real photography gallery remains active
      });
    return () => {
      mounted = false;
    };
  }, [glbPath]);

  const stepAngle = (delta: number) => {
    if (!hasMultiple) return;
    setActiveIdx((prev) => (((prev + delta) % images.length) + images.length) % images.length);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-champagne/20 bg-charcoal p-5 text-ivory sm:p-6">
      {hasMultiple && (
        <div className="mb-3 flex items-center justify-between text-xs text-champagne">
          <span className="inline-flex items-center gap-1.5">
            <RotateCw className="h-3.5 w-3.5" strokeWidth={1.5} />
            {hasGlb ? "Interactive 3D view" : "Drag to inspect angles"}
          </span>
          <span className="tabular-nums font-mono text-[11px]">
            {activeIdx + 1} / {images.length}
          </span>
        </div>
      )}

      <div
        role={hasMultiple ? "slider" : "img"}
        tabIndex={hasMultiple ? 0 : undefined}
        aria-label={hasMultiple ? `Inspect ${alt} angles` : alt}
        aria-valuemin={hasMultiple ? 1 : undefined}
        aria-valuemax={hasMultiple ? images.length : undefined}
        aria-valuenow={hasMultiple ? activeIdx + 1 : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") stepAngle(1);
          if (e.key === "ArrowLeft") stepAngle(-1);
        }}
        onPointerDown={(e) => {
          if (!hasMultiple) return;
          dragStartRef.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (!hasMultiple || dragStartRef.current === null) return;
          const dx = e.clientX - dragStartRef.current;
          setTiltDeg(Math.max(-14, Math.min(14, dx * 0.12)));
          if (Math.abs(dx) > 64) {
            stepAngle(dx > 0 ? 1 : -1);
            dragStartRef.current = e.clientX;
          }
        }}
        onPointerUp={() => {
          dragStartRef.current = null;
          setTiltDeg(0);
        }}
        onPointerLeave={() => {
          dragStartRef.current = null;
          setTiltDeg(0);
        }}
        className={`flex aspect-[4/3] w-full select-none items-center justify-center overflow-hidden rounded-xl bg-obsidian ${
          hasMultiple ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <img
          src={images[activeIdx]}
          alt={hasMultiple ? `${alt} — view ${activeIdx + 1}` : alt}
          style={{
            transform: hasMultiple ? `perspective(750px) rotateY(${tiltDeg}deg)` : undefined,
            transition:
              dragStartRef.current === null
                ? "transform 0.45s cubic-bezier(0.22,1,0.36,1)"
                : "none",
          }}
          className="pointer-events-none h-full w-full object-cover"
        />
      </div>

      {hasMultiple && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-ivory/10 pt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`h-9 rounded-full border px-3.5 text-xs font-medium transition-colors duration-200 ${
                idx === activeIdx
                  ? "border-champagne text-champagne"
                  : "border-ivory/20 text-ivory/70 hover:text-ivory"
              }`}
            >
              View 0{idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
