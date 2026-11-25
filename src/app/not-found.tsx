import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center bg-ivory px-6 py-28 text-center text-obsidian">
      <p className="text-sm font-medium text-antique-gold">404</p>
      <h1 className="mt-3 font-serif text-5xl font-normal">Page not found</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-obsidian/70">
        The piece or page you are looking for is not available here. Return to our Burrabazar showroom catalogue to continue browsing.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-obsidian px-7 text-sm font-semibold text-ivory transition-opacity duration-300 hover:opacity-90"
      >
        Return to showroom
      </Link>
    </main>
  );
}
