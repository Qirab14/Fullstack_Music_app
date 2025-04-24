// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Existing user check
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    user = new User({
      email,
      password: await bcrypt.hash(password, 12)
    });

    await user.save();

    // Generate token
    const token = generateToken(user);
    res.status(201).json({ token, userId: user._id });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;