const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — JWT Authentication Middleware
 *
 * Reads the Bearer token from the Authorization header,
 * verifies it, loads the user from DB, and attaches to req.user.
 * Every protected route calls next(err) on failure → global errorHandler.
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    const err = new Error('Not authorised — no token provided');
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user (without password) to request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      const err = new Error('User belonging to this token no longer exists');
      err.statusCode = 401;
      return next(err);
    }
    next();
  } catch (error) {
    const err = new Error('Not authorised — invalid or expired token');
    err.statusCode = 401;
    next(err);
  }
};

module.exports = protect;
