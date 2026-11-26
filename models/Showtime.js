const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "movieId wajib diisi"],
    },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: [true, "cinemaId wajib diisi"],
    },
    studioName: {
      type: String,
      required: [true, "Nama studio wajib diisi"],
      trim: true,
    },
    studioType: {
      type: String,
      enum: ["Regular", "IMAX", "Premiere"],
      default: "Regular",
    },
    date: {
      type: String,
      required: [true, "Tanggal tayang wajib diisi (contoh: 2026-11-28)"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Jam tayang wajib diisi (contoh: 14:00)"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Harga tiket wajib diisi"],
      min: [0, "Harga tiket tidak boleh negatif"],
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Showtime", showtimeSchema);
