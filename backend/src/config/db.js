const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas or fallback to local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/volunteer-hub';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Create a mock database for development if MongoDB connection fails
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock database for development');
      setupMockDB();
    } else {
      process.exit(1);
    }
  }
};

// Setup mock database for development
const setupMockDB = () => {
  // Mock User model methods
  const User = require('../models/User');
  
  // Override User.findOne to return mock data
  User.findOne = async ({ email }) => {
    if (email === 'admin@example.com') {
      return {
        _id: 'mock-user-id-1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin',
        matchPassword: async (password) => password === 'password123',
        getSignedJwtToken: () => 'mock-jwt-token'
      };
    }
    return null;
  };
  
  // Override User.create to return mock data
  User.create = async (userData) => {
    return {
      _id: 'mock-user-id-2',
      ...userData,
      role: 'user',
      matchPassword: async (password) => true,
      getSignedJwtToken: () => 'mock-jwt-token'
    };
  };
  
  // Override User.findById to return mock data
  User.findById = async (id) => {
    return {
      _id: id,
      firstName: 'Mock',
      lastName: 'User',
      email: 'mock@example.com',
      role: 'user'
    };
  };
};

module.exports = connectDB;