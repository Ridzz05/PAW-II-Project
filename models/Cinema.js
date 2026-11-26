const mongoose = require("mongoose");

const studioSubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama studio wajib diisi"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Regular", "IMAX", "Premiere"],
      default: "Regular",
    },
    rows: {
      type: Number,
      default: 6,
      min: 1,
    },
    cols: {
      type: Number,
      default: 8,
      min: 1,
    },
  },
  { _id: false }
);

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama bioskop wajib diisi"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Kota bioskop wajib diisi"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Alamat bioskop wajib diisi"],
      trim: true,
    },
    studios: {
      type: [studioSubSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cinema", cinemaSchema);
