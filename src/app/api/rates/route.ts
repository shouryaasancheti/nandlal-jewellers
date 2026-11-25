import { NextResponse } from "next/server";
import { STORE_INFO } from "@/lib/catalog";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const revalidate = 300; // Cache live rates for 5 minutes

function formatIstTimestamp(date: Date): string {
  return (
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date) + " IST"
  );
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`rates:${ip}`, 60, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      }
    );
  }

  const fallback = {
    gold24k: STORE_INFO.liveRates.gold24kPerGramInr,
    silver999: STORE_INFO.liveRates.silver999PerGramInr,
    live: false,
    asOf: "24 Nov 2026, 9:05 pm IST",
    source: "https://nandlaljewellers.com/",
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("https://nandlaljewellers.com/", {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NandlalRatesFetcher/1.0; +https://nandlaljewellers.com/)",
      },
      next: { revalidate: 300 },
    });
    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(fallback, { status: 200 });
    }

    const html = await res.text();
    const goldMatch = html.match(/24k<\/span>\s*<span>\s*([0-9,]+)\s*\/gms/i);
    const silverMatch = html.match(/999<\/span>\s*<span>\s*([0-9,]+)\s*\/gms/i);

    const gold24k = goldMatch ? Number(goldMatch[1].replace(/,/g, "")) : NaN;
    const silver999 = silverMatch ? Number(silverMatch[1].replace(/,/g, "")) : NaN;

    if (
      Number.isFinite(gold24k) &&
      gold24k > 1000 &&
      gold24k < 500000 &&
      Number.isFinite(silver999) &&
      silver999 > 10 &&
      silver999 < 50000
    ) {
      return NextResponse.json(
        {
          gold24k,
          silver999,
          live: true,
          asOf: formatIstTimestamp(new Date()),
          source: "https://nandlaljewellers.com/",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    return NextResponse.json(fallback, { status: 200 });
  } catch {
    return NextResponse.json(fallback, { status: 200 });
  }
}
