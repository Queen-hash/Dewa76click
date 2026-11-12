# Age Gate 18+ (Turnstile) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ubah repo ini menjadi halaman gerbang usia 18+ yang hanya mengarahkan
pengunjung yang lolos Turnstile dan menekan tombol ke
`https://dewa76.shop/m/register`.

**Architecture:** Satu halaman client (`app/page.tsx`) + satu route handler
(`app/api/verify-turnstile`) di Next.js 16 App Router. Tanpa middleware, tanpa
konten kedok. Token Turnstile diverifikasi server-side via Cloudflare
`siteverify`. Seluruh sisa fitur lama (WhitePage, `/article`, dependency
reCAPTCHA) dihapus.

**Tech Stack:** Next.js 16.3.5, React 19, TypeScript strict, Tailwind v4,
Cloudflare Turnstile (widget + siteverify).

**Spec:** docs/superpowers/specs/2026-11-12-age-gate-turnstile-design.md

## Global Constraints

- Tujuan redirect PERSIS: `https://dewa76.shop/m/register`, delay 350ms setelah klik
- DILARANG auto-redirect tanpa interaksi: tidak ada `<meta http-equiv="refresh">`,
  tidak ada redirect JS saat halaman load — inilah yang membuat gerbang bekerja
- Pixel saat klik, sebelum redirect: `fbq('track','Lead')` dan
  `ttq.track('SubmitForm')` — dipanggil bersyarat, tidak error bila pixel belum load
- `TURNSTILE_SECRET_KEY` hanya dibaca di server (route handler);
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` untuk widget
- Metadata: `robots: noindex`, judul/deskripsi netral "Konfirmasi Usia",
  tidak ada sisa konten "Zenith"; `html lang="id"`
- Tidak ada logo, tidak ada WhitePage, tidak ada `middleware.ts` (file dihapus)
- Tidak menyentuh situs `dewa76.shop` — semua perubahan di dalam repo ini saja
- Kualitas: `npx tsc --noEmit` bersih, `npm run lint` exit 0, `npm run build` sukses
- Tanpa framework uji baru (YAGNI — tidak ada infra uji di repo; verifikasi =
  typecheck + lint + build + smoke runtime)

## Review Focus

1. **Klien tanpa JS/crawler tidak boleh sampai ke tujuan** — Task 4: GET `/`
   HTML TIDAK mengandung `http-equiv="refresh"`; tombol ter-render `disabled`.
2. **Secret tidak boleh bocor ke bundle client** — Task 4: grep
   `TURNSTILE_SECRET_KEY` di `app/` → hanya cocok di
   `app/api/verify-turnstile/route.ts`.
3. **Token gagal → gerbang tetap tertutup** — Task 1: POST token dummy =
   `{"ok":false}` (HTTP 200); Task 4: POST body kosong = HTTP 400. Halaman
   tidak pernah merender tombol aktif tanpa verifikasi server yang `ok:true`.
4. **Env hilang tidak men-crash halaman** — Task 4: `npm run build` sukses
   tanpa `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; perilaku = tombol tak pernah aktif
   (fail-closed), bukan crash.
5. **Pixel harus terkirim sebelum pindah halaman** — Task 2: urutan kode
   pemanggilan pixel berada SEBELUM `location.href` dalam handler yang sama;
   Task 4/uji live: cek event masuk di Events Manager setelah ada key asli.

---

### Task 1: Init git + route handler `/api/verify-turnstile`

**Files:**
- Create: `app/api/verify-turnstile/route.ts`
- Create: `.env.local` (secret dummy untuk dev lokal; di-gitignore)

**Interfaces:**
- Produces: `POST /api/verify-turnstile` menerima JSON `{ token: string }`,
  membalas JSON `{ ok: boolean, error?: string }` dengan status:
  400 (token hilang/kosong), 500 (`TURNSTILE_SECRET_KEY` belum diset),
  502 (siteverify tak terjangkau), 200 `{ ok: true|false }` (hasil siteverify).
  Task 2 mengonsumsi kontrak ini.

- [ ] **Step 1: Init git sebagai baseline rollback**

  Run: `git init` lalu `git add -A` lalu
  `git commit -m "chore: baseline sebelum gerbang 18+"`.
  Catatan: kalau `git` tidak terpasang di mesin, lewati langkah ini.
  Verifikasi: `git status` bersih.

- [ ] **Step 2: Buat `.env.local` berisi secret dummy**

  Isi persis satu baris:
  ```
  TURNSTILE_SECRET_KEY=1x000000000000000000000000000000000000000AA
  ```
  (nilai dummy apa pun cukup untuk smoke — siteverify akan menjawab
  `success:false`). Verifikasi `.env.local` TIDAK muncul di `git status`
  (template `.gitignore` Next mengabaikan `.env*`; kalau muncul, tambahkan
  `.env.local` ke `.gitignore` dulu).

- [ ] **Step 3: Tulis route handler**

  `app/api/verify-turnstile/route.ts`:
  ```ts
  export async function POST(request: Request): Promise<Response>
  ```
  Perilaku yang dipatok:
  - `await request.json()` (dengan catch → anggap body rusak → perlakukan
    seperti token hilang)
  - token hilang/kosong/bukan string → `Response.json({ ok: false, error: "missing_token" }, { status: 400 })`
  - `process.env.TURNSTILE_SECRET_KEY` kosong → `{ ok: false, error: "server_misconfigured" }`, status 500
  - `FormData` berisi `secret` + `response` (token) → `POST` ke
    `https://challenges.cloudflare.com/turnstile/v0/siteverify` (body = FormData)
  - balasan siteverify → `Response.json({ ok: data.success === true })`, status 200
  - `fetch` melempar error → `{ ok: false, error: "verify_unreachable" }`, status 502

- [ ] **Step 4: Typecheck**

  Run: `npx tsc --noEmit` → Expected: tanpa error.

- [ ] **Step 5: Smoke runtime route**

  Run (dua terminal / background):
  `npm run dev` lalu
  `curl.exe -s -o - -w "%{http_code}" -X POST http://localhost:3000/api/verify-turnstile -H "Content-Type: application/json" -d "{\"token\":\"dummy\"}"`
  Expected: body `{"ok":false}` dengan kode `200`
  (siteverify menolak token dummy → `success:false`).

- [ ] **Step 6: Commit**

  ```bash
  git add app/api/verify-turnstile/route.ts
  git commit -m "feat: endpoint verifikasi token Turnstile"
  ```
  (`.env.local` tidak ikut — sudah ter-ignore; `git status` wajib bersih setelah commit.)

---

### Task 2: Halaman gerbang `app/page.tsx`

**Files:**
- Modify: `app/page.tsx` (tulis ulang penuh — ganti BridgePage)

**Interfaces:**
- Consumes: kontrak `POST /api/verify-turnstile` dari Task 1
- Produces: route `/` merender gerbang; tidak ada import ke WhitePage lagi

- [ ] **Step 1: Tulis ulang `app/page.tsx`**

  Persis satu halaman client (`"use client"`). Spesifikasi:
  - **Konstanta:** `const DEST = "https://dewa76.shop/m/register";` (string
    polos — base64 `atob` lama dibuang, tidak ada gunanya) dan
    `const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";`
  - **State:** `verified: boolean` (awal `false`), `redirecting: boolean`
  - **Global types** (menggantikan cast `any` lama, mematikan lint
    `no-explicit-any`):
    ```ts
    declare global {
      interface Window {
        fbq?: (...args: unknown[]) => void;
        ttq?: { track: (name: string) => void };
        turnstile?: {
          render: (el: HTMLElement, opts: Record<string, unknown>) => string;
        };
      }
    }
    ```
  - **Widget:** muat
    `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`
    via `<Script strategy="afterInteractive">` dari `next/script`; `onLoad`
    memanggil `window.turnstile.render(container, { sitekey: SITEKEY, callback, "expired-callback", "error-callback" })`
    ke `ref` div verifikasi.
    - `callback(token)` → `POST /api/verify-turnstile` dengan
      `{ token }` → `json.ok === true` → `setVerified(true)`
    - `"expired-callback"` dan `"error-callback"` → `setVerified(false)`
  - **Tombol:** label `Saya Berusia 18+ — Lanjutkan`, `disabled={!verified || redirecting}`,
    saat `redirecting` tampilkan teks `Menghubungkan...`.
    Handler klik (satu-satunya jalan ke tujuan, urutan dipatok):
    1. guard `if (redirecting) return;` → `setRedirecting(true)`
    2. pixel: `window.fbq?.("track", "Lead")` lalu `window.ttq?.track("SubmitForm")`
    3. `setTimeout(() => { window.location.href = DEST; }, 350)`
    TIDAK ada redirect lain di mana pun (tanpa `meta-refresh`, tanpa
    `useEffect` redirect).
  - **Teks halaman (dipatok):**
    - Judul kartu: `Konten Khusus Dewasa`
    - Isi: `Halaman ini hanya untuk pengunjung berusia 18 tahun ke atas. Selesaikan verifikasi di bawah ini, lalu tekan tombol untuk melanjutkan.`
    - Label area widget: `Verifikasi keamanan`
    - Baris bawah: `Dengan melanjutkan, kamu menyatakan berusia minimal 18 tahun.`
    - `<noscript>`: `Aktifkan JavaScript untuk melanjutkan.`
  - **Tampilan:** satu kartu terpusat vertikal-horizontal di layar penuh,
    Tailwind, netral/gelap, TANPA logo, tanpa tautan ke `/article`, tanpa
    fitur/badge lama.

- [ ] **Step 2: Typecheck + lint parsial**

  Run: `npx tsc --noEmit` → Expected: bersih.
  Run: `npm run lint` → Expected: error tersisa HANYA di
  `app/components/WhitePage.tsx` (2× `no-unescaped-entities`) — file itu dihapus
  di Task 3. Error lama `page.tsx` (set-state-in-effect, no-explicit-any,
  no-img-element) harus sudah hilang.

- [ ] **Step 3: Smoke halaman**

  Dengan `npm run dev` berjalan:
  `curl.exe -s http://localhost:3000/` → Expected:
  - HTTP 200, HTML mengandung `Konten Khusus Dewasa`
  - tombol muncul dengan atribut `disabled`
  - TIDAK mengandung `http-equiv="refresh"`
  - TIDAK mengandung `Kebugaran` (sisa WhitePage)

- [ ] **Step 4: Commit**

  ```bash
  git add app/page.tsx; git commit -m "feat: halaman gerbang 18+ dengan Turnstile"
  ```

---

### Task 3: Metadata layout + hapus sisa kode lama

**Files:**
- Modify: `app/layout.tsx` (metadata + `lang`)
- Delete: `app/components/WhitePage.tsx`, `app/article/page.tsx`, `middleware.ts`
- Modify: `package.json` (buang 2 dependensi) + lockfile via `npm install`

**Interfaces:**
- Consumes: tidak ada — halaman Task 2 sudah tidak mengimpor file yang dihapus

- [ ] **Step 1: Ganti metadata `layout.tsx`**

  Ganti objek `metadata` lama (Zenith/openGraph/Unsplash) dengan:
  ```ts
  export const metadata: Metadata = {
    title: "Konfirmasi Usia 18+",
    description: "Halaman konfirmasi usia sebelum melanjutkan.",
    robots: { index: false, follow: false },
  };
  ```
  Ubah `<html lang="en">` → `<html lang="id">`. Pertahankan font Geist dan
  kedua `<Script>` pixel (FB + TikTok) apa adanya.

- [ ] **Step 2: Hapus file lama**

  ```bash
  git rm app/components/WhitePage.tsx app/article/page.tsx middleware.ts
  ```
  (kalau tidak ada git: hapus biasa). Verifikasi referensi tersisa diserahkan ke
  Step 4: `tsc` akan gagal (TS2307 modul tak ditemukan) kalau masih ada file yang
  mengimpor yang dihapus — jadi Step 4 bersih = tidak ada referensi nyangkut.

- [ ] **Step 3: Buang dependensi menganggur**

  Hapus `react-google-recaptcha` (dependencies) dan
  `@types/react-google-recaptcha` (devDependencies) dari `package.json`,
  lalu Run: `npm install` → Expected: `package-lock.json` ter-update, tanpa error.

- [ ] **Step 4: Typecheck + lint penuh**

  Run: `npx tsc --noEmit` → bersih.
  Run: `npm run lint` → Expected: **exit 0, 0 problems** (target kualitas plan).

- [ ] **Step 5: Smoke routing**

  Dengan dev berjalan: `curl.exe -s -o NUL -w "%{http_code}" http://localhost:3000/article`
  → Expected: `404`. `curl.exe -s http://localhost:3000/ | findstr "robots"` →
  mengandung `noindex`.

- [ ] **Step 6: Commit**

  ```bash
  git add -A; git commit -m "refactor: hapus WhitePage, article, middleware dan dependency reCAPTCHA"
  ```

---

### Task 4: Build penuh + smoke final + handoff ops

**Files:**
- Verify only (tidak ada kode baru kecuali perubahan regenerated seperti blok AGENTS.md)

**Interfaces:**
- Consumes: seluruh Task 1–3

- [ ] **Step 1: Production build**

  Run: `npm run build` → Expected: sukses.
  Catatan: `next build` bisa menulis ulang blok AGENTS.md — kalau berubah,
  sertakan di commit (jangan dihapus).

- [ ] **Step 2: Review Focus #2 — secret tidak bocor ke client**

  Run: `grep -rn "TURNSTILE_SECRET_KEY" app/` → Expected: hanya
  `app/api/verify-turnstile/route.ts`. Kalau ada di file lain → perbaiki dulu.

- [ ] **Step 3: Smoke final (dev server)**

  | Uji | Perintah | Expected |
  |---|---|---|
  | Gerbang tampil | `curl.exe -s http://localhost:3000/` | 200, ada `Konfirmasi Usia` + `disabled`, TIDAK ada `http-equiv="refresh"` |
  | Token dummy | `curl.exe -s -X POST .../api/verify-turnstile -d '{"token":"dummy"}'` | 200 `{"ok":false}` |
  | Body kosong | `curl.exe -s -X POST .../api/verify-turnstile -d '{}'` | 400 `{"ok":false}` |
  | Artikel lama | `curl.exe -s -o NUL -w "%{http_code}" .../article` | 404 |

- [ ] **Step 4: Lint final**

  Run: `npm run lint` → exit 0; `npx tsc --noEmit` → bersih.

- [ ] **Step 5: Commit terakhir**

  ```bash
  git add -A; git commit -m "chore: verifikasi build dan smoke akhir gerbang"
  ```

- [ ] **Step 6: Serahkan checklist ops ke pengguna (di luar repo)**

  Tulis ke pengguna, urut:
  1. Cloudflare Dashboard → Turnstile → Add site
     (domains: `go.dewa76.shop` + `localhost`) → salin **sitekey** + **secret**
  2. Vercel project → Settings → Environment Variables:
     `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (sitekey) dan `TURNSTILE_SECRET_KEY`
     (secret) → redeploy
  3. Tambah domain `go.dewa76.shop` di Vercel; DNS `dewa76.shop` →
     CNAME `go` → `cname.vercel-dns.com`. **Jangan** aktifkan challenge
     apapun di Cloudflare (Under Attack / Bot Fight Mode) — crawler iklan harus
     bisa membaca halaman
  4. Uji live: buka `https://go.dewa76.shop/` → lolos Turnstile → klik →
     sampai `dewa76.shop/m/register`; cek event `Lead`/`SubmitForm` di
     Events Manager
  5. Buat link `t.ly` → `https://go.dewa76.shop/` (manual, di situs t.ly)
