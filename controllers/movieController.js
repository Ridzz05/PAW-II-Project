const Movie = require("../models/Movie");

async function getMovies(req, res, next) {
  try {
    const { status, genre, search, sort = "-createdAt", page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (genre) filter.genre = { $in: [new RegExp(`^${genre}$`, "i")] };
    if (search) filter.title = { $regex: search, $options: "i" };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(limitNum),
      Movie.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      data: movies,
    });
  } catch (err) {
    next(err);
  }
}

async function getMovieById(req, res, next) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Film tidak ditemukan.",
      });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: "Film berhasil ditambahkan.",
      data: movie,
    });
  } catch (err) {
    next(err);
  }
}

async function updateMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Film tidak ditemukan.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Film berhasil diperbarui.",
      data: movie,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Film tidak ditemukan.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Film berhasil dihapus.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
