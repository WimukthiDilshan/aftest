const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Register user
router.post('/', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

// Favorite routes
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:cca3', protect, removeFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router; 