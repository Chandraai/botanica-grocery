const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Try to connect to the provided URI or local MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`Local/Remote MongoDB Connection Failed: ${error.message}`);
    console.log('Falling back to In-Memory MongoDB for development/testing...');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${mongoUri}`);
    } catch (memoryError) {
      console.error(`In-Memory MongoDB Failed to Start: ${memoryError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
