import { NextResponse } from "next/server";
import { z } from "zod";
import { CATALOG_PRODUCTS } from "@/lib/catalog";
import { createRazorpayOrder } from "@/lib/laravel-adapter";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const orderRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  // 1. Per-IP Rate Limiting (20 checkout attempts / min)
  const ip = getClientIp(req);
  const rl = checkRateLimit(`razorpay-order:${ip}`, 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many checkout attempts. Please wait a minute." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      }
    );
  }

  // 2. Basic Same-Origin CSRF Defense
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { ok: false, error: "Cross-origin checkout request rejected." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid origin." }, { status: 403 });
    }
  }

  // 3. Strict Schema Validation + Server-Side Price Recomputation (Never trust client totals!)
  try {
    const raw = await req.json();
    const parsed = orderRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid cart items supplied." },
        { status: 400 }
      );
    }

    let serverComputedTotalInr = 0;
    for (const line of parsed.data.items) {
      const product = CATALOG_PRODUCTS.find((p) => p.id === line.productId);
      if (!product || product.priceInr === null) {
        return NextResponse.json(
          { ok: false, error: "One or more items require a showroom price quotation." },
          { status: 400 }
        );
      }
      serverComputedTotalInr += product.priceInr * line.quantity;
    }

    if (serverComputedTotalInr <= 0 || serverComputedTotalInr > 10_000_000) {
      return NextResponse.json(
        { ok: false, error: "Order total outside valid online checkout bounds." },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder(serverComputedTotalInr);
    return NextResponse.json(order, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to initialize checkout right now." },
      { status: 500 }
    );
  }
}
