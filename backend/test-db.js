require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log(`Using MongoDB URI: ${process.env.MONGODB_URI.substring(0, 20)}...`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connection successful!');
    console.log(`Connected to MongoDB host: ${conn.connection.host}`);
    
    // Try to list collections
    console.log('\nListing collections:');
    const collections = await conn.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('No collections found. Database may be empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Try creating a test document
    console.log('\nCreating a test document...');
    const TestModel = mongoose.model('TestConnection', new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    }));
    
    const testDoc = await TestModel.create({ name: 'Test Connection' });
    console.log(`✅ Test document created with ID: ${testDoc._id}`);
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document deleted');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    console.log('All tests passed! Your database connection is working properly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error(`Error: ${error.message}`);
    console.error('Full error:', error);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\nCONNECTION ISSUE: Could not connect to MongoDB server.');
      console.error('This could be due to:');
      console.error('1. Wrong connection string');
      console.error('2. Network issues');
      console.error('3. MongoDB server is not running or accessible');
      console.error('4. Credentials are incorrect');
    }
    
    if (error.name === 'MongoParseError') {
      console.error('\nCONNECTION STRING ISSUE: Invalid MongoDB connection string format.');
    }
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    
    process.exit(1);
  }
};

testConnection(); 