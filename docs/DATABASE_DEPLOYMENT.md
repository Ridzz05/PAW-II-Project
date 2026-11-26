# CINOVERSE - Database & Deployment

Dokumen ini khusus untuk bagian Database & Deployment.

## 1. Buat file `.env`

Salin `.env.example` menjadi `.env`.

Isi:

``` env
PORT=3000
MONGODB_URI=CONNECTION_STRING_MONGODB_ATLAS_ANDA
JWT_SECRET=SECRET_JWT_ANDA
JWT_EXPIRES_IN=7d
```

Jangan commit `.env` ke GitHub.

## 2. MongoDB Atlas

Buat cluster dan database user di MongoDB Atlas.

Network Access harus mengizinkan server Vercel terhubung. Untuk
konfigurasi tugas ini, gunakan `0.0.0.0/0` sesuai instruksi project.

Connection string harus mengarah ke database:

`cinoverse`

Contoh format:

`mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/cinoverse?retryWrites=true&w=majority`

## 3. Install dependency

``` bash
npm install
```

## 4. Cek koneksi database

File `scripts/verify-db.js` dapat digunakan untuk memeriksa koneksi.

``` bash
node scripts/verify-db.js
```

Jika database masih kosong:

``` bash
npm run seed
```

Jangan menjalankan `npm run seed` setelah membuat data testing penting
karena seed membersihkan data lama terlebih dahulu.

## 5. Jalankan backend lokal

``` bash
npm run dev
```

Tes:

`GET http://localhost:3000/`

dan:

`GET http://localhost:3000/api/movies`

## 6. Push ke GitHub

Pastikan `.env` tidak ikut ter-upload.

``` bash
git status
git add .
git commit -m "configure database and deployment"
git push
```

## 7. Vercel

Import repository backend ke Vercel.

Tambahkan Environment Variables:

-   `MONGODB_URI`
-   `JWT_SECRET`
-   `JWT_EXPIRES_IN`

Deploy atau Redeploy.

## 8. Tes production

Tes:

`GET https://URL-VERCEL-ANDA/`

dan:

`GET https://URL-VERCEL-ANDA/api/movies`

Jika data movies muncul, berarti Vercel berhasil terhubung ke MongoDB
Atlas.

## 9. Postman

Pada variable `baseUrl`, ubah:

``` text
http://localhost:3000
```

menjadi:

``` text
https://URL-VERCEL-ANDA
```

Kemudian jalankan kembali endpoint Auth, Movies, Cinemas, Showtimes, dan
Bookings.

## 10. Bukti untuk laporan

Simpan screenshot:

1.  MongoDB Atlas dengan database `cinoverse`.
2.  Collection `users`, `movies`, `cinemas`, `showtimes`, `bookings`.
3.  Postman endpoint lokal yang berhasil.
4.  Vercel Deployment Ready.
5.  Postman endpoint production yang berhasil.
