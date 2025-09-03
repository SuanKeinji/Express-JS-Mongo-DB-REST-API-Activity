const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);  // No options needed here
    console.log('MongoDB connected successfully!');

    // await mongoose.connection.close();
    // console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

testConnection();
