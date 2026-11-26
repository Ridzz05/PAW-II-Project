const crypto = require("crypto");
const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");

const bookingPopulate = {
  path: "showtimeId",
  populate: [
    { path: "movieId", select: "title duration ageRating posterUrl" },
    { path: "cinemaId", select: "name city address" },
  ],
};

function generateBookingCode() {
  return `CNV-${crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 6)}`;
}

async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate(bookingPopulate)
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      total: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllBookings(req, res, next) {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate(bookingPopulate)
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      total: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email")
      .populate(bookingPopulate);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Data pemesanan tidak ditemukan.",
      });
    }

    const isOwner = booking.userId._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke tiket ini.",
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

async function createBooking(req, res, next) {
  try {
    const { showtimeId, seats, paymentMethod } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "showtimeId dan daftar kursi (seats) wajib diisi.",
      });
    }

    const normalizedSeats = [...new Set(seats.map((s) => String(s).trim().toUpperCase()).filter(Boolean))];
    if (normalizedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal satu kursi yang valid harus dipilih.",
      });
    }

    // Reservasi kursi secara atomik agar tidak terjadi double booking
    const showtime = await Showtime.findOneAndUpdate(
      { _id: showtimeId, bookedSeats: { $nin: normalizedSeats } },
      { $addToSet: { bookedSeats: { $each: normalizedSeats } } },
      { new: true }
    );

    if (!showtime) {
      const exists = await Showtime.findById(showtimeId);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Jadwal tayang tidak ditemukan.",
        });
      }
      return res.status(409).json({
        success: false,
        message: "Salah satu atau beberapa kursi yang dipilih sudah dipesan.",
      });
    }

    const totalPrice = showtime.price * normalizedSeats.length;

    const booking = await Booking.create({
      bookingCode: generateBookingCode(),
      userId: req.user._id,
      showtimeId,
      seats: normalizedSeats,
      totalPrice,
      paymentStatus: "pending",
      paymentMethod: paymentMethod || "virtual_account",
    });

    const populated = await Booking.findById(booking._id).populate(bookingPopulate);

    res.status(201).json({
      success: true,
      message: "Pemesanan tiket berhasil dibuat. Silakan selesaikan pembayaran.",
      data: populated,
    });
  } catch (err) {
    next(err);
  }
}

async function payBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Data pemesanan tidak ditemukan.",
      });
    }

    const isOwner = booking.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk membayar pesanan ini.",
      });
    }

    if (booking.paymentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Pesanan tidak dapat dibayar karena berstatus '${booking.paymentStatus}'.`,
      });
    }

    booking.paymentStatus = "paid";
    booking.paidAt = new Date();
    if (req.body.paymentMethod) {
      booking.paymentMethod = req.body.paymentMethod;
    }
    await booking.save();

    const populated = await Booking.findById(booking._id).populate(bookingPopulate);

    res.status(200).json({
      success: true,
      message: "Pembayaran berhasil disimulasikan. E-ticket siap digunakan.",
      data: populated,
    });
  } catch (err) {
    next(err);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Data pemesanan tidak ditemukan.",
      });
    }

    const isOwner = booking.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk membatalkan pesanan ini.",
      });
    }

    if (booking.paymentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Pesanan tidak dapat dibatalkan karena berstatus '${booking.paymentStatus}'.`,
      });
    }

    booking.paymentStatus = "cancelled";
    await booking.save();

    await Showtime.findByIdAndUpdate(booking.showtimeId, {
      $pull: { bookedSeats: { $in: booking.seats } },
    });

    res.status(200).json({
      success: true,
      message: "Pesanan berhasil dibatalkan dan kursi telah dilepaskan.",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyBookings,
  getAllBookings,
  getBookingById,
  createBooking,
  payBooking,
  cancelBooking,
};
