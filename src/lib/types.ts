export type VerificationStatus = "VERIFIED" | "PLACEHOLDER";

export interface PriceBreakup {
  metalCost: number;
  makingCost: number;
  gst: number;
  total: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category:
    | "Rings"
    | "Earrings"
    | "Bangles & Bracelets"
    | "Necklaces"
    | "Chains"
    | "Mangalsutras"
    | "Pendants"
    | "Coins & Bars"
    | "Idols"
    | "Silver Items"
    | "Kids Items";
  metal: "Gold" | "Diamond" | "Platinum" | "Silver";
  metalColour: string;
  purity: string;
  stone?: string;
  grossWeightGrams?: number;
  netWeightGrams?: number;
  dimensions?: string;
  /** Numeric INR price when verified on live site; null renders "Ask for price" */
  priceInr: number | null;
  priceBreakup?: PriceBreakup;
  images: string[];
  cutoutImage?: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  verificationNote: string;
}

export interface StoreInfo {
  brandName: string;
  legalEntity: string;
  termsLegalEntity: string;
  establishedDate: string;
  addressPrimary: string;
  addressFooter: string;
  phones: string[];
  whatsappUrl: string;
  hours: string;
  liveRates: {
    gold24kPerGramInr: number;
    silver999PerGramInr: number;
    observedAt: string;
    verificationStatus: VerificationStatus;
  };
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    whatsapp: string;
  };
  aboutHeadline: string;
  aboutShort: string;
  aboutFull: string;
}

export interface AdapterResponse<T> {
  ok: boolean;
  mode: "LIVE_LARAVEL" | "PLACEHOLDER_MOCK";
  endpoint: string;
  data?: T;
  error?: string;
  placeholderNotice?: string;
}

export interface OtpChallenge {
  challengeId: string;
  phone: string;
  expiresInSeconds: number;
  verificationStatus: VerificationStatus;
}

export interface RazorpayOrderPayload {
  orderId: string;
  amountPaise: number;
  currency: "INR";
  keyId: string | null;
  verificationStatus: VerificationStatus;
}

export interface CustomOrderInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  requirements: string;
  referenceImageName?: string;
}

export interface AskPriceInput {
  productId?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  requirements: string;
}

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  message: string;
}
