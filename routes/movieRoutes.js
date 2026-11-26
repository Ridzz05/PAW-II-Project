const express = require("express");
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { protect, authorizeAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", protect, authorizeAdmin, createMovie);
router.put("/:id", protect, authorizeAdmin, updateMovie);
router.delete("/:id", protect, authorizeAdmin, deleteMovie);

module.exports = router;
