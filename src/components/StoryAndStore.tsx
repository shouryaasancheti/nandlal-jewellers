"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { STORE_INFO } from "@/lib/catalog";
import { submitContactEnquiry } from "@/lib/laravel-adapter";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Animation #10: Story masked reveal + Burrabazar showroom scroll-scrubbed scale unveil.
 */
export function StoryAndStore() {
  const storyRef = useRef<HTMLElement>(null);
  const storeRef = useRef<HTMLElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "ok"; text: string } | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".nj-story-rise",
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 78%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          ".nj-store-photo",
          { scale: 1.1 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: storeRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          ".nj-store-rise",
          { y: 52, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storeRef.current,
              start: "top 78%",
              once: true,
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: storyRef }
  );

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!name.trim() || !/^\d{10}$/.test(phone.trim()) || message.trim().length < 6) {
      setStatus({
        type: "error",
        text: "Enter your full name, a 10-digit mobile number, and a brief message.",
      });
      return;
    }
    setSubmitting(true);
    const res = await submitContactEnquiry({
      name,
      email,
      phone,
      address: "",
      city,
      message,
    });
    setSubmitting(false);
    setStatus({
      type: res.ok ? "ok" : "error",
      text: res.ok
        ? `${res.data?.referenceId} — ${res.placeholderNotice || "Enquiry received."}`
        : res.error || "Unable to send message.",
    });
    if (res.ok) {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }
  };

  return (
    <div ref={storyRef as unknown as React.RefObject<HTMLDivElement>}>
      {/* Our Story (Ivory Editorial Band) */}
      <section
        id="story"
        aria-label="Our Story"
        className="bg-ivory px-6 py-24 text-obsidian lg:px-12 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="nj-story-rise">
            <p className="mb-3 text-sm font-medium text-antique-gold">
              Established {STORE_INFO.establishedDate}
            </p>
            <h2 className="font-serif text-4xl font-normal leading-tight md:text-5xl">
              {STORE_INFO.aboutHeadline}
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="/images/raw/Logo21.png"
                alt="GNJ Nandlal Jewellers Emblem"
                className="h-14 w-auto"
              />
              <div className="text-xs leading-relaxed text-bronze">
                {STORE_INFO.legalEntity}
                <br />
                Burrabazar, Kolkata
              </div>
            </div>
          </div>

          <div className="nj-story-rise space-y-5 border-l border-obsidian/15 pl-6 md:pl-10">
            <p className="font-serif text-2xl leading-relaxed text-obsidian">
              &ldquo;{STORE_INFO.aboutShort}&rdquo;
            </p>
            <p className="text-base leading-relaxed text-obsidian/75">{STORE_INFO.aboutFull}</p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-antique-gold">
              <span className="rounded-lg border border-antique-gold/30 px-3 py-1.5">BIS Hallmark</span>
              <span className="rounded-lg border border-antique-gold/30 px-3 py-1.5">100% Certified</span>
              <span className="rounded-lg border border-antique-gold/30 px-3 py-1.5">Lifetime exchange</span>
              <span className="rounded-lg border border-antique-gold/30 px-3 py-1.5">7-day Kolkata exchange</span>
            </div>
          </div>
        </div>
      </section>

      {/* Store Experience & Contact (Obsidian Band) */}
      <section
        ref={storeRef}
        id="store"
        aria-label="Burrabazar Showroom Experience"
        className="border-t border-champagne/15 bg-obsidian px-6 py-24 text-ivory lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="nj-store-rise mb-12">
            <p className="mb-2 text-sm font-medium text-champagne">Burrabazar showroom</p>
            <h2 className="font-serif text-4xl font-normal md:text-5xl">
              Visit Nandlal Jewellers in Kolkata
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="nj-store-rise space-y-6">
              <div className="overflow-hidden rounded-2xl border border-ivory/15 bg-charcoal p-3">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/images/raw/store.png"
                    alt="Nandlal Jewellers Showroom at 43 Sir Hari Ram Goenka Street, Burrabazar, Kolkata"
                    className="nj-store-photo h-64 w-full object-cover will-change-transform sm:h-72"
                  />
                </div>
                <div className="space-y-3 px-3 pb-3 pt-5 text-sm text-ivory/85">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
                    <span>{STORE_INFO.addressPrimary}</span>
                  </p>
                  <p className="tabular-nums flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
                    <span>
                      <a href="tel:+919830026688" className="hover:text-champagne">9830026688</a>
                      {" · "}
                      <a href="tel:03346041858" className="hover:text-champagne">033-46041858</a>
                    </span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-champagne" strokeWidth={1.5} />
                    <span>{STORE_INFO.hours}</span>
                  </p>
                  <div className="pt-2">
                    <a
                      href={STORE_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-champagne px-6 text-xs font-semibold text-obsidian transition-opacity duration-200 hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                      <span>Message on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-ivory/15">
                <iframe
                  title="Nandlal Jewellers Burrabazar Kolkata Map"
                  src="https://www.google.com/maps?q=43,+Sir+Hari+Ram+Goenka+St,+Burrabazar,+Kolkata,+West+Bengal+700007&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-60 w-full border-0"
                />
              </div>
            </div>

            <div className="nj-store-rise rounded-2xl border border-ivory/15 bg-charcoal p-7 sm:p-9">
              <p className="text-sm font-medium text-champagne">Private consultation</p>
              <h3 className="mt-2 font-serif text-3xl">Write to our showroom</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">
                Book a private viewing, check today&apos;s gold rate, or plan a custom jewellery order.
              </p>

              {status && (
                <div
                  role={status.type === "error" ? "alert" : "status"}
                  className={`mt-5 rounded-xl border p-3.5 text-xs ${
                    status.type === "error"
                      ? "border-red-400/40 bg-red-950/40 text-red-200"
                      : "border-champagne/40 bg-obsidian text-champagne"
                  }`}
                >
                  {status.text}
                </div>
              )}

              <form onSubmit={handleContact} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs text-ivory/80">
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-ivory/20 bg-obsidian px-4 text-sm text-ivory"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-xs text-ivory/80">
                      Email address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-xl border border-ivory/20 bg-obsidian px-4 text-sm text-ivory"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-1.5 block text-xs text-ivory/80">
                      10-digit mobile number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 w-full rounded-xl border border-ivory/20 bg-obsidian px-4 text-sm text-ivory"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-city" className="mb-1.5 block text-xs text-ivory/80">
                    City
                  </label>
                  <input
                    id="contact-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12 w-full rounded-xl border border-ivory/20 bg-obsidian px-4 text-sm text-ivory"
                  />
                </div>
                <div>
                  <label htmlFor="contact-msg" className="mb-1.5 block text-xs text-ivory/80">
                    Message
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-ivory/20 bg-obsidian p-4 text-sm text-ivory"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-full bg-champagne text-sm font-semibold text-obsidian transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Sending enquiry..." : "Send enquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
