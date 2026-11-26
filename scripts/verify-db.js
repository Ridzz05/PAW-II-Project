require("dotenv").config();
const mongoose = require("mongoose");

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI belum diatur.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    console.log("✅ Koneksi MongoDB Atlas berhasil.");
    console.log(`Database: ${db.databaseName}`);

    const collections = await db.listCollections().toArray();
    console.log("Collection yang ditemukan:");

    if (collections.length === 0) {
      console.log("⚠️ Belum ada collection. Jalankan: npm run seed");
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`- ${collection.name}: ${count} dokumen`);
      }
    }
  } catch (error) {
    console.error("❌ Koneksi MongoDB gagal.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
