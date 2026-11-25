"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STORE_INFO, VERIFIED_CATEGORIES } from "@/lib/catalog";
import { LiveRateTicker } from "./LiveRateTicker";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-champagne/20 bg-obsidian px-6 pb-14 pt-20 text-ivory lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 pb-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src="/images/raw/nand-jew1.png"
            alt="Nandlal Jewellers"
            className="h-9 w-auto rounded-md bg-ivory px-2.5 py-1"
          />
          <p className="mt-4 text-sm leading-relaxed text-ivory/80">
            {STORE_INFO.legalEntity}
            <br />
            Established {STORE_INFO.establishedDate}, Kolkata.
          </p>
          <LiveRateTicker variant="footer" />
        </div>

        <div>
          <h3 className="text-sm font-medium text-champagne">Categories</h3>
          <ul className="mt-4 grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm text-ivory/85">
            {VERIFIED_CATEGORIES.slice(0, 8).map((cat) => (
              <li key={cat}>
                <Link href="/#showcase" className="transition-colors duration-200 hover:text-champagne">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-champagne">Showroom &amp; policies</h3>
          <p className="mt-4 text-sm leading-relaxed text-ivory/80">{STORE_INFO.addressFooter}</p>
          <p className="tabular-nums mt-2 font-mono text-sm text-ivory">
            {STORE_INFO.phones.join(" · ")}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              <a
                href="https://nandlaljewellers.com/page/#return"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-champagne"
              >
                Return &amp; exchange policy
              </a>
            </li>
            <li>
              <a
                href="https://nandlaljewellers.com/page/#terms"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-champagne"
              >
                Terms &amp; conditions
              </a>
            </li>
            <li>
              <a
                href="https://nandlaljewellers.com/page/#privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-champagne"
              >
                Privacy policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-champagne">Private dispatches</h3>
          <p className="mt-4 text-sm leading-relaxed text-ivory/75">
            Receive showroom updates and new arrival notices from Kolkata.
          </p>
          {subscribed ? (
            <p className="mt-4 text-sm text-champagne">Thank you. Your email has been noted.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex items-center gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-11 min-w-0 flex-1 rounded-full border border-ivory/25 bg-charcoal px-4 text-sm text-ivory placeholder:text-ivory/50"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-champagne px-5 text-xs font-semibold text-obsidian transition-opacity duration-200 hover:opacity-90"
              >
                Join
              </button>
            </form>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-ivory/85">
            <a href={STORE_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
              Instagram
            </a>
            <a href={STORE_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
              Facebook
            </a>
            <a href={STORE_INFO.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
              YouTube
            </a>
            <a href={STORE_INFO.social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-ivory/15 pt-6 text-xs text-ivory/70 sm:flex-row">
        <p>© {new Date().getFullYear()} {STORE_INFO.legalEntity}. All rights reserved.</p>
        <p>Payments: Visa, Mastercard, Maestro, RuPay, Razorpay, UPI</p>
      </div>
    </footer>
  );
}
