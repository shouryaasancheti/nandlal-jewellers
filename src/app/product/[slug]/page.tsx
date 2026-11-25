import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATALOG_PRODUCTS, STORE_INFO } from "@/lib/catalog";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return CATALOG_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = CATALOG_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.sku && !product.sku.startsWith("PLACEHOLDER") ? { sku: product.sku } : {}),
    brand: { "@type": "Brand", name: STORE_INFO.brandName },
    image: product.images.map((i) => `${STORE_INFO.social.instagram ? "https://nandlaljewellers.com" : ""}${i}`),
    ...(product.priceInr !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.priceInr,
            availability: "https://schema.org/InStock",
            url: product.sourceUrl,
          },
        }
      : {}),
  };

  return (
    <main className="min-h-screen bg-ivory px-6 pb-24 pt-28 text-obsidian lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] uppercase tracking-wider text-bronze">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#showcase" className="hover:underline">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-obsidian">{product.name}</span>
        </nav>

        <ProductDetailClient product={product} />
      </div>
    </main>
  );
}
