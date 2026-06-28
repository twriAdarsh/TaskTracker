/**
 * Global Error Handler Middleware
 * 
 * Express recognises a 4-argument function as an error handler.
 * This must be registered LAST in server.js (after all routes).
 * 
 * Handles:
 *  - Mongoose CastError   → 400 (invalid ObjectId in URL param)
 *  - Mongoose ValidationError → 422 (schema-level validation failure)
 *  - Mongoose duplicate key  → 409
 *  - Generic errors           → 500
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Invalid MongoDB ObjectId (e.g., /tasks/not-a-real-id)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Resource not found — invalid id: ${err.value}`;
  }

  // Mongoose schema validation errors (fired when calling .save() without express-validator)
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // MongoDB duplicate key (e.g., unique index violation)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  const response = { success: false, message };
  if (errors) response.errors = errors;

  // Only expose stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
