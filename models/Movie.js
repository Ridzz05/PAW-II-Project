const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Judul film wajib diisi"],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, "Genre film wajib diisi"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Minimal satu genre harus diisi",
      },
    },
    duration: {
      type: Number,
      required: [true, "Durasi film (menit) wajib diisi"],
      min: [1, "Durasi minimal 1 menit"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating minimal 0"],
      max: [10, "Rating maksimal 10"],
    },
    ageRating: {
      type: String,
      default: "13+",
      trim: true,
    },
    language: {
      type: String,
      default: "Indonesia",
      trim: true,
    },
    synopsis: {
      type: String,
      required: [true, "Sinopsis film wajib diisi"],
      trim: true,
    },
    posterUrl: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      default: "now_showing",
    },
    releaseDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
