const Cinema = require("../models/Cinema");

async function getCinemas(req, res, next) {
  try {
    const { city, search } = req.query;
    const filter = {};
    if (city) filter.city = { $regex: city, $options: "i" };
    if (search) filter.name = { $regex: search, $options: "i" };

    const cinemas = await Cinema.find(filter).sort("name");
    res.status(200).json({
      success: true,
      total: cinemas.length,
      data: cinemas,
    });
  } catch (err) {
    next(err);
  }
}

async function getCinemaById(req, res, next) {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Bioskop tidak ditemukan.",
      });
    }
    res.status(200).json({ success: true, data: cinema });
  } catch (err) {
    next(err);
  }
}

async function createCinema(req, res, next) {
  try {
    const cinema = await Cinema.create(req.body);
    res.status(201).json({
      success: true,
      message: "Bioskop berhasil ditambahkan.",
      data: cinema,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCinema(req, res, next) {
  try {
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Bioskop tidak ditemukan.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bioskop berhasil diperbarui.",
      data: cinema,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCinema(req, res, next) {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);
    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Bioskop tidak ditemukan.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Bioskop berhasil dihapus.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
};
