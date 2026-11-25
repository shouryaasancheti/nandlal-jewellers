# Nandlal Jewellers — Immersive Luxury Website (`nandlal-web`)

Production-ready Next.js 14 (App Router) + TypeScript + Tailwind CSS + Three.js + GSAP + Lenis rebuild of [https://nandlaljewellers.com/](https://nandlaljewellers.com/) for **GNJ NandLal Jewellers Private Limited** (Burrabazar, Kolkata; Est. 6 October 2015).

- **Live Site Audit:** `../docs/site-audit.md`
- **Image Provenance (100% Real Photos, Zero AI Images):** `../docs/image-credits.md`
- **Studio Background Removal Script:** `../scripts/remove_bg.py`

---

## 1. Install & Run Locally

```bash
cd nandlal-web
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build & Type Check
```bash
npm run typecheck
npm run build
npm run start
```

### Deploy (Vercel Recommended)
1. Push `nandlal-web/` to GitHub/GitLab.
2. Import into Vercel, set all environment variables from `.env.example`, and deploy.

---

## 2. Requires Configuration Checklist

Every unconnected integration is explicitly marked `PLACEHOLDER_MOCK` in code and UI until configured:

- [ ] **Laravel Backend Bridge (`LARAVEL_API_BASE_URL`, `LARAVEL_API_MODE=LIVE_LARAVEL`, `LARAVEL_API_TOKEN`):** Required to proxy authenticated `/dataFilter`, `/login-user`, `/model-signup`, `/otpVerification`, `/addToCart`, `/customOrderForm`, `/askPriceByUser`, and `/contactUs` requests to the live RPB CommoSoft Laravel backend.
- [ ] **Razorpay Payment Keys (`NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`):** Razorpay is confirmed as the live payment gateway on `nandlaljewellers.com` (Visa, Mastercard, Maestro, RuPay, UPI). Supply live keys in `.env.local` to enable real order creation and signature verification in `src/app/api/razorpay/order/route.ts`.
- [ ] **Google Maps API Key (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`):** Currently uses the public embed URL for `43, Sir Hari Ram Goenka St, Burrabazar, Kolkata 700007`. Add an API key if you want styled custom map markers.
- [ ] **WhatsApp Business Number (`NEXT_PUBLIC_WHATSAPP_NUMBER`):** Defaults to verified showroom number `919830026688`.
- [ ] **Optional 3D Hero Model (`/public/models/hero.glb`):** Drop a GLB scan of a hero jewellery piece at `public/models/hero.glb` to automatically enable 3D drag-to-rotate mode; otherwise the verified 4-angle real photo viewer runs cleanly.
- [ ] **Full Product Catalogue Sync:** Only 1 public product (`#845`, SKU `FA7BDH`, ₹63,785) is returned by `/dataFilter` without login. Export or expose authenticated SKUs/prices from the Laravel admin panel to replace `Ask for price` showcase entries.

---

## 3. Manual QA Checklist (Desktop, Tablet & Mobile)

- [ ] Verify hero loads under 2.5s LCP with real 22K Gold Ring cutout (`SKU FA7BDH`), 5 drifting cutouts, and `"An heirloom in the making."` under `KOLKATA · EST. 2015`.
- [ ] Toggle **Ivory Mist / Obsidian** hero theme and **Ambient Off / On** sound button.
- [ ] Enable OS `prefers-reduced-motion: reduce` and confirm intro, WebGL mist, and parallax gracefully disable to static layered fallback.
- [ ] Test category & metal filters, sorting, search modal, quick view, and product detail page `/product/gents-ring-fa7bdh` (360° drag viewer + verified price breakup).
- [ ] Test Bag drawer (add/increment/remove), Wishlist drawer, OTP Signup/Login modal (`PLACEHOLDER_MOCK`), Checkout Razorpay initialization, Custom Order (with photo upload), Ask for Price, and Contact Us forms.
