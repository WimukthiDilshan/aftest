const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    console.log('Registration attempt:', { name, username, email });
    
    // Check if user already exists with that email or username
    const userEmailExists = await User.findOne({ email });
    if (userEmailExists) {
      console.log('Registration failed: Email already exists');
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      console.log('Registration failed: Username already taken');
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create new user
    const user = await User.create({
      name,
      username,
      email,
      password
    });

    if (user) {
      console.log('User registered successfully:', user._id);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      console.log('Registration failed: Invalid user data');
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({ 
      message: error.message,
      error: error.toString(),
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const loginIdentifier = email; // This could be email or username

  try {
    console.log('Login attempt with:', loginIdentifier);
    
    // Find user by email or username
    let user = await User.findOne({ email: loginIdentifier }).select('+password');
    
    // If not found by email, try username
    if (!user) {
      user = await User.findOne({ username: loginIdentifier }).select('+password');
    }

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      console.log('Login successful for user:', user._id);
      return res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ message: 'Invalid email/username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: error.toString(),
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    console.log('Profile request for user:', req.user._id);
    
    const user = await User.findById(req.user._id);

    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      });
    } else {
      console.log('Profile request failed: User not found');
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile request error:', error);
    return res.status(404).json({ 
      message: 'Failed to fetch profile',
      error: error.toString() 
    });
  }
};

module.exports = { registerUser, loginUser, getUserProfile }; 