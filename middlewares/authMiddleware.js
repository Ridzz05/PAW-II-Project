const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token Bearer tidak ditemukan.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET belum dikonfigurasi di environment variables.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Pengguna untuk token ini tidak ditemukan.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang diizinkan.",
    });
  }
  next();
}

module.exports = { protect, authorizeAdmin };
