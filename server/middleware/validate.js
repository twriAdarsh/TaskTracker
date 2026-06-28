const { validationResult } = require('express-validator');

/**
 * Centralized validation middleware.
 * 
 * Place this AFTER your express-validator chain in a route definition.
 * It collects all validation errors and returns a structured 422 response
 * so the frontend can map errors to specific fields.
 * 
 * Usage:
 *   router.post('/', taskValidationRules, validate, createTask);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Transform the array into a field-keyed object: { title: "Title is required", ... }
    const formattedErrors = errors.array().reduce((acc, err) => {
      if (!acc[err.path]) acc[err.path] = err.msg;
      return acc;
    }, {});

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
