const Showtime = require("../models/Showtime");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");

async function getShowtimes(req, res, next) {
  try {
    const { movieId, cinemaId, date } = req.query;
    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (cinemaId) filter.cinemaId = cinemaId;
    if (date) filter.date = date;

    const showtimes = await Showtime.find(filter)
      .populate("movieId", "title genre duration ageRating posterUrl status")
      .populate("cinemaId", "name city address")
      .sort("date time");

    res.status(200).json({
      success: true,
      total: showtimes.length,
      data: showtimes,
    });
  } catch (err) {
    next(err);
  }
}

async function getShowtimeById(req, res, next) {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movieId", "title genre duration ageRating posterUrl status")
      .populate("cinemaId", "name city address studios");

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Jadwal tayang tidak ditemukan.",
      });
    }

    res.status(200).json({ success: true, data: showtime });
  } catch (err) {
    next(err);
  }
}

async function createShowtime(req, res, next) {
  try {
    const { movieId, cinemaId } = req.body;
    const [movie, cinema] = await Promise.all([
      Movie.findById(movieId),
      Cinema.findById(cinemaId),
    ]);

    if (!movie) {
      return res.status(404).json({ success: false, message: "Film tidak ditemukan." });
    }
    if (!cinema) {
      return res.status(404).json({ success: false, message: "Bioskop tidak ditemukan." });
    }

    const showtime = await Showtime.create(req.body);
    res.status(201).json({
      success: true,
      message: "Jadwal tayang berhasil ditambahkan.",
      data: showtime,
    });
  } catch (err) {
    next(err);
  }
}

async function updateShowtime(req, res, next) {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Jadwal tayang tidak ditemukan.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Jadwal tayang berhasil diperbarui.",
      data: showtime,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteShowtime(req, res, next) {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Jadwal tayang tidak ditemukan.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Jadwal tayang berhasil dihapus.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};
