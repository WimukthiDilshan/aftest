const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Using URI: ${process.env.MONGODB_URI.substring(0, 20)}...`); // Log part of the URI for debugging (not full for security)
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Add connection options if needed
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test database connection by listing collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error(`Message: ${error.message}`);
    console.error('Full error:', error);
    
    // More specific error handling
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check your connection string and network connection.');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 