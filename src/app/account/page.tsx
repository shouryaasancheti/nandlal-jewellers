"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function AccountPage() {
  const { user, setUser, setAuthOpen, wishlist, cart } = useStore();

  return (
    <main className="min-h-screen bg-ivory px-6 pb-24 pt-28 text-obsidian lg:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium text-antique-gold">Member account</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Your account</h1>

        {!user ? (
          <div className="mt-10 rounded-2xl border border-obsidian/10 bg-cream/60 p-10 text-center">
            <p className="font-serif text-2xl">Sign in to manage orders, addresses, and wishlist.</p>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="mt-5 h-12 rounded-full bg-obsidian px-7 text-xs font-semibold text-ivory"
            >
              Sign in with OTP
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-obsidian/10 bg-cream/60 p-6">
              <div>
                <h2 className="font-serif text-3xl">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="mt-1 text-xs text-bronze">
                  {user.email} · {user.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUser(null)}
                className="h-11 rounded-full border border-obsidian/20 px-5 text-xs font-medium hover:border-obsidian"
              >
                Sign out
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-obsidian/10 bg-cream/60 p-6">
                <h3 className="font-serif text-2xl">Order history</h3>
                <p className="mt-2 text-sm text-obsidian/65">
                  You have no recent online orders yet. Showroom purchases and online orders will appear here.
                </p>
              </div>
              <div className="rounded-2xl border border-obsidian/10 bg-cream/60 p-6">
                <h3 className="font-serif text-2xl">Saved items</h3>
                <p className="tabular-nums mt-2 text-sm text-bronze">
                  Wishlist: {wishlist.length} · Bag: {cart.reduce((s, i) => s + i.quantity, 0)}
                </p>
                <Link href="/#showcase" className="mt-4 inline-block text-sm font-medium underline">
                  Continue exploring
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
