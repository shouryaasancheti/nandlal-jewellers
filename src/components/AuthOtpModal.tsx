"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { requestSignupOtp } from "@/lib/laravel-adapter";

type Mode = "login" | "signup" | "otp" | "forgot";

export function AuthOtpModal() {
  const { authOpen, setAuthOpen, setUser, showToast } = useStore();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  if (!authOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailOrPhone.trim() || password.length < 6) {
      setError("Enter a valid email or 10-digit mobile number and password (min 6 characters).");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setUser({
      firstName: "Guest",
      lastName: "Member",
      email: emailOrPhone.includes("@") ? emailOrPhone : "member@nandlaljewellers.com",
      phone: emailOrPhone.includes("@") ? "9830026688" : emailOrPhone,
      mode: "PLACEHOLDER_MOCK",
    });
    showToast("Signed in to your Nandlal Jewellers account.");
    setAuthOpen(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !/^\d{10}$/.test(phone.trim()) || password.length < 6) {
      setError("Provide your first name, 10-digit mobile number, and a 6+ character password.");
      return;
    }
    setLoading(true);
    const res = await requestSignupOtp({ firstName, lastName, email, phone, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Could not send OTP.");
      return;
    }
    setNotice("Enter the 6-digit verification code sent to your mobile number.");
    setMode("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{4,6}$/.test(otp.trim())) {
      setError("Please enter a valid 4 to 6 digit OTP.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    setLoading(false);
    setUser({
      firstName: firstName || "Member",
      lastName: lastName || "",
      email: email || "member@nandlaljewellers.com",
      phone,
      mode: "PLACEHOLDER_MOCK",
    });
    showToast("Welcome to Nandlal Jewellers.");
    setAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[450] grid place-items-center bg-obsidian/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account Sign In"
        className="w-full max-w-md rounded-2xl border border-obsidian/15 bg-ivory p-7 text-obsidian shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-antique-gold">Nandlal Jewellers account</p>
            <h2 className="mt-1 font-serif text-3xl">
              {mode === "login" && "Sign in"}
              {mode === "signup" && "Create account"}
              {mode === "otp" && "Verify OTP"}
              {mode === "forgot" && "Reset password"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAuthOpen(false)}
            aria-label="Close sign in dialog"
            className="grid h-10 w-10 place-items-center rounded-full border border-obsidian/15"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-800/30 bg-red-50 px-3.5 py-2.5 text-xs text-red-900">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-4 rounded-xl border border-antique-gold/40 bg-cream px-3.5 py-2.5 text-xs text-obsidian/80">
            {notice}
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Email or mobile number</label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="98300XXXXX or email@example.com"
                className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="flex justify-between pt-2 text-xs text-obsidian/70">
              <button type="button" onClick={() => setMode("signup")} className="underline">
                Sign up with OTP
              </button>
              <button type="button" onClick={() => setMode("forgot")} className="underline">
                Forgot password?
              </button>
            </div>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 rounded-xl border border-obsidian/20 bg-white px-3 text-sm" />
              <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 rounded-xl border border-obsidian/20 bg-white px-3 text-sm" />
            </div>
            <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
            <input type="tel" required placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
            <input type="password" required placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
            <button type="submit" disabled={loading} className="h-12 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory disabled:opacity-50">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
            <button type="button" onClick={() => setMode("login")} className="w-full pt-1 text-center text-xs text-obsidian/70 underline">
              Already have an account? Sign in
            </button>
          </form>
        )}

        {mode === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-obsidian/70">
              Enter the verification code sent to <strong>{phone}</strong>.
            </p>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="h-12 w-full rounded-xl border border-obsidian/20 bg-white px-4 text-center font-mono text-lg tracking-[0.35em]"
            />
            <button type="submit" disabled={loading} className="h-12 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory disabled:opacity-50">
              {loading ? "Verifying..." : "Verify and continue"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setNotice("Verification code dispatched to your registered mobile number.");
              setMode("otp");
            }}
            className="space-y-4"
          >
            <input type="tel" required placeholder="Registered 10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-xl border border-obsidian/20 bg-white px-3.5 text-sm" />
            <button type="submit" className="h-12 w-full rounded-full bg-obsidian text-xs font-semibold text-ivory">
              Send recovery OTP
            </button>
            <button type="button" onClick={() => setMode("login")} className="w-full text-center text-xs text-obsidian/70 underline">
              Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
