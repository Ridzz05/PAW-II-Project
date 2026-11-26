const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET belum dikonfigurasi di environment variables.");
  }
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan kata sandi wajib diisi.",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan kata sandi wajib diisi.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Email atau kata sandi salah.",
      });
    }

    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: "Login berhasil.",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  res.status(200).json({
    success: true,
    data: req.user,
  });
}

module.exports = { register, login, getMe };
