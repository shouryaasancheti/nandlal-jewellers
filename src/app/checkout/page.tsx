"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const INDIAN_STATES = [
  "WEST BENGAL",
  "DELHI",
  "MAHARASHTRA",
  "KARNATAKA",
  "TAMIL NADU",
  "GUJARAT",
  "RAJASTHAN",
  "UTTAR PRADESH",
  "BIHAR",
  "JHARKHAND",
  "ASSAM",
  "ODISHA",
  "TELANGANA",
  "KERALA",
  "PUNJAB",
];

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("WEST BENGAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ orderId: string } | null>(null);

  const total = cart.reduce((s, i) => s + (i.product.priceInr ?? 0) * i.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !/^\d{10}$/.test(phone.trim()) || !/^\d{6}$/.test(pincode.trim())) {
      setError("Enter full name, 10-digit mobile number, and a valid 6-digit Indian pincode.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Unable to initialize checkout. Please try again.");
        return;
      }
      setResult({
        orderId: json.data?.orderId || `NJ-${Date.now()}`,
      });
      clearCart();
    } catch {
      setError("Could not reach checkout right now. Please try again or contact our showroom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory px-6 pb-24 pt-28 text-obsidian lg:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-antique-gold">Secure checkout</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Complete your order</h1>

        {result ? (
          <div className="mt-10 rounded-2xl border border-antique-gold/40 bg-cream p-8">
            <p className="text-xs font-medium text-antique-gold">Order request received</p>
            <h2 className="mt-2 font-serif text-3xl">Reference: {result.orderId}</h2>
            <p className="mt-3 text-sm text-obsidian/75">
              Our Burrabazar showroom concierge will confirm availability and share your Razorpay payment link shortly.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-12 items-center rounded-full bg-obsidian px-6 text-xs font-semibold text-ivory"
            >
              Return to showroom
            </Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-obsidian/10 bg-cream/60 p-10 text-center">
            <p className="font-serif text-2xl">Your bag is currently empty.</p>
            <Link
              href="/#showcase"
              className="mt-4 inline-flex h-12 items-center rounded-full bg-obsidian px-6 text-xs font-semibold text-ivory"
            >
              Browse jewellery
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <form onSubmit={handleCheckout} className="space-y-4 rounded-2xl border border-obsidian/10 bg-cream/55 p-7">
              <h2 className="font-serif text-2xl">Delivery address</h2>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-900">{error}</p>}
              <input type="text" required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-obsidian/20 bg-white px-4 text-sm" />
              <input type="tel" required placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 w-full rounded-xl border border-obsidian/20 bg-white px-4 text-sm" />
              <textarea rows={2} required placeholder="Full street address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-obsidian/20 bg-white p-4 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-12 rounded-xl border border-obsidian/20 bg-white px-4 text-sm" />
                <input type="text" required placeholder="6-digit pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="h-12 rounded-xl border border-obsidian/20 bg-white px-4 text-sm" />
              </div>
              <select value={state} onChange={(e) => setState(e.target.value)} className="h-12 w-full rounded-xl border border-obsidian/20 bg-white px-4 text-sm">
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <div className="rounded-xl border border-antique-gold/30 bg-ivory p-4 text-xs text-obsidian/80">
                <p className="font-semibold text-antique-gold">Razorpay Checkout</p>
                <p className="mt-1">
                  Accepts Visa, Mastercard, Maestro, RuPay, and UPI. Totals are verified server-side.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-full bg-obsidian text-sm font-semibold text-ivory disabled:opacity-50"
              >
                {loading ? "Processing..." : `Continue to pay ₹${total.toLocaleString("en-IN")}`}
              </button>
            </form>

            <aside className="rounded-2xl border border-obsidian/10 bg-cream/55 p-7">
              <h2 className="font-serif text-2xl">Order summary</h2>
              <ul className="mt-4 space-y-3 border-b border-obsidian/10 pb-4">
                {cart.map(({ product, quantity }) => (
                  <li key={product.id} className="flex justify-between text-sm">
                    <span>
                      {product.name} × {quantity}
                    </span>
                    <span className="tabular-nums font-mono">
                      ₹{((product.priceInr ?? 0) * quantity).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between text-base font-semibold">
                <span>Total (incl. GST)</span>
                <span className="tabular-nums font-mono">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-obsidian/65">
                <ShieldCheck className="h-4 w-4 text-antique-gold" strokeWidth={1.5} />
                BIS Hallmarked · Insured delivery · 7-day Kolkata exchange
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
