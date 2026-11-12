# Desain: Gerbang Usia 18+ (repo ini → landing t.ly)

Tanggal: 2026-11-12
Status: Di-approve pengguna

## Intent

Ubah situs ini dari bridge-page + WhitePage menjadi halaman gerbang usia polos.
Link yang dibagikan (`t.ly`) → subdomain `go.dewa76.shop` → manusia lolos
Turnstile + klik 18+ → baru diarahkan ke `dewa76.shop/m/register` sambil pixel
konversi terkirim. Crawler iklan bisa **membaca** halaman tapi tidak bisa
**mencapai** link tujuan. Situs asli `dewa76.shop` tidak disentuh (Fork 2).

## Goals

- Halaman kosong: peringatan 18+, widget Turnstile, tombol "Saya berusia 18+"
  (disabled sampai verifikasi lolos)
- Redirect **hanya** setelah klik — `https://dewa76.shop/m/register`,
  delay ±350ms, pixel FB `Lead` + TikTok `SubmitForm` ditembak dulu
- HTML + meta OG selalu terbaca crawler iklan (tidak ada challenge di depan)
- Hapus `WhitePage.tsx`, `app/article/`, `middleware.ts` seluruhnya
- Lint bersih (7 error yang ada ikut hilang karena file-nya dihapus/tertulis ulang)

## Non-goals & anti-goals

- ❌ Menyentuh `dewa76.shop` — DNS origin, konten, `/m/register`: apa adanya
- ❌ Auto-redirect tanpa interaksi (`meta-refresh`, redirect JS otomatis) —
  inilah yang membuat gerbang bekerja; tidak ada jalan selundup
- ❌ Challenge zone-wide (Under Attack / Bot Fight Mode) — memblokir crawler iklan
- ❌ Menjamin "iklan pasti lolos" — kebijakan tujuan (judi) di luar kendali
  teknis; ini hanya menghilangkan risiko *gagal akses*
- ❌ Tembok anti-bot absolut — bot ber-JS tetap bisa lolos; ini penyaring,
  bukan benteng

## Constraints

- Next.js 16 di Vercel; Turnstile gratis dari akun Cloudflare
- Subdomain `go.dewa76.shop` → CNAME `cname.vercel-dns.com` (nama bisa diganti)
- Prasyarat ops: DNS `dewa76.shop` harus bisa menambah record — lokasi manage
  DNS dikonfirmasi saat eksekusi

## Approaches (yang dipertimbangkan)

| Pendekatan | Keputusan | Alasan |
|---|---|---|
| A — challenge Cloudflare di depan | ❌ | Blokir crawler `facebookexternalhit` → iklan gagal akses |
| B — redirect di edge tanpa Vercel | ❌ | Pixel konversi hilang |
| C — Turnstile di halaman | ✅ | Crawler tetap baca, verifikasi tetap Cloudflare |
| Fork 1 — gerbang depan seluruh situs (Worker) | ❌ | Risiko situs utama mati, kode di luar repo |
| Fork 2 — gerbang landing saja | ✅ | Mudah, nol risiko ke situs asli |

## Rancangan teknis (how)

1. **`app/page.tsx` ditulis ulang** — kartu polos: teks peringatan 18+, widget
   Turnstile, tombol 18+ disabled → setelah verifikasi server lolos → aktifkan →
   klik → pixel → redirect. Tanpa JS = tidak kemana-mana.
2. **`/api/verify-turnstile` (route handler baru)** — verifikasi token
   server-side pakai `TURNSTILE_SECRET_KEY` (secret tidak pernah ke browser).
3. **`layout.tsx`** — kode pixel dasar dipertahankan; metadata diganti netral
   "Konfirmasi Usia" + `robots: noindex`.
4. **Hapus** — `app/components/WhitePage.tsx`, `app/article/page.tsx`,
   `middleware.ts`, dependensi `react-google-recaptcha` + `@types` (menganggur).
5. **Ops (di luar kode)** — daftarkan `go.dewa76.shop` di Turnstile dashboard →
   sitekey jadi `NEXT_PUBLIC_TURNSTILE_SITE_KEY` di Vercel → setelah deploy,
   pengguna membuat link `t.ly` → `https://go.dewa76.shop/`.

## Sisa urusan builder

- Nama subdomain (default `go.dewa76.shop`)
- Konfirmasi DNS manager saat langkah ops
- Halaman dibuat polos tanpa logo (panggilan builder — ganti kalau mau pakai logo)
