const mongoose = require('mongoose');

const connectDB = async () => {
  // 🔐 Zeabur / 雲端防呆：沒有 MONGO_URI 就不要連
  if (!process.env.MONGO_URI) {
    console.warn('⚠️  MONGO_URI not set, skip MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // 雲端環境不建議 process.exit，交給平台重啟
    throw error;
  }
};

module.exports = connectDB;
