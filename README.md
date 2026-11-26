# CINOVERSE — Backend RESTful API

Backend API untuk proyek akhir mata kuliah **Pengembangan Aplikasi Web II (PAW II)** — Sistem Pemesanan Tiket Bioskop Secara Online.

## Tautan Penting
- **Backend API (Vercel):** https://cinoverse-backend.vercel.app/
- **Repository GitHub:** https://github.com/Ridzz05/PAW-II-Project
- **Product Requirements Document (PRD):** `docs/PRD.md`
- **Laporan Progres Backend:** `docs/LAPORAN-BACKEND.md`
- **Postman Collection:** `postman/Cinoverse-API.postman_collection.json`

## Kelompok 3 (SI5B — Universitas MDP)
| No | Nama | NIM | Peran |
|---:|---|---|---|
| 1 | M. Rizki Algipari | 2428240069 | Ketua / Backend Developer |
| 2 | Putri Angel Li | 2428240091 | Frontend Developer |
| 3 | Fellisa Anastasya | 2428240094 | UI/UX Designer |
| 4 | Deisy Callisca Chandra | 2428240054 | Database & Deployment |
| 5 | Putri Reda Maulidia | 2428240086 | Dokumentasi & QA |

## Teknologi
- Node.js + Express.js 5
- MongoDB Atlas + Mongoose
- JSON Web Token (JWT) + `bcryptjs`
- Vercel (`vercel.json` serverless entry `app.js`)

## Koleksi Database (`cinoverse`)
1. `users` — Akun pengguna dan admin (`role`: `user` | `admin`)
2. `movies` — Data film (*now_showing* / *coming_soon*, genre, durasi, sinopsis, poster)
3. `cinemas` — Data lokasi bioskop dan daftar studio (*embedded*)
4. `showtimes` — Jadwal tayang (referensi ke `Movie` & `Cinema`), harga tiket, dan `bookedSeats`
5. `bookings` — Data pemesanan tiket, simulasi status pembayaran (`pending` / `paid` / `cancelled`), dan kode *e-ticket*

## Setup Lokal
1. Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Isi `MONGODB_URI` (MongoDB Atlas) dan `JWT_SECRET` di `.env`.
3. Install dependencies & isi data awal (*seed*):
   ```bash
   npm install
   npm run seed
   ```
4. Jalankan server:
   ```bash
   npm run dev
   ```

### Akun Demo (dari `npm run seed`)
- **Admin**: `admin@cinoverse.id` / `admin123`
- **User**: `budi@email.com` / `budi123`

## Daftar Endpoint

### Auth (`/api/auth`)
- `POST /api/auth/register` — Registrasi akun pengguna baru
- `POST /api/auth/login` — Login dan mendapatkan JWT token
- `GET /api/auth/me` — Profil pengguna yang sedang login *(Protected)*

### Movies (`/api/movies`)
- `GET /api/movies` — Daftar film (mendukung `?status=`, `?genre=`, `?search=`, `?sort=`, `?page=`, `?limit=`)
- `GET /api/movies/:id` — Detail film
- `POST /api/movies` — Tambah film *(Admin)*
- `PUT /api/movies/:id` — Ubah film *(Admin)*
- `DELETE /api/movies/:id` — Hapus film *(Admin)*

### Cinemas (`/api/cinemas`)
- `GET /api/cinemas` — Daftar bioskop & studio (mendukung `?city=`, `?search=`)
- `GET /api/cinemas/:id` — Detail bioskop
- `POST /api/cinemas` — Tambah bioskop *(Admin)*
- `PUT /api/cinemas/:id` — Ubah bioskop *(Admin)*
- `DELETE /api/cinemas/:id` — Hapus bioskop *(Admin)*

### Showtimes (`/api/showtimes`)
- `GET /api/showtimes` — Daftar jadwal tayang (mendukung `?movieId=`, `?cinemaId=`, `?date=`)
- `GET /api/showtimes/:id` — Detail jadwal tayang & kursi yang sudah terpesan (`bookedSeats`)
- `POST /api/showtimes` — Tambah jadwal tayang *(Admin)*
- `PUT /api/showtimes/:id` — Ubah jadwal tayang *(Admin)*
- `DELETE /api/showtimes/:id` — Hapus jadwal tayang *(Admin)*

### Bookings & E-Ticket (`/api/bookings`)
- `GET /api/bookings/me` — Riwayat pemesanan & e-ticket saya *(Protected)*
- `GET /api/bookings` — Semua data pemesanan *(Admin)*
- `GET /api/bookings/:id` — Detail tiket / e-ticket *(Protected)*
- `POST /api/bookings` — Buat pesanan & reservasi kursi *(Protected)*
- `PUT /api/bookings/:id/pay` — Simulasi pembayaran menjadi `paid` *(Protected)*
- `PUT /api/bookings/:id/cancel` — Batalkan pesanan `pending` dan lepaskan kursi *(Protected)*

## Pengujian Postman
Import file `postman/Cinoverse-API.postman_collection.json` ke Postman. Login otomatis menyimpan `token` ke collection variable.

## Deploy ke Vercel
1. Pastikan MongoDB Atlas Network Access mengizinkan `0.0.0.0/0`.
2. Hubungkan repo `PAW-II-Project` ke Vercel atau jalankan `vercel --prod`.
3. Tambahkan Environment Variables di Vercel: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`.
