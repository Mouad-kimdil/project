const User = require('../models/User');

// Register user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    console.log('Register attempt:', { firstName, lastName, email });

    // For development - always succeed with registration
    // Create a mock user object that mimics what would be returned from the database
    const user = {
      _id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      role: 'user',
      getSignedJwtToken: () => 'mock-jwt-token-' + Date.now()
    };

    console.log('User registered successfully:', email);
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email);

    // Validate email & password
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // For development - always succeed with login
    // Create a mock user object
    const user = {
      _id: `user_${Date.now()}`,
      firstName: email.split('@')[0],
      lastName: 'User',
      email,
      role: 'user',
      getSignedJwtToken: () => 'mock-jwt-token-' + Date.now()
    };

    console.log('User logged in successfully:', email);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  try {
    // For development - return the user from the request
    const user = req.user || {
      _id: 'mock-user-id',
      firstName: 'Mock',
      lastName: 'User',
      email: 'mock@example.com',
      role: 'user'
    };
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Log user out
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken ? user.getSignedJwtToken() : 'mock-jwt-token-' + Date.now();

  // Remove password from output
  if (user.password) user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || 'user'
    }
  });
};