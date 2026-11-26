# Product Requirements Document (PRD) — CINOVERSE

**Nama Proyek:** CINOVERSE (Sistem Pemesanan Tiket Bioskop Secara Online)  
**Mata Kuliah:** Pengembangan Aplikasi Web II (SI0027)  
**Kelompok / Kelas:** Kelompok 3 / SI5B — Universitas Multi Data Palembang (MDP)  
**Dosen Pengampu:** Nur Rachmat, M.Kom.  
**Repository:** `https://github.com/Ridzz05/PAW-II-Project`

---

## 1. Ringkasan Proyek & Latar Belakang

### 1.1 Latar Belakang Masalah
Saat film populer tayang di bioskop, pengunjung sering kesulitan memperoleh informasi terpadu mengenai jadwal tayang, lokasi bioskop, harga tiket, dan ketersediaan kursi. Pembelian tiket secara langsung di loket juga menimbulkan antrean panjang, terutama pada akhir pekan, hari libur, atau hari rilis film baru, serta berisiko membuat pengunjung datang tanpa kepastian ketersediaan kursi.

### 1.2 Solusi yang Diusulkan
**CINOVERSE** adalah aplikasi web berbasis arsitektur *decoupled* (*backend* RESTful API dan *frontend* SPA terpisah) untuk pemesanan tiket bioskop secara daring. Pengguna dapat melihat daftar film (*Now Showing* & *Coming Soon*), memilih lokasi bioskop dan jadwal tayang, melihat peta kursi yang tersedia secara dinamis, melakukan pemesanan dan simulasi pembayaran daring, serta memperoleh *e-ticket* digital.

### 1.3 Target Pengguna
1. **Pengunjung / Penonton Bioskop (`role: "user"`):** Mencari informasi film, mengecek jadwal dan kursi tersedia, memesan tiket, melakukan simulasi pembayaran, dan melihat riwayat *e-ticket*.
2. **Admin / Pengelola Bioskop (`role: "admin"`):** Mengelola master data film, data bioskop & studio, jadwal tayang, harga tiket, serta memantau seluruh transaksi pemesanan pengguna.

---

## 2. Tim & Pembagian Tugas (Kelompok 3)

| No | Nama Lengkap | NIM | Peran Utama | Fokus Backend (Saat Ini) | Fokus Frontend (Rencana) |
|---:|---|---|---|---|---|
| 1 | **M. Rizki Algipari** | 2428240069 | Ketua / Backend Developer | Inisiasi proyek Express.js, arsitektur RESTful API, autentikasi JWT, logika transaksi *booking* & *e-ticket* | Review integrasi API & debugging *decoupled* |
| 2 | **Putri Angel Li** | 2428240091 | Frontend Developer | Review kontrak respons JSON API | Pengembangan SPA React + Vite (halaman film, jadwal, kursi, checkout, riwayat *e-ticket*) & konsumsi API (Axios/Fetch) |
| 3 | **Fellisa Anastasya** | 2428240094 | UI/UX Designer | Penyelarasan struktur data UI dengan Figma | Finalisasi UI/UX responsif (desktop & mobile) sesuai prototype Figma |
| 4 | **Deisy Callisca Chandra** | 2428240054 | Database & Deployment | Perancangan skema & 5 koleksi MongoDB Atlas (`users`, `movies`, `cinemas`, `showtimes`, `bookings`) serta deployment Vercel | Pengaturan deployment produksi frontend (Vercel) & environment variables |
| 5 | **Putri Reda Maulidia** | 2428240086 | Dokumentasi & QA | Penyusunan Postman Collection + *automated test scripts*, dokumentasi endpoint, & QA API | Pengujian end-to-end integrasi frontend-backend & dokumentasi demo |

---

## 3. Ruang Lingkup & Batasan Proyek (Scope)

Sesuai proposal proyek akhir Kelompok 3:
1. Aplikasi merupakan studi kasus sistem pemesanan tiket bioskop dan **belum terhubung** ke sistem operasional bioskop nyata.
2. Pembayaran menggunakan **simulasi pembayaran internal** (transisi status `pending` → `paid` / `cancelled`) dan belum terintegrasi dengan *payment gateway* eksternal (Midtrans/Xendit).
3. Data film, bioskop, studio, jadwal, harga tiket, dan kursi dikelola di dalam database proyek (`MongoDB Atlas`) dan bukan feed real-time eksternal.
4. Sistem hanya mencakup **pemesanan tiket film**, tidak mencakup pemesanan makanan & minuman (*F&B*).
5. Sistem tidak mencakup operasional internal perusahaan (penggajian, pengadaan, atau akuntansi).
6. *E-ticket* berupa kode booking digital (`CNV-XXXXXX`) sebagai simulasi tanpa integrasi perangkat pemindai fisik.

---

## 4. Arsitektur Sistem & Tech Stack

CINOVERSE menerapkan arsitektur **Decoupled**:

- **Backend (Server):** Node.js + Express.js 5 (RESTful API murni JSON, arsitektur MVC/Layered: `config/`, `models/`, `controllers/`, `routes/`, `middlewares/`).
- **Database:** MongoDB Atlas (NoSQL) dengan ODM Mongoose (kombinasi *embedding* pada `Cinema.studios` dan *referencing* pada `Showtime` & `Booking`).
- **Autentikasi & Keamanan:** Stateless JSON Web Token (`jsonwebtoken`), hashing password `bcryptjs`, CORS, `dotenv`, dan *error handler* terpusat.
- **Deployment Backend:** Vercel (`vercel.json` serverless entry `app.js` dengan global connection cache di `config/db.js`).
- **Pengujian & Dokumentasi API:** Postman Collection v2.1 + *automated test assertions* (`postman/Cinoverse-API.postman_collection.json`).
- **Frontend (Rencana Tahap Lanjut):** React + Vite (SPA), konsumsi API asinkron dengan Axios/Fetch, penyimpanan token JWT, dan *protected route*, di-deploy ke Vercel.

---

## 5. Desain Basis Data (5 Koleksi MongoDB)

1. **`users`**
   - `name` (String, required)
   - `email` (String, required, unique, lowercase)
   - `password` (String, required, minlength 6, hashed with bcrypt, `select: false`)
   - `role` (String: `"user"` | `"admin"`, default `"user"`)
2. **`movies`**
   - `title`, `genre` (`[String]`), `duration` (Number, menit), `rating` (0–10), `ageRating` (default `"13+"`), `language`, `synopsis`, `posterUrl`, `status` (`"now_showing"` | `"coming_soon"`), `releaseDate`.
3. **`cinemas`**
   - `name`, `city`, `address`
   - `studios` *(embedded array)*: `[{ name, type: "Regular" | "IMAX" | "Premiere", rows, cols }]`.
4. **`showtimes`**
   - `movieId` (ObjectId → `Movie`), `cinemaId` (ObjectId → `Cinema`)
   - `studioName`, `studioType`, `date` (`YYYY-MM-DD`), `time` (`HH:mm`), `price` (Number)
   - `bookedSeats` (`[String]` — daftar kursi yang sudah dipesan).
5. **`bookings`**
   - `bookingCode` (String, unique, format `CNV-XXXXXX`)
   - `userId` (ObjectId → `User`), `showtimeId` (ObjectId → `Showtime`)
   - `seats` (`[String]`), `totalPrice` (Number)
   - `paymentStatus` (`"pending"` | `"paid"` | `"cancelled"`), `paymentMethod`, `paidAt` (Date).

---

## 6. Kebutuhan Fungsional & Kontrak RESTful API

### 6.1 Health Check
- `GET /` *(Public)* — Informasi aplikasi, kelompok, dan daftar endpoint.

### 6.2 Autentikasi JWT (`/api/auth`)
- `POST /api/auth/register` *(Public)* — Registrasi akun penonton baru (selalu `role: "user"`), mengembalikan JWT token.
- `POST /api/auth/login` *(Public)* — Login email & kata sandi, mengembalikan JWT token.
- `GET /api/auth/me` *(Protected: User/Admin)* — Mengambil profil user yang sedang login dari token Bearer.

### 6.3 Manajemen Film (`/api/movies`)
- `GET /api/movies` *(Public)* — Daftar film dengan filter `?status=`, `?genre=`, `?search=`, `?sort=`, `?page=`, `?limit=`.
- `GET /api/movies/:id` *(Public)* — Detail film.
- `POST /api/movies` *(Admin)* — Tambah film baru.
- `PUT /api/movies/:id` *(Admin)* — Perbarui data film.
- `DELETE /api/movies/:id` *(Admin)* — Hapus film.

### 6.4 Manajemen Bioskop (`/api/cinemas`)
- `GET /api/cinemas` *(Public)* — Daftar bioskop & studio dengan filter `?city=`, `?search=`.
- `GET /api/cinemas/:id` *(Public)* — Detail bioskop.
- `POST /api/cinemas` *(Admin)* — Tambah bioskop.
- `PUT /api/cinemas/:id` *(Admin)* — Perbarui bioskop.
- `DELETE /api/cinemas/:id` *(Admin)* — Hapus bioskop.

### 6.5 Manajemen Jadwal Tayang (`/api/showtimes`)
- `GET /api/showtimes` *(Public)* — Daftar jadwal tayang (`populate` film & bioskop), filter `?movieId=`, `?cinemaId=`, `?date=`.
- `GET /api/showtimes/:id` *(Public)* — Detail jadwal tayang beserta `bookedSeats` untuk render peta kursi.
- `POST /api/showtimes` *(Admin)* — Tambah jadwal tayang (validasi keberadaan `movieId` & `cinemaId`).
- `PUT /api/showtimes/:id` *(Admin)* — Perbarui jadwal tayang.
- `DELETE /api/showtimes/:id` *(Admin)* — Hapus jadwal tayang.

### 6.6 Pemesanan Tiket, Simulasi Pembayaran & E-Ticket (`/api/bookings`)
- `POST /api/bookings` *(Protected)* — Membuat pemesanan baru:
  - Normalisasi kursi (`uppercase`, unik).
  - Update atomik pada `Showtime` dengan syarat `{ _id: showtimeId, bookedSeats: { $nin: seats } }` dan `$addToSet` agar **anti double-booking** (mengembalikan `409 Conflict` jika kursi sudah terpesan).
  - Menghitung `totalPrice = showtime.price * seats.length`, menghasilkan `bookingCode` unik, status awal `pending`.
- `PUT /api/bookings/:id/pay` *(Protected — Pemilik / Admin)* — Simulasi pembayaran: mengubah status `pending` → `paid` dan mengisi `paidAt`.
- `PUT /api/bookings/:id/cancel` *(Protected — Pemilik / Admin)* — Membatalkan pesanan berstatus `pending` dan melepas kursi (`$pull` dari `Showtime.bookedSeats`).
- `GET /api/bookings/me` *(Protected)* — Riwayat pemesanan & *e-ticket* milik pengguna yang login.
- `GET /api/bookings/:id` *(Protected — Pemilik / Admin)* — Detail tiket / *e-ticket*.
- `GET /api/bookings` *(Admin)* — Daftar seluruh transaksi untuk dasbor admin.

---

## 7. Rencana Antarmuka Frontend SPA (Tahap Lanjut)

Mengacu pada prototype Figma dan Bab 4 Proposal:
1. **Halaman Login & Register:** Form email & password dengan validasi sisi klien, penyimpanan JWT token, dan tautan demo akun.
2. **Halaman Beranda & Daftar Film:** Tab *Sedang Tayang* / *Segera Hadir*, pencarian judul/genre, kartu film responsif (grid desktop, list vertikal mobile).
3. **Halaman Detail Film, Jadwal & Pilih Kursi:** Pilih kota/bioskop, jam tayang, peta kursi interaktif (hijau/tersedia, merah/terpesan), ringkasan harga.
4. **Halaman Simulasi Pembayaran & E-Ticket:** Konfirmasi metode pembayaran simulasi, menampilkan kode booking `CNV-XXXXXX`, status `paid`, dan detail studio/kursi.
5. **Halaman Riwayat Pesanan (`/riwayat` — Protected Route):** Daftar tiket pengguna beserta status transaksi.
6. **Dasbor Admin (`/admin` — Protected Route Admin):** CRUD Film, Bioskop, Jadwal Tayang, dan pantau semua Booking.

---

## 8. Pemetaan Sub-CPMK RPS & Target Jadwal

| Capaian RPS | Bukti Implementasi |
|---|---|
| **Sub-CPMK-4, 5, 6** | Express.js RESTful API murni JSON, CORS, dotenv, error handler terpusat, arsitektur MVC/Layered |
| **Sub-CPMK-7** | Postman Collection + automated test assertions (`pm.test`) untuk seluruh endpoint |
| **Sub-CPMK-8, 9** | 5 Model Mongoose di MongoDB Atlas + CRUD lengkap |
| **Sub-CPMK-10** | Autentikasi stateless JWT (register, login, middleware `protect` & `authorizeAdmin`) |
| **Sub-CPMK-11 s.d. 14** | Rencana pengembangan Frontend SPA React + Vite, integrasi JWT/Axios, & deployment |

**Target Jadwal:**
- **Kamis, 26 November 2026 (21.00 WIB):** Laporan progres Backend ke dosen.
- **Selasa, 1 Desember 2026:** Jadwal demonstrasi Kelompok 3 via Google Meet.
