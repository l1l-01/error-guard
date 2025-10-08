// Custom error class to standardize errors across your app
class ErrorGuard extends Error {
  // Constructor takes a message, optional HTTP status code, and optional extra details
  constructor(statusCode = 500, code = "ERROR", message, details = null) {
    // Call the parent Error constructor to set the message
    super(message);

    // Set the error name to the class name
    this.name = this.constructor.name;
    // HTTP status code for the error
    this.statusCode = statusCode;
    // Code
    this.code = code;
    // Determine error type: 4XX is 'fail', 5XX is 'error'
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";

    // Marks this error as operational (expected, not a bug)
    this.isOperational = true;
    // Optional additional info about the error
    this.details = details;

    // Capture stack trace (helps debugging, excludes constructor from trace)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Start Error Helper
const BadRequest = (message, details) =>
  new ErrorGuard(400, "BAD_REQUEST", message, details);

const ValidationError = (message, details) =>
  new ErrorGuard(400, "VALIDATION_ERROR", message, details);

const AuthenticationError = (message, details) =>
  new ErrorGuard(401, "AUTHENTICATION_ERROR", message, details);

const AuthorizationError = (message, details) =>
  new ErrorGuard(403, "FORBIDDEN_ACCESS", message, details);

const ResourceNotFound = (message, details) =>
  new ErrorGuard(404, "RESOURCE_NOT_FOUND", message, details);

const ConflictError = (message, details) =>
  new ErrorGuard(409, "RESOURCE_CONFLICT", message, details);

const RateLimitError = (message, details) =>
  new ErrorGuard(429, "RATE_LIMIT_EXCEEDED", message, details);

const DependencyError = (message, details) =>
  new ErrorGuard(503, "SERVICE_UNAVAILABLE", message, details);

const InternalError = (message, details) =>
  new ErrorGuard(500, "INTERNAL_SERVER_ERROR", message, details);
// End Error Helper

// Helper to wrap async route handlers and automatically catch errors
const asyncHandler = (fn) => (req, res, next) => {
  // Wrap the function in Promise.resolve to handle both sync & async functions
  // Pass any error to Express error handler
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Factory function to create the Express error-handling middleware
const createErrorHandler = (opts = {}) => {
  // Optional logger function passed by the user
  const { logger } = opts;

  // The actual middleware function (4 parameters required by Express for error middleware)
  return (err, req, res, next) => {
    // If a logger is provided log the error
    if (logger) {
      try {
        // Call the logger function with the error and request
        logger(err, req);
      } catch (e) {
        // Ignore logger errors to prevent crashing the middleware
      }
    }

    // Determine HTTP status code (default to 500)
    const statusCode = err?.statusCode || 500;

    // Determine status string ('fail' for 4xx, 'error' for 5xx)
    const status =
      err?.status || (String(statusCode).startsWith("4") ? "fail" : "error");

    // Determine the message to send (fallback to generic message)
    const message = err?.message || "Internal Server Error";

    // Prepare the response body
    const body = { status, message };

    // Include optional details if available
    if (err?.details) body.details = err.details;

    // If not in production, include stack trace and error name for debugging
    if (process.env.NODE_ENV !== "production") {
      body.stack = err.stack;
      body.name = err.name;
    }

    // Send JSON response with the determined status code
    res.status(statusCode).json(body);
  };
};

// Export the main utilities of the library
module.exports = {
  ErrorGuard,
  asyncHandler,
  createErrorHandler,
  BadRequest,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ResourceNotFound,
  ConflictError,
  RateLimitError,
  DependencyError,
  InternalError,
};
