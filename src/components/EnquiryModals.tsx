"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Upload, X } from "lucide-react";
import { CATALOG_PRODUCTS } from "@/lib/catalog";
import { submitAskPrice, submitCustomOrder } from "@/lib/laravel-adapter";
import { useStore } from "@/context/StoreContext";

export function EnquiryModals() {
  const {
    searchOpen,
    setSearchOpen,
    quickViewProduct,
    setQuickViewProduct,
    askPriceProduct,
    setAskPriceProduct,
    customOrderOpen,
    setCustomOrderOpen,
    addToCart,
    showToast,
  } = useStore();

  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cityOrAddr, setCityOrAddr] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const resetForm = () => {
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(false);
  };

  const searchMatches = CATALOG_PRODUCTS.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (!p.sku.startsWith("PLACEHOLDER") && p.sku.toLowerCase().includes(q)) ||
      p.metal.toLowerCase().includes(q)
    );
  });

  const handleAskPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !/^\d{10}$/.test(phone.trim())) {
      setFormError("Please enter your full name and a 10-digit mobile number.");
      return;
    }
    setSubmitting(true);
    const res = await submitAskPrice({
      productId: askPriceProduct?.id,
      name,
      email,
      phone,
      city: cityOrAddr,
      requirements: notes,
    });
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error || "Unable to submit price enquiry.");
      return;
    }
    setFormSuccess(
      `Thank you. Your quotation request (${res.data?.referenceId}) has been received by our Kolkata showroom team.`
    );
    showToast("Quotation request received.");
  };

  const handleCustomOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !/^\d{10}$/.test(phone.trim()) || notes.trim().length < 10) {
      setFormError(
        "Provide your name, 10-digit phone number, and a brief description of your custom jewellery piece."
      );
      return;
    }
    setSubmitting(true);
    const res = await submitCustomOrder({
      name,
      email,
      phone,
      address: cityOrAddr,
      requirements: notes,
      referenceImageName: fileName,
    });
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error || "Unable to submit custom order.");
      return;
    }
    setFormSuccess(
      `Thank you. Your custom order request (${res.data?.referenceId}) has been received by our Burrabazar showroom team.`
    );
    showToast("Custom order request submitted.");
  };

  return (
    <>
      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[450] flex items-start justify-center bg-obsidian/65 p-4 pt-20 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Nandlal Jewellers"
            className="w-full max-w-2xl rounded-2xl border border-obsidian/15 bg-ivory p-6 text-obsidian shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-obsidian/15 pb-4">
              <Search className="h-4 w-4 text-bronze" strokeWidth={1.75} />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rings, earrings, bangles, gold, or SKU..."
                className="flex-1 bg-transparent text-sm text-obsidian outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="grid h-10 w-10 place-items-center rounded-full border border-obsidian/15"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto">
              {searchMatches.length === 0 ? (
                <p className="py-10 text-center text-sm text-obsidian/65">
                  No matching pieces found for &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <ul className="divide-y divide-obsidian/10">
                  {searchMatches.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-cream/70"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-serif text-lg">{item.name}</p>
                          <p className="text-xs text-bronze">
                            {item.category}, {item.metal}
                          </p>
                        </div>
                        <span className="tabular-nums text-xs font-semibold">
                          {item.priceInr !== null
                            ? `₹${item.priceInr.toLocaleString("en-IN")}`
                            : "Ask for price"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[450] grid place-items-center bg-obsidian/65 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view ${quickViewProduct.name}`}
            className="grid w-full max-w-2xl overflow-hidden rounded-2xl bg-ivory text-obsidian shadow-2xl sm:grid-cols-2"
          >
            <div className="bg-mist">
              <img
                src={quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-antique-gold">
                    {quickViewProduct.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    aria-label="Close quick view"
                    className="grid h-10 w-10 place-items-center rounded-full border border-obsidian/15"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
                <h3 className="mt-2 font-serif text-3xl">{quickViewProduct.name}</h3>
                <p className="mt-1 text-xs text-bronze">
                  {quickViewProduct.metal}
                  {quickViewProduct.purity !== "Ask for purity" ? `, ${quickViewProduct.purity}` : ""}
                </p>
                <p className="tabular-nums mt-3 text-lg font-semibold">
                  {quickViewProduct.priceInr !== null
                    ? `₹${quickViewProduct.priceInr.toLocaleString("en-IN")}`
                    : "Ask for price"}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-obsidian/70">
                  Crafted with BIS hallmark standards and available at our Burrabazar, Kolkata showroom.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const p = quickViewProduct;
                    setQuickViewProduct(null);
                    if (p.priceInr !== null) addToCart(p);
                    else setAskPriceProduct(p);
                  }}
                  className="h-11 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory"
                >
                  {quickViewProduct.priceInr !== null ? "Add to bag" : "Ask for price"}
                </button>
                <Link
                  href={`/product/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="flex h-11 w-full items-center justify-center rounded-full border border-obsidian/20 text-xs font-medium"
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ask For Price Modal */}
      {askPriceProduct && (
        <div className="fixed inset-0 z-[450] grid place-items-center bg-obsidian/65 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ask for Price"
            className="w-full max-w-md rounded-2xl bg-ivory p-7 text-obsidian shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-antique-gold">Showroom quotation</p>
                <h2 className="font-serif text-3xl">Ask for price</h2>
                <p className="text-xs text-bronze">{askPriceProduct.name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setAskPriceProduct(null);
                }}
                aria-label="Close Ask for Price"
                className="grid h-10 w-10 place-items-center rounded-full border border-obsidian/15"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            {formError && (
              <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-xs text-red-900">
                {formError}
              </p>
            )}
            {formSuccess ? (
              <div className="space-y-4">
                <p className="rounded-xl border border-antique-gold/40 bg-cream p-4 text-xs leading-relaxed">
                  {formSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setAskPriceProduct(null);
                  }}
                  className="h-11 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleAskPrice} className="space-y-3">
                <input type="text" required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <input type="tel" required placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <input type="text" required placeholder="City (e.g. Kolkata)" value={cityOrAddr} onChange={(e) => setCityOrAddr(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <textarea rows={3} placeholder="Preferred karat, ring size, or delivery timeline..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-obsidian/20 bg-white p-3.5 text-sm" />
                <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory disabled:opacity-50">
                  {submitting ? "Submitting..." : "Request quotation"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Custom Order Modal */}
      {customOrderOpen && (
        <div className="fixed inset-0 z-[450] grid place-items-center bg-obsidian/65 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Custom Jewellery Order"
            className="w-full max-w-md rounded-2xl bg-ivory p-7 text-obsidian shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-antique-gold">Custom jewellery order</p>
                <h2 className="font-serif text-3xl">Custom jewellery order</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setCustomOrderOpen(false);
                }}
                aria-label="Close Custom Order"
                className="grid h-10 w-10 place-items-center rounded-full border border-obsidian/15"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            {formError && (
              <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-xs text-red-900">
                {formError}
              </p>
            )}
            {formSuccess ? (
              <div className="space-y-4">
                <p className="rounded-xl border border-antique-gold/40 bg-cream p-4 text-xs leading-relaxed">
                  {formSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setCustomOrderOpen(false);
                  }}
                  className="h-11 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomOrder} className="space-y-3">
                <input type="text" required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <input type="tel" required placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <input type="text" required placeholder="Full address" value={cityOrAddr} onChange={(e) => setCityOrAddr(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
                <label className="flex h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-obsidian/25 bg-cream/60 px-3.5 text-xs">
                  <Upload className="h-4 w-4 text-antique-gold" strokeWidth={1.5} />
                  <span>{fileName ? `Reference: ${fileName}` : "Upload reference photo (optional)"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name)}
                  />
                </label>
                <textarea rows={3} required placeholder="Describe metal purity, weight target, stones, and occasion..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-obsidian/20 bg-white p-3.5 text-sm" />
                <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit custom order request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
