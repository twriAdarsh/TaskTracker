const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI stored in environment variables.
 * Exits the process if connection fails — no point running the server without a DB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Fail fast — let the process manager restart the server
  }
};

module.exports = connectDB;
