# Toko Online Gratis (toko-online-astro)

Repo pendamping seri tutorial di [duakilo.net](https://duakilo.net): membangun toko online dengan biaya Rp0 memakai **Astro + Cloudflare + Supabase**. Seluruh pengerjaannya dibantu agent AI gratis.

Setiap langkah tutorial punya branch sendiri. Kamu bisa langsung melompat ke langkah mana pun, atau membandingkan perubahan antar langkah.

## Daftar langkah

| Branch | Isi | Status |
|---|---|---|
| `step-00-start` | Proyek Astro kosong, siap deploy ke Cloudflare | ✅ |
| `step-01-katalog` | Halaman katalog produk dari Supabase | rencana |
| `step-02-detail-produk` | Halaman detail produk | rencana |
| `step-03-keranjang` | Keranjang belanja | rencana |
| `step-04-checkout-wa` | Checkout lewat WhatsApp | rencana |
| `step-05-admin` | Halaman admin untuk kelola produk | rencana |
| `step-06-anti-pause` | Menjaga proyek Supabase gratis agar tidak di-pause | rencana |
| `step-07-midtrans` | Pembayaran dengan Midtrans | rencana |

`main` selalu berisi hasil akhir langkah terbaru.

## Cara memakai per langkah

Clone langsung pada langkah tertentu:

```bash
git clone -b step-00-start https://github.com/int2k/toko-online-astro.git
cd toko-online-astro
npm install
npm run dev
```

Lihat perubahan dari satu langkah ke langkah berikutnya di GitHub:

```
https://github.com/int2k/toko-online-astro/compare/step-00-start...step-01-katalog
```

Atau pindah langkah di repo yang sudah di-clone:

```bash
git fetch origin
git switch step-01-katalog
```

## Konfigurasi Supabase

Mulai dipakai di `step-01-katalog`. Salin contoh lalu isi nilainya dari Supabase Dashboard → Project Settings → API:

```bash
cp .env.example .env
```

File `.env` sudah masuk `.gitignore`, jadi jangan di-commit.

## Deploy ke Cloudflare

Situs di-deploy sebagai **Cloudflare Workers dengan static assets** (konfigurasi di `wrangler.jsonc`), bukan Cloudflare Pages. Cloudflare sekarang mengarahkan proyek baru ke Workers, dan langkah-langkah berikutnya (checkout, admin) butuh kode server yang bisa ditambahkan di Worker yang sama.

```bash
npx wrangler login   # sekali saja
npm run deploy       # build lalu deploy
```

Situs akan tersedia di `https://toko-online-astro.<akun-kamu>.workers.dev`.

## Versi alat (step-00-start, 21 November 2026)

- Node.js 26.7.0 (minimal 22.23.4, sesuai syarat Astro)
- npm 11.19.0
- Astro 7.4.13
- Wrangler 4.166.0
