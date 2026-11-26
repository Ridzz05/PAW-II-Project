require("dotenv").config();

const mongoose = require("mongoose");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const Showtime = require("../models/Showtime");
const Booking = require("../models/Booking");

async function seed() {
  try {
    await connectDB();
    console.log("Terhubung ke MongoDB. Membersihkan data lama...");

    await Promise.all([
      Booking.deleteMany({}),
      Showtime.deleteMany({}),
      Cinema.deleteMany({}),
      Movie.deleteMany({}),
      User.deleteMany({}),
    ]);

    const [adminUser, budiUser] = await User.create([
      {
        name: "Admin Cinoverse",
        email: "admin@cinoverse.id",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Budi Santoso",
        email: "budi@email.com",
        password: "budi123",
        role: "user",
      },
    ]);

    const movies = await Movie.create([
      {
        title: "Dune: Messiah",
        genre: ["Sci-Fi", "Epic", "Drama"],
        duration: 165,
        rating: 8.6,
        ageRating: "13+",
        language: "English",
        synopsis:
          "Paul Atreides menghadapi konsekuensi kekuasaannya sebagai Kaisar Alam Semesta di tengah konspirasi politik dan perang suci di seluruh galaksi.",
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600",
        status: "now_showing",
        releaseDate: new Date("2026-11-10"),
      },
      {
        title: "The Last Horizon",
        genre: ["Thriller", "Mystery"],
        duration: 128,
        rating: 7.9,
        ageRating: "13+",
        language: "English",
        synopsis:
          "Ekspedisi ilmiah ke wilayah terpencil menemukan sinyal misterius yang mengancam seluruh kru di stasiun observasi.",
        posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600",
        status: "now_showing",
        releaseDate: new Date("2026-11-15"),
      },
      {
        title: "Interstellar: Reborn",
        genre: ["Sci-Fi", "Adventure"],
        duration: 158,
        rating: 8.4,
        ageRating: "13+",
        language: "English",
        synopsis:
          "Misi penyelamatan umat manusia menembus lubang cacing menuju sistem bintang baru demi menemukan planet layak huni.",
        posterUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600",
        status: "now_showing",
        releaseDate: new Date("2026-11-20"),
      },
      {
        title: "Midnight in Jakarta",
        genre: ["Drama", "Romance"],
        duration: 112,
        rating: 8.1,
        ageRating: "17+",
        language: "Indonesia",
        synopsis:
          "Dua orang asing bertemu secara kebetulan di tengah hujan malam ibu kota dan berbagi kisah hidup hingga fajar menyingsing.",
        posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600",
        status: "coming_soon",
        releaseDate: new Date("2026-12-12"),
      },
    ]);

    const cinemas = await Cinema.create([
      {
        name: "Cinoverse Grand Plaza",
        city: "Palembang",
        address: "Jl. Jenderal Sudirman No. 120, Palembang",
        studios: [
          { name: "Studio 1 - IMAX", type: "IMAX", rows: 6, cols: 8 },
          { name: "Studio 2", type: "Regular", rows: 6, cols: 8 },
        ],
      },
      {
        name: "Cinoverse Icon Mall",
        city: "Palembang",
        address: "Jl. POM IX No. 45, Palembang",
        studios: [
          { name: "Studio 1", type: "Regular", rows: 6, cols: 8 },
          { name: "Studio 2 - Premiere", type: "Premiere", rows: 4, cols: 6 },
        ],
      },
    ]);

    const showtimes = await Showtime.create([
      {
        movieId: movies[0]._id,
        cinemaId: cinemas[0]._id,
        studioName: "Studio 1 - IMAX",
        studioType: "IMAX",
        date: "2026-11-28",
        time: "14:00",
        price: 85000,
        bookedSeats: ["A4"],
      },
      {
        movieId: movies[0]._id,
        cinemaId: cinemas[0]._id,
        studioName: "Studio 2",
        studioType: "Regular",
        date: "2026-11-28",
        time: "19:30",
        price: 50000,
        bookedSeats: [],
      },
      {
        movieId: movies[1]._id,
        cinemaId: cinemas[1]._id,
        studioName: "Studio 1",
        studioType: "Regular",
        date: "2026-11-28",
        time: "16:15",
        price: 50000,
        bookedSeats: [],
      },
      {
        movieId: movies[2]._id,
        cinemaId: cinemas[1]._id,
        studioName: "Studio 2 - Premiere",
        studioType: "Premiere",
        date: "2026-11-29",
        time: "20:00",
        price: 100000,
        bookedSeats: [],
      },
    ]);

    await Booking.create({
      bookingCode: "CNV-M7IXR5",
      userId: budiUser._id,
      showtimeId: showtimes[0]._id,
      seats: ["A4"],
      totalPrice: 85000,
      paymentStatus: "paid",
      paymentMethod: "virtual_account",
      paidAt: new Date(),
    });

    console.log("Seed berhasil! Akun demo:");
    console.log(`- Admin: ${adminUser.email} / admin123`);
    console.log(`- User : ${budiUser.email} / budi123`);
    console.log(`Total data: ${movies.length} film, ${cinemas.length} bioskop, ${showtimes.length} jadwal, 1 booking.`);
  } catch (err) {
    console.error("Seed gagal:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
