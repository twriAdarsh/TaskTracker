const express  = require('express');
const router   = express.Router();
const { body } = require('express-validator');

const { register, login, getMe, updateProfile, updatePassword } = require('../controllers/authController');
const validate = require('../middleware/validate');
const protect  = require('../middleware/protect');

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerRules, validate, register);
router.post('/login',    loginRules,    validate, login);
router.get('/me',        protect,               getMe);
router.put('/profile',   protect,               updateProfile);
router.put('/password',  protect,               updatePassword);

module.exports = router;
