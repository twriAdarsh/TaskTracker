const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: sign a JWT for a given user id ──────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

// ── Helper: build the response object sent after auth ───────────
const authResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      createdAt: user.createdAt,
    },
  });
};

// ─────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check for duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });
  authResponse(user, 201, res);
};

// ─────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error('Please provide email and password');
    err.statusCode = 400;
    throw err;
  }

  // password field excluded by default — explicitly select it back
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  authResponse(user, 200, res);
};

// ─────────────────────────────────────────────
// @desc    Get currently logged-in user
// @route   GET /api/auth/me
// @access  Protected
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  res.status(200).json({ success: true, user: req.user });
};

// ─────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Protected
// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    
    // If they changed email, make sure it's not taken
    if (req.body.email && req.body.email !== user.email) {
      const existing = await User.findOne({ email: req.body.email });
      if (existing) {
        const err = new Error('Email is already in use by another account');
        err.statusCode = 409;
        throw err;
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();
    authResponse(updatedUser, 200, res);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// ─────────────────────────────────────────────
// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Protected
// ─────────────────────────────────────────────
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const user = await User.findById(req.user._id).select('+password');
  
  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } else {
    res.status(401);
    throw new Error('Incorrect current password');
  }
};

module.exports = { register, login, getMe, updateProfile, updatePassword };
