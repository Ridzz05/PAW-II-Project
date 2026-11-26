require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const { logger } = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Health check / info API (tanpa membutuhkan koneksi database)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    app: "CINOVERSE Backend API",
    deskripsi: "Sistem Pemesanan Tiket Bioskop Secara Online",
    kelompok: "Kelompok 3 (SI5B)",
    database: "MongoDB (Mongoose)",
    endpoints: {
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/login",
        "GET /api/auth/me",
      ],
      movies: [
        "GET /api/movies",
        "GET /api/movies/:id",
        "POST /api/movies (Admin)",
        "PUT /api/movies/:id (Admin)",
        "DELETE /api/movies/:id (Admin)",
      ],
      cinemas: [
        "GET /api/cinemas",
        "GET /api/cinemas/:id",
        "POST /api/cinemas (Admin)",
        "PUT /api/cinemas/:id (Admin)",
        "DELETE /api/cinemas/:id (Admin)",
      ],
      showtimes: [
        "GET /api/showtimes",
        "GET /api/showtimes/:id",
        "POST /api/showtimes (Admin)",
        "PUT /api/showtimes/:id (Admin)",
        "DELETE /api/showtimes/:id (Admin)",
      ],
      bookings: [
        "GET /api/bookings/me (Auth)",
        "GET /api/bookings (Admin)",
        "GET /api/bookings/:id (Auth)",
        "POST /api/bookings (Auth)",
        "PUT /api/bookings/:id/pay (Auth)",
        "PUT /api/bookings/:id/cancel (Auth)",
      ],
    },
  });
});

// Pastikan koneksi MongoDB siap sebelum menangani route /api (aman untuk Vercel serverless)
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server CINOVERSE berjalan di http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error(`Gagal terhubung ke MongoDB: ${err.message}`);
      process.exit(1);
    });
}

module.exports = app;
