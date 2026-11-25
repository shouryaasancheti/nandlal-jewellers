"use client";

import React, { useEffect, useState } from "react";
import { STORE_INFO } from "@/lib/catalog";

interface RatePayload {
  gold24k: number;
  silver999: number;
  live: boolean;
  asOf: string;
}

interface LiveRateTickerProps {
  variant?: "hero" | "footer";
}

export function LiveRateTicker({ variant = "hero" }: LiveRateTickerProps) {
  const [rate, setRate] = useState<RatePayload>({
    gold24k: STORE_INFO.liveRates.gold24kPerGramInr,
    silver999: STORE_INFO.liveRates.silver999PerGramInr,
    live: false,
    asOf: "24 Nov 2026, 9:05 pm IST",
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/rates")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: RatePayload | null) => {
        if (mounted && data && typeof data.gold24k === "number") {
          setRate(data);
        }
      })
      .catch(() => {
        // Keep timestamped fallback
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (variant === "footer") {
    return (
      <div className="mt-3 space-y-1">
        <p className="tabular-nums font-mono text-xs text-champagne">
          24K Gold ₹{rate.gold24k.toLocaleString("en-IN")}/g &nbsp;|&nbsp; 999 Silver ₹
          {rate.silver999.toLocaleString("en-IN")}/g
        </p>
        <p className="text-[11px] text-ivory/60">
          {rate.live ? "Live from nandlaljewellers.com · " : "Rate "}as of {rate.asOf}
        </p>
      </div>
    );
  }

  return (
    <div className="tabular-nums hidden text-right font-mono text-[11px] leading-relaxed text-bronze sm:block">
      <span>
        24K Gold ₹{rate.gold24k.toLocaleString("en-IN")}/g · 999 Silver ₹
        {rate.silver999.toLocaleString("en-IN")}/g
      </span>
      <br />
      <span className="text-[10px] opacity-80">
        {rate.live ? "Live · " : ""}as of {rate.asOf}
      </span>
    </div>
  );
}
