function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Terjadi kesalahan pada server.";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Format ID tidak valid untuk field '${err.path}'.`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {}).join(", ");
    message = `Data duplikat pada field: ${fields || "unik"}.`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token tidak valid.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token sudah kedaluwarsa. Silakan login kembali.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { notFound, errorHandler };
