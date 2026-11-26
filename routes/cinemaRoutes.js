const express = require("express");
const {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
} = require("../controllers/cinemaController");
const { protect, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getCinemas);
router.get("/:id", getCinemaById);
router.post("/", protect, authorizeAdmin, createCinema);
router.put("/:id", protect, authorizeAdmin, updateCinema);
router.delete("/:id", protect, authorizeAdmin, deleteCinema);

module.exports = router;
