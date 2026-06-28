const mongoose = require('mongoose');

/**
 * Task Schema
 * 
 * Fields:
 *  - title       (required) — Short task name, max 100 chars
 *  - description (optional) — Longer details about the task
 *  - status      — Enum: 'pending' | 'in-progress' | 'completed' (default: pending)
 *  - priority    — Enum: 'low' | 'medium' | 'high' (default: medium)
 *  - dueDate     — Optional deadline stored as Date
 *  - createdAt   — Auto-set by Mongoose timestamps option
 *  - updatedAt   — Auto-set by Mongoose timestamps option
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be pending, in-progress, or completed',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    list: {
      type: String,
      trim: true,
      default: 'Personal',
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Task must belong to a user'],
      index:    true,
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Index for faster filtering & sorting by common query params
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ priority: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
