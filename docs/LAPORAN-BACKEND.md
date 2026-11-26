# Laporan Diskusi Project UAS – Backend

**Mata Kuliah:** Pengembangan Aplikasi Web II (SI0027)  
**Tanggal:** 26 November 2026  
**Kelompok:** 3 (CINOVERSE – Sistem Pemesanan Tiket Bioskop Secara Online)  

**Anggota yang hadir/terlibat:**
1. M. Rizki Algipari (2428240069)
2. Putri Angel Li (2428240091)
3. Fellisa Anastasya (2428240094)
4. Deisy Callisca Chandra (2428240054)
5. Putri Reda Maulidia (2428240086)

---

## 1. Database
- **Jenis:** MongoDB Atlas
- **Koleksi yang dibuat:** `users`, `movies`, `cinemas`, `showtimes`, `bookings`

## 2. RESTful API CRUD (SUB-CPMK-9)
Endpoint yang sudah selesai:
- `GET /` *(info API & health check)*
- `GET /api/movies`, `GET /api/movies/:id`, `POST /api/movies`, `PUT /api/movies/:id`, `DELETE /api/movies/:id`
- `GET /api/cinemas`, `GET /api/cinemas/:id`, `POST /api/cinemas`, `PUT /api/cinemas/:id`, `DELETE /api/cinemas/:id`
- `GET /api/showtimes`, `GET /api/showtimes/:id`, `POST /api/showtimes`, `PUT /api/showtimes/:id`, `DELETE /api/showtimes/:id`
- `GET /api/bookings/me`, `GET /api/bookings`, `GET /api/bookings/:id`, `POST /api/bookings`, `PUT /api/bookings/:id/pay`, `PUT /api/bookings/:id/cancel`

## 3. Autentikasi JWT (SUB-CPMK-10)
- **Register:** Sudah (`POST /api/auth/register`)
- **Login:** Sudah (`POST /api/auth/login`)
- **Middleware verifikasi token:** Sudah (`protect` & `authorizeAdmin`)
- **Endpoint yang sudah diproteksi:**
  - `GET /api/auth/me` *(user login)*
  - `POST`, `PUT`, `DELETE /api/movies` *(admin)*
  - `POST`, `PUT`, `DELETE /api/cinemas` *(admin)*
  - `POST`, `PUT`, `DELETE /api/showtimes` *(admin)*
  - `GET /api/bookings/me`, `GET /api/bookings/:id`, `POST /api/bookings`, `PUT /api/bookings/:id/pay`, `PUT /api/bookings/:id/cancel` *(user login)*
  - `GET /api/bookings` *(admin)*

## 4. Deploy Vercel
- **Status:** Sudah
- **Link Backend API:** https://cinoverse-backend.vercel.app/
- **Repository GitHub:** https://github.com/Ridzz05/PAW-II-Project

## 5. Pengujian Postman
Postman Collection (`postman/Cinoverse-API.postman_collection.json`) berisi **27 request** lengkap dengan *automated test script* (assertion status code & format JSON) sudah disiapkan untuk seluruh endpoint Auth, Movies, Cinemas, Showtimes, dan Bookings & E-Ticket. Pengujian akhir seluruh endpoint pada URL Vercel diselesaikan bersamaan dengan finalisasi konfigurasi Environment Variables MongoDB Atlas.

## 6. Pembagian Tugas Anggota
**Backend (sekarang):**
- **M. Rizki Algipari:** Setup project Express.js, perancangan 5 model Mongoose, RESTful API CRUD, autentikasi JWT & middleware proteksi route, konfigurasi & deploy Vercel
- **Deisy Callisca Chandra:** Perancangan basis data MongoDB Atlas dan pendukung deployment Vercel
- **Putri Reda Maulidia:** Penyusunan dokumentasi API, Postman Collection, dan pengujian (QA)

**Frontend (rencana):**
- **Putri Angel Li:** Pengembangan antarmuka web React (daftar film, jadwal tayang, pemilihan kursi, checkout, riwayat e-ticket) dan integrasi RESTful API
- **Fellisa Anastasya:** Finalisasi desain UI/UX responsif (desktop & mobile) sesuai prototype Figma serta penyesuaian komponen tampilan

## 7. Kendala yang Dihadapi
- Menyesuaikan mekanisme penguncian kursi (`bookedSeats`) agar tidak terjadi *double booking* saat kursi yang sama dipilih bersamaan; sudah diatasi dengan update atomik (`$nin` dan `$addToSet`) pada koleksi `showtimes`.
- Saat deploy ke Vercel, koneksi MongoDB untuk lingkungan serverless perlu dioptimalkan agar tidak timeout dan memerlukan konfigurasi Environment Variables (`MONGODB_URI` & `JWT_SECRET`) serta izin Network Access `0.0.0.0/0` di MongoDB Atlas; koneksi sudah diatasi dengan *global connection cache* di `config/db.js` dan sedang finalisasi environment variables di Vercel.

## 8. Rencana Sebelum Demonstrasi (Selasa, 1 Desember 2026)
Menyelesaikan konfigurasi Environment Variables MongoDB Atlas & `JWT_SECRET` di Vercel, menjalankan seed data awal (film, bioskop, jadwal, akun demo), menjalankan penuh Postman Collection Runner terhadap URL Vercel, serta merapikan dokumentasi untuk demonstrasi.
