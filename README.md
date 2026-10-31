# GradeUp

Platform belajar berbasis ujian. React + Vite + TypeScript, Tailwind CSS, React Router, Recharts, Supabase (disiapkan).

## Menjalankan
```bash
npm install
cp .env.example .env.local   # isi nilai Supabase bila sudah ada
npm run dev
npm run build
```

## Status
**Skeleton lengkap (Fase 1-4):** website publik, autentikasi, dashboard siswa, dashboard admin, seluruh rute, tema terang/gelap, konfigurasi Vercel.
Semua data masih DEMO (disimpan di memori, hilang saat halaman dimuat ulang).

> Autentikasi dan data saat ini hanya DEMO, tidak aman. `/dashboard` dan `/admin` belum diproteksi. Jangan gunakan untuk data nyata sebelum Supabase Auth, peran, dan RLS dipasang.

**Dicadangkan untuk berikutnya:** Supabase Auth/database nyata, akses berbasis peran, mesin ujian dan hasil permanen, manajemen konten nyata, langganan dan payment gateway, analitik produksi.

## Deploy
1. `git init && git add . && git commit -m "GradeUp fase 1"`, lalu push ke repositori GitHub Anda.
2. Import repositori di Vercel (preset Vite). `vercel.json` sudah menangani SPA routing.
3. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Environment Variables Vercel. Jangan pernah memakai service_role key di frontend.

## Struktur
`src/{components,layouts,pages/{public,auth,student,admin},routes,hooks,services,lib,types,constants,data,utils}`
