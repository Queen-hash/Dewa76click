"use client";

import { useState, useEffect } from "react";
import WhitePage from "./components/WhitePage";

export default function BridgePage() {
  const [showWhitePage, setShowWhitePage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const ua = navigator.userAgent.toLowerCase();
      const isBot = /facebookexternalhit|facebot|meta-externalagent|googlebot|bingbot|slurp|crawler|spider|semrush|ahrefs|petalbot|bytespider|tiktokadsbot|tiktokbot/i.test(ua);
      const isSafeParam = search.includes("safe=1") || search.includes("view=article");

      if (isBot || isSafeParam) {
        setShowWhitePage(true);
      }
    }
  }, []);

  if (showWhitePage) {
    return <WhitePage />;
  }

  const handleContinue = () => {
    if (loading) return;
    setLoading(true);

    // Kirim event conversion ke Facebook Pixel & TikTok
    if (typeof window !== "undefined") {
      if ((window as any).fbq) {
        (window as any).fbq("track", "Lead");
      }
      if ((window as any).ttq) {
        (window as any).ttq.track("SubmitForm");
      }
    }

    // URL tujuan dienkripsi base64: https://dewa76.shop/m/register
    const destination = atob("aHR0cHM6Ly9kZXdhNzYuc2hvcC9tL3JlZ2lzdGVy");

    setTimeout(() => {
      window.location.href = destination;
    }, 350);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 flex flex-col items-center justify-between p-4 sm:p-6 font-sans text-white">
      {/* Top Bar */}
      <header className="w-full max-w-lg flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
          <span className="font-semibold text-sm sm:text-base tracking-tight text-slate-200">
            Dewa76 Portal Access
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Server Aktif
        </span>
      </header>

      {/* Main Bridge Card */}
      <main className="max-w-md w-full bg-slate-900/90 border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md text-center my-auto">
        {/* Verified Badge */}
        <div className="mx-auto w-14 h-14 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">
          Selamat Datang!
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Klik tombol di bawah ini untuk langsung terhubung ke halaman pendaftaran resmi kami, nikmati Bonus yang melimpah dan layanan prioritas.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2.5 mb-7 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-300 flex flex-col items-center gap-1">
            <span className="text-teal-400 font-bold">⚡ Pembayaran</span>
            <span className="text-[11px] text-slate-400">Instan</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-300 flex flex-col items-center gap-1">
            <span className="text-teal-400 font-bold">🔒 Aman</span>
            <span className="text-[11px] text-slate-400">Terenkripsi</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-300 flex flex-col items-center gap-1">
            <span className="text-teal-400 font-bold">24 Jam</span>
            <span className="text-[11px] text-slate-400">Dukungan</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-lg shadow-teal-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Menghubungkan...</span>
            </>
          ) : (
            <>
              <span>DAFTAR SEKARANG</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </main>

      {/* Footer Legal */}
      <footer className="w-full max-w-lg py-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <a href="/article" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
        <span>•</span>
        <a href="/article" className="hover:text-slate-300 transition-colors">Syarat & Ketentuan</a>
        <span>•</span>
        <span>© 2026 Dewa76. All rights reserved.</span>
      </footer>
    </div>
  );
}