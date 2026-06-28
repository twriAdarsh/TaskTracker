const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');

/**
 * User Schema
 * Password is hashed via a pre-save hook — never stored in plain text.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false, // never returned in queries by default
    },
    customLists: {
      type: [String],
      default: ['Personal', 'Work', 'List 1'],
    },
    customTags: {
      type: [String],
      default: ['Tag 1', 'Tag 2'],
    },
  },
  { timestamps: true }
);

// ── Pre-save hook: hash password before storing ──────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if password changed
  const salt   = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plain text against stored hash ─────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
