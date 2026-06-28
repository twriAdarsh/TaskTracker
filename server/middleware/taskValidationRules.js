const { body } = require('express-validator');

/**
 * Validation rule chains for task endpoints.
 * 
 * Using express-validator's `body()` DSL to describe rules declaratively.
 * These arrays are spread into route definitions alongside the `validate` middleware.
 */

// Rules applied on CREATE (all required fields are enforced)
const taskCreateRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
];

// Rules applied on UPDATE (title is optional — partial updates allowed)
const taskUpdateRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty if provided')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
];

module.exports = { taskCreateRules, taskUpdateRules };
