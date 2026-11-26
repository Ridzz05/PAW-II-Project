const mongoose = require("mongoose");

// Cache koneksi global agar aman di lingkungan serverless (Vercel)
global._mongooseCache = global._mongooseCache || { conn: null, promise: null };

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI belum dikonfigurasi di environment variables.");
  }

  if (global._mongooseCache.conn && mongoose.connection.readyState === 1) {
    return global._mongooseCache.conn;
  }

  if (!global._mongooseCache.promise) {
    global._mongooseCache.promise = mongoose
      .connect(uri)
      .then((m) => m)
      .catch((err) => {
        global._mongooseCache.promise = null;
        throw err;
      });
  }

 global._mongooseCache.conn = await global._mongooseCache.promise;

console.log("MongoDB berhasil terhubung!");

return global._mongooseCache.conn;
}

module.exports = { connectDB };
