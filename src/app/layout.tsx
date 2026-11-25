import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartWishlistDrawers } from "@/components/CartWishlistDrawers";
import { AuthOtpModal } from "@/components/AuthOtpModal";
import { EnquiryModals } from "@/components/EnquiryModals";
import { STORE_INFO } from "@/lib/catalog";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nandlal Jewellers — Kolkata · Est. 2015 | Fine 22K Gold & Certified Diamonds",
  description:
    "GNJ NandLal Jewellers Private Limited, Burrabazar, Kolkata (Est. 6 October 2015). BIS-hallmarked 22K gold, certified diamonds, rings, earrings, bangles, and custom jewellery.",
  openGraph: {
    title: "Nandlal Jewellers — An Heirloom in the Making",
    description: "Fine 22K gold & certified diamond jewellery from Burrabazar, Kolkata.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: STORE_INFO.brandName,
    legalName: STORE_INFO.legalEntity,
    foundingDate: "2015-10-06",
    url: "https://nandlaljewellers.com/",
    telephone: "+91-9830026688",
    address: {
      "@type": "PostalAddress",
      streetAddress: "43, Sir Hari Ram Goenka St, Shyam Shree Market, Burrabazar",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700007",
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 11:00-19:00",
    sameAs: [
      STORE_INFO.social.instagram,
      STORE_INFO.social.facebook,
      STORE_INFO.social.youtube,
    ],
  };

  return (
    <html
      lang="en"
      data-hero-theme="light"
      className={`${cormorant.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1200] focus:rounded-full focus:bg-obsidian focus:px-4 focus:py-2 focus:text-xs focus:text-ivory"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd).replace(/</g, "\\u003c") }}
        />
        <StoreProvider>
          <SmoothScrollProvider>
            <Navbar />
            <div id="main-content">{children}</div>
            <Footer />
            <CartWishlistDrawers />
            <AuthOtpModal />
            <EnquiryModals />
          </SmoothScrollProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
