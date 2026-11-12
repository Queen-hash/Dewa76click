"use client";

import { useRef, useState } from "react";
import Script from "next/script";

const DEST = "https://dewa76.shop/m/register";
const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (name: string) => void };
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
    };
  }
}

export default function AgeGatePage() {
  const [verified, setVerified] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleVerify = async (token: string) => {
    try {
      const res = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json()) as { ok?: boolean };
      setVerified(data.ok === true);
    } catch {
      setVerified(false);
    }
  };

  const handleScriptLoad = () => {
    const el = containerRef.current;
    if (!el || !window.turnstile) return;
    window.turnstile.render(el, {
      sitekey: SITEKEY,
      callback: (token: string) => {
        void handleVerify(token);
      },
      "expired-callback": () => setVerified(false),
      "error-callback": () => setVerified(false),
    });
  };

  const handleContinue = () => {
    if (!verified || redirecting) return;
    setRedirecting(true);

    // Pixel konversi sebelum pindah halaman
    window.fbq?.("track", "Lead");
    window.ttq?.track("SubmitForm");

    setTimeout(() => {
      window.location.href = DEST;
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <main className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-7 sm:p-9 text-center shadow-2xl">
        <div
          aria-hidden
          className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl font-bold mb-5"
        >
          18+
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Halaman ini hanya untuk pengunjung berusia 18 tahun ke atas.
          Selesaikan verifikasi di bawah ini, lalu tekan tombol untuk
          melanjutkan.
        </p>

        <div className="text-left mb-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Verifikasi keamanan
          </p>
          <div ref={containerRef} />
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onLoad={handleScriptLoad}
          />
          <noscript className="block mt-2 text-xs text-amber-400">
            Aktifkan JavaScript untuk melanjutkan.
          </noscript>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!verified || redirecting}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
        >
          {redirecting ? "Menghubungkan..." : "Saya Berusia 18+ — Lanjutkan"}
        </button>

        <p className="text-xs text-slate-600 mt-5">
          Dengan melanjutkan, kamu menyatakan berusia minimal 18 tahun.
        </p>
      </main>
    </div>
  );
}
