const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      required: [true, "Kode booking wajib ada"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId wajib diisi"],
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: [true, "showtimeId wajib diisi"],
    },
    seats: {
      type: [String],
      required: [true, "Kursi wajib dipilih"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Minimal satu kursi harus dipilih",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Total harga wajib diisi"],
      min: [0, "Total harga tidak boleh negatif"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "virtual_account",
      trim: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
