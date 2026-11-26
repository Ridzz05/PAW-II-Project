const express = require("express");
const {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} = require("../controllers/showtimeController");
const { protect, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getShowtimes);
router.get("/:id", getShowtimeById);
router.post("/", protect, authorizeAdmin, createShowtime);
router.put("/:id", protect, authorizeAdmin, updateShowtime);
router.delete("/:id", protect, authorizeAdmin, deleteShowtime);

module.exports = router;
