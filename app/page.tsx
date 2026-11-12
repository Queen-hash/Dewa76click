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
      theme: "dark",
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
    <div className="relative min-h-screen bg-[#0C0A09] flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Glow latar emas (dekoratif) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-[#A16207]/30 blur-[110px]" />
        <div className="absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-[#854D0E]/25 blur-[130px]" />
      </div>

      <main className="animate-fade-up relative w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.06] p-7 sm:p-9 text-center shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl before:absolute before:inset-x-7 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent">
        {/* Medali 18+ */}
        <div
          aria-hidden
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#A16207] to-[#854D0E] font-display text-2xl font-semibold text-white shadow-[0_0_32px_-6px_rgba(161,98,7,0.7)] ring-1 ring-[#E0B44A]/40"
        >
          18+
        </div>

        <h1 className="mb-3 font-display text-[2rem] leading-[1.15] font-semibold text-white sm:text-[2.5rem]">
          Konten Khusus Dewasa
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-300">
          Halaman ini hanya untuk pengunjung berusia 18 tahun ke atas.
          Selesaikan verifikasi di bawah ini, lalu tekan tombol untuk
          melanjutkan.
        </p>

        <div className="mb-5 text-left">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-[0.15em] text-slate-400 uppercase">
            Verifikasi keamanan
            {verified && !redirecting && (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[#E0B44A]"
              >
                <path
                  d="M4 10.5l4 4 8-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </p>
          {/* Tinggi di-reserve agar widget tidak menyebabkan layout shift */}
          <div ref={containerRef} className="min-h-[65px]" />
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onLoad={handleScriptLoad}
          />
          <noscript className="mt-2 block text-xs text-[#E0B44A]">
            Aktifkan JavaScript untuk melanjutkan.
          </noscript>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!verified || redirecting}
          aria-busy={redirecting}
          className="w-full cursor-pointer rounded-xl bg-gradient-to-br from-[#A16207] to-[#854D0E] px-5 py-4 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(161,98,7,0.55)] transition-all duration-200 hover:from-[#B45309] hover:to-[#93570A] focus-visible:ring-2 focus-visible:ring-[#E0B44A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0A09] focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-[#A16207] disabled:hover:to-[#854D0E]"
        >
          {redirecting ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="-mt-0.5 mr-2 inline-block h-4 w-4 animate-spin"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Menghubungkan...
            </>
          ) : (
            "Saya Berusia 18+ — Lanjutkan"
          )}
        </button>

        <p className="mt-5 text-xs text-slate-400">
          Dengan melanjutkan, kamu menyatakan berusia minimal 18 tahun.
        </p>
      </main>
    </div>
  );
}
