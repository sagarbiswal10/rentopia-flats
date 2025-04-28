
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Add connection options for better reliability
      serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
      socketTimeoutMS: 45000, // How long the socket can be idle before closing
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    // More detailed error logging
    if (error.name === 'MongoServerSelectionError') {
      console.error('Failed to connect to MongoDB server. Please check:'.red);
      console.error('1. Your MongoDB connection string'.red);
      console.error('2. Network connectivity to MongoDB'.red);
      console.error('3. MongoDB server status'.red);
    }
    process.exit(1);
  }
};

module.exports = { connectDB };
