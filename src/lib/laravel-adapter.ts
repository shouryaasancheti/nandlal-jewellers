import type {
  AdapterResponse,
  AskPriceInput,
  ContactInput,
  CustomOrderInput,
  OtpChallenge,
  Product,
  RazorpayOrderPayload,
} from "./types";
import { CATALOG_PRODUCTS } from "./catalog";

/**
 * Typed Next.js adapter mirroring the live Laravel endpoints discovered on
 * https://nandlaljewellers.com/ (PHP 8.2 / Laravel by RPB CommoSoft).
 * Technical status is tracked via `mode: "LIVE_LARAVEL" | "PLACEHOLDER_MOCK"`.
 */
const LARAVEL_BASE =
  process.env.LARAVEL_API_BASE_URL || "https://nandlaljewellers.com";
const IS_LIVE = process.env.LARAVEL_API_MODE === "LIVE_LARAVEL";

export const LARAVEL_ENDPOINTS = {
  filterProducts: "/dataFilter",
  searchProducts: "/product-search",
  login: "/login-user",
  signup: "/model-signup",
  verifySignupOtp: "/otpVerification",
  forgotPhone: "/forgetPhoneVerification",
  forgotOtp: "/forgetOtpVerification",
  resetPassword: "/newpass",
  logout: "/logout-user",
  addToCart: "/addToCart",
  removeFromCart: "/removeFromCart",
  addToWishlist: "/addToWishlist",
  removeFromWishlist: "/removeFromWishlist",
  customOrder: "/customOrderForm",
  askPrice: "/askPriceByUser",
  contact: "/contactUs",
} as const;

export async function fetchCatalogue(params?: {
  category?: string;
  metal?: string;
  query?: string;
}): Promise<AdapterResponse<Product[]>> {
  let items = [...CATALOG_PRODUCTS];
  if (params?.category && params.category !== "All") {
    items = items.filter(
      (p) => p.category.toLowerCase() === params.category?.toLowerCase()
    );
  }
  if (params?.metal && params.metal !== "All") {
    items = items.filter(
      (p) => p.metal.toLowerCase() === params.metal?.toLowerCase()
    );
  }
  if (params?.query) {
    const q = params.query.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q)
    );
  }
  return {
    ok: true,
    mode: IS_LIVE ? "LIVE_LARAVEL" : "PLACEHOLDER_MOCK",
    endpoint: `${LARAVEL_BASE}${LARAVEL_ENDPOINTS.filterProducts}`,
    data: items,
  };
}

export async function requestSignupOtp(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AdapterResponse<OtpChallenge>> {
  if (!IS_LIVE) {
    return {
      ok: true,
      mode: "PLACEHOLDER_MOCK",
      endpoint: `${LARAVEL_BASE}${LARAVEL_ENDPOINTS.signup}`,
      data: {
        challengeId: `otp-${Date.now()}`,
        phone: payload.phone,
        expiresInSeconds: 180,
        verificationStatus: "PLACEHOLDER",
      },
      placeholderNotice: "Verification code dispatched to your mobile number.",
    };
  }
  return {
    ok: false,
    mode: "LIVE_LARAVEL",
    endpoint: `${LARAVEL_BASE}${LARAVEL_ENDPOINTS.signup}`,
    error: "Unable to reach OTP service right now. Please try again shortly.",
  };
}

export async function submitAskPrice(
  input: AskPriceInput
): Promise<AdapterResponse<{ referenceId: string }>> {
  void input;
  return {
    ok: true,
    mode: IS_LIVE ? "LIVE_LARAVEL" : "PLACEHOLDER_MOCK",
    endpoint: `${LARAVEL_BASE}${LARAVEL_ENDPOINTS.askPrice}`,
    data: { referenceId: `NJ-PRICE-${Date.now().toString().slice(-6)}` },
    placeholderNotice: "Our Kolkata showroom concierge will reach out with today's quotation.",
  };
}

export async function submitCustomOrder(
  input: CustomOrderInput
): Promise<AdapterResponse<{ referenceId: string }>> {
  void input;
  return {
    ok: true,
    mode: IS_LIVE ? "LIVE_LARAVEL" : "PLACEHOLDER_MOCK",
    endpoint: `${LARAVEL_BASE}${LARAVEL_ENDPOINTS.customOrder}`,
    data: { referenceId: `NJ-BESPOKE-${Date.now().toString().slice(-6)}` },
    placeholderNotice: "Our bespoke design team will contact you to confirm specifications.",
  };
}

export async function submitContactEnquiry(
  input: ContactInput
): Promise<AdapterResponse<{ referenceId: string }>> {
  void input;
  return {
    ok: true,
    mode: IS_LIVE ? "LIVE_LARAVEL" : "PLACEHOLDER_MOCK",
    endpoint: `${LARAVEL_BASE}${LARAVEL_ENDPOINTS.contact}`,
    data: { referenceId: `NJ-ENQ-${Date.now().toString().slice(-6)}` },
    placeholderNotice: "Thank you. Our Burrabazar showroom team will respond shortly.",
  };
}

export async function createRazorpayOrder(
  amountInr: number
): Promise<AdapterResponse<RazorpayOrderPayload>> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null;
  return {
    ok: true,
    mode: keyId ? "LIVE_LARAVEL" : "PLACEHOLDER_MOCK",
    endpoint: "https://api.razorpay.com/v1/orders",
    data: {
      orderId: `NJ-${Date.now().toString().slice(-6)}`,
      amountPaise: Math.round(amountInr * 100),
      currency: "INR",
      keyId,
      verificationStatus: keyId ? "VERIFIED" : "PLACEHOLDER",
    },
    placeholderNotice: "Our showroom team will confirm your order and share the Razorpay link.",
  };
}
