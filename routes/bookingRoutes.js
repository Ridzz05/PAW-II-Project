const express = require("express");
const {
  getMyBookings,
  getAllBookings,
  getBookingById,
  createBooking,
  payBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyBookings);
router.get("/", protect, authorizeAdmin, getAllBookings);
router.get("/:id", protect, getBookingById);
router.post("/", protect, createBooking);
router.put("/:id/pay", protect, payBooking);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
