
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 60000, // How long the socket can be idle before closing
      connectTimeoutMS: 30000, // How long to wait for initial connection
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
      console.error('4. MongoDB Atlas IP whitelist settings'.red);
    }
    
    if (error.name === 'MongooseError') {
      console.error('Mongoose connection error. Please check:'.red);
      console.error('1. MongoDB service is running'.red);
      console.error('2. Database name is correct'.red);
    }
    
    // Don't exit the process immediately in development to allow for reconnection attempts
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    throw error; // Re-throw for handling elsewhere
  }
};

module.exports = { connectDB };
